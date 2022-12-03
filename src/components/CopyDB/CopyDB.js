import React from 'react';
import { TextField, Typography, Button } from '@mui/material';
import supabase from '../../supabaseClient';
import supabase2 from '../../supabaseClient2';

function CopyDB() {
    const getSongLyricsByID = async (songID) => {
        // Source: https://github.com/akashrchandran/spotify-lyrics-api
        const url = `https://spotify-lyric-api.herokuapp.com/?trackid=${songID}`;
        const response = await fetch(url, { method: 'GET' });

        const lyricsData = await response.json();

        return lyricsData;
    };

    const copyDBData = async () => {
        const { data: songs, error } = await supabase
            .from('songs')
            .select('song_id');
        // console.log(songs);
        const songs_id_in_db = songs.map((song) => {
            return song.song_id;
        });
        // console.log(songs_id_in_db);

        // eslint-disable-next-line no-unreachable-loop
        for (let i = 0; i < songs_id_in_db.length; i++) {
            // eslint-disable-next-line no-await-in-loop
            const lyrics = await getSongLyricsByID(songs_id_in_db[i]);
            // console.log(lyrics.lines);
            // eslint-disable-next-line no-unreachable-loop
            for (let index = 0; index < lyrics.lines.length; index++) {
                // eslint-disable-next-line no-await-in-loop
                const { data: ai_image, error } = await supabase
                    .from('ai_image')
                    .select('*')
                    .eq('song_id', songs_id_in_db[i])
                    .eq('lyric_index', index);
                const ai_image_data = ai_image[0];
                // console.log(ai_image_data);
                // eslint-disable-next-line no-await-in-loop
                const { data, error1 } = await supabase2
                    .from('ai_image')
                    .insert([
                        {
                            image: ai_image_data.image,
                            lyric_index: ai_image_data.lyric_index,
                            song_id: ai_image_data.song_id,
                        },
                    ]);
                console.log(
                    `${i + 1}/${songs_id_in_db.length} : ${index + 1}/${
                        lyrics.lines.length
                    }`,
                );
            }
        }
    };
    const testFunction = async () => {
        // For performing testing
        // const { data: songs, error } = await supabase2
        //     .from('songs')
        //     .select('song_id');
        // console.log(songs);
        const { data: ai_image, error } = await supabase2
            .from('songs')
            .select('*');
        console.log('here');
        console.log(ai_image);
        const song_ids = ai_image.map((ai) => {
            return ai.song_id;
        });
        console.log(song_ids);
    };
    return (
        <div>
            <button
                type="submit"
                onClick={copyDBData}
            >
                Click here to copy data
            </button>
            <button
                type="submit"
                onClick={testFunction}
            >
                Test
            </button>
        </div>
    );
}

export default CopyDB;
