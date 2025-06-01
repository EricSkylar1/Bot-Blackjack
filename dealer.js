class Dealer extends Participant{
    constructor(){
        super("Dealer") 
    }

    dealCard(deck){
        return deck.shift();
    }

    dealToPlayer(shuffledDeck, player){
        const card = this.dealCard(shuffledDeck)
        player.getCard(card)
    }

    dealToSelf(shuffledDeck){
        const card = this.dealCard(shuffledDeck)
        this.hand.getCard(card)
    }
}