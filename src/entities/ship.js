var Entity = require('./entity');
var Bullet = require('./bullet.js');
var EventHandler = require('../events/events.js');
var util = require('../utilities');

var turnSpeed = 0.08;
var accelerationAmount = 0.2;
var damping = 0.97;

var PI = Math.PI;
var sevenPI = 7 * PI;
var sevenPIover6 = sevenPI / 6;
var fivePIover6 = (5 * PI) / 6;

/**
 * Ship entity``~
 * @param {number} x x position
 * @param {number} y y position
 */
function Ship(x, y, id) {
    var velX = 0;
    var velY = 0;
    var radius = 10;
    Entity.call(this, x, y, velX, velY, radius);
    this.acceleration = 0;
    this.lastFired = 0;
    this.fireRate = 400;
    this.id = id;
    this.score = 0;
    this.thrusting = false;
    this.evnt = new EventHandler();
}

util.inherits(Ship, Entity);

Ship.prototype.turnLeft = function turnLeft() {
    this.angle -= turnSpeed;
};
Ship.prototype.turnRight = function turnRight() {
    this.angle += turnSpeed;
};
Ship.prototype.engageThrusters = function engageThrusters() {
    this.thrusting = true;
    this.acceleration += accelerationAmount;
    this.velX += (Math.cos(this.angle) * accelerationAmount);
    this.velY += (Math.sin(this.angle) * accelerationAmount);
};
Ship.prototype.disengageThrusters = function disengageThrusters() {
    this.thrusting = false;
};
Ship.prototype.fire = function fire() {
    var now = Date.now();
    if (now - this.lastFired > this.fireRate) {
        var x = this.x + (Math.cos(this.angle) * this.radius);
        var y = this.y + (Math.sin(this.angle) * this.radius);
        var velX = this.velX + (Math.cos(this.angle) * Bullet.baseSpeed);
        var velY = this.velY + (Math.sin(this.angle) * Bullet.baseSpeed);
        this.lastFired = now;
        return new Bullet(x, y, velX, velY, this.id);
    }
};
Ship.prototype.collide = function() {
    this.score -= 1;
    this.evnt.fire('collide');
};
Ship.prototype.update = function update(deltaTime) {
    this.acceleration *= damping;
    this.velX *= damping;
    this.velY *= damping;
    this.x = this.x + this.velX;
    this.y = this.y + this.velY;
    return false;
};
Ship.prototype.draw = function draw(ctx) {
    var x = this.x;
    var y = this.y;
    var angle = this.angle;
    var angle7PI = angle + sevenPI;
    var angle7PIover6 = angle + sevenPIover6;
    var angle5PIover6 = angle + fivePIover6;
    var radius = this.radius;
    // Nose
    var x1 = x + (Math.cos(angle) * radius);
    var y1 = y + (Math.sin(angle) * radius);
    // Back left(??)
    var x2 = x + (Math.cos(angle7PIover6) * radius);
    var y2 = y + (Math.sin(angle7PIover6) * radius);
    // Back right(??)
    var x3 = x + (Math.cos(angle7PI) * (radius / 2));
    var y3 = y + (Math.sin(angle7PI) * (radius / 2));
    // Back center(??)
    var x4 = x + (Math.cos(angle5PIover6) * radius);
    var y4 = y + (Math.sin(angle5PIover6) * radius);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.lineTo(x1, y1);
    // Every once in a while, if under propulsion
    if ((Math.floor((Date.now() % 5000) / 500) % 2) && this.thrusting) {
        // Draw a little thruster flame
        var x5 = (x2 + x3) / 2;
        var y5 = (y2 + y3) / 2;
        var x6 = (x4 + x3) / 2;
        var y6 = (y4 + y3) / 2;
        var x7 = x + (Math.cos(angle + (7 * PI)) * (radius * 1.5));
        var y7 = y + (Math.sin(angle + (7 * PI)) * (radius * 1.5));
        ctx.moveTo(x5, y5);
        ctx.lineTo(x7, y7);
        ctx.lineTo(x6, y6);
    }
};

module.exports = Ship;