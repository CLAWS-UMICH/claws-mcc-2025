'use client'
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

  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isWaypointMode) return;

    // Get x and y position of the cursor relative to the container
    const rect = (event.target as HTMLDivElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    console.log(`Cursor Position: X: ${x}, Y: ${y}`);
    
    // You can perform additional actions with the coordinates here
  };

  return (
    <div>
      <button 
        className={`btn ${isWaypointMode ? 'active' : ''}`}
        onClick={toggleWaypointMode}
      >
        <span>
          {<img className="icon" src={locationIcon} alt="Add Waypoint Icon" />}
          Add Waypoint
        </span>
      </button>
      

    </div>
  );
};

export default AddWaypoint;
