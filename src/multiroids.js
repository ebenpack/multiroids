var Ship = require('./entities/ship');
var Bullet = require('./entities/bullet');
var Asteroid = require('./entities/asteroid');

function Multiroids(ctx, width, height){
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.lastUpdate = Date.now()
    this.keys = {};
    this.entities = {
        ships: [],
        bullets: [],
        asteroids: []
    };
}

Multiroids.prototype.addShip = function addShip(x, y){
    this.entities.ships.push(new Ship(x, y));
}
Multiroids.prototype.addBullet = function addBullet(x, y, velX, velY){
    this.entities.bullets.push(new Bullet(x, y, velX, velY));
}
Multiroids.prototype.addAsteroid = function addAsteroid(){
    this.entities.asteroids.push(new Asteroid(0, 0));
}
Multiroids.prototype.update = function update(){
    this.ctx.clearRect(0, 0, 300, 300)
    var now = Date.now()
    var deltaTime =  now - this.lastUpdate;
    this.lastUpdate = now;
    var entities = this.entities;
    this.handleEvents();
    this.ctx.beginPath();
    for (var entity in this.entities){
        if (entities.hasOwnProperty(entity)){
            for (var i = entities[entity].length - 1; i >= 0; i--){
                var currentEntity = entities[entity][i];
                var destruct = currentEntity.update(deltaTime);
                if (destruct){
                    entities[entity].splice(i, 1);
                } else {
                    if (currentEntity.x > this.width){
                        currentEntity.x = 0;
                    }
                    if (currentEntity.x < 0){
                        currentEntity.x = this.width;
                    }
                    if (currentEntity.y > this.height){
                        currentEntity.y = 0;
                    }
                    if (currentEntity.y < 0){
                        currentEntity.y = this.height;
                    }
                    entities[entity][i].draw(this.ctx);
                }
            }
        }
    }
    this.ctx.stroke();
    this.ctx.closePath();
    requestAnimationFrame(this.update.bind(this));
}
Multiroids.prototype.handleEvents = function handleEvents(){
    var now = Date.now();
    var ship = this.entities['ships'][0];
    if (this.keys[37]){
        ship.turnLeft();
    }
    if (this.keys[38]){
        ship.engageThrusters();
    }
    if (this.keys[39]){
        ship.turnRight();
    }
    if (this.keys[32]){
        if (now - ship.lastFired > ship.fireRate){
            var x = ship.x + (Math.cos(ship.angle) * ship.radius);
            var y = ship.y + (Math.sin(ship.angle) * ship.radius);
            var velX = ship.velX + (Math.cos(ship.angle) * Bullet.baseSpeed);
            var velY = ship.velY + (Math.sin(ship.angle) * Bullet.baseSpeed);
            this.addBullet(x, y, velX, velY);
            ship.lastFired = now;
        }
    }
};
Multiroids.prototype.pressed = function pressed(key){
    this.keys[key] = true;
};
Multiroids.prototype.unpressed = function unpressed(key){
    this.keys[key] = false;
};
Multiroids.prototype.start = function start(){
    requestAnimationFrame(this.update.bind(this));
};

module.exports = Multiroids;