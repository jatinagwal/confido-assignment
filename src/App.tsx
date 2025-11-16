import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './pages/Dashboard';
import { storage } from './utils/storage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in and has an agent
    const user = storage.getUser();
    const storedAgentId = storage.getItem('agentId');
    
    if (user && user.elevenLabsApiKey && storedAgentId) {
      setAgentId(storedAgentId);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (newAgentId: string) => {
    setAgentId(newAgentId);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setAgentId(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      {isAuthenticated && agentId ? (
        <Dashboard agentId={agentId} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontSize: '18px',
    color: '#666'
  }
};

export default App;

