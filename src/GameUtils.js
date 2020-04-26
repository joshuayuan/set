/*
 * This class contains utility functions for the game.
 */

// This function should only be called once at the start of each game.
export function generateCards() {
  const cards = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
          cards.push(i.toString() + j.toString() + k.toString() + l.toString());
        }
      }
    }
  }
  return cards;
}

// Returns the inputted list of cards shuffled
export function shuffleCards(cards) {
  const shuffled = cards.slice();
  for (let i = 0; i < shuffled.length; i++) {
    const r = getRandomInt(0, shuffled.length - 1);
    const temp = shuffled[i];
    shuffled[i] = shuffled[r];
    shuffled[r] = temp;
  }
  return shuffled;
}

// Returns n number of new cards from deck
// and returns deck with those cards popped off.
export function drawNCardsFromDeck(n, deck)  {
  const newDeck = deck.slice();
  const drawnCards = [];
  for (let i = 0; i < n; i++) {
    drawnCards.push(newDeck.pop());
  }
  return [drawnCards, newDeck];
}

// Only 3 cards should be passed in
// Returns true if the 3 cards make a set.
export function checkIsSet(potentialSet) {
  const cards = potentialSet.slice();
  if (cards.length !== 3) return false;
  const first = cards[0];
  const second = cards[1];
  const third = cards[2];

  const feature1 = allDifferent(first[0], second[0], third[0]) || allSame(first[0], second[0], third[0]);
  const feature2 = allDifferent(first[1], second[1], third[1]) || allSame(first[1], second[1], third[1]);
  const feature3 = allDifferent(first[2], second[2], third[2]) || allSame(first[2], second[2], third[2]);
  const feature4 = allDifferent(first[3], second[3], third[3]) || allSame(first[3], second[3], third[3]);
  console.log(feature1, feature2, feature3, feature4);
  return feature1 && feature2 && feature3 && feature4;
}

// a b and c are strings. Return true if they are all different
function allDifferent(a, b, c) {
  return a !== b && b !== c && a !== c;
}

//a b and c are strings. Return true if they are all the same
function allSame(a, b, c) {
  return a === b && b === c;
}

/**
 * From Mozilla Documentation:
 *
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
