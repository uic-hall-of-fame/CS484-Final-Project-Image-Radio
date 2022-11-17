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

let timeOutID = null; // timeOutID variable is placed outside the component because the component gets rerendered repeatedly which resets the timeOutID variable to null on every render when it is inside the below function
// https://stackoverflow.com/questions/60765267/why-is-the-state-not-being-properly-updated-in-this-react-native-component
let manualButtonClick = false;
export default function Player() {
    const [token, setToken] = useState('');
    const [tokenText, setTokenText] = useState('');
    const [showToken, setShowToken] = useState(false);
    const [uris, setUris] = useState([]);
    const [songText, setSongText] = useState('');
    const [artistText, setArtistText] = useState('');
    const [lyrics, setLyrics] = useState({});
    const [play, setPlay] = useState(false);
    const [liveLyrics, setLiveLyrics] = useState('');

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

        if (timeOutID) {
            clearTimeout(timeOutID); // Stop any setTimeout if running
        }
        if (manualButtonClick) {
            const play_pause_element =
                document.getElementsByClassName('rswp__toggle');
            manualButtonClick = false;
            play_pause_element[0].click();
        } else if (
            playerState.isPlaying &&
            playerState.type === 'progress_update'
        ) {
            const play_pause_element =
                document.getElementsByClassName('rswp__toggle');
            manualButtonClick = true;
            play_pause_element[0].click();
        } else if (playerState.isPlaying) {
            // If the song is being played
            const startTime = playerState.progressMs;
            const songLyrics = lyrics[playerState.track.id].lines;
            const startIndex = getStartIndex(startTime, songLyrics); // Index of the songLyrics array from which the lyrics will start displaying on the screen

            // offset is the time in ms by which our song being played is ahead of the start time of the lyrics at "startIndex" index
            let offset =
                startIndex !== -1
                    ? startTime - songLyrics[startIndex].startTimeMs
                    : startTime; // When the lyrics have not started in the song

            offset += 700; // Manually syncing the lag

            // Display the lyrics on the screen
            displayLyrics(startIndex, songLyrics, offset);
        }
    };
    const getStartIndex = (startTime, songLyrics) => {
        // This function will return the index of the songLyrics array from which the lyrics will start displaying on the screen
        for (let index = 0; index < songLyrics.length; index++) {
            if (startTime < parseInt(songLyrics[index].startTimeMs, 10)) {
                return index - 1;
            }
        }
        return songLyrics.length - 1;
    };
    const displayLyrics = (startIndex, songLyrics, offset = 0) => {
        // This function will display the lyrics on the screen

        if (startIndex === -1) {
            // When the lyrics have not started in the song
            setLiveLyrics('');

            // Calcultating the timeOut in ms after which the next line of lyrics is to be displayed
            const timeOut = songLyrics[startIndex + 1].startTimeMs - offset;
            timeOutID = setTimeout(() => {
                displayLyrics(startIndex + 1, songLyrics);
            }, timeOut);
        } else {
            // When the lyrics have started in the song
            setLiveLyrics(songLyrics[startIndex].words);

            if (startIndex <= songLyrics.length - 2) {
                // Calcultating the timeOut in ms after which the next line of lyrics is to be displayed
                const timeOut =
                    songLyrics[startIndex + 1].startTimeMs -
                    songLyrics[startIndex].startTimeMs -
                    offset;

                timeOutID = setTimeout(() => {
                    displayLyrics(startIndex + 1, songLyrics);
                }, timeOut);
            }
        }
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

    const addSongUriAndLyrics = async (songName, songArtist) => {
        const [songID, songLyrics] = await getIdAndLyricsByNameAndArtist(
            songName,
            songArtist,
        );

        setUris([...uris, `spotify:track:${songID}`]);
        setLyrics({ ...lyrics, [songID]: songLyrics }); // https://stackoverflow.com/questions/11508463/javascript-set-object-key-by-variable
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

    const getIdAndLyricsByNameAndArtist = async (songName, songArtist) => {
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
                            addSongUriAndLyrics(songText, artistText);
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
            <div>Lyrics: {liveLyrics}</div>
        </>
    );
}
