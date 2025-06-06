// Card Deck - H:Hearts D:Diamonds C:Clubs S:Spades
const deck = [
  '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', 'JH', 'QH', 'KH', 'AH',
  '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', 'JD', 'QD', 'KD', 'AD',
  '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', 'JC', 'QC', 'KC', 'AC',
  '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', 'JS', 'QS', 'KS', 'AS'
];

// Button Clicked
document.getElementById("start-game-button").onclick = async function() {
    
    // Create participants
    const dealer = new Dealer();
    const player = new Player();

    // Create a Deck Copy
    gameDeck = [...deck];
    // Shuffle Deck
    let shuffledDeck = shuffleDeck(gameDeck);
    updateNarration("Game Starts!")
    
    // Dealer Deals
    await dealInitialCards(dealer, player, shuffledDeck);

    // Calculate Initial Scores
    player.calculateInitialScore()
    dealer.calculateInitialScore()

    // Update Score on UI
    updatePlayerScore(player.score)
    updateDealerScore(dealer.score)

    await delay(3000);

    // Player Bot starts
    await playerTurn(player, shuffledDeck, dealer);

    if(player.isBusted === true){
        updateNarration("Player Busted - Game Over!")
        resetGame(player, dealer)
        return
    }

    updateNarration("Dealer reveals card")
    await updateDealerHiddenCard(dealer.getCardInHand()[1]);
    await dealer.calculateFullScore()
    await updateDealerScore(dealer.score)

    await delay(3000);

    if((player.score === 21 && player.hand.length === 2) && dealer.score < 21){
        updateNarration("Player Wins!")
        resetGame(player, dealer)
        return
    }

    updateNarration("Dealer's turn")
    await dealerTurn(dealer, shuffledDeck);

    if(dealer.score > player.score || player.score > 21){
        updateNarration("The House wins!")
    } else if(dealer.score === player.score){
        updateNarration("Push - Game Over")
    } else {
        updateNarration("Player Wins!")
    }

    await delay(2000);

    resetGame(player, dealer)

}

/**
 * Shuffles an array in place using the Fisher-Yates (Knuth) shuffle algorithm.
 * 
 * This algorithm ensures an unbiased shuffle where every permutation of the
 * array is equally likely. It works by iterating backwards through the array,
 * swapping each element with a randomly chosen element that comes before it (or itself).
 * 
 * @param {Array} deckToShuffle - The array (deck) to shuffle
 * @returns {Array} The shuffled array (same reference as input)
 */
function shuffleDeck(deckToShuffle) {
    for (let i = deckToShuffle.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = deckToShuffle[i];
        deckToShuffle[i] = deckToShuffle[j];
        deckToShuffle[j] = temp;
    }
    return deckToShuffle;
}

/**
 * Updates the narration text area with the provided message.
 * 
 * @param {string} updatedText - The text to display in the narration area.
 */
function updateNarration(updatedText) {
    const narrationDiv = document.getElementById("narration");
    narrationDiv.innerText = updatedText;
}

/**
 * Updates the player's displayed score.
 * 
 * @param {number|string} playerScore - The current score of the player.
 */
function updatePlayerScore(playerScore) {
    const playerScoreDiv = document.getElementById("player-score");
    playerScoreDiv.innerText = playerScore;
}

/**
 * Updates the dealer's displayed score.
 * 
 * @param {number|string} dealerScore - The current score of the dealer.
 */
function updateDealerScore(dealerScore) {
    const dealerScoreDiv = document.getElementById("dealer-score");
    dealerScoreDiv.innerText = dealerScore;
}

/**
 * Adds a new card element to the player's hand display.
 * 
 * @param {string} playerCard - The card value or representation to add.
 */
function updatePlayerCard(playerCard) {
    const playerCardDiv = document.getElementById("player-hand");
    const newCard = document.createElement("div");
    newCard.className = "card";
    newCard.innerText = playerCard;
    playerCardDiv.appendChild(newCard);
}

/**
 * Adds a new card element to the dealer's hand display.
 * 
 * @param {string} dealerCard - The card value or representation to add.
 */
