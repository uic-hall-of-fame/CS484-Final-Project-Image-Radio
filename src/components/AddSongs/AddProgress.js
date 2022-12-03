import React, { useEffect, useState } from 'react';
import { Button, Typography, LinearProgress, Box } from '@mui/material';
import supabase from '../../supabaseClient';

function AddProgress({ session, songName, songArtist, setAddingSong }) {
    const [songDetails, setSongDetails] = useState({});
    const [isSongExist, setIsSongExist] = useState(false); // Song already exists in database or not
    const [dataLoading, setDataLoading] = useState(true); // When waiting for responses from supabase and spotify api in useEffect
    const [progress, setProgress] = useState(0); // For progress bar on the frontend
    const [displayProgressBar, setDisplayProgressBar] = useState(false); // When the api calls to openai api are taking place and progress is to be shown
    const [isImageGenerating, setIsImageGenerating] = useState(false); // When the api calls to openai api are taking place and back button is to be disabled
    const [status, setStatus] = useState('');

    const onBackButtonClick = () => {
        setAddingSong(false);
    };

    const generateAIImages = async () => {
        setDisplayProgressBar(true); // Will display progress bar
        setIsImageGenerating(true);

        setStatus('Fetching song lyrics');
        const { song_id } = songDetails;
        const lyricsData = await getSongLyricsByID(song_id);
        console.log(lyricsData);
        if (lyricsData.error === true) {
            setStatus(`Error in fetching song lyrics (${lyricsData.message})`);
        } else if (lyricsData.syncType !== 'LINE_SYNCED') {
            setStatus(`Synced lyrics not available for this song`);
        } else {
            setStatus('Fetching synced song lyrics');
            const { lines } = lyricsData;
            console.log(lines);

            // Checking if any data for this song already exists in the database
            const promise_array = [];
            for (let index = 0; index < lines.length; index++) {
                promise_array.push(
                    supabase
                        .from('ai_image')
                        .select('*')
                        .eq('song_id', song_id)
                        .eq('lyric_index', index),
                );
            }
            let error = false;
            const song_db_data = await Promise.all(promise_array);
            console.log(song_db_data);
            const existingImagesIndex = [];
            for (let index = 0; index < song_db_data.length; index++) {
                if (song_db_data[index].error) {
                    error = song_db_data[index].value.error;
                    break;
                }
                if (song_db_data[index].data.length) {
                    existingImagesIndex.push(
                        song_db_data[index].data[0].lyric_index,
                    );
                }
            }
            console.log(existingImagesIndex);

            if (error) {
                setStatus('Error in fetching data from the database');
            } else {
                setStatus('Generating AI images');
                let db_error = false; // if any error is thrown while inserting any row in the database
                for (let index = 0; index < lines.length; index++) {
                    const imagePrompt = lines[index].words;
                    if (!existingImagesIndex.includes(index)) {
                        // The AI image for this index was not created before
                        let image = '';
                        if (imagePrompt !== '' && imagePrompt !== '♪') {
                            // eslint-disable-next-line no-await-in-loop
                            image = await fetchImage(imagePrompt);
                        }
                        // eslint-disable-next-line no-await-in-loop
                        const { data, error } = await supabase
                            .from('ai_image')
                            .insert([
                                {
                                    song_id,
                                    lyric_index: index,
                                    image,
                                },
                            ]);
                        if (error) {
                            db_error = true;
                            console.log(`error at index:${index}`);
                        }
                        setProgress(Math.floor((index / lines.length) * 100)); // Not doing index+1 because we don't want the progress to reach 100% yet
                    }
                }
                setStatus('Checking Database status');
                if (db_error) {
                    setProgress(
                        'There was some error in uploading AI images for some lyrics lines',
                    );
                } else {
                    const { data, error } = await supabase
                        .from('songs')
                        .insert([
                            {
                                song_id,
                                song_name: `${songDetails.song_name} by ${songDetails.artistString}`,
                            },
                        ]);
                    if (error) {
                        setStatus(
                            'AI images uploaded but the song not added in the songs list in the database',
                        );
                    } else {
                        setStatus(
                            'AI images successfully uploaded in the database',
                        );
                        setProgress(100);
                    }
                }
            }
        }
        setIsImageGenerating(false);
    };

    const fetchImage = async (imagePrompt) => {
        // References: https://beta.openai.com/docs/api-reference/images/create
        const url = 'https://api.openai.com/v1/images/generations';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                prompt: imagePrompt, // A text description of the desired image(s). The maximum length is 1000 characters.
                n: 1, // The number of images to generate. Must be between 1 and 10.
                size: '256x256', // Must be one of 256x256, 512x512, or 1024x1024 (default)
                response_format: 'b64_json',
            }),
        });
        const data = await response.json();
        if (data?.error?.message === 'Billing hard limit has been reached') {
            setStatus('openAI API key exhausted');
            setIsImageGenerating(false);
            console.log('API KEY EXHAUSTED');
        } else if (
            data?.error?.message?.startsWith(
                'Rate limit reached for images per minute.',
            )
        ) {
            setStatus(
                'openAI API rate limit reached for images per minute. Try again after sometime',
            );
            setIsImageGenerating(false);
            console.log('Rate limit reached');
        } else if (
            data?.error?.message ===
                'Your request was rejected as a result of our safety system. Your prompt may contain text that is not allowed by our safety system.' ||
            data?.error?.message ===
                'Your request was rejected as a result of our safety system. '
        ) {
            setStatus(
                `safety error: Not generating image for the lyric line "${imagePrompt}"`,
            );
            return '';
        }
        console.log(data);
        return data.data[0].b64_json;
    };

    const getSongLyricsByID = async (songID) => {
        // Source: https://github.com/akashrchandran/spotify-lyrics-api
        const url = `https://spotify-lyric-api.herokuapp.com/?trackid=${songID}`;
        const response = await fetch(url, { method: 'GET' });

        const lyricsData = await response.json();

        return lyricsData;
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
                Authorization: `Bearer ${session.provider_token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        // Manually logging out user when session token expires
        if (response.status === 401) {
            // Session token expired
            await supabase.auth.signOut();
            document.location.href = '/';
            return {}; // Returning a blank object to not let the below lines execute
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

    useEffect(() => {
        async function getSongDetails(songName, songArtist) {
            const fetchedSongDetails = await getSongDetailsByNameAndArtist(
                songName,
                songArtist,
            );
            setSongDetails(fetchedSongDetails);
            const fetchedIDsFromDB = (
                await supabase.from('songs').select('song_id')
            ).data;

            // Checking if the song already exists in the database
            for (let index = 0; index < fetchedIDsFromDB.length; index++) {
                if (
                    fetchedIDsFromDB[index].song_id ===
                    fetchedSongDetails.song_id
                ) {
                    setIsSongExist(true);
                    break;
                }
            }
            setDataLoading(false);
        }
        getSongDetails(songName, songArtist);
    }, []);

    if (dataLoading) {
        // Don't display anything while the data is being loaded in useEffect
        return <> </>;
    }
    if (isSongExist) {
        // If song already exists in the database
        return (
            <>
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
                        Song already exists in the database
                    </Typography>
                </div>
                <Button
                    variant="contained"
                    onClick={onBackButtonClick}
                >
                    Go Back
                </Button>
            </>
        );
    }
    return (
        <>
            <Typography
                variant="h2"
                // gutterBottom
                // marginRight={2}
            >
                {songDetails.song_name} by {songDetails.artistString}
            </Typography>
            <img
                src={songDetails.album_image[1].url}
                alt="Album pic not available"
                style={{ marginTop: 15 }}
            />
            {!displayProgressBar ? (
                <Button
                    variant="contained"
                    onClick={generateAIImages}
                    sx={{ marginTop: 3, marginBottom: 2 }}
                >
                    Start AI images generation
                </Button>
            ) : (
                <Box sx={{ width: '80%', marginTop: 5, marginBottom: 2 }}>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                    />
                    <div style={{ textAlign: 'center' }}>Status: {status}</div>
                </Box>
            )}
            {!isImageGenerating && (
                <Button
                    variant="contained"
                    onClick={onBackButtonClick}
                >
                    Go Back
                </Button>
            )}
        </>
    );
}

export default AddProgress;
