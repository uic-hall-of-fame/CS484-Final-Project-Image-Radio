import React from 'react';
import { Box, Typography } from '@mui/material';

export default function About() {
    return (
        <>
            <Typography
                variant="overline"
                component="div"
                gutterBottom
                align="center"
                sx={{ mt: 4, fontSize: '30px' }}
            >
                Final project Tech stack and MVP proposal
            </Typography>

            <Typography
                variant="overline"
                component="div"
                gutterBottom
                sx={{
                    mt: -2,
                    ml: 4,
                    textDecoration: 'underline',
                    textAlign: 'center',
                    fontSize: '20px',
                }}
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
                variant="overline"
                component="div"
                gutterBottom
                sx={{
                    mt: 4,
                    ml: 4,
                    mb: -1,
                    textDecoration: 'underline',
                    textAlign: 'center',
                    fontSize: '20px',
                }}
            >
                MVP (Minimum Viable Product) Description
            </Typography>

            <Typography
                variant="h6"
                align="justify"
                gutterBottom
                sx={{ ml: 4, mr: 4 }}
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
                variant="overline"
                component="div"
                gutterBottom
                sx={{
                    mt: 4,
                    ml: 4,
                    mb: -1,
                    textDecoration: 'underline',
                    textAlign: 'center',
                    fontSize: '20px',
                }}
            >
                Final Submission Description
            </Typography>

            <Typography
                variant="h6"
                align="justify"
                gutterBottom
                sx={{ ml: 4, mr: 4, mb: 4 }}
            >
                We plan to play a song and display AI generated images from its
                lyrics, in a synchronous manner. We will use{' '}
                <b>OAuth with Spotify</b> for user login. After this, we will
                fetch the timestamped lyrics of the song and play it using the{' '}
                <b>Spotify API</b>. <b>Supabase</b> database will be used for
                the backend, while <b>React</b> will be used for the frontend.
                We will use <b>GitHub</b> for version control along with{' '}
                <b>Netlify</b> for CI and hosting. Our project also utilizes the
                newly released <b>DALLE-2</b> API, to generate images based on
                the lyrics of the song. We successfully completed all the
                planned tasks for the final submission.
            </Typography>
        </>
    );
}
