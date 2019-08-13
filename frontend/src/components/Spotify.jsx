import React, { Component, Fragment } from 'react';
import classes from './spotify.module.css';
import Loader from './Loader';
import axios from 'axios';

class Spotify extends Component {
  state = {
    searchText: '',
    inputText: '',
    songs: [],
    error: null,
    isLoading: false,
    filteredPlaylist: null
  };

  changeHandle = event => {
    this.setState({ inputText: event.target.value });
  };

  clickHandle = async event => {
    event.preventDefault();
    const { inputText } = this.state;
    let filteredText = inputText.trim();
    filteredText = filteredText.replace(/[^a-zA-Z0-9]/g, '');
    await this.setState({
      searchText: filteredText,
      filteredPlaylist: null,
      error: ''
    });
    this.getSpotifySongs();
  };

  getSpotifySongs = async () => {
    const { searchText } = this.state;
    const songs = [];
    if (!searchText || searchText.length > 30) {
      this.setState({ error: 'Invalid Input' });
      return;
    }

    this.setState({ isLoading: true });

    for (let i = 0; i < searchText.length; i++) {
      try {
        const response = await axios.post(
          ` https://spotify--search.herokuapp.com/`,
          {
            q: searchText[i]
          }
        );
        const data = response.data.tracks.items;
        const tracks = data.map(track => track.name);
        songs.push({ [searchText[i]]: tracks });
      } catch (e) {
        console.log([]);
      }
    }
    this.setState({ songs });
    this.createNewPlayList();
  };

  createNewPlayList = () => {
    const { songs, searchText } = this.state;
    const filteredPlaylist = songs.map((song, i) => {
      return song[searchText[i]].filter(
        el =>
          searchText[i].toLowerCase() === el.charAt(0).toLowerCase() &&
          el.length > 3
      )[0];
    });
    this.setState({ filteredPlaylist, isLoading: false });
  };

  render() {
    const { filteredPlaylist, searchText } = this.state;
    let trackList = null,
      displayTracks = null;

    if (filteredPlaylist && searchText.length > 0) {
      trackList = filteredPlaylist.map((song, i) => (
        <div key={i} className={classes.displaySongs}>
          {searchText[i].toUpperCase()} : {song}
        </div>
      ));

      displayTracks = (
        <div style={{ marginBottom: '50px' }}>
          <p className={classes.para}>Results</p>
          <div className={classes.songBox}>{trackList}</div>
        </div>
      );
    }

    const loading = this.state.isLoading ? <Loader /> : '';

    return (
      <Fragment>
        <form onSubmit={this.clickHandle} className={classes.forms}>
          <input
            className={classes.inputBox}
            value={this.state.inputText}
            type='input'
            placeholder='Enter term to search songs'
            onChange={this.changeHandle}
          />
          <button className={classes.btn}>Search</button>
        </form>
        {loading}
        <p className={[classes.para, classes.error].join(' ')}>
          {this.state.error}
        </p>
        {displayTracks}
      </Fragment>
    );
  }
}

export default Spotify;