function updateDealerCard(dealerCard) {
    const dealerCardDiv = document.getElementById("dealer-hand");
    const newCard = document.createElement("div");
    newCard.className = "card";
    newCard.innerText = dealerCard;
    dealerCardDiv.appendChild(newCard);
}

/**
 * Reveals the dealer's hidden card by removing the placeholder ("??") and
 * adding the actual card element to the dealer's hand display.
 * 
 * @param {string} dealerCard - The actual card value to reveal.
 */
function updateDealerHiddenCard(dealerCard) {
    const dealerCardDiv = document.getElementById("dealer-hand");
    for (let child of dealerCardDiv.children) {
        if (child.innerText === "??") {
            child.remove();
            break;
        }
    }
    const newCard = document.createElement("div");
    newCard.className = "card";
    newCard.innerText = dealerCard;
    dealerCardDiv.appendChild(newCard);
}

/**
 * Executes the dealer's turn based on standard Blackjack rules.
 * 
 * The dealer continues to hit while their score is below 17. If their score exceeds 21,
 * they bust. Otherwise, the dealer stands and ends their turn.
 * 
 * During each decision:
 * - Narration is updated for player feedback.
 * - UI is refreshed with the dealer’s updated hand and score.
 * - Delays simulate a realistic pause between actions.
 * 
 * @param {Dealer} dealer - The dealer bot instance
 * @param {Array} shuffledDeck - The deck of cards to draw from
 */
async function dealerTurn(dealer, shuffledDeck){
    while(!dealer.isBusted){
        if(dealer.score < 17){
            updateNarration("Dealer Hits")
            await dealer.hit(shuffledDeck)
            updateDealerScore(dealer.score)
            await updateDealerCards(dealer)
            await delay(3000); 
        } else if (dealer.score > 21){
            dealer.busted()
            updateNarration("Dealer Busts!")
            await delay(3000); 
        } else {
            return
        }
    }
}

/**
 * Executes the player's turn by evaluating their decisions in a loop
 * until they choose to stand or bust.
 * 
 * The loop continues as long as the player decides to hit (`playerHitOrStand === 1`)
 * and hasn't busted. A delay is added to simulate the player "thinking"
 * if their score is still under 17 after hitting.
 * 
 * This function handles the turn logic sequentially, using the `playerEvaluates`
 * function to determine actions and apply side effects such as UI updates.
 * 
 * @param {Player} player - The player bot instance
 * @param {Array} shuffledDeck - The current shuffled deck of cards
 * @param {Dealer} dealer - The dealer bot instance (used to inform player's decisions)
 */
async function playerTurn(player, shuffledDeck, dealer) {
  let playerHitOrStand = 1;

  while (playerHitOrStand !== 0) {
    playerHitOrStand = await playerEvaluates(player, dealer, shuffledDeck);
    if(!player.isBusted && playerHitOrStand === 1 && player.score < 17){
        updateNarration("Player is thinking")
        await delay(3000); 
    }
    
  }
}

/**
 * Evaluates the player's decision to hit or stand based on their current score
 * and the dealer's visible score. Executes the appropriate action with UI updates.
 * 
 * Decision logic:
 * - If player's score is below 12, they always hit.
 * - If player's score is between 12 and 16:
 *    - Hit if dealer is showing a strong card (7 or higher) or a very weak card (3 or lower)
 *    - Otherwise, stand.
 * - If player's score is 17 to 21, they always stand.
 * - If player's score exceeds 21, they bust.
 * 
 * All actions trigger narration, UI updates, and are delayed for a more natural turn flow.
 * 
 * @param {Player} player - The player bot instance
 * @param {Dealer} dealer - The dealer bot instance
 * @param {Array} shuffledDeck - The deck of cards to deal from
 * @returns {Promise<number>} 1 if the player hit, 0 if they stood or busted
 */
