import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    Button,
    TextField,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import MusicPlayer from './MusicPlayer';
import PlayerErrorHandler from './PlayerErrorHandler';

export default function Player() {
    const [token, setToken] = useState('');
    const [tokenText, setTokenText] = useState('');
    const [showToken, setShowToken] = useState(false);
    const [uris, setUris] = useState([]);
    const [songText, setSongText] = useState('');
    const [artistText, setArtistText] = useState('');
    const [lyrics, setLyrics] = useState([]);
    const [play, setPlay] = useState(false);

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

    const handleTokenChange = (event) => {
        setTokenText(event.target.value);
    };

    const handleClickShowToken = () => {
        setShowToken(!showToken);
    };

    const handleMouseUpDownToken = (event) => {
        event.preventDefault();
    };

    const handleSongChange = (event) => {
        setSongText(event.target.value);
    };

    const handleArtistChange = (event) => {
        setArtistText(event.target.value);
    };

    const getPlayerUpdates = (playerState) => {
        console.log(playerState);
    };

    const refreshPage = () => {
        setToken('');
        setTokenText('');
        setShowToken(false);
        setUris([]);
        setSongText('');
        setArtistText('');
        setLyrics([]);
        setPlay(false);
    };

    const addSongUri = async (songName, songArtist) => {
        const [songID, songLyrics] = await getSongLyricsByNameAndArtist(
            songName,
            songArtist,
        );

        setUris([...uris, `spotify:track:${songID}`]);
        setLyrics([...lyrics, { song_id: songID, lyrics: songLyrics }]);
    };

    const getSongDetailsByNameAndArtist = async (songName, songArtist) => {
        // The regex function is replacing mulitple spaces with a single space (https://stackoverflow.com/questions/1981349/regex-to-replace-multiple-spaces-with-a-single-space)
        const query = `${songName
            .replace(/\s\s+/g, ' ')
            .replaceAll(' ', '+')}+${songArtist
            .replace(/\s\s+/g, ' ')
            .replaceAll(' ', '+')}`;

        const type = 'track';
        const limit = 1;
        const offset = 0;

        // https://developer.spotify.com/console/get-search-item/
        const url = `https://api.spotify.com/v1/search?q=${query}&type=${type}&limit=${limit}&offset=${offset}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        const data = await response.json();

        // Extracting all the artists of the song
        const { artists } = data.tracks.items[0];

        let artistString = artists[0].name; // First artist of the song

        // Intermediate artists of the song separated by commas
        for (let i = 1; i < artists.length - 1; i++) {
            artistString = `${artistString}, ${artists[i].name}`;
        }

        // Last artist of the song displayed after & (When multiple song artists present)
        if (artists.length > 1) {
            artistString = `${artistString} & ${
                artists[artists.length - 1].name
            }`;
        }

        const { id, name } = data.tracks.items[0];
        const href = data.tracks.items[0].external_urls.spotify;
        const album_image = data.tracks.items[0].album.images;
        const album_name = data.tracks.items[0].album.name;

        return {
            song_id: id,
            song_name: name,
            song_link: href,
            artistString,
            album_image,
            album_name,
        };
    };

    const getSongLyricsByID = async (songID) => {
        // Source: https://github.com/akashrchandran/spotify-lyrics-api
        const url = `https://spotify-lyric-api.herokuapp.com/?trackid=${songID}`;
        const response = await fetch(url, { method: 'GET' });
        const lyricsData = await response.json();

        return lyricsData;
    };

    const getSongLyricsByNameAndArtist = async (songName, songArtist) => {
        const { song_id } = await getSongDetailsByNameAndArtist(
            songName,
            songArtist,
        );

        const songLyrics = await getSongLyricsByID(song_id);

        return [song_id, songLyrics];
    };

    return (
        <>
            {token !== '' && play && uris.length > 0 ? (
                <div style={{ marginTop: 50, marginBottom: 30 }}>
                    <ErrorBoundary FallbackComponent={PlayerErrorHandler}>
                        <MusicPlayer
                            token={token}
                            callback={getPlayerUpdates}
                            uris={uris}
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
                        onChange={handleTokenChange}
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
                    onClick={() => {
                        handleSetToken();
                    }}
                >
                    Launch Player
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
            {token !== '' && !play ? (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 30,
                        columnGap: 20,
                    }}
                >
                    <TextField
                        label="Song Name"
                        variant="outlined"
                        value={songText}
                        onChange={handleSongChange}
                    />
                    <TextField
                        label="Artist Name"
                        variant="outlined"
                        value={artistText}
                        onChange={handleArtistChange}
                    />
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                            setSongText('');
                            setArtistText('');
                            addSongUri(songText, artistText);
                        }}
                    >
                        Add Song to Queue
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                            if (uris.length > 0) {
                                setPlay(true);
                            }
                        }}
                    >
                        Play Songs
                    </Button>
                </div>
            ) : null}
            {token !== '' && play ? (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 30,
                        columnGap: 20,
                    }}
                >
                    <Button
                        variant="contained"
                        size="small"
                        onClick={refreshPage}
                    >
                        Reset Player
                    </Button>
                </div>
            ) : null}
        </>
    );
}
