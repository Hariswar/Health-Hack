document.addEventListener('DOMContentLoaded', () => {
    // Game state
    let gameState = {
        coins: 0,
        coinsPerClick: 1,
        coinsPerSecond: 0,
        totalClicks: 0,
        multiplier: 1.5,
        items: {
            'super-mushroom': { 
                owned: 0, 
                cost: 10, 
                costMultiplier: 1.5, 
                coinsPerClick: 1 
            },
            'poison-mushroom': { 
                owned: 0, 
                cost: 100, 
                costMultiplier: 1.5, 
                coinsPerClick: 10 
            },
            'fire-flower': { 
                owned: 0, 
                cost: 500, 
                costMultiplier: 1.5, 
                coinsPerClick: 50 
            },
            'one-up': { 
                owned: 0, 
                cost: 1000, 
                costMultiplier: 1.5, 
                coinsPerClick: 100 
            },
            'super-leaf': { 
                owned: 0, 
                cost: 5000, 
                costMultiplier: 1.5, 
                coinsPerClick: 500 
            },
            'super-star': { 
                owned: 0, 
                cost: 10000, 
                costMultiplier: 1.5, 
                coinsPerClick: 1000 
            }
        },
        characters: {
            'mario': {
                owned: false,
                cost: 100,
                coinsPerSecond: 10
            },
            'luigi': {
                owned: false,
                cost: 200,
                coinsPerSecond: 20
            },
            'peach': {
                owned: false,
                cost: 500,
                coinsPerSecond: 50
            },
            'bowser': {
                owned: false,
                cost: 1000,
                coinsPerSecond: 100
            },
            'wario': {
                owned: false,
                cost: 10000,
                coinsPerSecond: 1000
            },
            'waluigi': {
                owned: false,
                cost: 100000,
                coinsPerSecond: 10000
            }
        }
    };

    const coinElement = document.getElementById('coin-button');
    const coinCountElement = document.getElementById('coin-counter');
    const coinsPerClickElement = document.getElementById('coins-per-click');
    const coinsPerSecondElement = document.getElementById('coins-per-second');
    const multiplierElement = document.getElementById('multiplier');
    const totalClicksDisplay = document.getElementById('total-clicks');

    const superMushroomCost = document.getElementById('super-mushroom-cost');
    const superMushroomOwned = document.getElementById('super-mushroom-owned');
    const superMushroomBuyButton = document.getElementById('super-mushroom-buy-button');

    const poisonMushroomCost = document.getElementById('poison-mushroom-cost');
    const poisonMushroomOwned = document.getElementById('poison-mushroom-owned');
    const poisonMushroomBuyButton = document.getElementById('poison-mushroom-buy-button');

    const fireFlowerCost = document.getElementById('fire-flower-cost');
    const fireFlowerOwned = document.getElementById('fire-flower-owned');
    const fireFlowerBuyButton = document.getElementById('fire-flower-buy-button');

    const oneUpCost = document.getElementById('one-up-cost');
    const oneUpOwned = document.getElementById('one-up-owned');
    const oneUpBuyButton = document.getElementById('one-up-buy-button');

    const superLeafCost = document.getElementById('super-leaf-cost');
    const superLeafOwned = document.getElementById('super-leaf-owned');
    const superLeafBuyButton = document.getElementById('super-leaf-buy-button');

    const superStarCost = document.getElementById('super-star-cost');
    const superStarOwned = document.getElementById('super-star-owned');
    const superStarBuyButton = document.getElementById('super-star-buy-button');

    const marioCost = document.getElementById('mario-cost');
    const marioBuyButton = document.getElementById('mario-buy-button');

    const luigiCost = document.getElementById('luigi-cost');
    const luigiBuyButton = document.getElementById('luigi-buy-button');

    const peachCost = document.getElementById('peach-cost');
    const peachBuyButton = document.getElementById('peach-buy-button');

    const bowserCost = document.getElementById('bowser-cost');
    const bowserBuyButton = document.getElementById('bowser-buy-button');

    const warioCost = document.getElementById('wario-cost');
    const warioBuyButton = document.getElementById('wario-buy-button');

    const waluigiCost = document.getElementById('waluigi-cost');
    const waluigiBuyButton = document.getElementById('waluigi-buy-button');

    // Initialize game
    function initGame() {
        updateUI();
        setupEventListeners();
        startPassiveIncome();
    }

    // Update UI with current game state
    function updateUI() {
        if (coinCountElement) coinCountElement.textContent = Math.floor(gameState.coins);
        if (coinsPerClickElement) coinsPerClickElement.textContent = gameState.coinsPerClick.toFixed(1);
        if (coinsPerSecondElement) coinsPerSecondElement.textContent = gameState.coinsPerSecond.toFixed(1);
        if (multiplierElement) multiplierElement.textContent = gameState.multiplier.toFixed(1);
        if (totalClicksDisplay) totalClicksDisplay.textContent = gameState.totalClicks;

        // Update shop items
        if (superMushroomCost) superMushroomCost.textContent = Math.floor(gameState.items['super-mushroom'].cost * Math.pow(gameState.items['super-mushroom'].costMultiplier, gameState.items['super-mushroom'].owned));
        if (superMushroomOwned) superMushroomOwned.textContent = gameState.items['super-mushroom'].owned;
        if (superMushroomBuyButton) superMushroomBuyButton.disabled = gameState.coins < Math.floor(gameState.items['super-mushroom'].cost * Math.pow(gameState.items['super-mushroom'].costMultiplier, gameState.items['super-mushroom'].owned));

        if (poisonMushroomCost) poisonMushroomCost.textContent = Math.floor(gameState.items['poison-mushroom'].cost * Math.pow(gameState.items['poison-mushroom'].costMultiplier, gameState.items['poison-mushroom'].owned));
        if (poisonMushroomOwned) poisonMushroomOwned.textContent = gameState.items['poison-mushroom'].owned;
        if (poisonMushroomBuyButton) poisonMushroomBuyButton.disabled = gameState.coins < Math.floor(gameState.items['poison-mushroom'].cost * Math.pow(gameState.items['poison-mushroom'].costMultiplier, gameState.items['poison-mushroom'].owned));

        if (fireFlowerCost) fireFlowerCost.textContent = Math.floor(gameState.items['fire-flower'].cost * Math.pow(gameState.items['fire-flower'].costMultiplier, gameState.items['fire-flower'].owned));
        if (fireFlowerOwned) fireFlowerOwned.textContent = gameState.items['fire-flower'].owned;
        if (fireFlowerBuyButton) fireFlowerBuyButton.disabled = gameState.coins < Math.floor(gameState.items['fire-flower'].cost * Math.pow(gameState.items['fire-flower'].costMultiplier, gameState.items['fire-flower'].owned));

        if (oneUpCost) oneUpCost.textContent = Math.floor(gameState.items['one-up'].cost * Math.pow(gameState.items['one-up'].costMultiplier, gameState.items['one-up'].owned));
        if (oneUpOwned) oneUpOwned.textContent = gameState.items['one-up'].owned;
        if (oneUpBuyButton) oneUpBuyButton.disabled = gameState.coins < Math.floor(gameState.items['one-up'].cost * Math.pow(gameState.items['one-up'].costMultiplier, gameState.items['one-up'].owned));

        if (superLeafCost) superLeafCost.textContent = Math.floor(gameState.items['super-leaf'].cost * Math.pow(gameState.items['super-leaf'].costMultiplier, gameState.items['super-leaf'].owned));
        if (superLeafOwned) superLeafOwned.textContent = gameState.items['super-leaf'].owned;
        if (superLeafBuyButton) superLeafBuyButton.disabled = gameState.coins < Math.floor(gameState.items['super-leaf'].cost * Math.pow(gameState.items['super-leaf'].costMultiplier, gameState.items['super-leaf'].owned));

        if (superStarCost) superStarCost.textContent = Math.floor(gameState.items['super-star'].cost * Math.pow(gameState.items['super-star'].costMultiplier, gameState.items['super-star'].owned));
        if (superStarOwned) superStarOwned.textContent = gameState.items['super-star'].owned;
        if (superStarBuyButton) superStarBuyButton.disabled = gameState.coins < Math.floor(gameState.items['super-star'].cost * Math.pow(gameState.items['super-star'].costMultiplier, gameState.items['super-star'].owned));

        if (marioCost) marioCost.textContent = gameState.characters['mario'].cost;
        if (marioBuyButton) {
            marioBuyButton.disabled = gameState.coins < gameState.characters['mario'].cost || gameState.characters['mario'].owned;
            marioBuyButton.textContent = gameState.characters['mario'].owned ? 'Sold' : 'Buy';
            marioBuyButton.style.backgroundColor = gameState.characters['mario'].owned ? 'red' : 'green';
        }

        if (luigiCost) luigiCost.textContent = gameState.characters['luigi'].cost;
        if (luigiBuyButton) {
            luigiBuyButton.disabled = gameState.coins < gameState.characters['luigi'].cost || gameState.characters['luigi'].owned;
            luigiBuyButton.textContent = gameState.characters['luigi'].owned ? 'Owned' : 'Buy';
            luigiBuyButton.style.backgroundColor = gameState.characters['luigi'].owned ? 'red' : 'green';
        }

        if (peachCost) peachCost.textContent = gameState.characters['peach'].cost;
        if (peachBuyButton) {
            peachBuyButton.disabled = gameState.coins < gameState.characters['peach'].cost || gameState.characters['peach'].owned;
            peachBuyButton.textContent = gameState.characters['peach'].owned ? 'Owned' : 'Buy';
            peachBuyButton.style.backgroundColor = gameState.characters['peach'].owned ? 'red' : 'green';
        }

        if (bowserCost) bowserCost.textContent = gameState.characters['bowser'].cost;
        if (bowserBuyButton) {
            bowserBuyButton.disabled = gameState.coins < gameState.characters['bowser'].cost || gameState.characters['bowser'].owned;
            bowserBuyButton.textContent = gameState.characters['bowser'].owned ? 'Owned' : 'Buy';
            bowserBuyButton.style.backgroundColor = gameState.characters['bowser'].owned ? 'red' : 'green';
        }

        if (warioCost) warioCost.textContent = gameState.characters['wario'].cost;
        if (warioBuyButton) {
            warioBuyButton.disabled = gameState.coins < gameState.characters['wario'].cost || gameState.characters['wario'].owned;
            warioBuyButton.textContent = gameState.characters['wario'].owned ? 'Owned' : 'Buy';
            warioBuyButton.style.backgroundColor = gameState.characters['wario'].owned ? 'red' : 'green';
        }

        if (waluigiCost) waluigiCost.textContent = gameState.characters['waluigi'].cost;
        if (waluigiBuyButton) {
            waluigiBuyButton.disabled = gameState.coins < gameState.characters['waluigi'].cost || gameState.characters['waluigi'].owned;
            waluigiBuyButton.textContent = gameState.characters['waluigi'].owned ? 'Owned' : 'Buy';
            waluigiBuyButton.style.backgroundColor = gameState.characters['waluigi'].owned ? 'red' : 'green';
        }
    }

    // Set up event listeners
    function setupEventListeners() {
        // Coin click event
        if (coinElement) coinElement.addEventListener('click', () => {
            clickCoin();
        });

        // Buy events
        if (superMushroomBuyButton) superMushroomBuyButton.addEventListener('click', () => {
            buyItem("super-mushroom");
        });

        if (poisonMushroomBuyButton) poisonMushroomBuyButton.addEventListener('click', () => {
            buyItem("poison-mushroom");
        });

        if (fireFlowerBuyButton) fireFlowerBuyButton.addEventListener('click', () => {
            buyItem("fire-flower");
        });

        if (oneUpBuyButton) oneUpBuyButton.addEventListener('click', () => {
            buyItem("one-up");
        });

        if (superLeafBuyButton) superLeafBuyButton.addEventListener('click', () => {
            buyItem("super-leaf");
        });

        if (superStarBuyButton) superStarBuyButton.addEventListener('click', () => {
            buyItem("super-star");
        });

        if (marioBuyButton) marioBuyButton.addEventListener('click', () => {
            buyCharacter("mario");
        });

        if (luigiBuyButton) luigiBuyButton.addEventListener('click', () => {
            buyCharacter("luigi");
        });

        if (peachBuyButton) peachBuyButton.addEventListener('click', () => {
            buyCharacter("peach");
        });

        if (bowserBuyButton) bowserBuyButton.addEventListener('click', () => {
            buyCharacter("bowser");
        });

        if (warioBuyButton) warioBuyButton.addEventListener('click', () => {
            buyCharacter("wario");
        });

        if (waluigiBuyButton) waluigiBuyButton.addEventListener('click', () => {
            buyCharacter("waluigi");
        });
    }

    // Click coin function
    function clickCoin() {
        const coinsEarned = gameState.coinsPerClick;
        gameState.coins += coinsEarned;
        gameState.totalClicks++;

        // Update UI
        updateUI();
    }

    // Buy item function
    function buyItem(itemId) {
        const item = gameState.items[itemId];
        const cost = Math.floor(item.cost * Math.pow(item.costMultiplier, item.owned));

        if (gameState.coins >= cost) {
            gameState.coins -= cost;
            item.owned++;
            gameState.coinsPerClick += item.coinsPerClick;

            // Update UI
            updateUI();
        }
    }

    // Buy character function
    function buyCharacter(characterId) {
        const character = gameState.characters[characterId];
        if (gameState.coins >= character.cost && !character.owned) {
            gameState.coins -= character.cost;
            character.owned = true;
            gameState.coinsPerSecond += character.coinsPerSecond;

            // Update UI
            updateUI();
        }
    }

    // Start passive income
    function startPassiveIncome() {
        setInterval(() => {
            gameState.coins += gameState.coinsPerSecond;
            updateUI();
        }, 1000);
    }

    // Initialize game when DOM is loaded
    initGame();
});