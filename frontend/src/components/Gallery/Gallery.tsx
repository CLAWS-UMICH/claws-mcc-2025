import React, { useState } from 'react';
import './Gallery.css';

interface Image {
  id: number;
  title: string;
  url: string;
}

const CircleIcon = ({ color }: { color: string }) => {
  return (
    <div
      style={{
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        backgroundColor: color,
        marginRight: '10px', 
      }}
    ></div>
  );
};


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

  // Determine the class for the gallery container
  const galleryClass =
    images.length < 5 ? 'fewer-than-five' : 'greater-than-five';

  return (
    <div id="gallery-container" className={galleryClass}>
      {images.map((image) => (
        <div
          key={image.id}
          className={`gallery-item ${selectedImageId === image.id ? 'selected' : ''}`}
          onClick={() => handleImageClick(image.id)}
        >
          <img src={image.url} alt={image.title} className="gallery-image" />
          <p className="gallery-title">{image.title}</p>

          {selectedImageId === image.id && (
             <ul className="popup-options">
             <li className="popup-option">
               <CircleIcon color="#007bff" /> {/* Blue Circle */}
               <span>Send to Steve</span>
             </li>
             <li className="popup-option">
               <CircleIcon color="#9ff" /> {/* Light Blue Circle */}
               <span>Send to Alex</span>
             </li>
           </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default Gallery;
