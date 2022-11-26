import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import About from './components/About/About';
import Player from './components/Player/Player';
import supabase from './supabaseClient';

function App() {
    const [session, setSession] = useState(null);

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
                size: '512x512', // Must be one of 256x256, 512x512, or 1024x1024 (default)
                response_format: 'b64_json',
            }),
        });
        const data = await response.json();
        return data.data[0].b64_json;
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
                    exact
                    path="/"
                    element={<About />}
                />
                <Route
                    exact
                    path="/player"
                    element={<Player session={session} />}
                />
            </Routes>
        </>
    );
}

export default App;
