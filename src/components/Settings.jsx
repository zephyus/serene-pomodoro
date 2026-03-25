import React, { useState } from 'react';
import './Settings.css';

const Settings = ({ notificationType, onNotificationChange, onRequestPermission }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleNotificationChange = (e) => {
        const value = e.target.value;
        onNotificationChange(value);

        // Request permission if Windows notification is selected
        if (value === 'windows') {
            onRequestPermission();
        }
    };

    return (
        <div className="settings-container">
            <button
                className="settings-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Settings"
            >
                ⚙️
            </button>

            {isOpen && (
                <div className="settings-panel">
                    <h3>Notification Settings</h3>

                    <div className="setting-group">
                        <label>Timer Complete Notification:</label>
                        <select
                            value={notificationType}
                            onChange={handleNotificationChange}
                            className="notification-select"
                        >
                            <option value="none">🔇 None</option>
                            <option value="brief">🔔 Brief Sound</option>
                            <option value="chime">🎵 Chime</option>
                            <option value="windows">💬 Windows Notification + Sound</option>
                        </select>
                    </div>

                    <div className="setting-info">
                        <small>
                            {notificationType === 'windows' &&
                                '💡 Windows notifications require browser permission'}
                            {notificationType === 'brief' &&
                                '🔔 Plays a gentle notification sound'}
                            {notificationType === 'chime' &&
                                '🎵 Plays a longer chime sound'}
                            {notificationType === 'none' &&
                                '🔇 No notification when timer completes'}
                        </small>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
