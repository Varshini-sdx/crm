import React from 'react';

export const Campaigns = ({ branch }) => {
    return (
        <div>
            <h2>Campaigns</h2>
            <p>Manage your marketing campaigns here.</p>
            <p>Current Branch: {branch?.name}</p>
        </div>
    );
};
