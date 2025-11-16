import React, { useState } from 'react';
import { storage } from '../utils/storage';

interface BalanceWarningProps {
  characterCount: number;
  characterLimit: number;
  onUpdateKey: (newKey: string) => void;
}

export const BalanceWarning: React.FC<BalanceWarningProps> = ({
  characterCount,
  characterLimit,
  onUpdateKey
}) => {
  const [showModal, setShowModal] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');

  const remainingCharacters = characterLimit - characterCount;
  const shouldWarn = remainingCharacters < 1000;

  const handleUpdateKey = () => {
    if (newApiKey.trim()) {
      // Update in storage (for reference)
      storage.updateApiKey('elevenLabsApiKey', newApiKey);
      onUpdateKey(newApiKey);
      setShowModal(false);
      setNewApiKey('');
      alert('API key updated! Note: For permanent changes, update the .env file.');
    }
  };

  if (!shouldWarn) return null;

  return (
    <>
      <div style={styles.warning}>
        <div style={styles.warningContent}>
          <span style={styles.warningIcon}>⚠️</span>
          <div>
            <strong>Low Character Balance</strong>
            <p style={styles.warningText}>
              You have {remainingCharacters.toLocaleString()} characters remaining (less than 1,000)
            </p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} style={styles.updateButton}>
          Update API Key
        </button>
      </div>

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Update ElevenLabs API Key</h2>
            <p style={styles.modalText}>
              Enter a new API key to continue using the service with a different account.
            </p>
            
            <input
              type="password"
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
              placeholder="sk_..."
              style={styles.input}
              autoFocus
            />

            <div style={styles.modalActions}>
              <button onClick={() => setShowModal(false)} style={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={handleUpdateKey} style={styles.confirmButton}>
                Update Key
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  warning: {
    background: '#fff3cd',
    border: '1px solid #ffc107',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  warningContent: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start'
  },
  warningIcon: {
    fontSize: '24px'
  },
  warningText: {
    margin: '4px 0 0 0',
    fontSize: '14px',
    color: '#856404'
  },
  updateButton: {
    padding: '8px 16px',
    background: '#ffc107',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    color: '#856404'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
  },
  modalTitle: {
    margin: '0 0 12px 0',
    fontSize: '24px',
    color: '#333'
  },
  modalText: {
    margin: '0 0 20px 0',
    color: '#666'
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
    justifyContent: 'flex-end'
  },
  cancelButton: {
    padding: '10px 20px',
    background: '#f5f5f5',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  confirmButton: {
    padding: '10px 20px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  }
};

