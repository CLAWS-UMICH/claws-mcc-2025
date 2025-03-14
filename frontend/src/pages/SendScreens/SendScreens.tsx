import { useState, useEffect } from 'react';
import './SendScreens.css';
import SearchBar from './SearchBar.tsx';
import Gallery from '../../components/Gallery/Gallery.tsx';
import alienTest from '../images/alienTest.jpg';
import astronautTest from '../images/astronautTest.jpg';
import marsTest from '../images/marsTest.jpg';
import meteoriteTest from '../images/meteoriteTest.jpg';
import moonTest from '../images/moonTest.jpg';
import nasaTest from '../images/nasaTest.jpg';
import saturnTest from '../images/saturnTest.jpg';
import sunTest from '../images/sunTest.jpg';
import nebulaTest from '../images/nebulaTest.jpg';
const ALL_IMAGES = [
  { id: 0, title: "Alien", url: alienTest, category:"Category 1" },
  { id: 1, title: "Astronaut", url: astronautTest, category:"Category 1" },
  { id: 2, title: "Mars", url: marsTest, category:"Category 1"  },
  { id: 3, title: "Meteorite", url: meteoriteTest, category:"Category 1"  },
  { id: 4, title: "Moon", url: moonTest, category:"Category 1"  },
  { id: 5, title: "Nasa", url: nasaTest, category:"Category 1"  },
  { id: 6, title: "Saturn", url: saturnTest, category:"Category 1"  },
  { id: 7, title: "Sun", url: sunTest, category:"Category 1"  },
  { id: 8, title: "Nebula", url: nebulaTest, category:"Category 1"  }
];

function SendScreens() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [visibleImages, setVisibleImages] = useState(ALL_IMAGES)
  const categories = ["All Categories", "Category 1", "Category 2", "Category 3", "Category 4", "Category 5", "Category 6", "Category 7", "Category 8", ];

  const sendToAstronautStub = (astronaut_id:number) => {
    console.log(`Clicked with astronaut id ${astronaut_id}`)
  }
  const filterImages = () => {
    let filteredImages = ALL_IMAGES;

    if (query) {
      filteredImages = filteredImages.filter((img) =>
        img.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (selectedCategory != "" && selectedCategory !== "All Categories") {
      filteredImages = filteredImages.filter(
        (img) => img.category === selectedCategory
      );
    }

    setVisibleImages(filteredImages);
  };

  

  const handleSearch = () => {
    filterImages();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterImages();
  };

  useEffect(() => {
    console.log(visibleImages);
  }, [visibleImages]);

  return (
    <>
      <div id="container">
        <SearchBar handleSearch={handleSearch} setQuery={setQuery} query={query}/>
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
}

export default SendScreens;