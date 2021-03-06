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

import firebase from './firebase.js';

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
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);

    const name = data.get('name');
    firebase.database().ref("/scores").push({
      username: name,
      score: this.props.score,
      timeStamp: firebase.database.ServerValue.TIMESTAMP,
    });

    this.props.resetGame(this.props.gameMode);
  }

  renderGameOver() {
    return (
      <div className="Endgame">
        <h1>Game is over!</h1>
        <p>Your score was <b>{this.props.score}</b>.</p>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>
              Save your score with a name:
            </label>
          </div>
          <div className="Input">
            <input type="text" name="name" />
          </div>
          <div>
            <input type="submit" value="save" />
          </div>
        </form>
      </div>
    );
  }


  render() {
    // If game is over:
    if (this.props.gameStatus === 1) return this.renderGameOver();

    // Rendering playing cards:
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
      hasWon: false, // Only indicates if you have gone through the whole deck.
      gameStatus: 0, // 0: playing 1: over
    };

    this.resetGame = this.resetGame.bind(this);
    this.timer = React.createRef();

    ReactGA.initialize('UA-164939986-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  resetGame(newGameMode) {
    if (newGameMode === 1 && this.timer.current != null) {
      // TODO Add count down later
      this.timer.current.reset();
      this.timer.current.start();
    }
    // Restart game.
    const [newCards, newDeck] = drawNCardsFromDeck(12, shuffleCards(generateCards()));
    const newSols = findSetsInCards(newCards);
    this.setState({
      gameMode: newGameMode,
      cards: newCards,
      deck: newDeck,
      selected: new Set(),
      solutions: newSols,
      solutionIndex: -1,
      score: 0,
      gameStatus: 0,
      hasWon: false,
    });
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
        if (drawnCards.length === 0) {
          // No more cards.
          // Remove cards from the back of the list (Same as above^)
          for (let k = selectedList.length - 1; k >= 0; k--) {
            currCards.splice(selectedList[k], 1);
          }
        } else {
          for (let i = 0; i < selectedList.length; i++) { // should always be length 3 though.
            currCards[selectedList[i]] = drawnCards[i];
          }
        }
        this.setState({deck: newDeck});
      }
      const filteredCards = currCards.filter(x => !!x); // This is a gamechanger lne of code.

      selected.clear();
      const newSols = findSetsInCards(filteredCards);
      // Not sure if it's safe to read deck state right after it's been set^
      if (newSols.length === 0 && (this.state.deck.length === 0))
        this.setState({hasWon: true});
      this.setState({
        score: this.state.score + 1,
        cards: filteredCards,
        solutions: newSols,
        solutionIndex: -1,
      });
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
    this.resetGame(newGameMode);
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
          <Timer
            ref={this.timer}
            initialTime={180001} // Have to add the one, or else the timer skip sthe first second
            direction="backward"
            checkpoints={[{
              time: 0,
              callback: () => this.setState({gameStatus: 1}),
            }]}
          >
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

    const hasWonElement = this.state.hasWon ? <span><b>Congrats! You have won!</b></span> : null;

    const timedDetails = this.state.gameMode === 0
      ? <p className="Score">{hasWonElement}</p>
      : (<p className="Score">{hasWonElement} score: {this.state.score} || {this.buildTimer()} </p>);

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
            resetGame={this.resetGame}
            gameStatus={this.state.gameStatus}
            score={this.state.score}
            gameMode={this.state.gameMode}
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
