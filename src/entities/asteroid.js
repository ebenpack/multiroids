var Entity = require('./entity');
var util = require('../utilities');

/**
 * Asteroid entity
 * @param {number} x x position
 * @param {number} y y position
 */
function Asteroid(x, y){
    var velX = util.randRange(5, 10);
    var velY = util.randRange(5, 10);
    var radius = util.randRange(6, 8);
    Entity.call(this, x, y, velX, velY, radius);
}

util.inherits(Asteroid, Entity);

module.exports = Asteroid;