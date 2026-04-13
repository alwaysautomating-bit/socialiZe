import React from 'react';
import './PlatformSelector.css';

const PlatformSelector = () => {
    return (
        <div className="platform-selector">
            <h1>Select Your Platform</h1>
            
            {/* New red socialiZe button */}
            <button className="socialize-button" style={{ backgroundColor: 'red', color: 'white' }}>
                socialiZe
            </button>

            {/* Other components can go here */}
        </div>
    );
};

export default PlatformSelector;