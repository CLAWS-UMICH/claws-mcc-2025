import { useState, useEffect, useRef } from 'react';
import './SendScreens.css';
import SearchBar from './SearchBar.tsx';
import Gallery from '../components/Gallery/Gallery';
import alienTest from '../images/alienTest.jpg';
import astronautTest from '../images/astronautTest.jpg';
import marsTest from '../images/marsTest.jpg';
import meteoriteTest from '../images/meteoriteTest.jpg';
import moonTest from '../images/moonTest.jpg';
import nasaTest from '../images/nasaTest.jpg';
import saturnTest from '../images/saturnTest.jpg';
import sunTest from '../images/sunTest.jpg';
import nebulaTest from '../images/nebulaTest.jpg';
import io, { Socket } from 'socket.io-client';


const ALL_IMAGES = [
  { id: 0, title: "Alien", url: alienTest, category: "Category 1" },
  { id: 1, title: "Astronaut", url: astronautTest, category: "Category 2" },
  { id: 2, title: "Mars", url: marsTest, category: "Category 3" },
  { id: 3, title: "Meteorite", url: meteoriteTest, category: "Category 3" },
  { id: 4, title: "Moon", url: moonTest, category: "Category 4" },
  { id: 5, title: "Nasa", url: nasaTest, category: "Category 5" },
  { id: 6, title: "Saturn", url: saturnTest, category: "Category 6" },
  { id: 7, title: "Sun", url: sunTest, category: "Category 7" },
  { id: 8, title: "Nebula", url: nebulaTest, category: "Category 3" }
];

function SendScreens() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [visibleImages, setVisibleImages] = useState(ALL_IMAGES);

  const categories = [
    "All Categories",
    "Category 1",
    "Category 2",
    "Category 3",
    "Category 4",
    "Category 5",
    "Category 6",
    "Category 7",
    "Category 8"
  ];

 
  const sendToAstronautStub = async (astronaut_id: number, title: string, imageUrl: string) => {
    console.log(`Connecting to send image "${title}" to astronaut ${astronaut_id}...`);

    try {
      // Connect to WebSocket server using the same origin as the page
      // This will route through the browser to the backend via the Docker port mapping
      const socketUrl = window.location.protocol + '//' + window.location.host;
      console.log(`Connecting to socket at: ${socketUrl}`);
      const socket = io(socketUrl);

      // Wait for the connection to establish
      socket.on('connect', async () => {
        console.log('Connected to server');

        // Join the specific astronaut room
        const room = `SEND_SCREEN_ASTRO_${astronaut_id}`;
        socket.emit('join_room', { room });

        console.log(`Joined room: ${room}`);

        // Convert image URL to binary data
        const response = await fetch(imageUrl);
        const imageBlob = await response.blob();
        const imageBuffer = await imageBlob.arrayBuffer();

        // Create message object
        const message_for_ar = JSON.stringify({
          type: room,
          use: 'GET',
          data: {
            imageTitle: title,
            image: imageBuffer, // Binary image data
          }
        });

        // Send message
        socket.emit('send_to_hololens', { room, data: message_for_ar });

        console.log('Image sent successfully:', message_for_ar);

        // Leave room and disconnect after sending
        socket.emit('leave_room', { room });
        socket.disconnect();
        console.log('Disconnected from server.');
      });

      // Handle connection errors
      socket.on('connect_error', (err) => {
        console.error('Connection error:', err);
      });

    } catch (error) {
      console.error('⚠️ Failed to send data:', error);
    }
  };

  // Automatically filter images when query or selectedCategory changes
  useEffect(() => {
    let filteredImages = ALL_IMAGES;

    if (query) {
      filteredImages = filteredImages.filter((img) =>
        img.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== "All Categories") {
      filteredImages = filteredImages.filter(
        (img) => img.category === selectedCategory
      );
    }

    setVisibleImages(filteredImages);
  }, [query, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering logic now runs automatically due to the useEffect
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category); // This will trigger the useEffect
  };

  return (
    <>
      <div id="container">
        <SearchBar handleSearch={handleSearch} setQuery={setQuery} query={query} />
        <div id="main-area">
          <div id="category-bar">
            <h3>Image Categories</h3>
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <Gallery sendToAstronaut={sendToAstronautStub} images={visibleImages} />
        </div>
      </div>
    </>
  );
};

export default SendScreens;
