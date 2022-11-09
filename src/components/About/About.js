import React from 'react';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

export default function About() {
    return (
        <>
            <Typography
                variant="h4"
                component="div"
                gutterBottom
                align="center"
                sx={{ mt: 4 }}
            >
                Final project Tech stack and MVP proposal
            </Typography>

            <Typography
                variant="h5"
                component="div"
                gutterBottom
                sx={{ mt: 4, ml: 4, textDecoration: 'underline' }}
            >
                Architecture Diagram
            </Typography>

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <img
                    alt="Architecture Diagram"
                    src="/images/Architecture_Diagram.png"
                />
            </Box>

            <Typography
                variant="h5"
                component="div"
                gutterBottom
                sx={{ mt: 4, ml: 4, textDecoration: 'underline' }}
            >
                MVP (Minimum Viable Product) Description
            </Typography>

            <Typography
                variant="h6"
                gutterBottom
                sx={{ ml: 4 }}
            >
                We plan to play a song and display its lyrics in a synchronous
                manner. We will use <b>OAuth with Spotify</b> for user login and
                to access user playlists. After this, we will fetch the
                timestamped lyrics of the song and play it using the{' '}
                <b>Spotify API</b>.<b>Supabase</b> database will be used for the
                backend, while
                <b>React</b> will be used for the frontend. We will use
                <b>GitHub</b> for version control along with <b>Netlify</b> for
                CI and hosting.
            </Typography>
        </>
    );
}
