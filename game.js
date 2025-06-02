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

function updateNarration(updatedText){
    const narrationDiv = document.getElementById("narration");
    narrationDiv.innerText = updatedText;
}

function updatePlayerScore(playerScore){
    const playerScoreDiv = document.getElementById("player-score")
    playerScoreDiv.innerText = playerScore;
}

function updateDealerScore(dealerScore){
    const dealerScoreDiv = document.getElementById("dealer-score")
    dealerScoreDiv.innerText = dealerScore;
}

function updatePlayerCard(playerCard){
    const playerCardDiv = document.getElementById("player-hand")
    const newCard = document.createElement("div");
    newCard.className = "card";
    newCard.innerText = playerCard;
    playerCardDiv.appendChild(newCard);
}

function updateDealerCard(dealerCard){
    const dealerCardDiv = document.getElementById("dealer-hand")
    const newCard = document.createElement("div");
    newCard.className = "card";
    newCard.innerText = dealerCard;
    dealerCardDiv.appendChild(newCard);
}

function updateDealerHiddenCard(dealerCard){
    const dealerCardDiv = document.getElementById("dealer-hand")
    for(let child of dealerCardDiv.children){
        if(child.innerText === "??"){
            child.remove()
            break;
        }
    }
    const newCard = document.createElement("div");
    newCard.className = "card";
    newCard.innerText = dealerCard;
    dealerCardDiv.appendChild(newCard);
}

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

async function updateDealerCards(dealer){
    updateDealerCard(dealer.getCardInHand()[dealer.hand.length - 1])
}

async function updatePlayerCards(player){
    updatePlayerCard(player.getCardInHand()[player.hand.length - 1])
}

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

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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