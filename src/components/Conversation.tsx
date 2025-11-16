import React, { useState, useEffect, useRef } from 'react';

interface ConversationProps {
  agentId: string;
  apiKey: string;
}

interface Message {
  id: string;
  type: 'user' | 'agent';
  text: string;
  timestamp: Date;
}

export const Conversation: React.FC<ConversationProps> = ({ agentId, apiKey }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [conversationState, setConversationState] = useState<'listening' | 'processing' | 'speaking' | 'ready'>('ready');
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<AudioBuffer[]>([]);
  const isPlayingRef = useRef(false);
  const gainNodeRef = useRef<GainNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const lastAudioChunkTimeRef = useRef<number>(0);
  const audioFinishCheckRef = useRef<NodeJS.Timeout | null>(null);
  const isRecordingRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Web Audio API
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      setAudioEnabled(true);
    }
    
    // Resume context if suspended (browser autoplay policy)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  useEffect(() => {
    // Check microphone permission status
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' as PermissionName })
        .then(result => {
          setMicPermission(result.state as 'granted' | 'denied' | 'prompt');
          result.onchange = () => {
            setMicPermission(result.state as 'granted' | 'denied' | 'prompt');
          };
        })
        .catch(() => {
          setMicPermission('prompt');
        });
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Function to play audio buffer
  const playAudioBuffer = async (buffer: AudioBuffer) => {
    if (!audioContextRef.current || !gainNodeRef.current || isMuted) {
      return;
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(gainNodeRef.current);
    
    return new Promise<void>((resolve) => {
      source.onended = () => {
        resolve();
      };
      source.start(0);
    });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = !isMuted ? 0 : 1;
    }
  };

  // Start voice recording
  const startRecording = async () => {
    try {
      console.log('startRecording called, current state:', { 
        hasStream: !!micStreamRef.current, 
        isRecording, 
        conversationState 
      });
      
      if (isRecording) {
        console.log('Already recording, skipping...');
        return;
      }
      
      if (micStreamRef.current) {
        // Already have stream, just resume
        console.log('Resuming existing stream');
        setIsRecording(true);
        isRecordingRef.current = true;
        setConversationState('listening');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      micStreamRef.current = stream;
      setMicPermission('granted');

      // Create AudioContext for processing
      const audioContext = new AudioContext({ sampleRate: 16000 });
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      source.connect(processor);
      processor.connect(audioContext.destination);

      let audioContextForRecording = audioContext;
      
      processor.onaudioprocess = (e) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          return;
        }
        
        // Check the actual isRecording state using ref
        if (!isRecordingRef.current) {
          return;
        }

        const inputData = e.inputBuffer.getChannelData(0);
        
        // Convert float32 to int16 PCM
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        // Convert to base64
        const base64Audio = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));

        // Send audio chunk to WebSocket
        wsRef.current.send(JSON.stringify({
          user_audio_chunk: base64Audio
        }));
      };
      
      // Store references for cleanup
      (micStreamRef.current as any).audioContext = audioContextForRecording;
      (micStreamRef.current as any).processor = processor;
      (micStreamRef.current as any).source = source;

      setIsRecording(true);
      isRecordingRef.current = true;
      setConversationState('listening');
      
      // Initialize audio playback if not already done
      if (!audioContextRef.current) {
        initAudio();
      }
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setMicPermission('denied');
      setConversationState('ready');
      alert('Microphone access denied. Please enable microphone permissions in your browser settings.');
    }
  };

  // Pause voice recording (keep stream alive)
  const pauseRecording = () => {
    console.log('Pausing recording');
    setIsRecording(false);
    isRecordingRef.current = false;
    setConversationState('ready');
  };

  // Stop voice recording (close stream)
  const stopRecording = () => {
    console.log('Stopping recording completely');
    setIsRecording(false);
    isRecordingRef.current = false;
    setConversationState('ready');
    
    if (micStreamRef.current) {
      // Clean up audio context and processor
      const stream = micStreamRef.current as any;
      if (stream.processor) {
        stream.processor.disconnect();
      }
      if (stream.source) {
        stream.source.disconnect();
      }
      if (stream.audioContext && stream.audioContext.state !== 'closed') {
        stream.audioContext.close();
      }
      
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      pauseRecording();
    } else {
      startRecording();
    }
  };

  // Function to process audio queue
  const processAudioQueue = async () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0) {
      return;
    }

    isPlayingRef.current = true;
    console.log('Starting audio playback, queue length:', audioQueueRef.current.length);

    while (audioQueueRef.current.length > 0) {
      const buffer = audioQueueRef.current.shift();
      if (buffer) {
        await playAudioBuffer(buffer);
      }
    }

    isPlayingRef.current = false;
    console.log('Audio playback finished');
    
    // When audio queue is empty and we're done playing, resume listening
    if (audioQueueRef.current.length === 0) {
      console.log('Audio queue empty, checking recording state:', { isRecording });
      if (!isRecording) {
        setConversationState('ready');
        setTimeout(() => {
          console.log('Attempting to resume recording after audio playback');
          startRecording();
        }, 1000);
      }
    }
  };

  // Function to decode and queue audio
  const handleAudioChunk = async (base64Audio: string) => {
    // Initialize audio on first chunk if not already done
    if (!audioContextRef.current) {
      initAudio();
    }
    
    if (!audioContextRef.current) return;

    try {
      // Decode base64 to array buffer
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Convert PCM16 data to Float32Array for Web Audio API
      // PCM 16000 Hz, 16-bit, mono
      const pcmData = new Int16Array(bytes.buffer);
      const sampleRate = 16000;
      const numberOfChannels = 1;
      
      // Create audio buffer
      const audioBuffer = audioContextRef.current.createBuffer(
        numberOfChannels,
        pcmData.length,
        sampleRate
      );

      // Convert Int16 PCM to Float32 and copy to audio buffer
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < pcmData.length; i++) {
        channelData[i] = pcmData[i] / 32768.0; // Normalize to -1.0 to 1.0
      }

      audioQueueRef.current.push(audioBuffer);
      processAudioQueue();
    } catch (error) {
      console.error('Error decoding audio:', error);
    }
  };

  useEffect(() => {
    // Establish WebSocket connection
    const connectWebSocket = () => {
      const wsUrl = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${agentId}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        
        // Send conversation initiation data
        const initData = {
          type: 'conversation_initiation_client_data',
          conversation_config_override: {
            agent: {
              language: 'en'
            }
          }
        };
        ws.send(JSON.stringify(initData));
        
        // Auto-start voice recording after a brief delay
        setTimeout(() => {
          console.log('WebSocket connected, starting recording...');
          startRecording();
        }, 1500);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received message:', data);

          // Handle different message types from the agent
          switch (data.type) {
            case 'conversation_initiation_metadata':
              if (data.conversation_initiation_metadata_event?.conversation_id) {
                setConversationId(data.conversation_initiation_metadata_event.conversation_id);
                console.log('Conversation ID:', data.conversation_initiation_metadata_event.conversation_id);
              }
              break;

            case 'user_transcript':
              if (data.user_transcription_event?.user_transcript) {
                console.log('User said:', data.user_transcription_event.user_transcript);
                const userMessage: Message = {
                  id: Date.now().toString(),
                  type: 'user',
                  text: data.user_transcription_event.user_transcript,
                  timestamp: new Date()
                };
                setMessages(prev => [...prev, userMessage]);
                setConversationState('processing');
                // Pause recording while agent processes
                pauseRecording();
              }
              break;

            case 'agent_response':
              if (data.agent_response_event?.agent_response) {
                const agentMessage: Message = {
                  id: Date.now().toString(),
                  type: 'agent',
                  text: data.agent_response_event.agent_response,
                  timestamp: new Date()
                };
                setMessages(prev => [...prev, agentMessage]);
                setIsAgentSpeaking(false);
                // Don't auto-resume here - wait for audio to finish
              }
              break;

            case 'internal_tentative_agent_response':
              // Agent is thinking/speaking
              setIsAgentSpeaking(true);
              setConversationState('speaking');
              break;

            case 'ping':
              // Respond to ping with pong
              if (data.ping_event?.event_id) {
                ws.send(JSON.stringify({
                  type: 'pong',
                  event_id: data.ping_event.event_id
                }));
              }
              break;

            case 'audio':
              // Handle audio chunks from agent
              if (data.audio_event?.audio_base_64) {
                handleAudioChunk(data.audio_event.audio_base_64);
                setIsAgentSpeaking(true);
                setConversationState('speaking');
                lastAudioChunkTimeRef.current = Date.now();
                
                // Clear any existing timeout
                if (audioFinishCheckRef.current) {
                  clearTimeout(audioFinishCheckRef.current);
                }
                
                // Set a new timeout to check if audio has finished
                audioFinishCheckRef.current = setTimeout(() => {
                  console.log('No audio chunks for 2s, checking state:', {
                    isRecording,
                    isPlaying: isPlayingRef.current,
                    audioQueueLength: audioQueueRef.current.length,
                    conversationState
                  });
                  
                  // Wait a bit for audio to finish playing, then resume
                  setTimeout(() => {
                    if (!isRecording && !isPlayingRef.current) {
                      console.log('All audio finished, resuming recording');
                      setConversationState('ready');
                      startRecording();
                    }
                  }, 1000);
                }, 2000);
              }
              break;

            case 'interruption':
              console.log('Conversation interrupted');
              setIsAgentSpeaking(false);
              // Clear audio queue on interruption
              audioQueueRef.current = [];
              break;

            default:
              console.log('Unhandled message type:', data.type);
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
      };

      wsRef.current = ws;
    };

    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      // Clear audio queue
      audioQueueRef.current = [];
    };
  }, [agentId]);

  const sendMessage = () => {
    if (!inputText.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    // Send user message through WebSocket
    const userMessage = {
      type: 'user_message',
      text: inputText.trim()
    };

    wsRef.current.send(JSON.stringify(userMessage));

    // Add message to UI
    const message: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: inputText.trim(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
    setInputText('');
    setIsAgentSpeaking(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h2 style={styles.headerTitle}>🏥 Confido Agent Chat</h2>
          <div style={styles.headerControls}>
            <button
              onClick={toggleMute}
              style={styles.iconButton}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
            {!audioEnabled && (
              <button
                onClick={initAudio}
                style={styles.enableAudioButton}
                title="Enable audio playback"
              >
                Enable Audio
              </button>
            )}
            <div style={styles.statusContainer}>
              <div style={{
                ...styles.statusDot,
                backgroundColor: isConnected ? '#10b981' : '#ef4444'
              }} />
              <span style={styles.statusText}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            {isAgentSpeaking && (
              <div style={styles.speakingIndicator}>
                <span>🗣️ Agent speaking...</span>
              </div>
            )}
            
            <div style={{
              ...styles.stateIndicator,
              backgroundColor: 
                conversationState === 'listening' ? 'rgba(239, 68, 68, 0.3)' :
                conversationState === 'processing' ? 'rgba(251, 191, 36, 0.3)' :
                conversationState === 'speaking' ? 'rgba(59, 130, 246, 0.3)' :
                'rgba(156, 163, 175, 0.3)'
            }}>
              <span>
                {conversationState === 'listening' && '🔴 Listening'}
                {conversationState === 'processing' && '⚙️ Processing'}
                {conversationState === 'speaking' && '🗣️ Speaking'}
                {conversationState === 'ready' && '⏸️ Ready'}
              </span>
            </div>
          </div>
        </div>
        {conversationId && (
          <div style={styles.conversationId}>
            Conversation ID: {conversationId.substring(0, 8)}...
          </div>
        )}
      </div>

      <div style={styles.messagesContainer}>
        {messages.length === 0 && (
          <div style={styles.emptyState}>
            {micPermission === 'denied' ? (
              <>
                <p>❌ Microphone access denied</p>
                <p style={styles.emptyStateSubtext}>
                  Please enable microphone permissions in your browser settings to use voice
                </p>
              </>
            ) : (
              <>
                <p>🎤 Voice conversation active!</p>
                <p style={styles.emptyStateSubtext}>
                  {isRecording ? 'Speak now... I\'m listening' : 'Connecting microphone...'}
                </p>
              </>
            )}
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              ...styles.messageWrapper,
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                ...styles.message,
                ...(message.type === 'user' ? styles.userMessage : styles.agentMessage)
              }}
            >
              <div style={styles.messageText}>{message.text}</div>
              <div style={styles.messageTime}>
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}

        {isAgentSpeaking && (
          <div style={styles.messageWrapper}>
            <div style={{ ...styles.message, ...styles.agentMessage }}>
              <div style={styles.typingIndicator}>
                <span className="typing-dot" style={styles.typingDot}></span>
                <span className="typing-dot" style={styles.typingDot}></span>
                <span className="typing-dot" style={styles.typingDot}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputContainer}>
        <div style={styles.voiceBotIndicator}>
          <button
            onClick={toggleRecording}
            className={isRecording ? 'recording' : ''}
            style={{
              ...styles.mainMicButton,
              backgroundColor: isRecording ? '#ef4444' : '#667eea',
              opacity: !isConnected ? 0.5 : 1
            }}
            disabled={!isConnected}
            title={isRecording ? 'Pause listening' : 'Resume listening'}
          >
            {isRecording ? '⏸️' : '🎤'}
          </button>
          <div style={styles.voiceStatus}>
            <div style={styles.voiceStatusTitle}>
              {conversationState === 'listening' && '🔴 Listening'}
              {conversationState === 'processing' && '⚙️ Processing'}
              {conversationState === 'speaking' && '🗣️ Agent Speaking'}
              {conversationState === 'ready' && '⏸️ Paused'}
            </div>
            <div style={styles.voiceStatusSubtext}>
              {conversationState === 'listening' && 'Speak naturally - I\'m listening to you'}
              {conversationState === 'processing' && 'Processing your message...'}
              {conversationState === 'speaking' && 'Agent is responding...'}
              {conversationState === 'ready' && 'Click the microphone to start'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  },
  header: {
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  headerTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600'
  },
  headerControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  iconButton: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  enableAudioButton: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '14px',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background 0.2s'
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%'
  },
  statusText: {
    fontSize: '14px'
  },
  speakingIndicator: {
    background: 'rgba(255, 255, 255, 0.2)',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600'
  },
  stateIndicator: {
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'background-color 0.3s'
  },
  conversationId: {
    fontSize: '12px',
    opacity: 0.8
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    background: '#f9fafb'
  },
  emptyState: {
    textAlign: 'center',
    color: '#666',
    marginTop: '50px'
  },
  emptyStateSubtext: {
    fontSize: '14px',
    marginTop: '8px'
  },
  messageWrapper: {
    display: 'flex',
    width: '100%'
  },
  message: {
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '12px',
    wordWrap: 'break-word'
  },
  userMessage: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderBottomRightRadius: '4px'
  },
  agentMessage: {
    background: 'white',
    color: '#333',
    border: '1px solid #e5e7eb',
    borderBottomLeftRadius: '4px'
  },
  messageText: {
    marginBottom: '4px',
    fontSize: '15px',
    lineHeight: '1.5'
  },
  messageTime: {
    fontSize: '11px',
    opacity: 0.7
  },
  typingIndicator: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center'
  },
  typingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#667eea'
  },
  inputContainer: {
    padding: '30px',
    background: 'white',
    borderTop: '1px solid #e5e7eb'
  },
  voiceBotIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    justifyContent: 'center'
  },
  mainMicButton: {
    padding: '20px',
    fontSize: '32px',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
  },
  voiceStatus: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  voiceStatusTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333'
  },
  voiceStatusSubtext: {
    fontSize: '14px',
    color: '#666'
  }
};

