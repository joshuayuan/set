import React from 'react';
import logo from './logo.svg';
import './App.css';

class Card extends React.Component {
  render() {
    const classes = "Card" + (this.props.isSelected ? " Selected" : "");
    console.log(classes);
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
    this.state = {
      cards: Array(12).fill(0),
      selected: Array(12).fill(false),
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
    return (
      <div className="App">
        <div className="Board">
          {this.renderBoard()}
        </div>
      </div>
    );
  }
}

export default App;
