'use client';

import { useState } from 'react';

export default function AdminHome() {
  const [data, setData] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleLoad = async () => {
    setIsLoading(true);
    setStatus('Loading...');
    try {
      const response = await fetch('/api/deals');
      if (!response.ok) throw new Error('Failed to load');
      const json = await response.json();
      setData(JSON.stringify(json, null, 2));
      setIsEditing(true);
      setStatus('Loaded successfully');
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setStatus('Saving...');
    try {
      // Validate JSON before saving
      const parsed = JSON.parse(data);

      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });

      if (!response.ok) throw new Error('Failed to save');
      setStatus('Saved successfully');
      setIsEditing(false);
      setData('');
    } catch (error) {
      if (error instanceof SyntaxError) {
        setStatus('Error: Invalid JSON');
      } else {
        setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setData('');
    setStatus('');
  };

  const handleDownload = () => {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deals.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setData(content);
      setIsEditing(true);
      setStatus('File loaded - review and save to blob');
    };
    reader.readAsText(file);
  };

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Daily Grub Admin</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Load, edit, and save restaurant deals data.
      </p>

      {!isEditing ? (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleLoad}
            disabled={isLoading}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Loading...' : 'Load from Blob'}
          </button>
          <label
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Upload JSON File
            <input
              type="file"
              accept=".json"
              onChange={handleUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <textarea
              value={data}
              onChange={(e) => setData(e.target.value)}
              style={{
                width: '100%',
                height: '500px',
                fontFamily: 'monospace',
                fontSize: '12px',
                padding: '1rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleSave}
              disabled={isLoading}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? 'Saving...' : 'Save to Blob'}
            </button>

            <button
              onClick={handleDownload}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Download JSON
            </button>

            <button
              onClick={handleCancel}
              disabled={isLoading}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {status && (
        <p style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: status.startsWith('Error') ? '#fef2f2' : '#f0fdf4',
          color: status.startsWith('Error') ? '#dc2626' : '#16a34a',
          borderRadius: '4px',
        }}>
          {status}
        </p>
      )}
    </main>
  );
}
