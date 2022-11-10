import React from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';

export default function Player() {
    return (
        <SpotifyPlayer
            token="BQABPuzQVeY4pWhkn0sXTfCCUysdyIXp5Lmbw046_mTpjbofTn5Zvnw5avF7t4XrWMmwYOlBX9zlhU7FjgxiSGnB21uCT6iFGoBy252uPdx1Ca0_aslyWZXKCNdfhguwtuj22eYOyPAQMWdu083beI3KNsMTuZSH_A1U2mKft-Eack16GKEeF8GIkNxA_-OvYw0PIgKhJsoYgSX91HtvvYvedtEsZ_e3Z6sgPsqw6jW-W-UUscaMVQ"
            uris={[
                'spotify:track:11dFghVXANMlKmJXsNCbNl',
                'spotify:artist:6HQYnRM4OzToCYPpVBInuU',
            ]}
        />
    );
}
