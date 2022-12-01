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
    const [sessionCopy, setSessionCopy] = useState(null);
    /* 
    We have created this state variable because of the following reasons:
    # onAuthStateChange listener fires up even during tab changes.
    # We can't directly read state variables in useEffect. 
    # We can access them by using callback function in setState but in that case we will have to compulsorily setState. Doing this with "session" state will rerender the whole app.
    # Inside this callback function we will check if the session returned by the onAuthChangeListener is different. If it is found to be different, then only we will set "session" state inside the callback function.
    */

    // For fetching the session when the app is run for the first time and setting up oauth change listeners
    useEffect(() => {
        const checkAdmin = async (user_id) => {
            // Will check if the current user is an admin or not
            const { data: admin, error } = await supabase
                .from('admin')
                .select('*');
            let adminFound = false;
            for (let index = 0; index < admin.length; index++) {
                if (admin[index].user_id === user_id) {
                    setIsAdmin(true);
                    adminFound = true;
                    break;
                }
            }
            if (!adminFound) {
                setIsAdmin(false);
            }
        };

        // Fetch session data the first time the application is run
        supabase.auth.getSession().then((res) => {
            setSession(res?.data.session ?? null);
            setSessionCopy(res?.data.session ?? null);
            checkAdmin(res?.data.session?.user.id);
        });

        // Creating listener for oauth state change
        const { data: listener } = supabase.auth.onAuthStateChange(
            (event, changedSession) => {
                setSessionCopy((sessionCopy) => {
                    if (
                        JSON.stringify(changedSession) !==
                        JSON.stringify(sessionCopy)
                    ) {
                        // There has been a change in spotify session
                        setSession(changedSession);

                        if (changedSession) {
                            checkAdmin(changedSession?.user.id);
                        } else {
                            setIsAdmin(false);
                        }
                    }
                    return changedSession;
                });
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
