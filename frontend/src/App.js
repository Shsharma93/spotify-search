import React from 'react';
import Spotify from './components/Spotify';
import classes from './App.module.css';

function App() {
  return (
    <div>
      <h1 className={classes.heading}>Search songs from Spotify</h1>
      <Spotify />
    </div>
  );
}

export default App;
