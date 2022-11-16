import React from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';

export default function MusicPlayer({ token, callback, uris }) {
    return (
        <SpotifyPlayer
            token={token}
            callback={callback}
            uris={uris}
        />
    );
}