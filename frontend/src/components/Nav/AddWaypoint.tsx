import React, { useState } from 'react';
import locationAddCursor from '../Nav/images/locationAdd.svg';
import locationIcon from '../Nav/images/locationAdd.png';
import "./AddWaypoint.css";

interface AddWaypointProps {
  onWaypointModeChange?: (isActive: boolean) => void;
}

const AddWaypoint: React.FC<AddWaypointProps> = ({ onWaypointModeChange }) => {
  const [isWaypointMode, setIsWaypointMode] = useState(false);

  const toggleWaypointMode = () => {
    const newMode = !isWaypointMode;
    setIsWaypointMode(newMode);
    
    // Change cursor style
    document.body.style.cursor = newMode 
      ? `url(${locationAddCursor}), auto`
      : 'default';
    
    // Notify parent component if needed
    if (onWaypointModeChange) {
      onWaypointModeChange(newMode);
    }
  };

  return (
    
    <button 
      className={`btn ${isWaypointMode ? 'active' : ''}`}
      onClick={toggleWaypointMode}
    >
      <span>
        {<img className="icon" src={locationIcon}/>}
        Add Waypoint
      </span>
    </button>
  );
};

export default AddWaypoint;
