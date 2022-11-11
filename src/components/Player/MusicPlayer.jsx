import React from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';

export default function MusicPlayer({ token, callback }) {
    return (
        <SpotifyPlayer
            token={token}
            callback={callback}
            uris={['spotify:track:11dFghVXANMlKmJXsNCbNl']}
        />
    );
}
