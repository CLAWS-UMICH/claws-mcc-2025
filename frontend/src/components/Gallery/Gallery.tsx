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
  sendToAstronaut: (astronaut_id: number, title: string, imageUrl: string)  => void;
  images: Image[];
}

const Gallery: React.FC<GalleryProps> = ({ sendToAstronaut, images }) => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const handleImageClick = (img: Image) => {
    if (selectedImage === img) {
      setSelectedImage(null);
    } else {
      setSelectedImage(img);
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
          className={`gallery-item ${selectedImage && selectedImage.id === image.id ? 'selected' : ''}`} /**Sorry i made this uglier Marcin -emma */
          onClick={() => handleImageClick(image)}
        >
          <img src={image.url} alt={image.title} className="gallery-image" />
          <p className="gallery-title">{image.title}</p>

          {selectedImage && selectedImage.id === image.id && (
             <div className="popup-options">
              <button onClick={() => sendToAstronaut(1, selectedImage.title, selectedImage.url)} className="popup-option"><CircleIcon color="#007bff" /> {/* Blue Circle */}
             <span>Send to Steve</span>
             </button>
             <button onClick={() => sendToAstronaut(2, selectedImage.title, selectedImage.url)} className="popup-option"><CircleIcon color="#9ff" /> {/* Light Blue Circle */}
               <span>Send to Alex</span>
               </button>
           </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Gallery;
