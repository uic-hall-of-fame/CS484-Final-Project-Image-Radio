import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

export default function SpotErrorHandler({ error }) {
    return (
        <div
            role="alert"
            style={{ textAlign: 'center' }}
        >
            <p>An error occurred:</p>
            <pre>{error.message}</pre>
            <p>
                Please check the scope of your Spotify Access Token. Regenerate
                it using the given link and try again!
            </p>
            <Button
                variant="contained"
                size="small"
                component={Link}
                to="/"
            >
                <b>Go Back</b>
            </Button>
        </div>
    );
}
