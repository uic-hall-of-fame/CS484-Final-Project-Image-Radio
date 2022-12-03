import React from 'react';

export default function PlayerErrorHandler({ error = null }) {
    return (
        <div
            role="alert"
            style={{ textAlign: 'center' }}
        >
            <p>An error occurred!</p>
            <pre>{error && error.message}</pre>
            <p>
                Please check the validity and scope of your Spotify Access
                Token. Regenerate it using the given link or relogin and try
                again!
            </p>
        </div>
    );
}
