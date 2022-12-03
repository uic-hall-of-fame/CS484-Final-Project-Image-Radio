import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    Button,
    Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import MusicPlayer from './MusicPlayer';
import PlayerErrorHandler from './PlayerErrorHandler';
import RadioPlaylist from './RadioPlaylist';
import supabase from '../../supabaseClient';

let timeOutID = null; // timeOutID variable is placed outside the component because the component gets rerendered repeatedly which resets the timeOutID variable to null on every render when it is inside the below function
// https://stackoverflow.com/questions/60765267/why-is-the-state-not-being-properly-updated-in-this-react-native-component
let manualButtonClick = false;

export default function Player({ session }) {
    // https://png-pixel.com/ : For getting 512X512/256X256 blank image
    const black_image_base64 =
        'iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAEiElEQVR42u3VMQEAAAQAQTpY9A9KBrO7CL98dtUEABylgQBgIAAYCAAGAoCBAICBAGAgABgIAAYCgIEAgIEAYCAAGAgABgKAgQCAgQBgIAAYCAAGAoCBAICBAGAgABgIAAYCgIEAgIEAYCAAGAgABgKAgQCAgQBgIAAYCAAGAoCByACAgQBgIAAYCAAGAgAGAoCBAGAgABgIAAYCAAYCgIEAYCAAGAgABgIABgKAgQBgIAAYCAAGAgAGAoCBAGAgABgIAAYCAAYCgIEAYCAAGAgABgIABgKAgQBgIAAYCAAGAgAGAoCBAGAgABgIAAZiIAAYCAAGAoCBAGAgAGAgABgIAAYCgIEAYCAAYCAAGAgABgKAgQBgIABgIAAYCAAGAoCBAGAgAGAgABgIAAYCgIEAYCAAYCAAGAgABgKAgQBgIABgIAAYCAAGAoCBAGAgAGAgABgIAAYCgIEAgIEAYCAAGAgABgKAgQCAgQBgIAAYCAAGAoCBAICBAGAgABgIAAYCgIEAgIEAYCAAGAgABgKAgQCAgQBgIAAYCAAGAoCBAICBAGAgABgIAAYCgIEAgIEAYCAAGAgABgKAgRgIAAYCgIEAYCAAGAgAGAgABgKAgQBgIAAYCAAYCAAGAoCBAGAgABgIABgIAAYCgIEAYCAAGAgAGAgABgKAgQBgIAAYCAAYCAAGAoCBAGAgABgIABgIAAYCgIEAYCAAGAgAGAgABgKAgQBgIABgIAAYCAAGAoCBAGAgAGAgABgIAAYCgIEAYCAAYCAAGAgABgKAgQBgIABgIAAYCAAGAoCBAGAgAGAgABgIAAYCgIEAYCAAYCAAGAgABgKAgQBgIABgIAAYCAAGAoCBAGAgBgKAgQBgIAAYCAAGAgAGAoCBAGAgABgIAAYCAAYCgIEAYCAAGAgABgIABgKAgQBgIAAYCAAGAgAGAoCBAGAgABgIAAYCAAYCgIEAYCAAGAgABgIABgKAgQBgIAAYCAAGAgAGAoCBAGAgABgIAAZiIAAYCAAGAoCBAGAgAGAgABgIAAYCgIEAYCAAYCAAGAgABgKAgQBgIABgIAAYCAAGAoCBAGAgAGAgABgIAAYCgIEAYCAAYCAAGAgABgKAgQBgIABgIAAYCAAGAoCBAGAgMgBgIAAYCAAGAoCBAICBAGAgABgIAAYCgIEAgIEAYCAAGAgABgKAgQCAgQBgIAAYCAAGAoCBAICBAGAgABgIAAYCgIEAgIEAYCAAGAgABgKAgQCAgQBgIAAYCAAGAoCBAICBAGAgABgIAAYCgIEYCAAGAoCBAGAgABgIABgIAAYCgIEAYCAAGAgAGAgABgKAgQBgIAAYCAAYCAAGAoCBAGAgABgIABgIAAYCgIEAYCAAGAgAGAgABgKAgQBgIAAYCAAYCAAGAoCBAGAgABgIABgIAAYCgIEAYCAAYCAAGAgABgKAgQBgIABgIAAYCAAGAoCBAGAgAGAgABgIAAYCgIEAYCAAYCAAGAgABgKAgQBgIABgIAAYCAAGAoCBAGAgAGAgABgIAAYCgIEA8NUCGMT1oLrIY8cAAAAASUVORK5CYII=';
    const [token, setToken] = useState('');
    const [tokenText, setTokenText] = useState('');
    const [showToken, setShowToken] = useState(false);
    const [uris, setUris] = useState([]);
    const [lyrics, setLyrics] = useState({});
    const [play, setPlay] = useState(false);
    const [liveLyrics, setLiveLyrics] = useState('');
    const [tokenError, setTokenError] = useState(false);
    const [firstPlayHappened, setFirstPlayHappened] = useState(false);
    const [images, setImages] = useState({});
    const [liveImages, setLiveImages] = useState(black_image_base64);
    const [loading, setLoading] = useState(false);
    const [playlist, setPlaylist] = useState([]);

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
        setTokenError(false);
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

    useEffect(() => {
        // Send user to homepage upon browser page refresh
        if (!session) {
            document.location.href = '/';
        }

        getPlaylist();
    }, []);

    const getPlaylist = async () => {
        const fetchedSongsFromDB = (
            await supabase.from('songs').select('song_id')
        ).data;

        const fetchedPlaylist = await Promise.all(
            fetchedSongsFromDB.map(async (song) => {
                const songDetails = await getSongDetailsByID(song.song_id);
                return { ...songDetails, isSelected: false };
            }),
        );

        setPlaylist(fetchedPlaylist);
    };

    const refreshPlaylist = () => {
        const refreshedPlaylist = [...playlist].map((song) => {
            return {
                ...song,
                isSelected: false,
            };
        });

        setPlaylist(refreshedPlaylist);
    };

    const getPlayerUpdates = (playerState) => {
        if (timeOutID) {
            clearTimeout(timeOutID); // Stop any setTimeout if running
        }
        if (manualButtonClick) {
            // After manually initiating a pause event on the music player
            const play_pause_element =
                document.getElementsByClassName('rswp__toggle');
            manualButtonClick = false;
            play_pause_element[0].click();
        }
        // Old way of handling lyrics sync when a new song is played
        // else if (
        //     playerState.track.id !== currentSongID &&
        //     playerState.type === 'player_update'
        // ) {
        //     console.log('Song played for the first time');
        //     setCurrentSongID(playerState.track.id);
        //     const play_pause_element =
        //         document.getElementsByClassName('rswp__toggle');

        //     play_pause_element[0].click();
        //     play_pause_element[0].click();
        // }
        else if (
            playerState.isPlaying &&
            playerState.type === 'progress_update'
        ) {
            // When user jumps to a new position on the player while the song is being played
            const play_pause_element =
                document.getElementsByClassName('rswp__toggle');
            manualButtonClick = true;
            play_pause_element[0].click();
        } else if (playerState.isPlaying) {
            // If the song is being played
            const startTime = playerState.progressMs;
            const songLyrics = lyrics[playerState.track.id].lines;
            const songImages = images[playerState.track.id];
            const startIndex = getStartIndex(startTime, songLyrics); // Index of the songLyrics array from which the lyrics will start displaying on the screen

            // offset is the time in ms by which our song being played is ahead of the start time of the lyrics at "startIndex" index
            let offset =
                startIndex !== -1
                    ? startTime - songLyrics[startIndex].startTimeMs
                    : startTime; // When the lyrics have not started in the song

            // Manually syncing the lyrics for 2 special cases
            if (
                firstPlayHappened === false &&
                playerState.type === 'player_update'
            ) {
                // 1st Case : First play event on the player
                setFirstPlayHappened(true);
                offset -= 1000;
            } else if (
                firstPlayHappened &&
                playerState.type === 'track_update'
            ) {
                // 2nd Case : New song played on the player excluding the first case
                offset -= 1000;
            }

            // Display the lyrics on the screen
            displayLyrics(startIndex, songLyrics, songImages, offset);
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

    const displayLyrics = (startIndex, songLyrics, songImages, offset = 0) => {
        // This function will display the lyrics on the screen
        if (startIndex === -1) {
            // When the lyrics have not started in the song
            setLiveLyrics('');
            setLiveImages(songImages[0]);

            // Calculating the timeOut in ms after which the next line of lyrics is to be displayed
            const timeOut = songLyrics[startIndex + 1].startTimeMs - offset;
            timeOutID = setTimeout(() => {
                displayLyrics(startIndex + 1, songLyrics, songImages);
            }, timeOut);
        } else {
            // When the lyrics have started in the song
            setLiveLyrics(songLyrics[startIndex].words);
            if (songImages[startIndex] !== '') {
                setLiveImages(songImages[startIndex]);
            }

            if (startIndex <= songLyrics.length - 2) {
                // Calculating the timeOut in ms after which the next line of lyrics is to be displayed
                const timeOut =
                    songLyrics[startIndex + 1].startTimeMs -
                    songLyrics[startIndex].startTimeMs -
                    offset;

                timeOutID = setTimeout(() => {
                    displayLyrics(startIndex + 1, songLyrics, songImages);
                }, timeOut);
            }
        }
    };

    const refreshPage = () => {
        setToken('');
        setTokenText('');
        setShowToken(false);
        setUris([]);
        setLyrics([]);
        setPlay(false);
        clearTimeout(timeOutID);
        setLiveLyrics('');
        setTokenError(false);
        setFirstPlayHappened(false);
        setImages({});
        setLiveImages(black_image_base64);
        refreshPlaylist();
    };

    const addSongUriAndLyrics = async () => {
        setLoading(true);

        const selectedSongs = playlist.filter(
            (song) => song.isSelected === true,
        );

        for (let i = 0; i < selectedSongs.length; i++) {
            const songID = selectedSongs[i].song_id;

            // eslint-disable-next-line no-await-in-loop
            const songLyrics = await getSongLyricsByID(songID);

            const noOfLines = songLyrics.lines.length;

            // let song_images = [];
            // for (let index = 0; index < noOfLines; index++) {
            //     // eslint-disable-next-line no-await-in-loop
            //     const { data: ai_image_db_data, error } = await supabase
            //         .from('ai_image')
            //         .select('*')
            //         .eq('song_id', songID)
            //         .eq('lyric_index', index);
            //     song_images = [...song_images, ai_image_db_data[0].image];
            //     console.log(`${i}:${index}/${noOfLines}`);
            // }

            const promise_array = [];
            for (let index = 0; index < noOfLines; index++) {
                promise_array.push(
                    supabase
                        .from('ai_image')
                        .select('*')
                        .eq('song_id', songID)
                        .eq('lyric_index', index),
                );
            }

            // eslint-disable-next-line no-await-in-loop
            const ai_image_db_data = await Promise.allSettled(promise_array);

            let song_images = [];
            song_images = Array(noOfLines).fill('');
            ai_image_db_data.forEach((db_data) => {
                song_images[db_data.value.data[0].lyric_index] =
                    db_data.value.data[0].image;
            });

            setUris((uri) => {
                return [...uri, `spotify:track:${songID}`];
            });
            setLyrics((lyric) => {
                return { ...lyric, [songID]: songLyrics };
            });
            setImages((image) => {
                return { ...image, [songID]: song_images };
            });
        }
        if (selectedSongs.length > 0) {
            setPlay(true);
        }
        setLoading(false);
    };

    const getSongDetailsByID = async (id) => {
        const url = `https://api.spotify.com/v1/tracks/${id}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${session.provider_token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        if (response.status === 401) {
            setTokenError(true);
        }

        const data = await response.json();

        let artistString = data.artists[0].name; // First artist of the song

        // Intermediate artists of the song separated by commas
        for (let i = 1; i < data.artists.length - 1; i++) {
            artistString = `${artistString}, ${data.artists[i].name}`;
        }

        // Last artist of the song displayed after & (When multiple song artists present)
        if (data.artists.length > 1) {
            artistString = `${artistString} & ${
                data.artists[data.artists.length - 1].name
            }`;
        }

        return {
            song_id: data.id,
            song_name: data.name,
            artist_name: artistString,
            album_image: data.album.images[0].url,
        };
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

        if (response.status === 401) {
            setTokenError(true);
        }

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

    if (!session) {
        // When user is not logged in
        return <> </>;
    }
    return (
        <>
            {token !== '' && play && uris.length > 0 ? (
                <div style={{ marginTop: 10, marginBottom: 30 }}>
                    <ErrorBoundary FallbackComponent={PlayerErrorHandler}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 10,
                            }}
                        >
                            {/* Reference: https://stackoverflow.com/questions/8499633/how-to-display-base64-images-in-html */}
                            <img
                                src={`data:image/jpeg;base64,${liveImages}`}
                                id="base64image"
                                height="400px"
                                width="400px"
                                alt="Failed to load"
                            />
                        </div>
                        <MusicPlayer
                            token={token}
                            callback={getPlayerUpdates}
                            uris={uris}
                        />
                    </ErrorBoundary>
                </div>
            ) : null}
            {!play || tokenError ? (
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
                            border: '0.1px solid white',
                            '& .MuiOutlinedInput-root.Mui-focused': {
                                '& > fieldset': {
                                    border: 'none',
                                },
                            },
                        }}
                        variant="outlined"
                    >
                        <InputLabel
                            htmlFor="outlined-adornment-password"
                            sx={{ backgroundColor: '#191414' }}
                        >
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
                                        sx={{ color: 'white' }}
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
            ) : null}
            {tokenError ? <PlayerErrorHandler /> : null}
            <div style={{ textAlign: 'center', marginTop: 10, height: 30 }}>
                <h3> {play && !tokenError ? liveLyrics : null}</h3>
            </div>
            {(token !== '' && play) || tokenError ? (
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
            {token !== '' && !play && !tokenError ? (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="overline">
                        <b>Listen to songs from our radio playlist</b>
                    </Typography>
                    <RadioPlaylist
                        playlist={playlist}
                        setPlaylist={setPlaylist}
                    />
                    {!(
                        loading ||
                        playlist.filter((song) => {
                            return song.isSelected;
                        }).length === 0
                    ) ? (
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ mt: 5, mb: 20 }}
                            onClick={() => {
                                addSongUriAndLyrics();
                            }}
                        >
                            Play Songs
                        </Button>
                    ) : null}
                </div>
            ) : null}
        </>
    );
}
