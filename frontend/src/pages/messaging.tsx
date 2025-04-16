import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Define an interface for the data structure
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
  const [message, setMessage] = useState<string>('');
  const [receivedData, setReceivedData] = useState<MessagingData | null>(null);

  // Message counters for each group
  const [messageIdA1, setMessageIdA1] = useState<number>(1);
  const [messageIdA2, setMessageIdA2] = useState<number>(1);
  const [messageIdGroup, setMessageIdGroup] = useState<number>(1);

  useEffect(() => {
    // Connect to the Socket.IO server
    const newSocket = io(document.location.origin + '/');
    setSocket(newSocket);

    // Join the MESSAGING room on connection
    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('join_room', { room: 'MESSAGING' });
    });

    // Listen for messages sent to the MESSAGING room
    newSocket.on('room_data', (data: MessagingData) => {
      console.log(`Message received in room ${data.room}:`, data);

      // Switch on the `from` field to handle messages
      switch (data.data.from) {
        case 1:
          console.log('Message from Astronaut 1:', data.data.message);
          break;
        case 2:
          console.log('Message from Astronaut 2:', data.data.message);
          break;
        case 4:
          console.log('Message from Group Chat:', data.data.message);
          break;
        default:
          console.log('Unknown sender:', data.data.message);
      }

      setReceivedData(data); // Update state with received data
    });

    // Clean up connection on component unmount
    return () => {
      newSocket.emit('leave_room', { room: 'MESSAGING' });
      newSocket.disconnect();
    };
  }, []);

  // Function to send data to a HoloLens
  const sendToHoloLens = (hololensId: string, from: number) => {
    if (socket) {
      // Increment message_id based on the group
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
        room: "MESSAGING", // Target HoloLens room ID
        use: "SEND", // Example use case
        data: {
          message_id: messageId,
          sent_to: parseInt(hololensId.replace('hololens_', '')), // Extract numeric ID
          message: message,
          from: 3
        },
      };

      socket.emit('send_to_hololens', dataToSend);
      console.log(`Data sent to ${hololensId} (from ${from}):`, dataToSend);
    }
  };

  return (
    <div>
      <h1>Messaging Room</h1>
      <div>
        <h2>Send Messages</h2>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message"
        />
        <button onClick={() => sendToHoloLens('hololens_1', 1)}>Send to Astronaut 1</button>
        <button onClick={() => sendToHoloLens('hololens_2', 2)}>Send to Astronaut 2</button>
        <button onClick={() => sendToHoloLens('groupchat', 4)}>Send to Group Chat</button>
      </div>
      <div>
        <h2>Received Data</h2>
        {receivedData ? (
          <div>
            <p>Room: {receivedData.room}</p>
            <p>Use: {receivedData.use}</p>
            <p>Message ID: {receivedData.data.message_id}</p>
            <p>Sent To: {receivedData.data.sent_to}</p>
            <p>Message: {receivedData.data.message}</p>
            <p>From: {receivedData.data.from}</p>
          </div>
        ) : (
          <p>No data received yet.</p>
        )}
      </div>
    </div>
  );
};

export default Messaging;