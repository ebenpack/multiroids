var Entity = require('./entity');
var util = require('../utilities');

var turnSpeed = 0.08;
var accelerationAmount = 0.2;
var damping = 0.97;

/**
 * Ship entity
 * @param {number} x x position
 * @param {number} y y position
 */
function Ship(x, y){
    var velX = 0;
    var velY = 0;
    var radius = 10;
    Entity.call(this, x, y, velX, velY, radius);
    this.acceleration = 0;
    this.lastFired = 0;
    this.fireRate = 400;
}

util.inherits(Ship, Entity);

Ship.prototype.turnLeft = function turnLeft(){
    this.angle -= turnSpeed;
};
Ship.prototype.turnRight = function turnRight(){
    this.angle += turnSpeed;
};
Ship.prototype.engageThrusters = function engageThrusters(){
    this.acceleration += accelerationAmount;
    this.velX += (Math.cos(this.angle) * accelerationAmount);
    this.velY += (Math.sin(this.angle) * accelerationAmount);
};
Ship.prototype.fire = function fire(){

};
Ship.prototype.update = function update(deltaTime){
    this.acceleration *= damping;
    this.velX *= damping;
    this.velY *= damping;
    this.x = this.x + this.velX;
    this.y = this.y + this.velY;
    return false;
    // If hit, destruct
};
Ship.prototype.draw = function draw(ctx){
    var x = this.x;
    var y = this.y;
    var angle = this.angle;
    var radius = this.radius;
    var PI = Math.PI;
    var x1 = x + (Math.cos(angle) * radius);
    var y1 = y + (Math.sin(angle) * radius);
    var x2 = x + (Math.cos(angle + ((7*PI)/6)) * radius);
    var y2 = y + (Math.sin(angle + ((7*PI)/6)) * radius);
    var x3 = x + (Math.cos(angle + (7*PI)) * (radius / 2));
    var y3 = y + (Math.sin(angle + (7*PI)) * (radius / 2));
    var x4 = x + (Math.cos(angle + ((5*PI)/6)) * radius);
    var y4 = y + (Math.sin(angle + ((5*PI)/6)) * radius);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.lineTo(x1, y1);
};

module.exports = Ship;