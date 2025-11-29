import { useState } from 'react';
import './App.css';

function App() {
  const [backendStatus, setBackendStatus] = useState<string>('');

  const checkBackend = async () => {
    try {
      const response = await fetch('http://localhost:5001/health');
      const data = await response.json();
      setBackendStatus(`Backend: ${data.message}`);
    } catch (error) {
      setBackendStatus('Backend: Not connected');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Simple CRM Demo</h1>
        <p>Welcome to the Simple CRM System</p>
        <button onClick={checkBackend}>Check Backend Status</button>
        {backendStatus && <p className="status">{backendStatus}</p>}
      </header>
    </div>
  );
}

export default App;
