import React from 'react';
import './App.css';
import {generateCards, shuffleCards, drawNCardsFromDeck} from './GameUtils.js';

class Card extends React.Component {
  render() {
    const classes = "Card" + (this.props.isSelected ? " Selected" : "");
    return (
      <div className={classes} onClick={this.props.clickHandler}>
        <h1>{this.props.value}</h1>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    const [initialCards, deck] = drawNCardsFromDeck(12, shuffleCards(generateCards()));
    this.state = {
      cards: initialCards,
      selected: Array(12).fill(false),
      deck: deck,
    };
  }

  renderBoard() {
    const res = [];
    for (let i = 0; i < this.state.cards.length; i++) {
      res.push(
        <Card
          key={i}
          value={this.state.cards[i]}
          clickHandler={() => this.onClickCard(i)}
          isSelected={this.state.selected[i]}
        />
      );
    }

    return res;
  }

  onClickCard(position) {
    const selected = this.state.selected.slice();
    selected[position] = !selected[position];
    this.setState({selected: selected});
  }

  render() {
    const board = this.renderBoard();
    return (
      <div className="App">
        <div className="Board">
          {board}
        </div>
      </div>
    );
  }
}

export default App;
