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
            mushroom: { owned: 0, cost: 10, costMultiplier: 1.5, coinsPerClick: 1 },
            'fire-flower': { owned: 0, cost: 50, costMultiplier: 1.5, coinsPerSecond: 1 },
            star: { owned: 0, cost: 200, costMultiplier: 1.5, coinsPerSecond: 5 },
            'one-up': { owned: 0, cost: 500, costMultiplier: 2, globalMultiplier: 2 }
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

    // DOM elements
    const coinElement = document.getElementById('coin-button');
    const coinCountElement = document.getElementById('coin-counter');
    const coinsPerClickElement = document.getElementById('coins-per-click');
    const coinsPerSecondElement = document.getElementById('coins-per-second');
    const totalClicksDisplay = document.getElementById('total-clicks');
    const cpcStat = document.getElementById('cpc-stat');
    const cpsStat = document.getElementById('cps-stat');
    const multiplierStat = document.getElementById('multiplier-stat');
    const floatingNumbersElement = document.getElementById('floating-numbers');
    const shopItems = document.querySelectorAll('.shop-items .racers');
    const achievementListElement = document.getElementById('achievement-list');
    const notificationElement = document.getElementById('notification');
    const saveNotificationElement = document.getElementById('save-notification');
    const toggleViewButton = document.getElementById('toggle-view');
    const shopTitle = document.getElementById('shop-title');
    const arrowIcon = document.querySelector('.arrow-icon');

    // Sound effects
    const coinSound = new Audio('https://themushroomkingdom.net/sounds/wav/smw/smw_coin.wav');
    const powerupSound = new Audio('https://themushroomkingdom.net/sounds/wav/smw/smw_power-up.wav');
    const achievementSound = new Audio('https://themushroomkingdom.net/sounds/wav/smw/smw_1-up.wav');

    // Preload sounds
    coinSound.load();
    powerupSound.load();
    achievementSound.load();

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
        shopItems.forEach(item => {
            const id = parseInt(item.id);
            const itemData = gameState.items[id];
            const costElement = item.querySelector('.cost-amount');
            const ownedElement = item.querySelector('.owned-count');
            const buyButton = item.querySelector('.buy-button');
            const currentCost = 0;

            if (itemData !== undefined) {
                currentCost = Math.floor(itemData.cost * Math.pow(itemData.costMultiplier, itemData.owned));
                
                costElement.textContent = currentCost;
                ownedElement.textContent = itemData.owned;

                // Disable buy button if not enough coins
                if (gameState.coins < currentCost) {
                    buyButton.disabled = true;
                } else {
                    buyButton.disabled = false;
                }
            }
        });
    }

    // Set up event listeners
    function setupEventListeners() {
        // Coin click event
        coinElement.addEventListener('click', () => {
            clickCoin();
        });

        // Shop item buy events
        shopItems.forEach(item => {
            const buyButton = item.querySelector('.buy-button');
            buyButton.addEventListener('click', () => {
                buyItem(item.id);
            });
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

        // Play coin sound
        playCoinSound();

        // Animate coin
        coinElement.classList.add('clicked');
        setTimeout(() => {
            coinElement.classList.remove('clicked');
        }, 300);

        // Show floating number
        showFloatingNumber('+' + coinsEarned.toFixed(1));

        // Check achievements
        checkAchievements();

        // Update UI
        updateUI();
    }

    // Play coin sound with random pitch
    function playCoinSound() {
        // Create a new audio element each time to allow overlapping sounds
        const sound = coinSound.cloneNode();
        sound.volume = 0.3;
        sound.playbackRate = 0.8 + Math.random() * 0.4; // Random pitch between 0.8 and 1.2
        sound.play().catch(e => console.log("Audio play failed:", e));
    }

    // Show floating number animation
    function showFloatingNumber(text) {
        const floatingNumber = document.createElement('div');
        floatingNumber.className = 'floating-number';
        floatingNumber.textContent = text;

        // Random position around the coin
        const left = 20 + Math.random() * 60; // 20% to 80% of container width
        const top = 20 + Math.random() * 60; // 20% to 80% of container height

        floatingNumber.style.left = `${left}%`;
        floatingNumber.style.top = `${top}%`;

        floatingNumbersElement.appendChild(floatingNumber);

        // Remove after animation completes
        setTimeout(() => {
            floatingNumber.remove();
        }, 1000);
    }

    // Buy item function
    function buyItem(itemId) {
        const item = gameState.items[itemId];
        const cost = Math.floor(item.cost * Math.pow(item.costMultiplier, item.owned));

        if (gameState.coins >= cost) {
            gameState.coins -= cost;
            item.owned++;

            // Play powerup sound
            powerupSound.currentTime = 0;
            powerupSound.volume = 0.5;
            powerupSound.play().catch(e => console.log("Audio play failed:", e));

            // Apply item effects
            if (itemId === 'mushroom') {
                gameState.coinsPerClick += item.coinsPerClick;
            } else if (itemId === 'fire-flower' || itemId === 'star') {
                gameState.coinsPerSecond += item.coinsPerSecond;
            } else if (itemId === 'one-up') {
                gameState.multiplier *= item.globalMultiplier;
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
            // Play achievement sound
            achievementSound.currentTime = 0;
            achievementSound.volume = 0.5;
            achievementSound.play().catch(e => console.log("Audio play failed:", e));

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
