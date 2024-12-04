import { useState } from 'react';
import './SendScreens.css';
import alienTest from '../images/alienTest.jpg';
import astronautTest from '../images/astronautTest.jpg';
import marsTest from '../images/marsTest.jpg';
import meteoriteTest from '../images/meteoriteTest.jpg';
import moonTest from '../images/moonTest.jpg';
import nasaTest from '../images/nasaTest.jpg';
import saturnTest from '../images/saturnTest.jpg';

const ALL_IMAGES = [
  { id: 0, title: "Alien Test", url: alienTest, category: "Category 1" },
  { id: 1, title: "Astronaut Test", url: astronautTest, category: "Category 5" },
  { id: 2, title: "Mars Test", url: marsTest, category: "Category 1" },
  { id: 3, title: "Meteorite Test", url: meteoriteTest, category: "Category 2" },
  { id: 4, title: "Moon Test", url: moonTest, category: "Category 4" },
  { id: 5, title: "NASA Test", url: nasaTest, category: "Category 3" },
  { id: 6, title: "Saturn Test", url: saturnTest, category: "Category 3" },
];

function SendScreens() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [visibleImages, setVisibleImages] = useState(ALL_IMAGES)
  const categories = ["All Categories", "Category 1", "Category 2", "Category 3", "Category 4", "Category 5", "Category 6", "Category 7", "Category 8", ];

  const filterImages = () => {
    let filteredImages = ALL_IMAGES;

    if (query) {
      filteredImages = filteredImages.filter((img) =>
        img.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory != "All Categories") {
      filteredImages = filteredImages.filter(
        (img) => img.category === selectedCategory
      );
    }

    setVisibleImages(filteredImages);
    alert(filteredImages.map((img) => img.title).join("\n"));

  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterImages();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterImages();
  };

  return (
    <>
      <div id="container">
        <div id="search-bar">
          <h4 id="screen-share-title">Screen Share</h4>
          <form onSubmit={handleSearch} id="search-input-form">
            <input
              id="search-input"
              type="text"
              onChange={(e) => setQuery(e.target.value)}
              placeholder="  Search Images"
              value={query}
            />
          </form>
        </div>
        <div id= "main-area">
        <div id="category-bar">
            <h3>Image Categories</h3>
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default SendScreens;
