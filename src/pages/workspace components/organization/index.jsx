import React from 'react';

export const Organization = ({ branch }) => {
    return (
        <div>
            <h2>Organization Settings</h2>
            <p>Manage your organization settings here.</p>
            <p>Current Branch: {branch?.name}</p>
        </div>
    );
};
