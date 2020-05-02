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
        {this.props.inSolution
          ? <span className="Dot" />
          : null}
      </div>
    );
  }
}

class Board extends React.Component {
  render() {
    const res = [];
    for (let i = 0; i < this.props.cards.length; i++) {
      const inSolution = this.props.solution != null
        ? this.props.solution.includes(this.props.cards[i])
        : false;

      res.push(
        <Card
          inSolution={inSolution}
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
    const solutions = findSetsInCards(initialCards);
    this.state = {
      cards: initialCards,
      solutions: solutions, // List of the solutions -- [[s1, s2, s3], [s1, s2, s3], ...]
      solutionIndex: -1, // Index to track which solution we are displaying. Init at -1.
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
    }

    const potentialSet = [] ;
    selected.forEach((i) => potentialSet.push(this.state.cards[i]));

    if (checkIsSet(potentialSet)) {
      // Will be generating new cards here, so should also find the new solutions
      const currCards = this.state.cards.slice();
      const selectedList = Array.from(selected).sort((a, b) => a - b); // Sort numerically
      if (currCards.length > 12) {
        // Remove cards from the back of the list
        for (let j = selectedList.length - 1; j >= 0; j--) {
          currCards.splice(selectedList[j], 1);
        }
      } else {
        // Add 3 from deck.
        const [drawnCards, newDeck] = drawNCardsFromDeck(selected.size, this.state.deck);
        for (let i = 0; i < selectedList.length; i++) { // should always be length 3 though.
          currCards[selectedList[i]] = drawnCards[i];
        }
        this.setState({deck: newDeck});
      }

      selected.clear();
      const newSols = findSetsInCards(currCards);
      this.setState({cards: currCards, solutions: newSols, solutionIndex: -1});
    }

    this.setState({selected: selected});
  }

  onClickSolution() {
    const sols = this.state.solutions.slice();
    if (!sols.length) {
      // No solution
      // Maybe change button to say "no solution" in the future.
      return;
    }
    const solutionIndex = this.state.solutionIndex;
    this.setState({solutionIndex: (solutionIndex + 1) % sols.length});
  }

  onClickToggleGameMode() {
    const gameMode = this.state.gameMode;
    const newGameMode = gameMode === 1 ? 0 : 1;

    // Restart game.
    // TODO modularize the game restart.
    const [newCards, newDeck] = drawNCardsFromDeck(12, shuffleCards(generateCards()));
    const newSols = findSetsInCards(newCards);
    this.setState({
      gameMode: newGameMode,
      cards: newCards,
      deck: newDeck,
      selected: new Set(),
      solutions: newSols,
      solutionIndex: -1});
  }

  onClickNoSet() {
    const currCards = this.state.cards.slice();
    const [additionalCards, newDeck] = drawNCardsFromDeck(3, this.state.deck);
    const newCards = currCards.concat(additionalCards);
    const newSolutions = findSetsInCards(newCards);
    this.setState({
      deck: newDeck,
      cards: newCards,
      solutions: newSolutions,
      solutionIndex: -1,
    });
  }

  onClickShuffle() {
    const currCards = this.state.cards.slice();
    const shuffledCards = shuffleCards(currCards);
    const selectedIndices = Array.from(this.state.selected);
    const newIndices = [];
    for (let i = 0; i < selectedIndices.length; i++) {
      newIndices.push(shuffledCards.indexOf(currCards[selectedIndices[i]]));
    }
    this.setState({cards: shuffledCards, selected: new Set(newIndices)});
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
      ? <span className="Score"/>
      : (<p className="Score">score: {this.state.score} || {this.buildTimer()} </p>);

    return (
      <div className="App">
        <Header gameMode={this.state.gameMode} onClick={() => this.onClickToggleGameMode()} />
        <hr/>
        <hr/>
        <div className="Board">
          <div className="Info">
            <p className="Mode">game mode: {this.state.gameMode === 0 ? "free play" : "timed"}</p>

            <div className="Buttons">
              <button className="Button" onClick={() => this.onClickNoSet()}>No Set?</button>
              <button className="Button" onClick={() => this.onClickShuffle()}>Shuffle</button>
              {this.state.gameMode === 0
                ? <button className="Button" onClick={() => this.onClickSolution()}>Solution</button>
                : null}
            </div>
            {timedDetails}
          </div>
          <Board
            solution={
              this.state.solutionIndex === -1
                ? null
                : this.state.solutions[this.state.solutionIndex]}
            cards={this.state.cards}
            onClickCard={(i) => this.onClickCard(i)}
            selected={this.state.selected}
          />
        </div>
        </div>
    );
  }
}

export default App;
