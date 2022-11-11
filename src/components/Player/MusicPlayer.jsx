import React from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';

export default function MusicPlayer({ token }) {
    return (
        <SpotifyPlayer
            token={token}
            uris={['spotify:track:11dFghVXANMlKmJXsNCbNl']}
        />
    );
}
