var Ship = require('./entities/ship');
var Bullet = require('./entities/bullet');
var Asteroid = require('./entities/asteroid');
var randRange = require('./utilities').randRange;

var Quadtree = require('quadtree');

// TODO: move to config file
var asteroidSpawnRate = 3000;
var maxAsteroids = 1;

function Multiroids(ctx, width, height){
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.lastUpdate = Date.now();
    this.keys = {};
    this.entities = {
        ships: [],
        bullets: [],
        asteroids: []
    };
    this.nextAsteroid = asteroidSpawnRate;
    this.qtree = new Quadtree.Quadtree(0, 0, 0, this.width, this.height);
}

Multiroids.prototype.addShip = function addShip(x, y){
    var newShip = new Ship(x, y, Date.now());
    this.entities.ships.push(newShip);
    return newShip;
};
Multiroids.prototype.addBullet = function addBullet(bullet){
    this.entities.bullets.push(bullet);
};
Multiroids.prototype.addAsteroid = function addAsteroid(){
    this.nextAsteroid = asteroidSpawnRate;
    this.entities.asteroids.push(
        new Asteroid(randRange(0, this.width), randRange(0, this.height))
    );
};
Multiroids.prototype.update = function update(){
    this.qtree.clear();
    this.ctx.clearRect(0, 0, this.width, this.height);
    var now = Date.now();
    var deltaTime =  now - this.lastUpdate;
    this.lastUpdate = now;
    var entities = this.entities;
    this.handleEvents();
    this.ctx.beginPath();
    // Build quadtree
    for (var entity in this.entities){
        if (entities.hasOwnProperty(entity)){
            for (var i = entities[entity].length - 1; i >= 0; i--){
                this.qtree.insert(entities[entity][i]);
            }
        }
    }
    // Update and check for collisions
    for (var entity in this.entities){
        if (entities.hasOwnProperty(entity)){
            for (var i = entities[entity].length - 1; i >= 0; i--){
                var currentEntity = entities[entity][i];
                var destruct = currentEntity.update(deltaTime);
                if (!destruct){
                    var possibleCollides = this.qtree.retrieve(currentEntity);
                    for (var k = 0; k < possibleCollides.length; k++){
                         var otherEntity = possibleCollides[k];
                         if ((currentEntity !== otherEntity) &&
                            (currentEntity.id !== otherEntity.id) && 
                            (currentEntity.detectCollide(otherEntity))){
                            currentEntity.collide(otherEntity);
                         }
                     }
                }
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
    this.nextAsteroid -= deltaTime;
    if (this.nextAsteroid <= 0 && this.entities.asteroids.length < maxAsteroids){
        this.addAsteroid();
    }
    this.ctx.stroke();
    this.ctx.closePath();
    requestAnimationFrame(this.update.bind(this));
};
Multiroids.prototype.handleEvents = function handleEvents(){
    var ship = this.entities.ships[0];
    if (this.keys[37]){
        ship.turnLeft();
    }
    if (this.keys[38]){
        ship.engageThrusters();
    } else {
        ship.disengageThrusters();
    }
    if (this.keys[39]){
        ship.turnRight();
    }
    if (this.keys[32]){
        var bullet = ship.fire();
        if (bullet){
            this.addBullet(bullet);
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