import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Define the interface for messages
interface MessagingData {
  room: string;
  use: string;
  data: {
    message_id: number;
    sent_to: number;
    message: string;
    from: number;
  };
}

const Messaging: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState('');
  const [receivedData, setReceivedData] = useState<MessagingData | null>(null);
  const [messageIdA1, setMessageIdA1] = useState(1);
  const [messageIdA2, setMessageIdA2] = useState(1);
  const [messageIdGroup, setMessageIdGroup] = useState(1);

  useEffect(() => {
    const newSocket = io(document.location.origin + '/');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('join_room', { room: 'MESSAGING' });
    });

    newSocket.on('room_data', (data: MessagingData) => {
      console.log(`Message received in room ${data.room}:`, data);
      setReceivedData(data);
    });

    return () => {
      newSocket.emit('leave_room', { room: 'MESSAGING' });
      newSocket.disconnect();
    };
  }, []);

  const sendToHoloLens = (hololensId: string, from: number) => {
    if (!socket) return;

    let messageId = 0;
    if (from === 1) {
      messageId = messageIdA1;
      setMessageIdA1((prev) => prev + 1);
    } else if (from === 2) {
      messageId = messageIdA2;
      setMessageIdA2((prev) => prev + 1);
    } else if (from === 4) {
      messageId = messageIdGroup;
      setMessageIdGroup((prev) => prev + 1);
    }

    const dataToSend: MessagingData = {
      room: 'MESSAGING',
      use: 'SEND',
      data: {
        message_id: messageId,
        sent_to: parseInt(hololensId.replace('hololens_', '')) || 4,
        message,
        from: 3,
      },
    };

    socket.emit('send_to_hololens', JSON.stringify(dataToSend));
    console.log(`Sent to ${hololensId}:`, dataToSend);
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
            onClick={() => sendToHoloLens('hololens_1', 1)}
          >
            Send to Astronaut 1
          </button>
          <button
            style={buttonStyle}
            onClick={() => sendToHoloLens('hololens_2', 2)}
          >
            Send to Astronaut 2
          </button>
          <button
            style={buttonStyle}
            onClick={() => sendToHoloLens('groupchat', 4)}
          >
            Send to Group Chat
          </button>
        </div>

        <h2 style={{ marginTop: '2rem' }}>Received Message</h2>
        <div style={{ backgroundColor: '#1e1e1e', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
          {receivedData ? (
            <>
              <p><strong>Room:</strong> {receivedData.room}</p>
              <p><strong>Use:</strong> {receivedData.use}</p>
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
