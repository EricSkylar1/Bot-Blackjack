# Bot-Blackjack
Bot Blackjack is a lightweight, browser-based simulation of the classic card game Blackjack, where two automated bots—a player and a dealer—compete in a turn-based format. Built entirely with pure HTML, CSS, and vanilla JavaScript, this project was intentionally developed without the use of any frameworks or external libraries. The goal was to reinforce fundamental coding skills in a clean and controlled environment, while also applying object-oriented programming (OOP) principles in a practical, hands-on way.
🎯 Purpose and Goals

The project was designed as a technical exercise to:

    Practice vanilla web development without relying on abstraction layers

    Implement a self-contained game flow using native browser APIs

    Explore and apply OOP concepts in JavaScript such as inheritance, encapsulation, and polymorphism

    Strengthen understanding of DOM manipulation and real-time UI updates

    Simulate AI decision-making through bot logic

🧠 Game Features

    Turn-based Blackjack match between a player bot and dealer bot

    Built-in logic for hit, stand, and win conditions

    Real-time rendering of game progress in the browser

    Basic AI strategy for each bot based on current hand value

    Deterministic flow for testing, plus randomized elements to simulate actual play

🧱 OOP Design Breakdown

The core architecture revolves around three main classes:

    Participant – A base class representing any game entity that can receive cards, manage a hand, and take turns.

    Player – Inherits from Participant, customized with bot behavior for hit/stand logic.

    Dealer – Also inherits from Participant, but implements its own strategy consistent with real Blackjack rules.

This separation of roles allows for clean abstraction of shared functionality, while keeping behaviors modular and maintainable.

🧬 Inheritance

Both Player and Dealer inherit common methods from the Participant base class. These include methods like receiveCard, calculateHandValue, and a general hit function. Each subclass can call or extend these shared methods as needed, reducing code duplication and improving readability.

🔁 Polymorphism

The project demonstrates polymorphism through the use of methods like receiveCard() and hit(), which are called on instances of both Player and Dealer. Despite being the same method name, the runtime behavior differs depending on the class instance, showcasing dynamic dispatch and class-specific logic during execution.

🧩 Encapsulation

Each class is responsible for managing its own internal state, such as the current hand of cards and score calculation. This ensures that logic stays encapsulated and avoids unnecessary dependencies between components.

🛠️ Overriding

The Player and Dealer classes each override inherited methods to implement unique behaviors during their turn. For example, while both use hit(), the internal logic that determines when to hit or stand varies between the two bots, demonstrating method specialization through overriding.

💡 Educational Takeaways

Bot Blackjack is an excellent example of how to build a complete interactive application using just the fundamentals of front-end development and object-oriented programming. It highlights how core concepts like inheritance, polymorphism, and encapsulation can be used in JavaScript to create clean, extensible systems—even in simple, framework-free projects.

### How to Launch

1. Clone the repo and navigate to the project folder

2. Open the game in your browser:

- On macOS/Linux:  
  `open index.html`  

- On Windows:  
  `start index.html`  