import React from 'react';
import './App.css';

export default class Header extends React.Component {
  render () {
    const gameMode = this.props.gameMode;
    const gameModeText = gameMode === 0 ? "Play Timed" : "Play Free Play";

    return (
    <div className="Header">
      <h1>SET</h1>
      <button className="Button" onClick={this.props.onClick}>{gameModeText}</button>
    </div>);
  }
}
