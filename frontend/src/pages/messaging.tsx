import React, { useState, useEffect } from 'react';
import socket from '../socket';

// Define the interface for messages
interface MessagingData {
  client: string;
  room: string;
  data: {
    message_id: number;
    sent_to: number;
    message: string;
    from: number;
  };
}

const Messaging: React.FC = () => {
  const [message, setMessage] = useState('');
  const [receivedData, setReceivedData] = useState<MessagingData | null>(null);
  const [messageIdEV1, setMessageIdEV1] = useState(1);
  const [messageIdEV2, setMessageIdEV2] = useState(1);
  const [messageIdPR, setMessageIdPR] = useState(1);

  useEffect(() => {
    // Join the MESSAGING room on component mount
    socket.emit('join_room', { room: 'MESSAGING' });

    // Listen for room data
    socket.on('room_data', (data: MessagingData) => {
      console.log(`Message received in room ${data.room}:`, data);
      setReceivedData(data);
    });

    // Clean up on component unmount
    return () => {
      socket.emit('leave_room', { room: 'MESSAGING' });
      socket.off('room_data');
    };
  }, []);

  const sendToClient = (clientId: number) => {
    if (!socket) return;

    let messageId = 0;
    let targetClient = '';

    // Determine the target client and message ID
    if (clientId === 1) {
      targetClient = 'hololens_1'; // EV1
      messageId = messageIdEV1;
      setMessageIdEV1((prev) => prev + 1);
    } else if (clientId === 2) {
      targetClient = 'hololens_2'; // EV2
      messageId = messageIdEV2;
      setMessageIdEV2((prev) => prev + 1);
    } else if (clientId === 3) {
      targetClient = 'pr_client'; // PR
      messageId = messageIdPR;
      setMessageIdPR((prev) => prev + 1);
    }

    const dataToSend: MessagingData = {
      client: targetClient,
      room: 'MESSAGING',
      data: {
        message_id: messageId,
        sent_to: clientId,
        message,
        from: 4, // 4 == LMCC
      },
    };

    // Emit the appropriate event
    const eventName = clientId === 3 ? 'send_to_pr' : 'send_to_hololens';
    socket.emit(eventName, JSON.stringify(dataToSend));
    console.log(`Sent to ${targetClient}:`, dataToSend);

    // Clear the input field after sending
    setMessage('');
  };

  return (
    <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Messaging Room</h1>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>Send a Message</h2>
        <input
          style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '1rem',
            borderRadius: '4px',
            border: '1px solid #444',
            backgroundColor: '#1e1e1e',
            color: 'white',
          }}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
        />
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            style={buttonStyle}
            onClick={() => sendToClient(1)}
          >
            Send to EV1
          </button>
          <button
            style={buttonStyle}
            onClick={() => sendToClient(2)}
          >
            Send to EV2
          </button>
          <button
            style={buttonStyle}
            onClick={() => sendToClient(3)}
          >
            Send to PR
          </button>
        </div>

        <h2 style={{ marginTop: '2rem' }}>Received Message</h2>
        <div style={{ backgroundColor: '#1e1e1e', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
          {receivedData ? (
            <>
              <p><strong>Client To:</strong> {receivedData.client}</p>
              <p><strong>Room:</strong> {receivedData.room}</p>
              <p><strong>Message ID:</strong> {receivedData.data.message_id}</p>
              <p><strong>Sent To:</strong> {receivedData.data.sent_to}</p>
              <p><strong>Message:</strong> {receivedData.data.message}</p>
              <p><strong>From:</strong> {receivedData.data.from}</p>
            </>
          ) : (
            <p style={{ color: '#888' }}>No messages received yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#0066ff',
  color: 'white',
  padding: '0.75rem 1rem',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  flex: '1',
  minWidth: '150px',
  transition: 'background-color 0.2s ease',
};

export default Messaging;