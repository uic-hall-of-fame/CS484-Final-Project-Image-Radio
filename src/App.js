import './App.css';
import Navbar from './components/Navbar/Navbar';
import About from './components/About/About';
import supabase from './supabaseClient';

function App() {
    return (
        <>
            <Navbar supabase={supabase} />
            <About />
        </>
    );
}

export default App;
