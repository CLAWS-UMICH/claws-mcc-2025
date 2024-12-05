import { useState } from 'react';
import './SendScreens.css';
import QuickShare from "../components/QuickShare"; // Adjust the path if necessary
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

const testImages = [
  { id: 0, title: "Alien", url: alienTest },
  { id: 1, title: "Astronaut", url: astronautTest },
  { id: 2, title: "Mars", url: marsTest },
  { id: 3, title: "Meteorite", url: meteoriteTest },
  { id: 4, title: "Moon", url: moonTest },
  { id: 5, title: "Nasa", url: nasaTest },
  { id: 6, title: "Saturn", url: saturnTest },
  { id: 7, title: "Sun", url: sunTest },
  { id: 8, title: "Nebula", url: nebulaTest }
];

function SendScreens() {
  const [query, setQuery] = useState("");

  const search = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload on form submission
    alert("Clicked search with: " + query);
  }

  // Stub for sendToAstronaut
  const sendToAstronautStub = (astronaut_id: number) => {
    console.log(`Stub: sendToAstronaut called with ID: ${astronaut_id}`);
  };

  return (
    <div id="container">
      <div id="search-bar">
        <h4 id="screen-share-title">Screen Share</h4>
        <form onSubmit={search} id="search-input-form">
          <input 
            id="search-input"
            type="text" 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="  Search Images" 
            value={query}
          />
        </form>
      </div>
      <div id="gallery">
        <Gallery sendToAstronaut={sendToAstronautStub} images={testImages} />
      </div>
    </div>
  );
}

export default SendScreens;
