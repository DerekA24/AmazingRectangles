import app1 from './app1.js'


class Game {
    constructor(AmazingRects, PoisonRects, PulsRects, TurretRects, grenade, Shield, Bomb, swingHealth, rectHealth, Damage, Damage1, Round) {
        this.totalCash = 5;
        this.cashRecieved = .50; //cash recieved per rectangle destroyed
        //cost of items
        this.grenadeCost = 10;
        this.shieldCost = 10;
        this.bombCost = 35;
        this.healthCost = 5;
        this.damageCost = 5;
        //base cost of all items
        this.Costs = [10, 10, 35, 5, 5];
        // Persistent stats across rounds
        this.playerStats = {
            grenades: grenade,
            shields: Shield,
            bombs: Bomb,
            health: swingHealth,
            damage: Damage
        };
        // times each item has been bought
        this.grenadeTimes = 0;
        this.shieldTimes = 0;
        this.bombTimes = 0;
        this.healthTimes = 0;
        this.damageTimes = 0;

        this.config = { AmazingRects, PoisonRects, PulsRects, TurretRects, rectHealth, Damage1 };
        this.round = Round || 1;
        this.currentApp = null;

    }

    start() {
        this.startApp();
    }
    // Storage key for saving/restoring progress
    static STORAGE_KEY = 'amazingRectSavedGame_v1';

    // Save current game state to localStorage (called at the start of each round)
    saveToStorage() {
        try {
            const payload = {
                totalCash: this.totalCash,
                cashRecieved: this.cashRecieved,
                grenadeCost: this.grenadeCost,
                shieldCost: this.shieldCost,
                bombCost: this.bombCost,
                healthCost: this.healthCost,
                damageCost: this.damageCost,
                Costs: this.Costs,
                playerStats: this.playerStats,
                grenadeTimes: this.grenadeTimes,
                shieldTimes: this.shieldTimes,
                bombTimes: this.bombTimes,
                healthTimes: this.healthTimes,
                damageTimes: this.damageTimes,
                config: this.config,
                round: this.round
            };
            localStorage.setItem(Game.STORAGE_KEY, JSON.stringify(payload));
        } catch (e) {
            console.warn('Failed to save game to storage', e);
        }
    }

    // Check if there's a saved game
    static hasSavedGame() {
        try {
            return !!localStorage.getItem(Game.STORAGE_KEY);
        } catch (e) {
            return false;
        }
    }

    // Load a saved game from storage and return a Game instance, or null
    static loadFromStorage() {
        try {
            const raw = localStorage.getItem(Game.STORAGE_KEY);
            if (!raw) return null;
            const s = JSON.parse(raw);
            // Construct a new Game using the saved config values (fallbacks for safety)
            const cfg = s.config || {};
            const g = new Game(
                cfg.AmazingRects ?? 5,
                cfg.PoisonRects ?? 3,
                cfg.PulsRects ?? 0,
                cfg.TurretRects ?? 0,
                s.playerStats?.grenades ?? 0,
                s.playerStats?.shields ?? 0,
                s.playerStats?.bombs ?? 0,
                s.playerStats?.health ?? 1,
                cfg.rectHealth ?? 1,
                s.playerStats?.damage ?? 1,
                cfg.Damage1 ?? 1,
                s.round ?? 1
            );
            // restore additional fields
            g.totalCash = s.totalCash ?? g.totalCash;
            g.cashRecieved = s.cashRecieved ?? g.cashRecieved;
            g.Costs = s.Costs ?? g.Costs;
            g.grenadeCost = s.grenadeCost ?? g.grenadeCost;
            g.shieldCost = s.shieldCost ?? g.shieldCost;
            g.bombCost = s.bombCost ?? g.bombCost;
            g.healthCost = s.healthCost ?? g.healthCost;
            g.damageCost = s.damageCost ?? g.damageCost;
            g.playerStats = s.playerStats ?? g.playerStats;
            g.grenadeTimes = s.grenadeTimes ?? g.grenadeTimes;
            g.shieldTimes = s.shieldTimes ?? g.shieldTimes;
            g.bombTimes = s.bombTimes ?? g.bombTimes;
            g.healthTimes = s.healthTimes ?? g.healthTimes;
            g.damageTimes = s.damageTimes ?? g.damageTimes;
            g.config = s.config ?? g.config;
            g.round = s.round ?? g.round;
            return g;
        } catch (e) {
            console.warn('Failed to load saved game', e);
            return null;
        }
    }

    // Clear saved game
    static clearSavedGame() {
        try {
            localStorage.removeItem(Game.STORAGE_KEY);
        } catch (e) {
            console.warn('Failed to clear saved game', e);
        }
    }
    startApp() {
        if (this.currentApp && this.currentApp.area) {
            this.currentApp.area.stop?.();
            this.currentApp.area.rectangles = [];
        }

        // Create a new app1 instance using latest player stats
        this.currentApp = new app1(
            this.config.AmazingRects,
            this.config.PoisonRects,
            this.config.PulsRects,
            this.config.TurretRects,
            this.playerStats.grenades,
            this.playerStats.shields,
            this.playerStats.bombs,
            this.playerStats.health,
            this.config.rectHealth,
            this.playerStats.damage,
            this.config.Damage1,
            this.round,
            this.grenadeCost,
            this.shieldCost,
            this.bombCost,
            this.healthCost,
            this.damageCost,
            this.cashRecieved
        );
        // After constructing app1, ensure the swing's maxHealth/current health reflect player stats.
        const desiredHealth = Number.isFinite(this.playerStats.health) ? this.playerStats.health : 1;
        this.currentApp.desiredSwingHealth = desiredHealth;
        this.currentApp.setGameReference(this);
        this.currentApp.startApp();
    }

