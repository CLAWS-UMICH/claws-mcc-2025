import React, { useState } from 'react';
import './NavOptions.css';

const NavOptions = () => {

    return (
        <div className="nav-options">
            <div className="left-section">Navigation</div>
            <div className="right-section">
                <button className="btn">
                    <span> 
                        {/* <img src="./Nav/images/locationAdd.png"/> */}
                        Add Waypoint
                    </span>
                </button>
                <button className="btn">
                    <span> 
                        {/* <img src="./Nav/images/locationAdd.png"/> */}
                        Create Route
                    </span>
                </button>
            </div>
        </div>
    );
};

export default NavOptions;