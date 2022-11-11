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

    const handleChange = (event) => {
        setTokenText(event.target.value);
    };

    const handleSetToken = () => {
        setToken(tokenText);
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
            </div>
        </>
    );
}
