# CS 484 Project - Image Radio

## Group Members:

1. Jason James Dsouza (UIN: 677667371)
2. Anjani Sruti Doradla (UIN: 670111749)
3. Harsh Jethwani (UIN: 670509818)

## Link to hosted app

https://image-radio.netlify.app/

## What does your application do?

Our application aims to emulate a radio station, which uses the lyrics of a song of the user's choice, to generate a series of images, and synchronizes the music audio with its respective images.

## What makes it different than a CRUD app? I.e., what functionality does it provide that is not just a user interface layer on top of a database of user information, and the ability to view / add to / change that information?

Our application uses the Spotify API to fetch the timestamped lyrics of a given song with its annotations, after which it displays a series of AI generated images based on the lyrics, and plays its synchronized audio.

## What security and privacy concerns do you expect you (as developers) or your users to have with this application?

Currently, we plan to implement Spotify OAuth to access the user's playlists. Here, the user may be concerned about their private data getting compromised. However, we will ensure to use the correct authorization scope when implementing OAuth, so that we only get the specific user data that our application requires.
