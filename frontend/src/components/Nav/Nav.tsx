import React, { useState } from 'react';
import './Nav.css';
import NavOptions from './NavOptions.tsx';
import DefaultState from './DefaultState.tsx';

const Nav = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const togglePanel = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <>
            <NavOptions/>
            <div className="main-container">
                {/* Panel */}
                <DefaultState/>
                <div className="background-img">
                    
                </div>
            </div>
        </>
    );
};

export default Nav;