import React from 'react';
import { Box, Typography } from '@mui/material';

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
                We plan to play a song and display its lyrics, in a synchronous
                manner. We will use <b>OAuth with Spotify</b> for user login.
                After this, we will fetch the timestamped lyrics of the song and
                play it using the <b>Spotify API</b>. <b>Supabase</b> database
                will be used for the backend, while <b>React</b> will be used
                for the frontend. We will use <b>GitHub</b> for version control
                along with <b>Netlify</b> for CI and hosting. We successfully
                completed all the planned tasks for the MVP.
            </Typography>

            <Typography
                variant="h5"
                component="div"
                gutterBottom
                sx={{ mt: 4, ml: 4, textDecoration: 'underline' }}
            >
                Final Submission Description
            </Typography>

            <Typography
                variant="h6"
                gutterBottom
                sx={{ ml: 4 }}
            >
                We plan to play a song and display AI generated images from its
                lyrics, in a synchronous manner. We will use{' '}
                <b>OAuth with Spotify</b> for user login. After this, we will
                fetch the timestamped lyrics of the song and play it using the{' '}
                <b>Spotify API</b>. <b>Supabase</b> database will be used for
                the backend, while <b>React</b> will be used for the frontend.
                We will use <b>GitHub</b> for version control along with{' '}
                <b>Netlify</b> for CI and hosting. Our project will also utilize
                an image generating AI API (probably the newly released{' '}
                <b>DALLE-2</b>), to generate images based on the lyrics of the
                song.
            </Typography>
        </>
    );
}
