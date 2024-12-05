import React, { useState } from 'react';
import './Gallery.css';

interface Image {
  id: number;
  title: string;
  url: string;
}

interface GalleryProps {
  sendToAstronaut: (astronaut_id: number) => void;
  images: Image[];
}

const Gallery: React.FC<GalleryProps> = ({ sendToAstronaut, images }) => {
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

  const handleImageClick = (id: number) => {
    if (selectedImageId === id) {
      setSelectedImageId(null); 
    } else {
      setSelectedImageId(id); 
    }
  };

  return (
    <div id="gallery-container">
      {images.map((image) => (
        <div
          key={image.id}
          className={`gallery-item ${selectedImageId === image.id ? 'selected' : ''}`}
          onClick={() => handleImageClick(image.id)}
        >
          <img src={image.url} alt={image.title} className="gallery-image" />
          <p className="gallery-title">{image.title}</p>

          {selectedImageId === image.id && (
            <p className="popover-content">This is some content for {image.title}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Gallery;
