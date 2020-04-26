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

class Board extends React.Component {
  render() {
    const res = [];
    for (let i = 0; i < this.props.cards.length; i++) {
      res.push(
        <Card
          key={i}
          value={this.props.cards[i]}
          clickHandler={() => this.props.onClickCard(i)}
          isSelected={this.props.selected[i]}
        />
      );
    }

    return res;
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

  onClickCard(position) {
    const selected = this.state.selected.slice();
    selected[position] = !selected[position];
    this.setState({selected: selected});
  }

  onClickEnter() {
    const newCards = this.state.cards.slice();
    const selectedIndexes = [];
    for (let i = 0; i < this.state.selected.length; i++) {
      if (this.state.selected[i]) selectedIndexes.push(i);
    }
    console.log(selectedIndexes);
    const [drawnCards, newDeck] = drawNCardsFromDeck(selectedIndexes.length, this.state.deck);
    for (let j = 0; j < selectedIndexes.length; j++) {
      newCards[selectedIndexes[j]] = drawnCards[j];
    }
    this.setState({cards: newCards, selected: Array(12).fill(false), deck: newDeck});
  }

  render() {
    return (
      <div className="App">
        <div className="Board">
          <Board
            cards={this.state.cards}
            onClickCard={(i) => this.onClickCard(i)}
            selected={this.state.selected}
          />
        </div>
        <button className="Button" onClick={() => this.onClickEnter()}>Enter</button>
      </div>
    );
  }
}

export default App;
