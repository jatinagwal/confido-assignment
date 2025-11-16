import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { ElevenLabsAPI } from '../services/api';
import { SubscriptionInfo } from '../types';
import { BalanceWarning } from '../components/BalanceWarning';
import { Conversation } from '../components/Conversation';
import { ConversationStart } from '../components/ConversationStart';

interface DashboardProps {
  agentId: string;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ agentId, onLogout }) => {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [conversationStarted, setConversationStarted] = useState(false);
  const [kbStatus, setKbStatus] = useState<any>(null);

  const loadData = async (newApiKey?: string) => {
    try {
      setLoading(true);
      setError('');

      // Get API key from environment or parameter
      const key = newApiKey || import.meta.env.VITE_ELEVENLABS_API_KEY || '';
      setApiKey(key);
      
      const api = new ElevenLabsAPI(key);
      const subData = await api.getSubscription();
      setSubscription(subData);
      
      // Load KB status
      try {
        const storedKbIds = storage.getItem('kbIds');
        if (storedKbIds) {
          const kbIds = JSON.parse(storedKbIds);
          setKbStatus({
            count: Object.keys(kbIds).length,
            ids: kbIds
          });
        }
      } catch (err) {
        console.warn('Could not load KB status:', err);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    storage.clearUser();
    storage.removeItem('agentId');
    onLogout();
  };

  const handleUpdateApiKey = (newKey: string) => {
    loadData(newKey);
  };

  const handleStartConversation = () => {
    setConversationStarted(true);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>🏥 Confido Agent Manager</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </header>

      {subscription && (
        <>
          <BalanceWarning
            characterCount={subscription.character_count}
            characterLimit={subscription.character_limit}
            onUpdateKey={handleUpdateApiKey}
          />

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Subscription Tier</div>
              <div style={styles.statValue}>{subscription.tier}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Characters Used</div>
              <div style={styles.statValue}>
                {subscription.character_count.toLocaleString()} / {subscription.character_limit.toLocaleString()}
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Status</div>
              <div style={styles.statValue}>{subscription.status}</div>
            </div>
            {kbStatus && (
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Knowledge Base</div>
                <div style={styles.statValue}>{kbStatus.count} docs</div>
                <div style={styles.kbDetails}>
                  {Object.keys(kbStatus.ids).map(name => (
                    <div key={name} style={styles.kbItem}>
                      ✅ {name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <div style={styles.conversationWrapper}>
        {conversationStarted ? (
          <Conversation agentId={agentId} apiKey={apiKey} />
        ) : (
          <ConversationStart onStart={handleStartConversation} />
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: '#f5f5f5',
    padding: '20px'
  },
  header: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  headerTitle: {
    margin: 0,
    fontSize: '24px',
    color: '#333'
  },
  logoutButton: {
    padding: '10px 20px',
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#666'
  },
  error: {
    background: '#fee',
    color: '#c33',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333'
  },
  kbDetails: {
    marginTop: '10px',
    fontSize: '12px',
    color: '#666'
  },
  kbItem: {
    padding: '4px 0',
    fontSize: '11px'
  },
  conversationWrapper: {
    height: 'calc(100vh - 320px)',
    minHeight: '500px'
  }
};

