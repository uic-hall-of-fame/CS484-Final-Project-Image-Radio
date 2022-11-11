import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    Button,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import MusicPlayer from './MusicPlayer';
import PlayerErrorHandler from './PlayerErrorHandler';

export default function Player() {
    const [token, setToken] = useState('');
    const [tokenText, setTokenText] = useState('');
    const [showToken, setShowToken] = useState(false);

    const scopes = [
        'streaming',
        'user-read-email',
        'user-read-private',
        'user-library-read',
        'user-library-modify',
        'user-read-playback-state',
        'user-modify-playback-state',
    ];

    const tokenPath = `https://accounts.spotify.com/en/authorize?response_type=token&client_id=adaaf209fb064dfab873a71817029e0d&redirect_uri=https:%2F%2Fdeveloper.spotify.com%2Fdocumentation%2Fweb-playback-sdk%2Fquick-start%2F&scope=${scopes.join(
        '%20',
    )}&show_dialog=true`;

    const handleSetToken = () => {
        setToken(tokenText);
    };

    const handleChange = (event) => {
        setTokenText(event.target.value);
    };

    const handleClickShowToken = () => {
        setShowToken(!showToken);
    };

    const handleMouseUpDownToken = (event) => {
        event.preventDefault();
    };

    const getPlayerUpdates = (playerState) => {
        console.log(playerState);
    };

    return (
        <>
            {token !== '' ? (
                <div style={{ marginTop: 50, marginBottom: 30 }}>
                    <ErrorBoundary FallbackComponent={PlayerErrorHandler}>
                        <MusicPlayer
                            token={token}
                            callback={getPlayerUpdates}
                        />
                    </ErrorBoundary>
                </div>
            ) : null}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 30,
                    columnGap: 20,
                }}
            >
                <FormControl
                    sx={{
                        width: '25ch',
                    }}
                    variant="outlined"
                >
                    <InputLabel htmlFor="outlined-adornment-password">
                        Spotify Access Token
                    </InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showToken ? 'text' : 'password'}
                        value={tokenText}
                        onChange={handleChange}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowToken}
                                    onMouseDown={handleMouseUpDownToken}
                                    onMouseUp={handleMouseUpDownToken}
                                    edge="end"
                                >
                                    {showToken ? (
                                        <VisibilityOff />
                                    ) : (
                                        <Visibility />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Spotify Access Token"
                    />
                </FormControl>
                <Button
                    variant="contained"
                    size="small"
                    onClick={handleSetToken}
                >
                    Play Music
                </Button>
                <Button
                    href={tokenPath}
                    target="_blank"
                    size="small"
                    variant="contained"
                >
                    Generate Access Token
                </Button>
            </div>
        </>
    );
}
