import React from 'react';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

export default function About() {
    return (
        <>
            <Typography
                variant='h4'
                component='div'
                gutterBottom
                align='center'
                sx={{ mt: 4 }}
            >
                Final project Tech stack and MVP proposal
            </Typography>

            <Typography
                variant='h5'
                component='div'
                gutterBottom
                sx={{ mt: 4, ml: 4, textDecoration: 'underline' }}
            >
                Architecture Diagram
            </Typography>

            <Box display='flex' justifyContent='center' alignItems='center'>
                <img
                    alt='Architecture Diagram'
                    src='/images/Architecture_Diagram.png'
                />
            </Box>

            <Typography
                variant='h5'
                component='div'
                gutterBottom
                sx={{ mt: 4, ml: 4, textDecoration: 'underline' }}
            >
                MVP (Minimum Viable Product) Description
            </Typography>

            <Typography variant='h6' gutterBottom sx={{ ml: 4 }}>
                We are planning to play and display the lyrics of songs in sync.
                We will be using Spotify API for authorizing users, fetching
                lyrics of the songs, and playing songs. Supabase database will
                be used for backend while React will be used for Frontend.
            </Typography>
        </>
    );
}
