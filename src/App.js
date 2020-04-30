import React from 'react';
import './App.css';
import {
  generateCards,
  shuffleCards,
  drawNCardsFromDeck,
  checkIsSet,
  findSetsInCards
} from './GameUtils.js';
import SVGs from './SVGs.js';
import Header from './OtherComponents.js';
import ReactGA from 'react-ga';
import Timer from 'react-compound-timer';

class Card extends React.Component {
  render() {
    const classes = "Card" + (this.props.isSelected ? " Selected" : "");
    return (
      <div className={classes} onClick={this.props.clickHandler}>
        <SVGs value={this.props.value}/>
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
          isSelected={this.props.selected.has(i)}
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
      selected: new Set(), // Empty set to hold index of selected cards
      deck: deck,
      gameMode: 0, // 0: free play, 1: timed
      score: 0,
    };

    ReactGA.initialize('UA-164939986-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  onClickCard(position) {
    const selected = new Set(this.state.selected); // Indices
    if (selected.has(position)) { // Deselect
      selected.delete(position);
    } else { // Select?
      if (selected.size >= 3) return; // Don't select more than 3.
      selected.add(position);

      const potentialSet = [] ;
      selected.forEach((i) => potentialSet.push(this.state.cards[i]));

      if (checkIsSet(potentialSet)) {
        const currCards = this.state.cards.slice();
        const [drawnCards, newDeck] = drawNCardsFromDeck(selected.size, this.state.deck);
        const selectedList = Array.from(selected);
        for (let i = 0; i < selectedList.length; i++) { // should always be length 3 though.
          currCards[selectedList[i]] = drawnCards[i];
        }

        this.setState({cards: currCards, deck: newDeck});
        selected.clear();
      }
    }

    this.setState({selected: selected});
  }

  onClickSolution() {
    const sols = findSetsInCards(this.state.cards);
    sols.forEach((s) => console.log(s));
  }

  onClickToggleGameMode() {
    const gameMode = this.state.gameMode;
    const newGameMode = gameMode === 1 ? 0 : 1;
    this.setState({gameMode: newGameMode});
  }

  onClickNoSet() {
    const currCards = this.state.cards.slice();
    const sols = findSetsInCards(currCards);

    if (sols.length === 0) {
      const [additionalCards, newDeck] = drawNCardsFromDeck(3, this.state.deck);
      const newCards = currCards.concat(additionalCards);
      console.log(newCards);
      this.setState({
        deck: newDeck,
        selected: Array(newCards.length).fill(false),
        cards: newCards,
      });
    }
  }

  buildTimer() {
    return (
          <Timer initialTime={180000} direction="backward" startImmediately={true}>
            {() => (
              <React.Fragment>
                <span>
                  <Timer.Minutes />m : <Timer.Seconds />s
                </span>
              </React.Fragment>
            )}
          </Timer>);
  }

  render() {
    // TODO Add in later
    // const svgDefs = <svg><defs><style>{".class{color: red}"}</style></defs></svg>; 

    const timedDetails = this.state.gameMode === 0
      ? <span />
      : (<span className="Score">Score:  {this.state.score} || {this.buildTimer()} </span>);

    return (
      <div className="App">
        <Header gameMode={this.state.gameMode} onClick={() => this.onClickToggleGameMode()} />
        <hr/>
        <div className="Board">
          <div className="Info">
            <p className="Title">game mode: {this.state.gameMode === 0 ? "free play" : "timed"}</p>
            {timedDetails}
          </div>
          <Board
            cards={this.state.cards}
            onClickCard={(i) => this.onClickCard(i)}
            selected={this.state.selected}
          />
        </div>
        <button className="Button" onClick={() => this.onClickNoSet()}>No Set?</button>
        <button className="Button" onClick={() => this.onClickSolution()}>Solution</button>
      </div>
    );
  }
}

export default App;
