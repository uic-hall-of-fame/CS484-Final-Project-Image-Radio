import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import About from './components/About/About';
import Player from './components/Player/Player';
import supabase from './supabaseClient';
import AddSongs from './components/AddSongs/AddSongs';

function App() {
    const [session, setSession] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

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

    // For displaying images in base64 format (imagesrc is the variable containing image data in base64 format)
    // Reference: https://stackoverflow.com/questions/8499633/how-to-display-base64-images-in-html
    // <img
    //             src={`data:image/jpeg;base64,${imagesrc}`}
    //             id="base64image"
    //             alt="could not load"
    //         />

    // For fetching the session when the app is run for the first time and setting up oauth change listeners
    useEffect(() => {
        const checkAdmin = async (user_id) => {
            // Will check if the current user is an admin or not
            const { data: admin, error } = await supabase
                .from('admin')
                .select('*');

            for (let index = 0; index < admin.length; index++) {
                if (admin[index].user_id === user_id) {
                    setIsAdmin(true);
                    break;
                }
            }
        };

        // Fetch session data the first time the application is run
        supabase.auth.getSession().then((res) => {
            setSession(res?.data.session ?? null);
            checkAdmin(res?.data.session?.user.id);
        });

        // Creating listener for oauth state change
        const { data: listener } = supabase.auth.onAuthStateChange(
            (event, changedSession) => {
                setIsAdmin(false);
                setSession(changedSession);
                checkAdmin(changedSession?.user.id);
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
                <Route
                    exact
                    path="/add_songs"
                    element={
                        <AddSongs
                            session={session}
                            isAdmin={isAdmin}
                        />
                    }
                />
            </Routes>
        </>
    );
}

export default App;
