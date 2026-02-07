import React from 'react';

export const Team = ({ branch }) => {
    return (
        <div>
            <h2>Team Component</h2>
            <p>Branch: {branch?.name}</p>
        </div>
    );
};
