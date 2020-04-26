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

export function drawNCardsFromDeck(n, deck)  {
  const newDeck = deck.slice();
  const drawnCards = [];
  for (let i = 0; i < n; i++) {
    drawnCards.push(newDeck.pop());
  }
  return [drawnCards, newDeck];
}

/**
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
