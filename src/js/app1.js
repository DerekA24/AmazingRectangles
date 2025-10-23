import DrawingArea from './drawingArea.js';
import cursorTracker from './cursorTracker.js';
import AmazingRectangle from './rectangles/AmazingRectangle.js';
import SwingingRectangle from './rectangles/SwingingRectangle.js';
import PulsingRectangle from './rectangles/PulsingRectangle.js';
import TurretRectangle from './rectangles/TurretRectangle.js';
import BulletRectangle from './rectangles/BulletRectangle.js';
import Grenade from './rectangles/Grenade.js';
import AbstractRectangle from './rectangles/AbstractRectangle.js';


class app1{
    constructor(RECT_COUNT,POIS_COUNT,PULS_COUNT,TURRET_COUNT, grenade, shield, bomb, health, health1, damage, damage1, round, grenadeCost, shieldCost, bombCost, healthCost, damageCost, cashRecieved) {
        this.area = null;
        this.swing = null;
        this.Grenades = grenade;
        this.Shields = shield;
        this.Bombs = bomb;
        this.health = health;
        this.health1 = health1;
        this.damage = damage;
        this.damage1 = damage1;
        this.round = round;
        this.RECT_COUNT = RECT_COUNT;
        this.POIS_COUNT = POIS_COUNT;
        this.PULS_COUNT = PULS_COUNT;
        this.TURRET_COUNT = TURRET_COUNT;
        this.SWING_RECT_SIZE = { w: 60, h: 10 }
        this.shopPrices = {
            grenade: grenadeCost,
            shield: shieldCost,
            bomb: bombCost,
            health: healthCost,
            damage: damageCost
        };
        this.cashRecieved = cashRecieved;
    }
    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    spawnTurret(area) {
        const w = 30;
        const h = 30;
        let x, y;

    // Randomly choose one of four edges: top, bottom, left, right
        const edge = Math.floor(Math.random() * 4);
        switch (edge) {
            case 0: // top
                x = Math.random() * (area.canvas.width - w);
                y = 0;
                break;
            case 1: // bottom
                x = Math.random() * (area.canvas.width - w);
                y = area.canvas.height - h;
                break;
            case 2: // left
                x = 0;
                y = Math.random() * (area.canvas.height - h);
                break;
            case 3: // right
                x = area.canvas.width - w;
                y = Math.random() * (area.canvas.height - h);
                break;
        }
        const turret = new TurretRectangle(x, y, w, h, "blue");
        area.addRectangle(turret);

        return turret;
    }

    spawnBullet(area, turret) {
        const center = turret.returnLocation();
        const cursor = cursorTracker.getPosition();

        // Compute direction vector
        const dx = cursor.x - center.x;
        const dy = cursor.y - center.y;
        const mag = Math.sqrt(dx*dx + dy*dy);
        const speed = 5; // pixels per frame

        const vx = (dx / mag) * speed;
        const vy = (dy / mag) * speed;

        const bullet = new BulletRectangle(center.x - 5, center.y - 5, 5, 5, "black");
        bullet.setSpeed(vx, vy);
        return bullet;
    }

    // Spawn a grenade at the cursor position
    createGrenade() {
        const pos = cursorTracker.getPosition();
        const grenade = new Grenade(pos.x - 7, pos.y - 7, 15, 15, );
        grenade.setSpeed(0, 0);
        return grenade;
    }

    createAmazingRectangles(area, count, count1, count2, count3) {
        const rects = [];
        for (let i = 0; i < count; i++) {
            const w = this.randomBetween(30, 55);
            const x = this.randomBetween(0, area.canvas.width - w);
            const y = this.randomBetween(0, area.canvas.height - w);
            const rect = new AmazingRectangle(x, y, w, w, 'pink');
            rect.setHealth(this.health1);
            rects.push(rect);
            area.addRectangle(rect);
        }
        for (let i = 0; i < count1; i++) {
            const w = this.randomBetween(30, 55);
            const x = this.randomBetween(0, area.canvas.width - w);
            const y = this.randomBetween(0, area.canvas.height - w);
            const rect = new AmazingRectangle(x, y, w, w, 'limegreen');
            rect.setPoisonous(true);
            rects.push(rect);
            area.addRectangle(rect);
        }
        for (let i = 0; i < count2; i++) {
            const w = 35;
            const h = 35;
            const x = this.randomBetween(0, area.canvas.width - w);
            const y = this.randomBetween(0, area.canvas.height - h);
            const rect = new PulsingRectangle(x, y, w, h, 'purple');
            rects.push(rect);
            area.addRectangle(rect);
        }
        for (let i = 0; i < count3; i++) {
            const turret = this.spawnTurret(area);
            rects.push(turret);
        }
        return rects;
    }

    createSwingingRectangle(area,health) {
        const x = area.canvas.width / 2;
        const y = area.canvas.height / 2;
        this.swing = new SwingingRectangle(x, y, this.SWING_RECT_SIZE.w, this.SWING_RECT_SIZE.h, 0);
        this.swing.color = 'orange';
        area.addRectangle(this.swing);
        // rotation control
        this.swing.isRotating = false;
        // degrees per second
        this.swing.rotationSpeed = 540;
        this.swing.setHealth(health);
        return this.swing;
    }

