import React from 'react';
import {
    Avatar,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
} from '@mui/material';

export default function RadioPlaylist({ playlist, setPlaylist }) {
    const getBackground = (song) => {
        if (song.hasLyrics) {
            return song.isSelected ? 'lightgreen' : null;
        }
        return '#dc143c';
    };
    return (
        <List sx={{ minWidth: '50%' }}>
            {playlist
                ? playlist.map((song, index) => (
                      <ListItem
                          key={song.song_id}
                          button
                          sx={{
                              borderBottom: 1,
                              borderTop: 1,
                              borderColor: 'lightgray',
                              background: getBackground(song),
                              opacity: song.isSelected ? '50%' : '100%',
                          }}
                          onClick={() => {
                              if (song.hasLyrics) {
                                  const modifiedPlaylist = [...playlist];
                                  modifiedPlaylist[index].isSelected =
                                      !modifiedPlaylist[index].isSelected;
                                  setPlaylist(modifiedPlaylist);
                              }
                          }}
                          disabled={!song.hasLyrics}
                      >
                          <ListItemAvatar>
                              <Avatar
                                  variant="square"
                                  src={song.album_image}
                                  alt="thumbnail"
                                  sx={{ height: 50, width: 50 }}
                              />
                          </ListItemAvatar>
                          <ListItemText
                              primary={
                                  <Typography>{song.song_name}</Typography>
                              }
                              secondary={
                                  <Typography
                                      style={{
                                          color: 'gray',
                                          fontSize: '14px',
                                      }}
                                  >
                                      {song.artist_name}
                                  </Typography>
                              }
                              sx={{ ml: 2 }}
                          />
                      </ListItem>
                  ))
                : null}
        </List>
    );
}
