import React from "react";
import './propertystatus.css';

const PropertyStatus = ({ text, backgroundColor, textColor }) => {
    const statusPanelStyle = {
        backgroundColor: backgroundColor,
        color: textColor 
    };

    return (
        <div className="status-panel" style={statusPanelStyle}>
            <div className="status-panel-child" />
            <h2 className="status-action" style={{ color: textColor }}>
                {text}
            </h2>
        </div>
    );
}

export default PropertyStatus;