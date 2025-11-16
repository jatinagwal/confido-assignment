import React, { useState } from 'react';
import { storage } from '../utils/storage';
import { ElevenLabsAPI } from '../services/api';

interface LoginProps {
  onLogin: (agentId: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const demoUsername = (import.meta as any).env.VITE_DEMO_USERNAME || 'admin';
      const demoPassword = (import.meta as any).env.VITE_DEMO_PASSWORD || 'demo123';

      if (username !== demoUsername || password !== demoPassword) {
        setError('Invalid username or password. Try: admin / demo123');
        setLoading(false);
        return;
      }

      // Get API keys from environment
      const elevenLabsApiKey = (import.meta as any).env.VITE_ELEVENLABS_API_KEY || '';
      const calcomApiKey = (import.meta as any).env.VITE_CALCOM_API_KEY || '';

      // Store credentials
      storage.setApiKeys({
        elevenLabsApiKey,
        calcomApiKey
      });

      storage.setUser({
        username,
        elevenLabsApiKey,
        calcomApiKey
      });

      // Load agent config and create agent
      const api = new ElevenLabsAPI(elevenLabsApiKey);
      
      // First, upload knowledge base documents
      setError('Creating knowledge base documents...');
      
      const kbDocuments = [
        { name: 'insurance_providers', path: '/knowledge_base/INSURANCE_knowledge_base.md' },
        { name: 'healthcare_edge_cases', path: '/knowledge_base/HEALTHCARE_EDGE_CASES.md' }
      ];

      const kbIds: { [key: string]: string } = {};
      
      // Step 1: Create knowledge base documents
      for (const doc of kbDocuments) {
        try {
          console.log(`📚 Creating knowledge base document: ${doc.name}...`);
          setError(`Creating knowledge base: ${doc.name}...`);
          
          const response = await fetch(doc.path);
          if (!response.ok) {
            throw new Error(`Failed to fetch ${doc.path}: ${response.statusText}`);
          }
          const text = await response.text();
          console.log(`✅ Fetched ${doc.name}, length: ${text.length} characters`);
          
          // Create the knowledge base document in ElevenLabs
          const kbDoc = await api.createKnowledgeBaseDocument(text, doc.name);
          
          if (!kbDoc || !kbDoc.id) {
            throw new Error(`Failed to get ID for ${doc.name}`);
          }
          
          console.log(`✅ Successfully created ${doc.name} with ID: ${kbDoc.id}`);
          kbIds[doc.name] = kbDoc.id;
        } catch (err: any) {
          console.error(`❌ Error creating KB document ${doc.name}:`, err);
          throw new Error(`Failed to create knowledge base document ${doc.name}: ${err.message}`);
        }
      }

      // Step 2: Verify all KB documents were created
      if (!kbIds.insurance_providers || !kbIds.healthcare_edge_cases) {
        console.error('Missing KB IDs:', kbIds);
        throw new Error('Failed to create all knowledge base documents');
      }

      console.log('✅ All knowledge base documents created successfully:', kbIds);
      
      // Add a small delay to ensure KB documents are fully processed
      setError('Waiting for knowledge base to be ready...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verify each KB document exists before proceeding
      setError('Verifying knowledge base documents...');
      for (const [name, id] of Object.entries(kbIds)) {
        try {
          await api.getKnowledgeBaseDocument(id);
          console.log(`✅ Verified KB document ${name} exists with ID: ${id}`);
        } catch (err) {
          console.error(`❌ KB document ${name} with ID ${id} not found`);
          throw new Error(`Knowledge base document ${name} was not properly created`);
        }
      }

      // Step 3: Load agent config
      setError('Loading agent configuration...');
      const configResponse = await fetch('/agent_config.json');
      if (!configResponse.ok) {
        throw new Error('Failed to load agent configuration');
      }
      const agentConfig = await configResponse.json();

      // Step 4: Build the knowledge base array with the new IDs
      // Use the format that works: full objects with all properties
      const knowledgeBaseArray = Object.entries(kbIds).map(([name, id]) => ({
        id: id,
        name: name,
        type: 'text',
        usage_mode: 'auto'
      }));
      
      console.log('📋 Knowledge base configuration:', JSON.stringify(knowledgeBaseArray, null, 2));

      // Step 5: Create the agent configuration with the knowledge base
      // According to the API schema, knowledge_base goes under agent.prompt
      const newAgentConfig = {
        ...agentConfig,
        conversation_config: {
          ...agentConfig.conversation_config,
          agent: {
            ...agentConfig.conversation_config.agent,
            prompt: {
              ...agentConfig.conversation_config.agent.prompt,
              knowledge_base: knowledgeBaseArray  // This is the correct location!
            }
          }
        }
      };
      
      // Step 6: Create the agent WITH the knowledge base
      setError('Creating AI agent with knowledge base...');
      
      // Create agent WITH knowledge base - this should work!
      console.log('📤 Creating agent WITH knowledge base configuration...');
      console.log('Knowledge base being included:', JSON.stringify(knowledgeBaseArray, null, 2));
      
      let agent = await api.createAgent(newAgentConfig);
      
      if (!agent || !agent.agent_id) {
        throw new Error('Failed to create agent - no agent ID returned');
      }
      
      console.log('✅ Agent created successfully with ID:', agent.agent_id);
      console.log('✅ Knowledge base should be linked with the agent');
      
      // Step 7: Verify KB documents are linked to the agent
      try {
        setError('Verifying knowledge base integration...');
        
        // List all KB documents to verify they exist
        const kbList = await api.listKnowledgeBase();
        console.log('📚 Total KB documents in account:', kbList.length);
        
        // Verify our documents are in the list
        if (kbList && Array.isArray(kbList)) {
          const ourDocs = kbList.filter((doc: any) => 
            Object.values(kbIds).includes(doc.id)
          );
          
          if (ourDocs.length !== Object.keys(kbIds).length) {
            console.warn(`⚠️ Expected ${Object.keys(kbIds).length} KB documents, found ${ourDocs.length}`);
          } else {
            console.log(`✅ All ${ourDocs.length} KB documents verified in account`);
          }
        } else {
          console.log('⚠️ Could not verify KB documents list');
        }
        
        // Get agent details to confirm KB is properly linked
        const agentDetails = await api.getAgent(agent.agent_id);
        // Check the correct location according to API schema
        const agentKB = agentDetails.conversation_config?.agent?.prompt?.knowledge_base || [];
        
        if (agentKB.length === 0) {
          console.warn('⚠️ No knowledge base documents found in agent.prompt.knowledge_base');
          console.log('📝 The KB documents have been created with these IDs:');
          console.log('Knowledge Base IDs:', kbIds);
          
          // Also check the old location in case it's there
          const oldLocationKB = agentDetails.conversation_config?.agent?.knowledge_base;
          if (oldLocationKB && oldLocationKB.length > 0) {
            console.log('ℹ️ Found KB in agent.knowledge_base (old location):', oldLocationKB.length, 'documents');
          }
        } else {
          console.log(`✅ Agent has ${agentKB.length} KB documents linked in prompt.knowledge_base:`, agentKB.map((kb: any) => kb.name || kb.id));
          
          // Verify each KB document is properly linked
          for (const kbDoc of knowledgeBaseArray) {
            const found = agentKB.find((kb: any) => kb.id === kbDoc.id);
            if (!found) {
              console.warn(`⚠️ KB document ${kbDoc.name} (${kbDoc.id}) not found in agent config`);
            } else {
              console.log(`✅ KB document ${kbDoc.name} properly linked`);
            }
          }
        }
      } catch (err) {
        console.warn('⚠️ Could not fully verify KB integration:', err);
        // Don't fail the login, just warn
      }
      
      // Store agent ID and KB IDs
      storage.setItem('agentId', agent.agent_id);
      storage.setItem('kbIds', JSON.stringify(kbIds));

      onLogin(agent.agent_id);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to create agent. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🏥 Confido Agent Manager</h1>
        <p style={styles.subtitle}>Login to manage your AI agents</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              style={styles.input}
              required
              autoComplete="username"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="demo123"
              style={styles.input}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button 
            type="submit" 
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Demo credentials: <strong>admin</strong> / <strong>demo123</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
    textAlign: 'center'
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: '30px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333'
  },
  input: {
    padding: '12px',
    fontSize: '14px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.3s'
  },
  error: {
    padding: '12px',
    background: '#fee',
    color: '#c33',
    borderRadius: '8px',
    fontSize: '14px'
  },
  button: {
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'opacity 0.3s'
  },
  footer: {
    marginTop: '20px',
    textAlign: 'center'
  },
  footerText: {
    fontSize: '14px',
    color: '#666'
  },
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600'
  }
};

