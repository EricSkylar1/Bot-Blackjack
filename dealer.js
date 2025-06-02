class Dealer extends Participant{
    constructor(){
        super("Dealer") 
    }

    dealCard(deck){
        return deck.shift();
    }

    dealToPlayer(shuffledDeck, player){
        const card = this.dealCard(shuffledDeck)
        player.receiveCard(card)
    }

    dealToSelf(shuffledDeck){
        const card = this.dealCard(shuffledDeck)
        this.receiveCard(card)
    }

    calculateInitialScore(){
        const firstCard = this.getCardInHand()[0];
        const value = firstCard.slice(0,-1);
        switch (value) {
            case "J":
                this.score += 10;
                break;
            case "Q":
                this.score += 10;
                break;
            case "K":
                this.score += 10;
                break;
            case "A":
                this.score += 11;
                break;
            default:
                this.score += Number(value);
                break;
        }
    }

    calculateFullScore(){
        this.score = 0
        for(const card of this.hand){
            const value = card.slice(0,-1)
            switch (value) {
                case "J":
                    this.score += 10;
                    break;
                case "Q":
                    this.score += 10;
                    break;
                case "K":
                    this.score += 10;
                    break;
                case "A":
                    this.score += 11;
                    break;
                default:
                    this.score += Number(value);
                    break;
            }
        }
    }
}