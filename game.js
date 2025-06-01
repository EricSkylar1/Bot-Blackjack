// Card Deck - H:Hearts D:Diamonds C:Clubs S:Spades
const deck = [
  '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', 'JH', 'QH', 'KH', 'AH',
  '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', 'JD', 'QD', 'KD', 'AD',
  '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', 'JC', 'QC', 'KC', 'AC',
  '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', 'JS', 'QS', 'KS', 'AS'
];

// Button Clicked
document.getElementById("start-game-button").onclick = function() {
    
    // Create a Deck Copy
    gameDeck = [...deck];
    // Shuffle Deck
    let shuffledDeck = shuffleDeck(gameDeck);
    // Dealer Deals
        // Player gets Face Up Card
        // Dealer get Face Up Card
        // Player gets Face Up Card
        // Dealer gets Face Down Card

    // Player Bot starts
        // Evaluate to Hit
            // Continue 
        // Evaluate to Stand
            // Go to Dealer

    // Dealer goes
        // Hit if not 17
        // Stand if 17+

}

// Fisher-Yates Shuffling Algorithm
function shuffleDeck(deckToShuffle){
    for(let i = deckToShuffle.length - 1; i > 0; i--){
        var j = Math.floor(Math.random() * (i + 1))
        var temp = deckToShuffle[i]
        deckToShuffle[i] = deckToShuffle[j]
        deckToShuffle[j] = temp
    }
    return deckToShuffle;
}