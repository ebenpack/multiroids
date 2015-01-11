/**
 * Game entity
 * @param {number} x     x position
 * @param {number} y     y position
 * @param {number} speed speed
 */
function Entity(x, y, velX, velY, radius){
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.radius = radius;
    this.angle = 0;
}
/**
 * Move entity
 */
Entity.prototype.move = function move(){
    this.x += this.velX;
    this.y += this.velY;
};
/**
 * Update entity
 */
Entity.prototype.update = function update(){
    return false;
};
Entity.prototype.detectCollide = function detectCollide(otherEntity){
    return (Math.pow(otherEntity.x - this.x, 2) + Math.pow(this.y - otherEntity.y, 2) <= 
                        Math.pow(this.radius + otherEntity.radius, 2));
};
/**
 * Draw entity to the given context
 */
Entity.prototype.draw = function draw(ctx){
    ctx.moveTo(this.x + this.radius, this.y);
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
};

module.exports = Entity;