    applyCursorRepulsion(rectangles, cursorProvider) {
        // For each rectangle, if the cursor is within a certain radius, push rectangle away
        const REPULSE_RADIUS = 120;
        const REPULSE_FORCE = 3;

        return function updateRepulsion() {
            const pos = cursorProvider();
            rectangles.forEach(rect => {
                // compute center of rectangle
                if (rect instanceof AmazingRectangle && !rect.getPoisonous()) {
                    const cx = rect.x + rect.width / 2;
                    const cy = rect.y + rect.height / 2;
                    const dx = cx - pos.x;
                    const dy = cy - pos.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist > 0 && dist < REPULSE_RADIUS) {
                        // normalized vector away from cursor
                        const nx = dx / dist;
                        const ny = dy / dist;
                        // apply movement scaled by force and proximity
                        const strength = (1 - dist / REPULSE_RADIUS) * REPULSE_FORCE;
                        rect.x += nx * strength * 8;
                        rect.y += ny * strength * 8;
                    }
                }
            });
        };
    }
    setGameReference(game) {
        this.game = game;
    }
    startApp() {
        const self = this;
        const canvas = document.getElementById('drawingArea');
        if (!canvas) {
            console.error('Canvas with id drawingCanvas not found in DOM');
            return;
        }

        self.area = new DrawingArea(canvas);
        // Expose canvas globally for legacy code that references `canvas` directly
        window.canvas = canvas;
        const amazingRects = this.createAmazingRectangles(self.area, this.RECT_COUNT, this.POIS_COUNT, this.PULS_COUNT, this.TURRET_COUNT);
        self.swing = self.createSwingingRectangle(self.area,self.health);
        // If a desired swing health was provided by Game (e.g., after buying health), apply it here.
        // This ensures the actual SwingingRectangle object has its max/current health set
        // to the player's upgraded value when a new round starts.
        try {
            const desired = (typeof this.desiredSwingHealth === 'number') ? this.desiredSwingHealth : (this.health || 1);
            if (self.swing && typeof self.swing.setHealth === 'function') {
                self.swing.setHealth(desired);
            }
        } catch (e) {
            // defensive: ignore if anything goes wrong (leaves default health)
            console.warn('Failed to apply desired swing health:', e);
        }

        // Initialize cursor tracker with canvas and spinning rectangle
        cursorTracker.init({ canvas: canvas, spinningRectangle: self.swing });

        // Load HUD icons (use the images placed in public/images/)
        try {
            self.hudIcons = {
                grenade: new Image(),
                shield: new Image(),
                bomb: new Image()
            };
            self.hudIcons.grenade.src = 'images/Grenade.jpg';
            self.hudIcons.shield.src = 'images/Shield.webp';
            self.hudIcons.bomb.src = 'images/Bomb.webp';
        } catch (e) {
            console.warn('Failed to initialize HUD icons', e);
            self.hudIcons = null;
        }

        // Set up repulsion updater
        const repulse = this.applyCursorRepulsion(amazingRects, () => cursorTracker.getPosition());

        // Update shop button labels to reflect current shop prices (keep HTML static but dynamic labels)
        try {
            const btnG = document.getElementById('buyGrenade');
            const btnS = document.getElementById('buyShield');
            const btnB = document.getElementById('buyBomb');
            const btnH = document.getElementById('buyHealth');
            const btnD = document.getElementById('buyDamage');
                if (btnG) btnG.textContent = `$${(self.game.grenadeCost).toFixed(2)}`;
                if (btnS) btnS.textContent = `$${(self.game.shieldCost).toFixed(2)}`;
                if (btnB) btnB.textContent = `$${(self.game.bombCost).toFixed(2)}`;
                if (btnH) btnH.textContent = `$${(self.game.healthCost).toFixed(2)}`;
                if (btnD) btnD.textContent = `$${(self.game.damageCost).toFixed(2)}`;
        } catch (e) {
            console.warn('Failed to set shop price labels:', e);
        }

        // Wrap rectangle update methods to include repulsion per frame
        // We'll call repulse() from the DrawingArea draw loop by monkey-patching area.draw
        const originalDraw = self.area.draw.bind(self.area);
        let gameState=true;
        const start = Date.now();
        let lastDamageTime = 0; // global cooldown for all damage (1 second)
        function canTakeDamage(cooldownMs = 750) {
            const now = performance.now();
            if (now - lastDamageTime >= cooldownMs) {
                lastDamageTime = now;
                return true;
            }
            return false;
        }
    
    let paused = false;
    let isShop = false;
    // Prevent OS key-repeat from consuming multiple items per press
    const oneShotKeys = { '1': false, '2': false, '3': false };
        // helper to draw the HUD (called from multiple places, including shop)
        const drawHUD = function() {
            const ctx = self.area.context;
            const hudWidth = 260;
            const hudHeight = 56;
            const x = (self.area.canvas.width - hudWidth) / 2;
            const y = 12; // distance from top

            ctx.save();
            // background
            ctx.fillStyle = 'rgba(0,0,0,0.35)';
            const radius = 10;
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + hudWidth - radius, y);
            ctx.quadraticCurveTo(x + hudWidth, y, x + hudWidth, y + radius);
            ctx.lineTo(x + hudWidth, y + hudHeight - radius);
            ctx.quadraticCurveTo(x + hudWidth, y + hudHeight, x + hudWidth - radius, y + hudHeight);
            ctx.lineTo(x + radius, y + hudHeight);
            ctx.quadraticCurveTo(x, y + hudHeight, x, y + hudHeight - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.fill();

            // icons and counts
            const slotW = hudWidth / 3;
            const iconXOffsets = [x + slotW * 0 + slotW / 2, x + slotW * 1 + slotW / 2, x + slotW * 2 + slotW / 2];
            const iconY = y + hudHeight / 2;
            const iconSize = 28;

            // grenade icon
            if (self.hudIcons && self.hudIcons.grenade && self.hudIcons.grenade.complete && self.hudIcons.grenade.naturalWidth) {
                ctx.drawImage(self.hudIcons.grenade, iconXOffsets[0] - 28 - iconSize/2, iconY - iconSize/2, iconSize, iconSize);
            } else {
                ctx.beginPath();
                ctx.fillStyle = '#8BC34A';
                ctx.arc(iconXOffsets[0] - 28, iconY, 12, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.fillStyle = 'black';
            ctx.font = '16px Orbitron';
            ctx.textAlign = 'left';
            ctx.fillText(`x ${self.Grenades || 0}`, iconXOffsets[0] - 12, iconY + 6);

            // shield icon
            if (self.hudIcons && self.hudIcons.shield && self.hudIcons.shield.complete && self.hudIcons.shield.naturalWidth) {
                ctx.drawImage(self.hudIcons.shield, iconXOffsets[1] - 28 - iconSize/2, iconY - iconSize/2, iconSize, iconSize);
            } else {
                const sx = iconXOffsets[1] - 28;
                ctx.fillStyle = '#03A9F4';
                ctx.beginPath();
                ctx.moveTo(sx, iconY - 12);
                ctx.lineTo(sx + 14, iconY - 2);
                ctx.lineTo(sx, iconY + 14);
                ctx.closePath();
                ctx.fill();
            }
            ctx.fillStyle = 'black';
            ctx.fillText(`x ${self.Shields || 0}`, iconXOffsets[1] - 12, iconY + 6);

            // bomb icon
            if (self.hudIcons && self.hudIcons.bomb && self.hudIcons.bomb.complete && self.hudIcons.bomb.naturalWidth) {
                ctx.drawImage(self.hudIcons.bomb, iconXOffsets[2] - 28 - iconSize/2, iconY - iconSize/2, iconSize, iconSize);
            } else {
                const bx = iconXOffsets[2] - 28;
                ctx.fillStyle = '#FF7043';
                ctx.fillRect(bx - 12, iconY - 12, 18, 18);
            }
            ctx.fillStyle = 'black';
            ctx.fillText(`x ${self.Bombs || 0}`, iconXOffsets[2] - 12, iconY + 6);

            ctx.restore();
            self.game.updateCost();
        };

        self.area.draw = function(time) {
            if (isShop) {
                // keep game visually looping but skip updates
                requestAnimationFrame(self.area.draw);

                const shopPopup = document.getElementById('popupShop');
                const cashDisplay = document.getElementById('shopCashDisplay');

                // show the shop modal
                shopPopup.style.display = 'flex';

                // show current cash (safe fallback)
                function updateShopDisplay() {
                    const totalCash = (self.game && typeof self.game.totalCash === 'number') ? self.game.totalCash : 0;
                    // show with 2 decimals
                    cashDisplay.textContent = `Cash: $${totalCash.toFixed(2)}`;

                    // Update all shop button prices (declare once)
                    const btnG = document.getElementById('buyGrenade');
                    const btnS = document.getElementById('buyShield');
                    const btnB = document.getElementById('buyBomb');
                    const btnH = document.getElementById('buyHealth');
                    const btnD = document.getElementById('buyDamage');

                    if (btnG) btnG.textContent = `$${self.game.grenadeCost.toFixed(2)}`;
                    if (btnS) btnS.textContent = `$${self.game.shieldCost.toFixed(2)}`;
                    if (btnB) btnB.textContent = `$${self.game.bombCost.toFixed(2)}`;
                    if (btnH) btnH.textContent = `$${self.game.healthCost.toFixed(2)}`;
                    if (btnD) btnD.textContent = `$${self.game.damageCost.toFixed(2)}`;
                }
                // Buy handlers
                document.getElementById('buyGrenade').onclick = () => {
                    const total = self.game?.totalCash ?? 0;
                        if (total >= self.game.grenadeCost) {
                            if (self.game) self.game.totalCash -= self.game.grenadeCost;
                        self.Grenades = (self.Grenades || 0) + 1;
                        if (self.game) {
                            self.game.playerStats.grenades = self.Grenades;
                            self.game.grenadeTimes++; // track purchase count
                                self.game.updateCost(); // update costs immediately
                        }
                        updateShopDisplay();
                    }
                };

                document.getElementById('buyShield').onclick = () => {
                    const total = self.game?.totalCash ?? 0;
                        if (total >= self.game.shieldCost) {
                            if (self.game) self.game.totalCash -= self.game.shieldCost;
                        self.Shields = (self.Shields || 0) + 1;
                        if (self.game) {
                            self.game.playerStats.shields = self.Shields;
                            self.game.shieldTimes++; // track purchase count
                                self.game.updateCost(); // update costs immediately
                        }
                        updateShopDisplay();
                    }
                };

                document.getElementById('buyBomb').onclick = () => {
                    const total = self.game?.totalCash ?? 0;
                    if (total >= self.game.bombCost) {
                        if (self.game) self.game.totalCash -= self.game.bombCost;
                        self.Bombs = (self.Bombs || 0) + 1;
                        if (self.game) {
                            self.game.playerStats.bombs = self.Bombs;
                            self.game.bombTimes++; // track purchase count
                            self.game.updateCost();
                        }
                        updateShopDisplay();
                    }
                };

                document.getElementById('buyHealth').onclick = () => {
                    const total = self.game?.totalCash ?? 0;
                    if (total >= self.game.healthCost) {
                        if (self.game) self.game.totalCash -= self.game.healthCost;
                        // increase swing max health (your SwingingRectangle should read this value when set)
                        self.swing.maxHealth = (self.swing.maxHealth || 0) + 1.5;
                        self.swing.health+=1.5;
                        if (self.game) {
                            self.game.playerStats.health = self.swing.maxHealth;
                            self.game.healthTimes++; // track purchase count
                            self.game.updateCost();
                        }
                        updateShopDisplay();
                    }
                };

                document.getElementById('buyDamage').onclick = () => {
                    const total = self.game?.totalCash ?? 0;
                    if (total >= self.game.damageCost) {
                        if (self.game) self.game.totalCash -= self.game.damageCost;
                        // increase damage applied by swing
                        self.damage = (self.damage || 0) + 2;
                        if (self.game) {
                            self.game.playerStats.damage = self.damage;
                            self.game.damageTimes++; // track purchase count
                            self.game.updateCost();
                        }
                        updateShopDisplay();
                    }
                };

                 // Resume (close shop and resume the game)
                document.getElementById('Resume1').onclick = () => {
                    lastDamageTime = performance.now(); // keep your damage timers from immediately triggering
                    shopPopup.style.display = 'none';
                    isShop = false;
                    // note: continue game loop (we're already inside draw)
                };

                // Exit to home (prefer to save & go home via Game.goHome, fallback to reload)
                document.getElementById('BackHome1').onclick = () => {
                    // Ensure we fully stop the game loop and clear rectangles before navigating home.
                    // This prevents the draw loop from later detecting a win (track===0) and
                    // incrementing the round while we're trying to go home from the shop.
                    isShop = false;
                    shopPopup.style.display = 'none';
                    try {
                        // stop the drawing loop if possible
                        if (self.area && typeof self.area.stop === 'function') self.area.stop();
                        // clear rectangles so win detection won't trigger
                        if (self.area && Array.isArray(self.area.rectangles)) self.area.rectangles = [];
                        // guard the in-loop game state
                        gameState = false;
                    } catch (e) {
                        console.warn('Error while stopping area before going home:', e);
                    }
                    if (self.game && typeof self.game.goHome === 'function') {
                        try {
                            self.game.goHome();
                        } catch (e) {
                            console.error('goHome() failed from shop exit, reloading instead', e);
                            location.reload();
                        }
                    } else {
                        location.reload();
                    }
                };
                // update the cash display each frame while shop open
                updateShopDisplay();

                // Draw a static frame (no updates) so HUD & counts reflect purchases while shop is open
                try {
                    self.area.clear();
                    // draw background grid
                    self.area.drawGrid(50);
                    // draw all rectangles but do not call their update methods
                    self.area.rectangles.forEach(rect => {
                        if (rect && typeof rect.draw === 'function') rect.draw(self.area.context);
                    });
                    // draw HUD showing current counts
                    drawHUD();
                } catch (e) {
                    // non-fatal; still continue
                    console.warn('Error drawing static shop frame', e);
                }

                return; // skip the rest of updates/collisions this frame
            }
                        if (paused) {
                            requestAnimationFrame(self.area.draw); // keep looping but frozen
                            const pausePopup = document.getElementById('PausePopup');
                            pausePopup.style.display = 'flex'; // shows the modal (uses flex centering)
                            const Resume = document.getElementById('Resume');
                            const returnHome = document.getElementById('BackHome');   
                            Resume.onclick = () => {
                                lastDamageTime = performance.now();
                                pausePopup.style.display = 'none';
                                paused = false;
                            };
                            returnHome.onclick = () => {
                                // Ensure we fully stop the game loop and clear rectangles before navigating home
                                // This prevents the draw loop from detecting a win (track===0) while we're
                                // trying to go home from the pause screen.
                                paused = false;
                                pausePopup.style.display = 'none';
                                try {
                                    if (self.area && typeof self.area.stop === 'function') self.area.stop();
                                    if (self.area && Array.isArray(self.area.rectangles)) self.area.rectangles = [];
                                    gameState = false;
                                } catch (e) {
                                    console.warn('Error while stopping area before going home from pause:', e);
                                }
                                if (self.game && typeof self.game.goHome === 'function') {
                                    try {
                                        self.game.goHome();
                                    } catch (e) {
                                        console.error('goHome() failed from pause exit, reloading instead', e);
                                        location.reload();
                                    }
                                } else {
                                    location.reload();
                                }
                            };
                            return; // skip updating positions, collisions, etc.
                        }
            self.game.updateCost();
            const end = Date.now();
            repulse();
            let gameOver=false;
            // compute dt from previous frame (seconds)
            const dt = self.area.lastTime ? (time - self.area.lastTime) / 1000 : 0;
            // update swinging rectangle with cursor position (SwingingRectangle expects cursor args)
            if (typeof self.swing.update === 'function') {
                const pos = cursorTracker.getPosition();
                self.swing.update(pos.x, pos.y, canvas, dt);
            }
            // advance rotation if active
            if (self.swing.isRotating) {
                self.swing.swingAngle = (self.swing.swingAngle + self.swing.rotationSpeed * dt) % 360;
            }
            // Collision detection: remove amazing rectangles that intersect the swinging rectangle
            const swingBox = { x: self.swing.x, y: self.swing.y, w: self.swing.width, h: self.swing.height };
            self.area.rectangles = self.area.rectangles.filter(rect => {
                // leave rectangles that are not AmazingRectangle (e.g., the swing itself)
                if (rect === self.swing) return true;
                const a = { x: rect.x, y: rect.y, w: rect.width, h: rect.height };
                const intersect = !(a.x + a.w < swingBox.x || a.x > swingBox.x + swingBox.w ||
                                    a.y + a.h < swingBox.y || a.y > swingBox.y + swingBox.h);
                // only remove if currently rotating and the rectangle is NOT poisonous
                if (rect instanceof AmazingRectangle) {
                    const isPoisonous = (typeof rect.getPoisonous === 'function') ? rect.getPoisonous() : false;
                    if (intersect && self.swing.isRotating && !isPoisonous) {
                        if (rect.getHealth()<=self.damage) {
                            if (self.game) self.game.totalCash += self.cashRecieved;      
                            return false;
                        }
                        else {
                            rect.removeHealth(self.damage);
                            return true;
                        }
                    }
                    if (intersect && isPoisonous && !self.swing.getShield()&&canTakeDamage(650)) {
                        if (self.swing.getHealth()<= self.damage1) {
                            gameOver = true;
                        }
                        else {
                            self.swing.removeHealth(self.damage1);
                        }
                    }
                }
                // if the type of rectangle is pusling rectangle
                if (rect instanceof PulsingRectangle) {
                    const corners = [
                        {x: swingBox.x, y: swingBox.y},
                        {x: swingBox.x + swingBox.w, y: swingBox.y},
                        {x: swingBox.x, y: swingBox.y + swingBox.h},
                        {x: swingBox.x + swingBox.w, y: swingBox.y + swingBox.h}
                    ];
                    for (const corner of corners) {
                        if (rect.isPointIn(corner.x, corner.y)&&rect.Pulsing()&&!self.swing.getShield()&&canTakeDamage(650)) {
                            if (self.swing.getHealth()<=self.damage1) {
                                gameOver = true;
                            }
                            else {
                                self.swing.removeHealth(self.damage1);
                            }
                        }
                    }
                }
                if (rect instanceof BulletRectangle) {
                    if (rect.isOffCanvas()) return false; // remove bullet if off-canvas
                    if (intersect&&!self.swing.getShield()&&canTakeDamage(650)) {
                        if (self.swing.getHealth()<=self.damage1) {
                            gameOver = true;
                        }
                        else {
                            self.swing.removeHealth(self.damage1);
                        }
                    }
                }

                return true;
            
            });
            // Create an array to track grenades that exploded this frame
            let grenadesToExplode = [];

            self.area.rectangles = self.area.rectangles.filter(rect => {
                // your other logic (swing collisions, etc.)

                if (rect instanceof Grenade) {
                    rect.update(dt);
                    if (rect.getExplode()) grenadesToExplode.push(rect); // mark for explosion
                    if (rect.Disappear()) return false; // remove after done exploding
                }

                return true;
            });

            // Now, handle explosions AFTER the filter (safe and clean)
            for (const grenade of grenadesToExplode) {
                self.area.rectangles = self.area.rectangles.filter(r => {
                    if (r === grenade) return true; // don't delete the grenade itself yet
                    if (r === self.swing) return true; // don't delete the swing rectangle
                    const rx = r.x + r.width / 2;
                    const ry = r.y + r.height / 2;
                    if (grenade.isWithin(rx, ry)) {
                        if (r instanceof AmazingRectangle) {
                            if (self.game) self.game.totalCash += self.cashRecieved;
                        }
                        return false;
                    } // keep rectangles outside explosion radius
                    return true;
                });
            }

            self.area.rectangles.forEach(rect => {
            if (rect instanceof TurretRectangle && rect.canFire()) {
                const bullet = self.spawnBullet(self.area, rect);
                if (bullet) {
                    amazingRects.push(bullet);
                    // Ensure the bullet is part of the drawing area's rectangles so
                    // it will receive updates and be drawn
                    if (self.area && typeof self.area.addRectangle === 'function') {
                        self.area.addRectangle(bullet);
                    }
                }
                rect.resetCooldown();
            }
            });
            if (gameState&&end-start>650) {
                if (gameOver) {
                    gameState=false;
                    self.area.rectangles=[];
                    // Stop drawing / freeze the game if possible
                    if (self.area.stop) self.area.stop();

                    // Show popup
                    const popup = document.getElementById('losePopup');
                    popup.style.display = 'flex'; // shows the modal (uses flex centering)

                    // Set up button to close popup
                    const playBtn = document.getElementById('losePlayAgain');
                    const okBtn = document.getElementById('loseOK');
                    playBtn.onclick = () => {
                        // Try to start a fresh game (round 1) without reloading the page.
                        // If we have access to the Game constructor via the current game instance,
                        // construct a new Game with the original initial params used in Game.main.
                        // Fallback: reload the page.
                        try {
                            popup.style.display = 'none';
                            if (self.game && typeof self.game.constructor === 'function') {
                                const GameCtor = self.game.constructor;
                                // These initial values match Game.main defaults used at startup.
                                // clear any saved progress on loss - cannot resume after losing
                                if (GameCtor.clearSavedGame) {
                                    try { GameCtor.clearSavedGame(); } catch (e) { /* ignore */ }
                                }
                                const newGame = new GameCtor(5, 3, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1);
                                // Hide home background video when a new game starts programmatically
                                try { const video = document.getElementById('homeBgVideo'); if (video) video.style.display = 'none'; } catch (e) {}
                                newGame.start();
                            } else {
                                // fallback to reload if we can't construct a new Game
                                if (self.game && typeof self.game.goHome === 'function') self.game.goHome();
                                else location.reload();
                            }
                        } catch (e) {
                            console.error('Failed to start fresh game programmatically, reloading instead.', e);
                            location.reload();
                        }
                    };
                    okBtn.onclick = () => {
                        popup.style.display = 'none';
                        // Ensure any previously saved game is erased so Resume cannot restore a lost session
                        try {
                            if (self.game && self.game.constructor && typeof self.game.constructor.clearSavedGame === 'function') {
                                try { self.game.constructor.clearSavedGame(); } catch (e) { /* ignore */ }
                            } else if (window && window.localStorage) {
                                try { window.localStorage.removeItem('amazingRectSavedGame_v1'); } catch (e) { /* ignore */ }
                            }
                        } catch (e) { /* ignore */ }

                        // Return home without saving (prevents creating a resume after losing)
                        if (self.game && typeof self.game.goHome === 'function') {
                            try { self.game.goHome(false); } catch (e) { console.error(e); location.reload(); }
                        } else {
                            location.reload(); // reload page to restart game
                        }
                    }
                    return; // stop drawing loop
                };
            }
            let track=0;
            for (let i=0;i<self.area.getRectangles().length;i++) {
                if (self.area.getRectangles()[i] instanceof AmazingRectangle && !self.area.getRectangles()[i].getPoisonous()) {
                    track++;
                }
            }

            if (gameState) {
                if (track===0) {
                    // Stop drawing / freeze the game and show the YouWin popup.
                    // The actual round increment and scaling is handled by Game.nextRound()
                    // when the player clicks Next Round.
                    gameState = false;
                    self.area.rectangles = [];
                    if (self.area.stop) self.area.stop();
                    const popup1 = document.getElementById('YouWin');
                    popup1.style.display = 'flex'; // shows the modal (uses flex centering)

                    const Exit = document.getElementById('Exit');
                    const PlayAgain = document.getElementById('PlayAgain');
                    // Math quiz wiring: appears above YouWin, no penalty
                    const mathPopup = document.getElementById('MathQuizPopup');
                    const mathQEl = document.getElementById('mathQuestion');
                    const mathInput = document.getElementById('mathAnswer');
                    const mathSubmit = document.getElementById('submitMath');
                    const mathSkip = document.getElementById('skipMath');
                    const mathFeedback = document.getElementById('mathFeedback');
                    let currentAnswer = null;
                    function generateMath() {
                        // simple + or - with small integers
                        const a = Math.floor(Math.random()*20)+1; // 1..20
                        const b = Math.floor(Math.random()*20)+1;
                        const plus = Math.random() < 0.6; // bias toward addition
                        if (plus) {
                            currentAnswer = a + b;
                            mathQEl.textContent = `${a} + ${b} = ?`;
                        } else {
                            // ensure non-negative
                            const x = Math.max(a, b);
                            const y = Math.min(a, b);
                            currentAnswer = x - y;
                            mathQEl.textContent = `${x} - ${y} = ?`;
                        }
                        mathInput.value = '';
                        mathFeedback.textContent = '';
                    }
                    function showMath() {
                        if (mathPopup) mathPopup.style.display = 'flex';
                        try { mathInput.focus(); } catch(e){}
                    }
                    function hideMath() {
                        if (mathPopup) mathPopup.style.display = 'none';
                    }
                    mathSubmit.onclick = () => {
                        const val = parseInt((mathInput.value||'').trim(), 10);
                        if (Number.isNaN(val)) {
                            mathFeedback.textContent = 'Please enter a number';
                            return;
                        }
                        if (val === currentAnswer) {
                            mathFeedback.textContent = 'Correct!';
                            setTimeout(() => { hideMath(); }, 1000);
                        } else {
                            mathFeedback.textContent = `Not quite — correct answer is ${currentAnswer}`;
                            setTimeout(() => { hideMath(); }, 2000);
                        }
                        // hide quiz after short delay so user sees feedback
                    };
                    mathSkip.onclick = () => { hideMath(); };
                    
                    PlayAgain.onclick = () => {
                        popup1.style.display = 'none';
                        if (self.game && typeof self.game.nextRound === 'function') {
                            self.game.nextRound();
                        } else {
                            console.warn('Game reference not set on app1');
                        }
                    };
                    // Show math quiz above the YouWin popup (no penalty) only if enabled in prefs
                    try {
                        const GameClass = (self && self.game && self.game.constructor) ? self.game.constructor : (window && window.Game) ? window.Game : null;
                        const enabled = GameClass && typeof GameClass.isMathPracticeEnabled === 'function' ? GameClass.isMathPracticeEnabled() : true;
                        if (enabled) { try { generateMath(); showMath(); } catch(e) { console.warn('Failed to show math quiz', e); } }
                    } catch (e) { console.warn('Failed to determine math preference', e); }
                    Exit.onclick = () => {
                        popup1.style.display = 'none';
                        if (self.game && typeof self.game.goHome === 'function') self.game.goHome();
                        else location.reload();
                    };
                
                    return; // stop drawing loop
                };
            }
        originalDraw(time);
        if (flashTime > 0) {
                flashTime -= dt;
                // Draw orange overlay
                self.area.context.fillStyle = 'orange';
                self.area.context.fillRect(0, 0, self.area.canvas.width, self.area.canvas.height);

                // When the flash finishes, show the popup
                if (flashTime <= 0 && flashTriggered) {
                    flashTriggered = false; // reset
                    gameState = false;
                    // Show YouWin popup
                    const popup = document.getElementById('YouWin');
                    popup.style.display = 'flex';
                    // setup PlayAgain / Exit buttons as usual
                    const Exit = document.getElementById('Exit');
                    const PlayAgain = document.getElementById('PlayAgain');
                    PlayAgain.onclick = () => {
                        popup.style.display = 'none';
                        if (self.game && typeof self.game.nextRound === 'function') {
                            self.game.nextRound();
                        } else {
                            console.warn('Game reference not set on app1');
                        }
                    }
                    Exit.onclick = () => {
                        popup.style.display = 'none';
                        if (self.game && typeof self.game.goHome === 'function') self.game.goHome();
                        else location.reload();
                    };
                    return; // stop drawing loop
                }
            }
        const ctx = self.area.context;
        ctx.save();
        ctx.font = "22px Orbitron";
        ctx.fillStyle = "black";
        ctx.textAlign = "left";
        ctx.fillText(`Round: ${self.round}`, 13, 30);
        ctx.restore();
        ctx.save();
        ctx.font = "22px Orbitron";
        ctx.fillStyle = "black";
        ctx.textAlign = "left";
        const totalCash = self.game?.totalCash ?? 0; // fallback to 0 if undefined
        ctx.fillText(`Cash: ${totalCash.toFixed(2)}`, 13, 60);
        ctx.restore();
        ctx.save();
        ctx.font = "20px Orbitron";
        ctx.fillStyle = "black";
        ctx.textAlign = "right";
        ctx.fillText(`Esc To Pause`, self.area.canvas.width - 20 , 30);
        ctx.restore();
        ctx.save();
        ctx.font = "20px Orbitron";
        ctx.fillStyle = "black";
        ctx.textAlign = "right";
        ctx.fillText(`E For Shop`, self.area.canvas.width - 20 , 60);
        ctx.restore();
        // Draw top-center HUD for grenades, shields, bombs
        (function drawHUD() {
            const ctx = self.area.context;
            const hudWidth = 260;
            const hudHeight = 56;
            const x = (self.area.canvas.width - hudWidth) / 2;
            const y = 12; // distance from top

            // (semi-transparent rounded rectangle)
            ctx.save();
            ctx.fillStyle = 'rgba(0,0,0,0.35)';
            const radius = 10;
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + hudWidth - radius, y);
            ctx.quadraticCurveTo(x + hudWidth, y, x + hudWidth, y + radius);
            ctx.lineTo(x + hudWidth, y + hudHeight - radius);
            ctx.quadraticCurveTo(x + hudWidth, y + hudHeight, x + hudWidth - radius, y + hudHeight);
            ctx.lineTo(x + radius, y + hudHeight);
            ctx.quadraticCurveTo(x, y + hudHeight, x, y + hudHeight - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.fill();

            // layout: three slots
            const slotW = hudWidth / 3;
            const iconXOffsets = [x + slotW * 0 + slotW / 2, x + slotW * 1 + slotW / 2, x + slotW * 2 + slotW / 2];
            const iconY = y + hudHeight / 2;

            // Draw icons (use images if loaded, otherwise fallback to simple shapes)
            const iconSize = 28;

            // grenade
            if (self.hudIcons && self.hudIcons.grenade && self.hudIcons.grenade.complete && self.hudIcons.grenade.naturalWidth) {
                ctx.drawImage(self.hudIcons.grenade, iconXOffsets[0] - 28 - iconSize/2, iconY - iconSize/2, iconSize, iconSize);
            } else {
                ctx.beginPath();
                ctx.fillStyle = '#8BC34A';
                ctx.arc(iconXOffsets[0] - 28, iconY, 12, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.fillStyle = 'black';
            ctx.font = '16px Orbitron';
            ctx.textAlign = 'left';
            ctx.fillText(`x ${self.Grenades || 0}`, iconXOffsets[0] - 12, iconY + 6);

            // shield
            if (self.hudIcons && self.hudIcons.shield && self.hudIcons.shield.complete && self.hudIcons.shield.naturalWidth) {
                ctx.drawImage(self.hudIcons.shield, iconXOffsets[1] - 28 - iconSize/2, iconY - iconSize/2, iconSize, iconSize);
            } else {
                const sx = iconXOffsets[1] - 28;
                ctx.fillStyle = '#03A9F4';
                ctx.beginPath();
                ctx.moveTo(sx, iconY - 12);
                ctx.lineTo(sx + 14, iconY - 2);
                ctx.lineTo(sx, iconY + 14);
                ctx.closePath();
                ctx.fill();
            }
            ctx.fillStyle = 'black';
            ctx.fillText(`x ${self.Shields || 0}`, iconXOffsets[1] - 12, iconY + 6);

            // bomb
            if (self.hudIcons && self.hudIcons.bomb && self.hudIcons.bomb.complete && self.hudIcons.bomb.naturalWidth) {
                ctx.drawImage(self.hudIcons.bomb, iconXOffsets[2] - 28 - iconSize/2, iconY - iconSize/2, iconSize, iconSize);
            } else {
                const bx = iconXOffsets[2] - 28;
                ctx.fillStyle = '#FF7043';
                ctx.fillRect(bx - 12, iconY - 12, 18, 18);
            }
            ctx.fillStyle = 'black';
            ctx.fillText(`x ${self.Bombs || 0}`, iconXOffsets[2] - 12, iconY + 6);

            ctx.restore();
        })();
    }

        self.area.start();
        console.log('Amazing Rectangles app started');
    // keep per-app active grenade on the instance so global handlers can access it
    self.activeGrenade = null;
        let flashTime = 0; // how long the orange flash should show
        let flashTriggered = false;
        // Keyboard handling: expose per-app handlers and bridge via a single global listener
        // store one-shot keys on the instance so separate app instances don't conflict
        self.oneShotKeys = { '1': false, '2': false, '3': false };

        // attach per-app key handlers (referencing local variables like amazingRects)
        self._handleKeyDown = function(e) {
            if (e.key === 'e') {
                isShop = true;;
            }
            if (e.code === 'Space' || e.key === 'Esc' || e.key === 'Escape') {
                paused = true;
            }
            if (e.key === '2' && self.Bombs > 0 && gameState === true) {
                if (!self.oneShotKeys['2']) {
                    const pos = cursorTracker.getPosition();
                    self.oneShotKeys['2'] = true;
                    self.game.playerStats.bombs--;
                    const bomb = new AbstractRectangle(pos.x,pos.y,27,27);
                    amazingRects.push(bomb);
                    self.area.addRectangle(bomb);
                    setTimeout(function() {
                        // Apply bomb effect: remove all amazing rectangles except the swinging rectangle
                    self.area.rectangles.forEach(rect => {
                        if (rect instanceof AmazingRectangle) {
                            if (self.game) self.game.totalCash += self.cashRecieved;
                        }
                    });
                    // Remove all rectangles except the swinging rectangle
                    self.area.rectangles = self.area.rectangles.filter(rect => rect === self.swing);
                    amazingRects.length = 0; // clear tracked rectangles
                    flashTime = 0.15; // duration of flash
                    flashTriggered = true; // mark that this is the special flash event
                    self.Bombs--;
                    }, 750);
                }
            }
            if (e.key === '3' && !self.swing.getShield() && self.Shields > 0 && gameState === true) {
                if (!self.oneShotKeys['3']) {
                    self.oneShotKeys['3'] = true;
                    self.swing.setShield(true);
                    self.game.playerStats.shields--;
                    self.Shields--;
                }
            }
            if (e.key === 'r' || e.key === 'R') {
                self.swing.isRotating = true;
            }
            if (e.key === '1' && self.Grenades > 0 && gameState === true) {
                if (!self.oneShotKeys['1']) {
                    self.oneShotKeys['1'] = true;
                    // Spawn grenade at cursor, then decrement counts only if spawn succeeded
                    const grenade = self.createGrenade();
                    if (grenade) {
                        amazingRects.push(grenade);
                        self.area.addRectangle(grenade);
                        self.activeGrenade = grenade; // Store reference on instance
                        // decrement app-local count and sync to Game.playerStats
                        self.Grenades = (self.Grenades || 1) - 1;
                        if (self.game) self.game.playerStats.grenades = self.Grenades;
                    }
                }
            }
            if (self.activeGrenade) {
                const speed = 5;
                switch (e.key) {
                    case 'ArrowUp':
                        self.activeGrenade.setSpeed(0, -speed);
                        break;
                    case 'ArrowDown':
                        self.activeGrenade.setSpeed(0, speed);
                        break;
                    case 'ArrowLeft':
                        self.activeGrenade.setSpeed(-speed, 0);
                        break;
                    case 'ArrowRight':
                        self.activeGrenade.setSpeed(speed, 0);
                        break;
                }
            }
        };

        self._handleKeyUp = function(e) {
            if (e.key === 'r' || e.key === 'R') {
                self.swing.isRotating = false;
            }
            // reset one-shot guards when key released so the next press will consume an item
            if (e.key === '1' || e.key === '2' || e.key === '3') {
                if (self.oneShotKeys) self.oneShotKeys[e.key] = false;
            }
        };

        // expose this app as the current app for the global handlers
        window.__amazingRect_currentApp = self;

        // register the global bridge handlers once; they forward events to the current app
        if (!window.__amazingRect_handlersAdded) {
            window.__amazingRect_handlersAdded = true;
            window.__amazingRect_globalHandler = function(ev) {
                const app = window.__amazingRect_currentApp;
                if (!app) return;
                if (ev.type === 'keydown') app._handleKeyDown(ev);
                else if (ev.type === 'keyup') app._handleKeyUp(ev);
            };
            window.addEventListener('keydown', window.__amazingRect_globalHandler);
            window.addEventListener('keyup', window.__amazingRect_globalHandler);
        }

        // When this app is torn down / replaced, Game.startApp() will set window.__amazingRect_currentApp
        // to the new app so the same global handlers forward to the correct instance.
        if (self.activeGrenade && self.activeGrenade.Disappear()) {
            self.activeGrenade = null;
        }
    }
}

export default app1;
