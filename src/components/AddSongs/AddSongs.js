import React, { useState } from 'react';
import { TextField, Typography, Button } from '@mui/material';
import AddProgress from './AddProgress';

function AddSongs({ session, isAdmin }) {
    const [songName, setSongName] = useState('');
    const [songArtist, setSongArtist] = useState('');
    const [addingSong, setAddingSong] = useState(false); // After addSong button is clicked, addingSong becomes true

    const onAddSongsButtonClick = () => {
        setAddingSong(true);
    };

    const onSongNameChange = (event) => {
        setSongName(event.target.value);
    };

    const onSongArtistChange = (event) => {
        setSongArtist(event.target.value);
    };

    // When user is not logged in
    if (!session) {
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 30,
                }}
            >
                <Typography
                    variant="h5"
                    gutterBottom
                    color="red"
                >
                    Login via an admin account to view this page
                </Typography>
            </div>
        );
    }
    if (!isAdmin) {
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 30,
                }}
            >
                <Typography
                    variant="h5"
                    gutterBottom
                    color="red"
                >
                    Only admin users are allowed to add songs to the radio
                </Typography>
            </div>
        );
    }
    return (
        <div
            className="container"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 30,
                flexDirection: 'column',
            }}
        >
            {!addingSong ? (
                <>
                    <Typography
                        variant="h4"
                        gutterBottom
                    >
                        Add Songs to the Radio
                    </Typography>
                    <div
                        className="input_fields"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            columnGap: 40,
                            marginTop: 20,
                            marginBottom: 30,
                        }}
                    >
                        <TextField
                            label="Song Name"
                            variant="outlined"
                            sx={{
                                border: '0.1px solid white',
                                borderRadius: 2,
                                '& .MuiOutlinedInput-root.Mui-focused': {
                                    '& > fieldset': {
                                        border: 'none',
                                    },
                                },
                            }}
                            InputLabelProps={{
                                style: { backgroundColor: '#191414' },
                            }}
                            value={songName}
                            onChange={onSongNameChange}
                        />

                        <TextField
                            label="Song Artist"
                            variant="outlined"
                            sx={{
                                border: '0.1px solid white',
                                borderRadius: 2,
                                '& .MuiOutlinedInput-root.Mui-focused': {
                                    '& > fieldset': {
                                        border: 'none',
                                    },
                                },
                            }}
                            InputLabelProps={{
                                style: { backgroundColor: '#191414' },
                            }}
                            value={songArtist}
                            onChange={onSongArtistChange}
                        />
                    </div>
                    {songName && songArtist ? (
                        <Button
                            variant="contained"
                            onClick={onAddSongsButtonClick}
                        >
                            Add Song
                        </Button>
                    ) : null}
                </>
            ) : (
                <AddProgress
                    session={session}
                    songName={songName}
                    songArtist={songArtist}
                    setAddingSong={setAddingSong}
                />
            )}
        </div>
    );
}

export default AddSongs;