    // Called when player chooses to go back to the home screen.
    // pass save=false to avoid persisting (useful when returning after a loss)
    goHome(save = true) {
        // stop current app
        if (this.currentApp && this.currentApp.area) {
            this.currentApp.area.stop?.();
            this.currentApp.area.rectangles = [];
        }
        // Save current game state so it can be resumed later (unless explicitly disabled)
        if (save) this.saveToStorage();

        // Show start popup and enable Resume button
        const startPopup = document.getElementById('StartPopup');
        if (startPopup) startPopup.style.display = 'flex';
        // Background video should only show when this is the homescreen for a fresh start or after loss
        try {
            const video = document.getElementById('homeBgVideo');
            const canvas = document.getElementById('drawingArea');
            if (video) {
                // show video only when we are not preserving the game screen (i.e., save===false or first load)
                if (!save) {
                    video.style.display = 'block';
                    // hide canvas so video is unobstructed behind popups
                    if (canvas) canvas.style.display = 'none';
                } else {
                    video.style.display = 'none';
                    if (canvas) canvas.style.display = 'block';
                }
            }
        } catch (e) {
            // ignore DOM errors
        }
        const resumeBtn = document.getElementById('ResumeSaved');
        if (resumeBtn) {
            resumeBtn.style.display = Game.hasSavedGame() ? 'inline-block' : 'none';
            resumeBtn.onclick = () => {
                const loaded = Game.loadFromStorage();
                if (loaded) {
                    // replace this game instance with loaded and start
                    try {
                        // Copy relevant fields into current instance
                        this.totalCash = loaded.totalCash;
                        this.cashRecieved = loaded.cashRecieved;
                        this.grenadeCost = loaded.grenadeCost;
                        this.shieldCost = loaded.shieldCost;
                        this.bombCost = loaded.bombCost;
                        this.healthCost = loaded.healthCost;
                        this.damageCost = loaded.damageCost;
                        this.Costs = loaded.Costs;
                        this.playerStats = loaded.playerStats;
                        this.grenadeTimes = loaded.grenadeTimes;
                        this.shieldTimes = loaded.shieldTimes;
                        this.bombTimes = loaded.bombTimes;
                        this.healthTimes = loaded.healthTimes;
                        this.damageTimes = loaded.damageTimes;
                        this.config = loaded.config;
                        this.round = loaded.round;
                        // start app from loaded state
                        startPopup.style.display = 'none';
                        this.start();
                    } catch (e) {
                        console.error('Failed to resume saved game', e);
                    }
                }
            };
        }
        // Ensure Play button is visible
        const playBtn = document.getElementById('PlayGame');
        if (playBtn) {
            playBtn.style.display = 'inline-block';
            // If we intentionally didn't save (e.g., after a loss), prefer 'Play'
            if (!save) playBtn.textContent = 'Play';
            else playBtn.textContent = Game.hasSavedGame() ? 'New Game' : 'Play';
        }
    }
    updateCost() {
        this.grenadeCost = this.Costs[0]*Math.pow(1.40, this.grenadeTimes);
        this.shieldCost = this.Costs[1]*Math.pow(1.45, this.shieldTimes);
        this.bombCost = this.Costs[2]*Math.pow(1.47, this.bombTimes);
        this.healthCost = this.Costs[3]*Math.pow(1.32, this.healthTimes);
        this.damageCost = this.Costs[4]*Math.pow(1.28, this.damageTimes);
    }
    nextRound() {
        this.round++;
        // Update Cash Recieved Per Rectangle
        this.cashRecieved = .5*Math.pow(1.13, this.round);
        // Scale Rectangle Attributes
        if (Math.random()<.45) {
            // Scale enemy damage slightly each round. Use the current Damage1 value
            this.config.Damage1 = this.config.Damage1 * 1.125;
        }
        if (Math.random()<.67) {
            this.config.rectHealth+=2;
        }
        // Scale More Rectangles With Later Rounds
        if (this.config.AmazingRects<20) {
            if (Math.random()<.45) {
                this.config.AmazingRects+=1;
            }
        }
        if (this.config.PoisonRects<5) {
            if (Math.random()<.3) {
                this.config.PoisonRects++;
            }
        }
        if (this.round>4&&this.round<11) {
            if (this.config.PulsRects<5) {
                if (Math.random()<.3) {
                    this.config.PulsRects++;
                }
            }
            if (this.config.PoisonRects<5) {
                if (Math.random()<.2) {
                    this.config.PoisonRects++;
                }
            }
        
        }
        else if (this.round>=11&&this.round<20) {
            if (this.config.PulsRects<6) {
                if (Math.random()<.3) {
                    this.config.PulsRects++;
                }
            }
            if (this.config.TurretRects<3) {
                if (Math.random()<.3) {
                    this.config.TurretRects++;
                }
            }
            if (this.config.PoisonRects<7) {
                if (Math.random()<.1) {
                    this.config.PoisonRects++;
                }
            }
        }
        else if (this.round>=20) {
            if (this.config.PulsRects<9) {
                if (Math.random()<.05) {
                    this.config.PulsRects++;
                }
            }
            if (this.config.TurretRects<4) {
                if (Math.random()<.2) {
                    this.config.TurretRects++;
                }
            }
            if (this.config.PoisonRects<10) {
                if (Math.random()<.05) {
                    this.config.PoisonRects++;
                }
            }
        }
        this.startApp(); // reruns the ENTIRE startApp() fresh
        // Persist new round/state so resume will reflect the updated round
        try { this.saveToStorage(); } catch (e) { /* ignore */ }
    }
    static main() {
        const init = () => {
    let game = new Game(5, 3, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1);

        const popup = document.getElementById('StartPopup');
        const tutorialPopup = document.getElementById('tutorialPopup');
        const Play = document.getElementById('PlayGame');
        const Tutorial = document.getElementById('Tutorial');
        const ResumeSaved = document.getElementById('ResumeSaved');
        const tutorialClose = document.getElementById('exitTutorial');

        // Ensure home background video is visible on first load
        try {
            const video = document.getElementById('homeBgVideo');
            if (video) video.style.display = 'block';
            // Try to start playback programmatically; if blocked, start on first user gesture
            try {
                const p = video.play();
                if (p && typeof p.then === 'function') {
                    p.catch(() => {
                        // Playback blocked by browser policy: attach one-time gesture to start
                        const startVideo = () => { try { video.play(); } catch (e) {} finally { window.removeEventListener('click', startVideo); window.removeEventListener('keydown', startVideo); } };
                        window.addEventListener('click', startVideo, { once: true });
                        window.addEventListener('keydown', startVideo, { once: true });
                    });
                }
            } catch (e) {
                // ignore play() exceptions
            }
        } catch (e) {}

        // Show resume button only if a saved game exists
        if (ResumeSaved) {
            ResumeSaved.style.display = Game.hasSavedGame() ? 'inline-block' : 'none';
            ResumeSaved.onclick = () => {
                const loaded = Game.loadFromStorage();
                if (loaded) {
                    // Replace the newly created game instance with the loaded one
                    // and start from the saved state
                    try {
                        // copy fields from loaded to game instance
                        Object.assign(game, {
                            totalCash: loaded.totalCash,
                            cashRecieved: loaded.cashRecieved,
                            grenadeCost: loaded.grenadeCost,
                            shieldCost: loaded.shieldCost,
                            bombCost: loaded.bombCost,
                            healthCost: loaded.healthCost,
                            damageCost: loaded.damageCost,
                            Costs: loaded.Costs,
                            playerStats: loaded.playerStats,
                            grenadeTimes: loaded.grenadeTimes,
                            shieldTimes: loaded.shieldTimes,
                            bombTimes: loaded.bombTimes,
                            healthTimes: loaded.healthTimes,
                            damageTimes: loaded.damageTimes,
                            config: loaded.config,
                            round: loaded.round
                        });
                        if (popup) popup.style.display = 'none';
                        // Hide the background video when game starts/resumes and show canvas
                        try { const video = document.getElementById('homeBgVideo'); const canvas = document.getElementById('drawingArea'); if (video) video.style.display = 'none'; if (canvas) canvas.style.display = 'block'; } catch (e) {}
                        game.start();
                    } catch (e) {
                        console.error('Failed to resume saved game', e);
                    }
                }
            };
        }

        // Set Play button label depending on whether a saved game exists.
        if (Play) Play.textContent = Game.hasSavedGame() ? 'New Game' : 'Play';

        Play.onclick = () => {
            if (popup) popup.style.display = 'none';
            // Starting a new game via Play should erase any previous saved progress
            try { Game.clearSavedGame(); } catch (e) { /* ignore */ }
            // hide home video when gameplay begins and show canvas
            try { const video = document.getElementById('homeBgVideo'); const canvas = document.getElementById('drawingArea'); if (video) video.style.display = 'none'; if (canvas) canvas.style.display = 'block'; } catch (e) {}
            // create a fresh Game instance and start it
            game = new Game(5, 3, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1);
            // hide resume button when starting a fresh game
            if (ResumeSaved) ResumeSaved.style.display = 'none';
            game.start(); // starts the full app
        };

        Tutorial.onclick = () => {
            if (popup) popup.style.display = 'none';
            if (tutorialPopup) {
                tutorialPopup.style.display = 'flex';
                tutorialClose.onclick = () => {
                    tutorialPopup.style.display = 'none';
                    if (popup) popup.style.display = 'flex';
                };
            }
        };
        };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}

}
Game.main();
