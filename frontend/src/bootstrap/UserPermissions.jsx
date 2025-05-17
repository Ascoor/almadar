import React, { useEffect } from 'react';
import { Reverb } from '@reverb/reverb-js';

const UserPermissions = ({ userId }) => {
    useEffect(() => {
        const reverb = new Reverb({
            apiKey: '5zjfq29w0tarim5h6i0u', // Replace with your actual API key
        });

        reverb.on(`permissions.user.${userId}`, (data) => {
            console.log('Permissions updated for user:', data);
            // Update your UI based on the received data
        });

        return () => {
            reverb.disconnect();
        };
    }, [userId]);

    return <div>User Permissions Component</div>;
};

export default UserPermissions;