import React, { useState } from 'react';
import { Button, Typography, CircularProgress } from '@mui/material';
import supabase from '../../supabaseClient';

function AddProgress({ session, songName, songArtist, setAddingSong }) {
    const [songDetails, setSongDetails] = useState({});
    const [isSongExist, setIsSongExist] = useState(false); // Song already exist in database or not
    const [dataLoading, setDataLoading] = useState(true);

    const onBackButtonClick = () => {
        setAddingSong(false);
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
            supabase.auth.signOut();
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

    useState(() => {
        async function getSongDetails(songName, songArtist) {
            const fetchedSongDetails = await getSongDetailsByNameAndArtist(
                songName,
                songArtist,
            );
            setSongDetails(fetchedSongDetails);

            const fetchedIDs = (await supabase.from('songs').select('song_id'))
                .data;

            // Checking if the song already exists in the database
            for (let index = 0; index < fetchedIDs.length; index++) {
                if (fetchedIDs[index].song_id === fetchedSongDetails.song_id) {
                    setIsSongExist(true);
                    break;
                }
            }
            setDataLoading(false);
        }
        getSongDetails(songName, songArtist);
    }, []);

    if (dataLoading) {
        // Don't display anything while the data is being loaded
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
            <div
                className="progress_heading"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography
                    variant="h2"
                    // gutterBottom
                    marginRight={2}
                >
                    Generating AI images
                </Typography>
                <CircularProgress />
            </div>
            <div>
                Adding {songDetails.song_name} by {songDetails.artistString}
            </div>
            <Button
                variant="contained"
                onClick={onBackButtonClick}
            >
                Cancel/Go Back
            </Button>
        </>
    );
}

export default AddProgress;
