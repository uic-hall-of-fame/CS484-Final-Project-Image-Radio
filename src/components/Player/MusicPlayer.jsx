import React from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';

export default function MusicPlayer({ token, callback, uris }) {
    return (
        <SpotifyPlayer
            token={token}
            callback={callback}
            uris={uris}
            styles={{
                bgColor: '#1db954',
                trackNameColor: '#191414',
                trackArtistColor: '#404040',
                sliderHandleColor: '#666666',
            }}
        />
    );
}
