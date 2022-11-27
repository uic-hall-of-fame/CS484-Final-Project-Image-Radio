import React, { useState } from 'react';
import { TextField, Typography, Button } from '@mui/material';
import AddProgress from './AddProgress';

function AddSongs({ session, isAdmin }) {
    const [songName, setSongName] = useState('');
    const [songArtist, setSongArtist] = useState('');
    const [addingSong, setAddingSong] = useState(false);

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
                    variant="h2"
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
                    variant="h2"
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
            {!addingSong && (
                <>
                    <Typography
                        variant="h2"
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
                            columnGap: 20,
                            marginBottom: 20,
                        }}
                    >
                        <TextField
                            id="outlined-basic"
                            label="Song Name"
                            variant="outlined"
                            value={songName}
                            onChange={onSongNameChange}
                        />

                        <TextField
                            id="outlined-basic"
                            label="Song Artist"
                            variant="outlined"
                            value={songArtist}
                            onChange={onSongArtistChange}
                        />
                    </div>
                    <Button
                        variant="contained"
                        disabled={!(songName && songArtist)}
                        onClick={onAddSongsButtonClick}
                    >
                        Add Song
                    </Button>
                </>
            )}

            {addingSong && (
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
