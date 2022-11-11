import React from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';

export default function MusicPlayer() {
    return (
        <SpotifyPlayer
            token="BQAz7X0mSJ2RBlkn9O9tvhsLTOMug3f-0FSx26J4QOLxq1ynO3_3oLRsdxqx1xWFmGquaGTbBTe1pIf5bkRlbmUwFD-v0FUr-WvJ7sL3kPaLNZMDB0B1UJYs6LBPVLm1rcrpm1MDIZz_VjBvKq5N1KD1jz06OHPgBQB3TzsmNE29xNt8or61ocOfysv8TfYnjYzmQxEyU4PLkcgDgJ4rX1wkBMKC03sRllNjsdVmJojqsjMjlKBvZg"
            uris={['spotify:track:11dFghVXANMlKmJXsNCbNl']}
        />
    );
}
