import { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import About from './components/About/About';
import supabase from './supabaseClient';

function App() {
    const [session, setSession] = useState(null);

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
            <About />
        </>
    );
}

export default App;
