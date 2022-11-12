import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import About from './components/About/About';
import Player from './components/Player/Player';
import supabase from './supabaseClient';

function App() {
    const [session, setSession] = useState(null);

    const getSongDetailsByNameAndArtist = async (songName, songArtist) => {
        const { provider_token } = session;

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
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                Authorization: `Bearer ${provider_token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        const data = await response.json();

        // Extracting details from data

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
    };

    // For fetching the session when the app is run for the first time and setting up oauth change listeners
    useEffect(() => {
        // Fetch session data
        supabase.auth.getSession().then((res) => {
            setSession(res?.data.session ?? null);
        });

        // Creating listener for oauth state change
        const { data: listener } = supabase.auth.onAuthStateChange(
            (event, changedSession) => {
                setSession(changedSession);
            },
        );

        // Unsubscribing the listener before dismounting of the component
        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);

    return (
        <>
            <Navbar
                supabase={supabase}
                session={session}
            />
            <Routes>
                <Route
                    path="/"
                    element={<About />}
                />
                <Route
                    path="/player"
                    element={session ? <Player /> : <Navigate to="/" />}
                />
            </Routes>
        </>
    );
}

export default App;
