import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

export default function RadioPlaylist({ playlist, setPlaylist }) {
    return (
        <List sx={{ minWidth: '50%', bgcolor: 'background.paper' }}>
            {playlist
                ? playlist.map((song, index) => (
                      <ListItem
                          key={song.song_id}
                          button
                          sx={{
                              borderBottom: 1,
                              borderTop: 1,
                              borderColor: 'lightgray',
                              background: song.isSelected ? 'lightgreen' : null,
                              opacity: song.isSelected ? '50%' : '100%',
                          }}
                          onClick={() => {
                              const modifiedPlaylist = [...playlist];
                              modifiedPlaylist[index].isSelected =
                                  !modifiedPlaylist[index].isSelected;
                              setPlaylist(modifiedPlaylist);
                          }}
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
                              primary={song.song_name}
                              secondary={song.song_artist}
                              sx={{ ml: 2 }}
                          />
                      </ListItem>
                  ))
                : null}
        </List>
    );
}
