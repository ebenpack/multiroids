var Entity = require('./entity');
var util = require('../utilities');

/**
 * Asteroid entity
 * @param {number} x x position
 * @param {number} y y position
 */
function Asteroid(x, y){
    var velX = util.randRange(0.1, 0.8);
    var velY = util.randRange(0.1, 0.8);
    var radius = util.randRange(10, 14);
    Entity.call(this, x, y, velX, velY, radius);
    this.id = 'asteroid';
    this.health = 10;
}
util.inherits(Asteroid, Entity);


Asteroid.prototype.update = function update(){
    this.move();
    return this.destruct;
};
Asteroid.prototype.collide = function collide(otherEntity){
    this.health -= 2;
    if (this.health <= 0){
        this.destruct = true;
    }
};
module.exports = Asteroid;