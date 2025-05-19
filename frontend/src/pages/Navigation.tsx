// for web in houston to complete
// rewrork the old navigation page to fit this new design
// NO WAYPOINTS
// A Map with EV1 and EV2 and PR locations to monitor

import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation: React.FC = () => {
	const navStyle = {
		backgroundColor: '#1E1E1E',
		padding: '1rem',
		display: 'flex',
		justifyContent: 'center',
		gap: '2rem',
		borderBottom: '1px solid #333',
		position: 'sticky',
		top: 0,
		zIndex: 1000
	};

	const linkStyle = {
		color: 'white',
		textDecoration: 'none',
		padding: '0.5rem 1rem',
		borderRadius: '4px',
		transition: 'background-color 0.2s ease',
	};

	const activeLinkStyle = {
		backgroundColor: '#0066ff',
	};

	return (
		<nav style={navStyle}>
			<NavLink 
				to="/vitals" 
				style={({isActive}) => ({
					...linkStyle,
					...(isActive ? activeLinkStyle : {})
				})}
			>
				Vitals
			</NavLink>
			<NavLink 
				to="/messages" 
				style={({isActive}) => ({
					...linkStyle,
					...(isActive ? activeLinkStyle : {})
				})}
			>
				Messages
			</NavLink>
		</nav>
	);
};

export default Navigation;