async function playerEvaluates(player, dealer, shuffledDeck){
    if(player.score < 12){
        await player.hit(shuffledDeck)
        updateNarration("Player Hits")
        updatePlayerScore(player.score)
        await updatePlayerCards(player)
        await delay(3000);
        return 1
    } else if (player.score >= 12 && player.score <= 16){
        if(dealer.score >= 7 || dealer.score <= 3){
            await player.hit(shuffledDeck)
            updateNarration("Player Hits")
            updatePlayerScore(player.score)
            await updatePlayerCards(player)
            await delay(3000);
            return 1
        } else {
            updateNarration("Player Stands")
            await delay(3000); 
            return 0
        }
    } else if(player.score >= 17 && player.score <= 21){
        updateNarration("Player Stands")
        await delay(3000); 
        return 0
    } else {
        updateNarration("Player Busts!")
        player.busted()
        return 0
    }
}

/**
 * Updates the UI with the dealer's most recently dealt card.
 * 
 * This function assumes the dealer has already received the card,
 * and updates the interface by displaying the last card in the dealer's hand.
 * 
 * @param {Dealer} dealer - The dealer bot instance whose card will be shown
 */
async function updateDealerCards(dealer){
    updateDealerCard(dealer.getCardInHand()[dealer.hand.length - 1])
}

/**
 * Updates the UI with the player's most recently dealt card.
 * 
 * This function assumes the player has already received the card,
 * and updates the interface by displaying the last card in the player's hand.
 * 
 * @param {Player} player - The player bot instance whose card will be shown
 */
async function updatePlayerCards(player){
    updatePlayerCard(player.getCardInHand()[player.hand.length - 1])
}

/**
 * Deals the initial two cards to both the player and the dealer with delays and narration updates.
 * 
 * Card order:
 * 1. Player receives first face-up card
 * 2. Dealer receives first face-up card
 * 3. Player receives second face-up card
 * 4. Dealer receives second face-down card (displayed as "??")
 * 
 * Delays simulate real-time dealing and improve game pacing and readability.
 * 
 * @param {Dealer} dealer - The dealer bot instance
 * @param {Player} player - The player bot instance
 * @param {Array} shuffledDeck - The shuffled array of cards to deal from
 */
async function dealInitialCards(dealer, player, shuffledDeck){
    // Player gets Face Up Card
    dealer.dealToPlayer(shuffledDeck, player)
    updateNarration("Dealer deals Card 1 to Player")
    updatePlayerCard(player.getCardInHand()[0])
    await delay(3000);

    // Dealer get Face Up Card
    dealer.dealToSelf(shuffledDeck)
    updateNarration("Dealer deals Card 1 to Self")
    updateDealerCard(dealer.getCardInHand()[0])
    await delay(3000);

    // Player gets Face Up Card
    dealer.dealToPlayer(shuffledDeck, player)
    updateNarration("Dealer deals Card 2 to Player")
    updatePlayerCard(player.getCardInHand()[1])
    await delay(3000);

    // Dealer gets Face Down Card
    dealer.dealToSelf(shuffledDeck)
    updateNarration("Dealer deals Card 2 to Self")
    updateDealerCard("??")
    await delay(3000);
}

/**
 * Creates a delay for a specified duration using a Promise.
 *
 * This is useful for adding pauses between actions in asynchronous functions,
 * such as simulating turns in a game or animating steps.
 *
 * @param {number} ms - The number of milliseconds to delay
 * @returns {Promise<void>} A Promise that resolves after the specified delay
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Resets the game state for a new round of Blackjack.
 * 
 * This function clears the UI elements related to both the player's and dealer's hands and scores,
 * and also calls each bot's `resetHand()` method to clear their internal state.
 * 
 * @param {Player} player - The player bot instance
 * @param {Dealer} dealer - The dealer bot instance
 */
function resetGame(player, dealer){
    const dealerCardDiv = document.getElementById("dealer-hand")
    dealerCardDiv.innerHTML = "";

    const playerCardDiv = document.getElementById("player-hand")
    playerCardDiv.innerHTML = "";

    const playerScoreDiv = document.getElementById("player-score")
    playerScoreDiv.innerHTML = "";

    const dealerScoreDiv = document.getElementById("dealer-score")
    dealerScoreDiv.innerHTML = "";

    player.resetHand()
    dealer.resetHand()
}