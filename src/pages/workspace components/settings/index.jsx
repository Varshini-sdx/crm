import React from 'react';

export const Settings = ({ branch }) => {
    return (
        <div>
            <h2>Settings</h2>
            <p>Manage your workspace settings here.</p>
            <p>Current Branch: {branch?.name}</p>
        </div>
    );
};
