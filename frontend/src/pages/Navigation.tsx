// for web in houston to complete
// rewrork the old navigation page to fit this new design
// NO WAYPOINTS
// A Map with EV1 and EV2 and PR locations to monitor

import React from 'react';
import { NavLink } from 'react-router-dom';
import Timer from '../components/Timer';

const Navigation: React.FC = () => {
	const navStyle = {
		backgroundColor: '#1a1a1a',
		display: 'flex',
		justifyContent: 'space-between',
		borderBottom: '1px solid #333',
		position: 'sticky' as const,
		top: 0,
		zIndex: 100
	};

	const leftSectionStyle = {
		width: '33.6%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		padding: '0.75rem 1rem',
		paddingBottom: '0rem',
		paddingTop: '0rem',
		borderRight: '1px solid #333'
	};

	const rightSectionStyle = {
		width: '66%',
		display: 'flex',
		gap: '1rem',
		paddingBottom: '0rem',
		paddingTop: '0rem',
		padding: '0.75rem 1rem'
	};

	const linkStyle = {
		color: '#666',
		textDecoration: 'none',
		padding: '0.5rem 1rem',
		borderRadius: '4px',
		transition: 'all 0.2s'
	};

	const activeLinkStyle = {
		...linkStyle,
		backgroundColor: '#333',
		color: 'white'
	};

	return (
		<nav style={navStyle}>
			<div style={leftSectionStyle}>
				<Timer />
			</div>
			<div style={rightSectionStyle}>
				<NavLink 
					to="/vitals" 
					style={({isActive}) => isActive ? activeLinkStyle : linkStyle}
				>
					Vitals
				</NavLink>
				<NavLink 
					to="/messages" 
					style={({isActive}) => isActive ? activeLinkStyle : linkStyle}
				>
					Messages
				</NavLink>
				<NavLink 
					to="/nav" 
					style={({isActive}) => isActive ? activeLinkStyle : linkStyle}
				>
					Navigation
				</NavLink>
			</div>
		</nav>
	);
};

export default Navigation;