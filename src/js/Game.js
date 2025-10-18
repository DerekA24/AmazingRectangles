import app1 from './app1.js'


class Game {
    constructor(AmazingRects, PoisonRects, PulsRects, TurretRects, grenade, Shield, Bomb, swingHealth, rectHealth, Damage, Damage1, Round) {
        this.totalCash = 5;
        this.cashRecieved = .50; //cash recieved per rectangle destroyed
        //cost of items
        this.grenadeCost = 10;
        this.shieldCost = 5;
        this.bombCost = 40;
        this.healthCost = 5;
        this.damageCost = 5;
        //base cost of all items
        this.Costs = [10, 5, 40, 5, 5];
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
    // Note: startApp() on the app will initialize the swing, but the app constructor may not
    // attach it until `startApp()` runs. We'll set desired values here and again after start.
    const desiredHealth = Number.isFinite(this.playerStats.health) ? this.playerStats.health : 1;
    // store desired values for the app to pick up when creating the swing
    this.currentApp.desiredSwingHealth = desiredHealth;
    this.currentApp.setGameReference(this);
    this.currentApp.startApp();
    }
    updateCost() {
        this.grenadeCost = this.Costs[0]*Math.pow(1.45, this.grenadeTimes);
        this.shieldCost = this.Costs[1]*Math.pow(1.45, this.shieldTimes);
        this.bombCost = this.Costs[2]*Math.pow(1.38, this.bombTimes);
        this.healthCost = this.Costs[3]*Math.pow(1.32, this.healthTimes);
        this.damageCost = this.Costs[4]*Math.pow(1.25, this.damageTimes);
    }
    nextRound() {
        this.round++;
        // Update Cash Recieved Per Rectangle
        this.cashRecieved = .5*Math.pow(1.13, this.round);
        // Scale Rectangle Attributes
        if (Math.random()<.45) {
            // Scale enemy damage slightly each round. Use the current Damage1 value
            // instead of a non-existent `config.Damage` which produces NaN.
            this.config.Damage1 = this.config.Damage1 * 1.1;
        }
        if (Math.random()<.5) {
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
    }
    static main() {
        const init = () => {
        const game = new Game(5, 3, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1);
        
        const popup = document.getElementById('StartPopup');
        const tutorialPopup = document.getElementById('tutorialPopup');
        const Play = document.getElementById('PlayGame');
        const Tutorial = document.getElementById('Tutorial');
        const tutorialClose = document.getElementById('exitTutorial');

        Play.onclick = () => {
            popup.style.display = 'none';
            game.start(); // starts the full app
        };

        Tutorial.onclick = () => {
            popup.style.display = 'none';
            tutorialPopup.style.display = 'flex';
            tutorialClose.onclick = () => {
                tutorialPopup.style.display = 'none';
                popup.style.display = 'flex';
            };
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
