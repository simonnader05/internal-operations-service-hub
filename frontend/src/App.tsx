import { useEffect, useState } from 'react';
import './App.css';

type ServiceRequest = {
  id: string;
  number: string;
  title: string;
  serviceArea: string;
  status: string;
};

const API_URL = 'http://localhost:3000';

function App() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [role, setRole] = useState('HR');
  const [message, setMessage] = useState('');

  async function loadRequests() {
    try {
      const response = await fetch(`${API_URL}/requests`);

      if (!response.ok) {
        throw new Error('Could not load requests');
      }

      const data = await response.json();
      setRequests(data);
      setMessage('');
    } catch {
      setMessage('Unable to connect to the Service Hub. Please try again.');
    }
  }

  async function changeStatus(id: string, status: string) {
    try {
      const response = await fetch(`${API_URL}/requests/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': role,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Request update failed');
        return;
      }

      setMessage(`Request ${data.number} updated to ${data.status}`);
      await loadRequests();
    } catch {
      setMessage('Unable to connect to the Service Hub. Please try again.');
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <main className="app">
      <h1>Internal Operations Service Hub</h1>

      <p>Service Request Status Flow</p>

      <label>
        Acting role:
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="HR">HR</option>
          <option value="IT">IT</option>
          <option value="Manager">Manager</option>
          <option value="Employee">Employee</option>
        </select>
      </label>

      {message && <div className="message">{message}</div>}

      <div className="requests">
        {requests.map((request) => (
          <article key={request.id} className="request-card">
            <h2>{request.number}</h2>

            <p>{request.title}</p>

            <p>
              <strong>Area:</strong> {request.serviceArea}
            </p>

            <p>
              <strong>Status:</strong> {request.status}
            </p>

            <div className="actions">
              <button
                onClick={() => changeStatus(request.id, 'In Progress')}
              >
                In Progress
              </button>

              <button
                onClick={() => changeStatus(request.id, 'Resolved')}
              >
                Resolved
              </button>

              <button
                onClick={() => changeStatus(request.id, 'Closed')}
              >
                Closed
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

export default App;