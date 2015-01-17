var Entity = require('./entity');
var util = require('../utilities');

/**
 * Bullet entity
 * @param {number} x     x position
 * @param {number} y     y position
 * @param {number} speed speed
 */
function Bullet(x, y, velX, velY, id){
    var radius = 2;
    Entity.call(this, x, y, velX, velY, radius);
    this.life = 3000;
    this.id = id;
}

util.inherits(Bullet, Entity);

Bullet.baseSpeed = 1;

Bullet.prototype.update = function update(timeDelta){
    this.move();
    this.life -= timeDelta;
    if (this.life <= 0){
        this.destruct = true;
    }
    return this.destruct;
}

module.exports = Bullet;