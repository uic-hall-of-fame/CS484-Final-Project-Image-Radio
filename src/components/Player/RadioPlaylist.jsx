import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

export default function FolderList() {
    const playlist = [
        {
            id: 1,
            name: 'Yellow',
            artist: 'Coldplay',
            thumbnail: '/images/Architecture_Diagram.png',
        },
        {
            id: 2,
            name: 'Beautiful',
            artist: 'Eminem',
            thumbnail: 'radio_favicon.png',
        },
        {
            id: 3,
            name: 'Ghost',
            artist: 'Justin Bieber',
            thumbnail: 'logo512.png',
        },
    ];
    return (
        <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        >
            {playlist.map((song) => (
                <ListItem key={song.id}>
                    <ListItemAvatar>
                        <Avatar
                            src={song.thumbnail}
                            alt="thumbnail"
                        />
                    </ListItemAvatar>
                    <ListItemText
                        primary={song.name}
                        secondary={song.artist}
                    />
                </ListItem>
            ))}
        </List>
    );
}
