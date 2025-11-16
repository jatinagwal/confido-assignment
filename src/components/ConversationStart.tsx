import React from 'react';

interface ConversationStartProps {
  onStart: () => void;
}

export const ConversationStart: React.FC<ConversationStartProps> = ({ onStart }) => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <div style={styles.icon}>🎤</div>
        </div>
        
        <h2 style={styles.title}>Ready to Talk?</h2>
        
        <p style={styles.description}>
          Start a voice conversation with your Confido Health AI assistant.
          Just speak naturally - the agent will listen and respond with voice.
        </p>

        <div style={styles.featuresGrid}>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🎤</span>
            <span style={styles.featureText}>Voice Conversation</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🔊</span>
            <span style={styles.featureText}>Voice Responses</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>📅</span>
            <span style={styles.featureText}>Book Appointments</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>💬</span>
            <span style={styles.featureText}>Natural Dialogue</span>
          </div>
        </div>

        <button onClick={onStart} style={styles.startButton}>
          🎤 Start Voice Conversation
        </button>

        <p style={styles.hint}>
          💡 Please allow microphone access when prompted
        </p>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '500px',
    padding: '40px 20px'
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '48px',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  },
  iconContainer: {
    marginBottom: '24px'
  },
  icon: {
    fontSize: '64px',
    display: 'inline-block',
    animation: 'pulse 2s ease-in-out infinite'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  description: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '32px'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    marginBottom: '32px'
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: '#f9fafb',
    borderRadius: '12px',
    border: '1px solid #e5e7eb'
  },
  featureIcon: {
    fontSize: '24px'
  },
  featureText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333'
  },
  startButton: {
    width: '100%',
    padding: '16px 32px',
    fontSize: '18px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
    marginBottom: '16px'
  },
  hint: {
    fontSize: '14px',
    color: '#999',
    margin: 0
  }
};

