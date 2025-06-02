class Participant{
    constructor(p_type){
        this.p_type = p_type;
        this.score = 0;
        this.hand = [];
        this.isBusted = false;
    }

    receiveCard(card){
        this.hand.push(card);
    }

    getCardInHand(){
        return this.hand;
    }

    hit(shuffledDeck){
        const card = shuffledDeck.shift() // get next card
        this.receiveCard(card)
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
                    if(this.score <= 10){
                        this.score += 11;
                    } else {
                        this.score += 1;
                    }
                    break;
                default:
                    this.score += Number(value);
                    break;
            }
    }

    calculateInitialScore(){
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

    busted(){
        this.isBusted = true;
    }

    resetHand(){
        this.hand = []
        this.score = 0
    }

}