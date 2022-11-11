import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import MusicPlayer from './MusicPlayer';
import PlayerErrorHandler from './PlayerErrorHandler';

export default function Player() {
    return (
        <ErrorBoundary FallbackComponent={PlayerErrorHandler}>
            <MusicPlayer />
        </ErrorBoundary>
    );
}
