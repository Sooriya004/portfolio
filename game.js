// Chrome-style Dinosaur Game with Anime Theme
const GAME_CONFIG = {
    gravity: 0.6,
    jumpForce: -15,
    groundY: 300,
    gameSpeed: 6,
    obstacleInterval: 1500
};

class Player {
    constructor() {
        this.width = 30;
        this.height = 50;
        this.x = 50;
        this.y = GAME_CONFIG.groundY;
        this.vy = 0;
        this.isJumping = false;
    }

    jump() {
        if (!this.isJumping) {
            this.vy = GAME_CONFIG.jumpForce;
            this.isJumping = true;
        }
    }

    update() {
        this.vy += GAME_CONFIG.gravity;
        this.y += this.vy;

        if (this.y > GAME_CONFIG.groundY) {
            this.y = GAME_CONFIG.groundY;
            this.vy = 0;
            this.isJumping = false;
        }
    }

    draw(ctx) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();

        // Head
        ctx.arc(this.x + this.width/2, this.y + 10, 8, 0, Math.PI * 2);
        
        // Body
        ctx.moveTo(this.x + this.width/2, this.y + 18);
        ctx.lineTo(this.x + this.width/2, this.y + 35);
        
        // Arms
        ctx.moveTo(this.x + this.width/2, this.y + 25);
        ctx.lineTo(this.x + this.width/2 - 10, this.y + 30);
        ctx.moveTo(this.x + this.width/2, this.y + 25);
        ctx.lineTo(this.x + this.width/2 + 10, this.y + 30);
        
        // Legs
        ctx.moveTo(this.x + this.width/2, this.y + 35);
        ctx.lineTo(this.x + this.width/2 - 8, this.y + 48);
        ctx.moveTo(this.x + this.width/2, this.y + 35);
        ctx.lineTo(this.x + this.width/2 + 8, this.y + 48);
        
        ctx.stroke();
    }
}

class Obstacle {
    constructor(canvasWidth) {
        this.width = 30;
        this.height = 50;
        this.x = canvasWidth;
        this.y = GAME_CONFIG.groundY + this.height/2;
        this.color = '#FF9B42'; // Using primary color for obstacle
    }

    update() {
        this.x -= GAME_CONFIG.gameSpeed;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y - this.height, this.width, this.height);
    }
}

class Game {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.score = 0;
        this.isGameOver = false;
        this.player = new Player();
        this.obstacles = [];
        this.lastObstacleTime = 0;

        document.getElementById('game-container').appendChild(this.canvas);
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.isGameOver) {
                    this.reset();
                } else {
                    this.player.jump();
                }
            }
        });

        this.canvas.addEventListener('click', () => {
            if (this.isGameOver) {
                this.reset();
            } else {
                this.player.jump();
            }
        });
    }

    reset() {
        this.score = 0;
        this.isGameOver = false;
        this.player = new Player();
        this.obstacles = [];
        this.lastObstacleTime = 0;
        this.gameLoop();
    }

    checkCollision(player, obstacle) {
        return player.x < obstacle.x + obstacle.width &&
               player.x + player.width > obstacle.x &&
               player.y < obstacle.y &&
               player.y + player.height > obstacle.y - obstacle.height;
    }

    update() {
        if (this.isGameOver) return;

        this.player.update();

        const currentTime = Date.now();
        if (currentTime - this.lastObstacleTime > GAME_CONFIG.obstacleInterval) {
            this.obstacles.push(new Obstacle(this.canvas.width));
            this.lastObstacleTime = currentTime;
        }

        this.obstacles = this.obstacles.filter(obstacle => {
            obstacle.update();
            if (this.checkCollision(this.player, obstacle)) {
                this.isGameOver = true;
            }
            return obstacle.x > -obstacle.width;
        });

        if (!this.isGameOver) {
            this.score++;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw ground
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(0, GAME_CONFIG.groundY + 50, this.canvas.width, 2);

        this.player.draw(this.ctx);
        this.obstacles.forEach(obstacle => obstacle.draw(this.ctx));

        // Draw score
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px Poppins';
        this.ctx.fillText(`Score: ${Math.floor(this.score/10)}`, 20, 30);

        if (this.isGameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '30px Poppins';
            const gameOverText = 'Game Over! Click or press Space to restart';
            const textMetrics = this.ctx.measureText(gameOverText);
            const textX = (this.canvas.width - textMetrics.width) / 2;
            this.ctx.fillText(gameOverText, textX, this.canvas.height/2);
        }
    }

    gameLoop() {
        if (!this.isGameOver) {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.gameLoop());
        }
    }
}

function toggleGame() {
    const gameModal = document.getElementById('game-modal');
    
    if (gameModal.classList.contains('show')) {
        gameModal.classList.remove('show');
    } else {
        gameModal.classList.add('show');
        const game = new Game();
        game.gameLoop();
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const gameButton = document.createElement('button');
    gameButton.id = 'game-button';
    gameButton.innerHTML = '<i class="fas fa-gamepad"></i>';
    gameButton.addEventListener('click', toggleGame);
    document.body.appendChild(gameButton);

    const gameModal = document.createElement('div');
    gameModal.id = 'game-modal';
    gameModal.innerHTML = `
        <div class="game-modal-content">
            <h2>Anime Runner</h2>
            <p>Help Luffy jump over obstacles! Press Space or click to jump.</p>
            <div id="game-container" class="game-container"></div>
        </div>
    `;
    document.body.appendChild(gameModal);
});