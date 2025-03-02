document.addEventListener('DOMContentLoaded', () => {
    // Game state
    let gameState = {
        coins: 0,
        coinsPerClick: 1,
        coinsPerSecond: 0,
        totalCoinsEarned: 0,
        totalClicks: 0,
        multiplier: 1,
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
                coinsPerClick: 5 
            },
            'fire-flower': { 
                owned: 0, 
                cost: 10000, 
                costMultiplier: 1.5, 
                coinsPerClick: 50 
            },
            'one-up': { 
                owned: 0, 
                cost: 100000, 
                costMultiplier: 1.5, 
                coinsPerClick: 100 
            },
            'super-leaf': { 
                owned: 0, 
                cost: 1000000, 
                costMultiplier: 1.5, 
                coinsPerClick: 500 
            },
            'super-star': { 
                owned: 0, 
                cost: 10000000, 
                costMultiplier: 1.5, 
                coinsPerClick: 1000 
            },
            characters: {
                'mario': {
                    owned: 0,
                    cost: 100000000,
                    coinsPerSecond: 10000
                },
                'luigi': {
                    owned: 0,
                    cost: 1000000000,
                    coinsPerSecond: 100000
                },
                'peach': {
                    owned: 0,
                    cost: 10000000000,
                    coinsPerSecond: 1000000
                },
                'bowser': {
                    owned: 0,
                    cost: 100000000000,
                    coinsPerSecond: 10000000
                },
                'wario': {
                    owned: 0,
                    cost: 1000000000000,
                    coinsPerSecond: 100000000
                },
                'waluigi': {
                    owned: 0,
                    cost: 10000000000000,
                    coinsPerSecond: 1000000000
                }
            }
        },

        achievements: [
            { id: 'first-coin', name: 'First Coin!', description: 'Click your first coin', unlocked: false, requirement: () => gameState.totalClicks >= 1 },
            { id: 'ten-coins', name: 'Coin Collector', description: 'Earn 10 coins', unlocked: false, requirement: () => gameState.totalCoinsEarned >= 10 },
            { id: 'hundred-coins', name: 'Coin Enthusiast', description: 'Earn 100 coins', unlocked: false, requirement: () => gameState.totalCoinsEarned >= 100 },
            { id: 'thousand-coins', name: 'Coin Master', description: 'Earn 1,000 coins', unlocked: false, requirement: () => gameState.totalCoinsEarned >= 1000 },
            { id: 'first-upgrade', name: 'Power Up!', description: 'Buy your first upgrade', unlocked: false, requirement: () => Object.values(gameState.items).some(item => item.owned > 0) },
            { id: 'five-upgrades', name: 'Upgrade Addict', description: 'Buy 5 upgrades in total', unlocked: false, requirement: () => Object.values(gameState.items).reduce((total, item) => total + item.owned, 0) >= 5 },
            { id: 'passive-income', name: 'Passive Income', description: 'Earn coins automatically', unlocked: false, requirement: () => gameState.coinsPerSecond > 0 },
            { id: 'click-machine', name: 'Click Machine', description: 'Click 100 times', unlocked: false, requirement: () => gameState.totalClicks >= 100 }
        ],

        lastSaved: Date.now()
    };

    const coinElement = document.getElementById('coin-button');
    const coinCountElement = document.getElementById('coin-counter');
    const coinsPerClickElement = document.getElementById('coins-per-click');
    const coinsPerSecondElement = document.getElementById('coins-per-second');
    
    const totalClicksDisplay = document.getElementById('total-clicks');
    const cpcStat = document.getElementById('cpc-stat');
    const cpsStat = document.getElementById('cps-stat');
    const multiplierStat = document.getElementById('multiplier-stat');

    const achievementListElement = document.getElementById('achievement-list');
    const notificationElement = document.getElementById('notification');
    const saveNotificationElement = document.getElementById('save-notification');
    const toggleViewButton = document.getElementById('toggle-view');
    const shopTitle = document.getElementById('shop-title');
    const arrowIcon = document.querySelector('.arrow-icon');

    const superMushroomCost = document.getElementById('super-mushroom-cost');
    const superMushroomOwned = document.getElementById('super-mushroom-owned');
    const superMushroomCPS = document.getElementById('super-mushroom-cps');
    const superMushroomBuyButton = document.getElementById('super-mushroom-buy-button');

    const fireFlowerCost = document.getElementById('fire-flower-cost');
    const fireFlowerOwned = document.getElementById('fire-flower-owned');
    const fireFlowerCPS = document.getElementById('fire-flower-cps');
    const fireFlowerBuyButton = document.getElementById('fire-flower-buy-button');

    const oneUpCost = document.getElementById('one-up-cost');
    const oneUpOwned = document.getElementById('one-up-owned');
    const oneUpCPS = document.getElementById('one-up-cps');
    const oneUpBuyButton = document.getElementById('one-up-buy-button');

    const superStarCost = document.getElementById('super-star-cost');
    const superStarOwned = document.getElementById('super-star-owned');
    const superStarCPS = document.getElementById('super-star-cps');
    const superStarBuyButton = document.getElementById('super-star-buy-button');

    const poisonMushroomCost = document.getElementById('poison-mushroom-cost');
    const poisonMushroomOwned = document.getElementById('poison-mushroom-owned');
    const poisonMushroomCPS = document.getElementById('poison-mushroom-cps');
    const poisonMushroomBuyButton = document.getElementById('poison-mushroom-buy-button');

    const superLeafCost = document.getElementById('super-leaf-cost');
    const superLeafOwned = document.getElementById('super-leaf-owned');
    const superLeafCPS = document.getElementById('super-leaf-cps');
    const superLeafBuyButton = document.getElementById('super-leaf-buy-button');

    const marioCost = document.getElementById('mario-cost');
    const marioCPS = document.getElementById('mario-cps');
    const marioBuyButton = document.getElementById('mario-buy-button');

    const luigiCost = document.getElementById('luigi-cost');
    const luigiCPS = document.getElementById('luigi-cps');
    const luigiBuyButton = document.getElementById('luigi-buy-button');
    
    const peachCost = document.getElementById('peach-cost');
    const peachCPS = document.getElementById('peach-cps');
    const peachBuyButton = document.getElementById('peach-buy-button');

    const bowserCost = document.getElementById('bowser-cost');
    const bowserCPS = document.getElementById('bowser-cps');
    const bowserBuyButton = document.getElementById('bowser-buy-button');

    const warioCost = document.getElementById('wario-cost');
    const warioCPS = document.getElementById('wario-cps');
    const warioBuyButton = document.getElementById('wario-buy-button');

    const waluigiCost = document.getElementById('waluigi-cost');
    const waluigiCPS = document.getElementById('waluigi-cps');
    const waluigiBuyButton = document.getElementById('waluigi-buy-button');

    
    // Initialize game
    function initGame() {
        // Load saved game if exists
        loadGame();

        // Initialize UI
        updateUI();
        renderAchievements();

        // Set up event listeners
        setupEventListeners();

        // Start game loop
        startGameLoop();
    }

    // Update UI with current game state
    function updateUI() {
        coinCountElement.textContent = Math.floor(gameState.coins);
        coinsPerClickElement.textContent = (gameState.coinsPerClick * gameState.multiplier).toFixed(1);
        coinsPerSecondElement.textContent = (gameState.coinsPerSecond * gameState.multiplier).toFixed(1);
        totalClicksDisplay.textContent = gameState.totalClicks;
        cpcStat.textContent = gameState.coinsPerClick.toFixed(1);
        cpsStat.textContent = gameState.coinsPerSecond.toFixed(1);
        multiplierStat.textContent = `x${(gameState.coinsPerClick / 1).toFixed(1)}`;

        // Update shop items
        superMushroomCost.textContent = Math.floor(gameState.items['super-mushroom'].cost * Math.pow(gameState.items['super-mushroom'].costMultiplier, gameState.items['super-mushroom'].owned));
        superMushroomOwned.textContent = gameState.items['super-mushroom'].owned;
        superMushroomCPS.textContent = gameState.items['super-mushroom'].coinsPerClick;
        superMushroomBuyButton.disabled = gameState.coins < Math.floor(gameState.items['super-mushroom'].cost * Math.pow(gameState.items['super-mushroom'].costMultiplier, gameState.items['super-mushroom'].owned));

        poisonMushroomCost.textContent = Math.floor(gameState.items['poison-mushroom'].cost * Math.pow(gameState.items['poison-mushroom'].costMultiplier, gameState.items['poison-mushroom'].owned));
        poisonMushroomOwned.textContent = gameState.items['poison-mushroom'].owned;
        poisonMushroomCPS.textContent = gameState.items['poison-mushroom'].coinsPerClick;
        poisonMushroomBuyButton.disabled = gameState.coins < Math.floor(gameState.items['poison-mushroom'].cost * Math.pow(gameState.items['poison-mushroom'].costMultiplier, gameState.items['poison-mushroom'].owned));

        fireFlowerCost.textContent = Math.floor(gameState.items['fire-flower'].cost * Math.pow(gameState.items['fire-flower'].costMultiplier, gameState.items['fire-flower'].owned));
        fireFlowerOwned.textContent = gameState.items['fire-flower'].owned;
        fireFlowerCPS.textContent = gameState.items['fire-flower'].coinsPerClick;
        fireFlowerBuyButton.disabled = gameState.coins < Math.floor(gameState.items['fire-flower'].cost * Math.pow(gameState.items['fire-flower'].costMultiplier, gameState.items['fire-flower'].owned));

        oneUpCost.textContent = Math.floor(gameState.items['one-up'].cost * Math.pow(gameState.items['one-up'].costMultiplier, gameState.items['one-up'].owned));
        oneUpOwned.textContent = gameState.items['one-up'].owned;
        oneUpCPS.textContent = gameState.items['one-up'].coinsPerClick;
        oneUpBuyButton.disabled = gameState.coins < Math.floor(gameState.items['one-up'].cost * Math.pow(gameState.items['one-up'].costMultiplier, gameState.items['one-up'].owned));

        superLeafCost.textContent = Math.floor(gameState.items['super-leaf'].cost * Math.pow(gameState.items['super-leaf'].costMultiplier, gameState.items['super-leaf'].owned));
        superLeafOwned.textContent = gameState.items['super-leaf'].owned;
        superLeafCPS.textContent = gameState.items['super-leaf'].coinsPerClick;
        superLeafBuyButton.disabled = gameState.coins < Math.floor(gameState.items['super-leaf'].cost * Math.pow(gameState.items['super-leaf'].costMultiplier, gameState.items['super-leaf'].owned));

        superStarCost.textContent = Math.floor(gameState.items['super-star'].cost * Math.pow(gameState.items['super-star'].costMultiplier, gameState.items['super-star'].owned));
        superStarOwned.textContent = gameState.items['super-star'].owned;
        superStarCPS.textContent = gameState.items['super-star'].coinsPerClick;
        superStarBuyButton.disabled = gameState.coins < Math.floor(gameState.items['super-star'].cost * Math.pow(gameState.items['super-star'].costMultiplier, gameState.items['super-star'].owned));

        marioCost.textContent = Math.floor(gameState.items.characters['mario'].cost);
        marioCPS.textContent = gameState.items.characters['mario'].coinsPerSecond;
        marioBuyButton.disabled = gameState.coins < gameState.items.characters['mario'].cost;

        luigiCost.textContent = Math.floor(gameState.items.characters['luigi'].cost);
        luigiCPS.textContent = gameState.items.characters['luigi'].coinsPerSecond;
        luigiBuyButton.disabled = gameState.coins < gameState.items.characters['luigi'].cost;

        peachCost.textContent = Math.floor(gameState.items.characters['peach'].cost);
        peachCPS.textContent = gameState.items.characters['peach'].coinsPerSecond;
        peachBuyButton.disabled = gameState.coins < gameState.items.characters['peach'].cost;

        bowserCost.textContent = Math.floor(gameState.items.characters['bowser'].cost);
        bowserCPS.textContent = gameState.items.characters['bowser'].coinsPerSecond;
        bowserBuyButton.disabled = gameState.coins < gameState.items.characters['bowser'].cost;

        warioCost.textContent = Math.floor(gameState.items.characters['wario'].cost);
        warioCPS.textContent = gameState.items.characters['wario'].coinsPerSecond;
        warioBuyButton.disabled = gameState.coins < gameState.items.characters['wario'].cost;

        waluigiCost.textContent = Math.floor(gameState.items.characters['waluigi'].cost);
        waluigiCPS.textContent = gameState.items.characters['waluigi'].coinsPerSecond;
        waluigiBuyButton.disabled = gameState.coins < gameState.items.characters['waluigi'].cost;
    }

    // Set up event listeners
    function setupEventListeners() {
        // Coin click event
        coinElement.addEventListener('click', () => {
            clickCoin();
        });

        // Buy event
        superMushroomBuyButton.addEventListener('click', () => {
            buyItem("super-mushroom");
        });

        poisonMushroomBuyButton.addEventListener('click', () => {
            buyItem("poison-mushroom");
        });

        fireFlowerBuyButton.addEventListener('click', () => {
            buyItem("fire-flower");
        });

        oneUpBuyButton.addEventListener('click', () => {
            buyItem("one-up");
        });

        superLeafBuyButton.addEventListener('click', () => {
            buyItem("super-leaf");
        });

        superStarBuyButton.addEventListener('click', () => {
            buyItem("super-star");
        });

        marioBuyButton.addEventListener('click', () => {
            buyItem("mario");
        });

        luigiBuyButton.addEventListener('click', () => {
            buyItem("luigi");
        });

        peachBuyButton.addEventListener('click', () => {
            buyItem("peach");
        });

        bowserBuyButton.addEventListener('click', () => {
            buyItem("bowser");
        });

        warioBuyButton.addEventListener('click', () => {
            buyItem("wario");
        });

        waluigiBuyButton.addEventListener('click', () => {
            buyItem("waluigi");
        });

        toggleViewButton.addEventListener('click', () => {
            if (shopTitle.textContent === 'UPGRADES') {
                shopTitle.textContent = 'CHARACTERS';
                arrowIcon.textContent = '▼';
            } else {
                shopTitle.textContent = 'UPGRADES';
                arrowIcon.textContent = '▲';
            }
        });
    }

    // Click coin function
    function clickCoin() {
        const coinsEarned = gameState.coinsPerClick * gameState.multiplier;
        gameState.coins += coinsEarned;
        gameState.totalCoinsEarned += coinsEarned;
        gameState.totalClicks++;

        // Animate coin
        coinElement.classList.add('clicked');
        setTimeout(() => {
            coinElement.classList.remove('clicked');
        }, 300);

        // Check achievements
        checkAchievements();

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

            // Apply item effects
            if (itemId === "super-mushroom") {
                gameState.coinsPerClick += item.coinsPerClick;
            }

            if (itemId === "poison-mushroom") {
                gameState.coinsPerClick += item.coinsPerClick;
            }

            if (itemId === "fire-flower") {
                gameState.coinsPerClick += item.coinsPerClick;
            }

            if (itemId === "one-up") {
                gameState.coinsPerClick += item.coinsPerClick;
            }

            if (itemId === "super-leaf") {
                gameState.coinsPerClick += item.coinsPerClick;
            }

            if (itemId === "super-star") {
                gameState.coinsPerClick += item.coinsPerClick;
            }

            // Show notification
            showNotification(`You bought a ${formatItemName(itemId)}!`);

            // Check achievements
            checkAchievements();

            // Update UI
            updateUI();
        }
    }

    // Format item name for display
    function formatItemName(itemId) {
        const names = {
            'mushroom': 'Super Mushroom',
            'poison-mushroom': 'Poison Mushroom',
            'fire-flower': 'Fire Flower',
            'star': 'Starman',
            'one-up': '1-Up Mushroom'
        };

        return names[itemId] || itemId;
    }

    // Show notification
    function showNotification(message) {
        notificationElement.textContent = message;
        notificationElement.classList.add('show');

        setTimeout(() => {
            notificationElement.classList.remove('show');
        }, 3000);
    }

    // Show save notification
    function showSaveNotification() {
        saveNotificationElement.classList.add('show');

        setTimeout(() => {
            saveNotificationElement.classList.remove('show');
        }, 2000);
    }

    // Render achievements
    function renderAchievements() {
        achievementListElement.innerHTML = '';

        gameState.achievements.forEach(achievement => {
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement ${achievement.unlocked ? 'unlocked' : ''}`;
            achievementElement.innerHTML = `
                <h3>${achievement.unlocked ? '✓ ' : '? '}${achievement.name}</h3>
                <p>${achievement.unlocked ? achievement.description : 'Keep playing to unlock'}</p>
            `;

            achievementListElement.appendChild(achievementElement);
        });
    }

    // Check achievements
    function checkAchievements() {
        let newAchievements = false;

        gameState.achievements.forEach(achievement => {
            if (!achievement.unlocked && achievement.requirement()) {
                achievement.unlocked = true;
                newAchievements = true;

                // Show notification
                showNotification(`Achievement Unlocked: ${achievement.name}`);
            }
        });

        if (newAchievements) {
            // Update achievements display
            renderAchievements();
        }
    }

    // Game loop
    function startGameLoop() {
        let lastUpdate = Date.now();

        function gameLoop() {
            const now = Date.now();
            const deltaTime = (now - lastUpdate) / 1000; // Convert to seconds
            lastUpdate = now;

            // Add passive income
            if (gameState.coinsPerSecond > 0) {
                const coinsEarned = gameState.coinsPerSecond * gameState.multiplier * deltaTime;
                gameState.coins += coinsEarned;
                gameState.totalCoinsEarned += coinsEarned;

                // Check achievements
                checkAchievements();
            }

            // Auto-save every minute
            if (now - gameState.lastSaved > 60000) {
                saveGame();
                gameState.lastSaved = now;
                showSaveNotification();
            }

            // Update UI
            updateUI();

            // Continue loop
            requestAnimationFrame(gameLoop);
        }

        // Start the loop
        gameLoop();
    }

    // Save game
    function saveGame() {
        localStorage.setItem('marioClickerSave', JSON.stringify(gameState));
    }

    // Load game
    function loadGame() {
        const savedGame = localStorage.getItem('marioClickerSave');

        if (savedGame) {
            try {
                const parsedSave = JSON.parse(savedGame);

                // Merge saved data with default state to handle new properties
                gameState = {
                    ...gameState,
                    ...parsedSave,
                    // Ensure items and achievements structure is preserved
                    items: { ...gameState.items, ...parsedSave.items },
                    achievements: gameState.achievements.map(achievement => {
                        const savedAchievement = parsedSave.achievements.find(a => a.id === achievement.id);
                        return savedAchievement ? { ...achievement, unlocked: savedAchievement.unlocked } : achievement;
                    })
                };

                showNotification('Game loaded!');
            } catch (error) {
                console.error('Error loading saved game:', error);
                showNotification('Error loading saved game');
            }
        }
    }

    // Reset game
    function resetGame() {
        if (confirm('Are you sure you want to reset your game? All progress will be lost!')) {
            localStorage.removeItem('marioClickerSave');
            location.reload();
        }
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        // Space bar to click coin
        if (event.code === 'Space') {
            clickCoin();
            event.preventDefault();
        }

        // S to save game
        if (event.code === 'KeyS' && (event.ctrlKey || event.metaKey)) {
            saveGame();
            showSaveNotification();
            event.preventDefault();
        }

        // R to reset game (with confirmation)
        if (event.code === 'KeyR' && event.ctrlKey) {
            resetGame();
            event.preventDefault();
        }
    });

    // Add context menu for additional options
    document.addEventListener('contextmenu', (event) => {
        // Prevent only in game area
        if (event.target.closest('.game-container')) {
            event.preventDefault();

            const contextMenu = document.createElement('div');
            contextMenu.className = 'context-menu';
            contextMenu.style.position = 'absolute';
            contextMenu.style.left = `${event.pageX}px`;
            contextMenu.style.top = `${event.pageY}px`;
            contextMenu.style.backgroundColor = 'white';
            contextMenu.style.border = '2px solid #e52521';
            contextMenu.style.borderRadius = '5px';
            contextMenu.style.padding = '5px';
            contextMenu.style.zIndex = '1000';
            contextMenu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

            contextMenu.innerHTML = `
                <div style="padding: 5px; cursor: pointer;" onclick="saveGame(); showSaveNotification(); document.querySelector('.context-menu').remove();">Save Game</div>
                <div style="padding: 5px; cursor: pointer;" onclick="resetGame();">Reset Game</div>
            `;

            document.body.appendChild(contextMenu);

            // Remove menu when clicking elsewhere
            document.addEventListener('click', function removeMenu() {
                contextMenu.remove();
                document.removeEventListener('click', removeMenu);
            });
        }
    });

    // Initialize game when DOM is loaded
    initGame();

    // Save game before unloading page
    window.addEventListener('beforeunload', saveGame);
});
