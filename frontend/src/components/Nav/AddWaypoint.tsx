import React, { useState } from 'react';
import './AddWaypoint.css';
import { Waypoint, WaypointType } from './types';

interface AddWaypointProps {
  waypoints: Waypoint[];
  setWaypoints: React.Dispatch<React.SetStateAction<Waypoint[]>>;
}

const AddWaypoint: React.FC<AddWaypointProps> = ({ waypoints, setWaypoints }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    lat: string;
    long: string;
    type: WaypointType;
  }>({
    title: '',
    lat: '',
    long: '',
    type: WaypointType.GEO
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'type' ? Number(value) : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create a new waypoint
    const newWaypoint: Waypoint = {
      waypoint_id: waypoints.length ? Math.max(...waypoints.map(w => w.waypoint_id)) + 1 : 1,
      title: formData.title,
      location: {
        lat: parseFloat(formData.lat),
        long: parseFloat(formData.long)
      },
      type: formData.type
    };

    // Add the new waypoint to the list
    setWaypoints([...waypoints, newWaypoint]);

    // Reset form and close modal
    setFormData({
      title: '',
      lat: '',
      long: '',
      type: WaypointType.GEO
    });
    setShowModal(false);
  };

  return (
    <>
      <button className="btn" onClick={() => setShowModal(true)}>
        <span>Add Waypoint</span>
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Waypoint</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lat">Latitude</label>
                <input
                  type="number"
                  step="any"
                  id="lat"
                  name="lat"
                  value={formData.lat}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="long">Longitude</label>
                <input
                  type="number"
                  step="any"
                  id="long"
                  name="long"
                  value={formData.long}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  required
                >
                  <option value={WaypointType.STATION}>Station (Blue)</option>
                  <option value={WaypointType.NAV}>Navigation (Pink)</option>
                  <option value={WaypointType.GEO}>Geographic (Green)</option>
                  <option value={WaypointType.DANGER}>Danger (Red)</option>
                </select>
              </div>

              <div className="button-group">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit">
                  Add Waypoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddWaypoint;