!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Multiroids=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
function Quadtree(level, x, y, width, height) {
    this.level = level;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.objects = [];
    this.nodes = [];
}
Quadtree.prototype.max_objects = 4;
Quadtree.prototype.max_levels = 5;
Quadtree.prototype.clear = function(){
    this.objects.length = 0;
    for (var i = 0; i < this.nodes.length; i++) {
        this.nodes[i].clear();
    }
    this.nodes.length = 0;
};
Quadtree.prototype.split = function(){
    var subWidth = Math.round(this.width / 2);
    var subHeight = Math.round(this.height / 2);
    var x = Math.round(this.x);
    var y = Math.round(this.y);
    this.nodes[0] = new Quadtree(this.level+1, x + subWidth, y, subWidth, subHeight);
    this.nodes[1] = new Quadtree(this.level+1, x, y, subWidth, subHeight);
    this.nodes[2] = new Quadtree(this.level+1, x, y + subHeight, subWidth, subHeight);
    this.nodes[3] = new Quadtree(this.level+1, x + subWidth, y + subHeight, subWidth, subHeight);
};
Quadtree.prototype.getIndex = function(rect){
    var index = -1;
    var verticalMidpoint = this.x + (this.width / 2);
    var horizontalMidpoint = this.y + (this.height / 2);

    var topQuadrant = (rect.y < horizontalMidpoint && rect.y + rect.height < horizontalMidpoint);
    var bottomQuadrant = (rect.y > horizontalMidpoint);

    if( rect.x < verticalMidpoint && rect.x + rect.width < verticalMidpoint ) {
        if( topQuadrant ) {
            index = 1;
        } else if( bottomQuadrant ) {
            index = 2;
        }
    } else if( rect.x > verticalMidpoint ) {
        if( topQuadrant ) {
            index = 0;
        } else if( bottomQuadrant ) {
            index = 3;
        }
    }
    return index;
};
Quadtree.prototype.retrieve = function(rect){
    var index = this.getIndex(rect);
    var returnObjects = this.objects;
    if(this.nodes.length > 0) {
        if(index !== -1){
            returnObjects = returnObjects.concat(this.nodes[index].retrieve(rect));
        } else {
            for( var i=0; i < this.nodes.length; i++ ) {
                returnObjects = returnObjects.concat(this.nodes[i].retrieve(rect));
            }
        }
    }
    return returnObjects;
};
Quadtree.prototype.insert = function(rect){
    var i = 0;
    var index;
    if(this.nodes.length > 0) {
        index = this.getIndex( rect );
        if( index !== -1 ) {
            this.nodes[index].insert( rect ); 
            return;
        }
    }
    this.objects.push( rect );
    if( this.objects.length > this.max_objects && this.level < this.max_levels ) {
        if( this.nodes.length === 0) {
            this.split();
        }
        while( i < this.objects.length ) {
            index = this.getIndex( this.objects[ i ] );
            if( index !== -1 ) {    
                this.nodes[index].insert( this.objects.splice(i, 1)[0] );
            } else {
                i = i + 1;
            }
        }
    }
};

module.exports.Quadtree = Quadtree;
},{}],2:[function(_dereq_,module,exports){
var Entity = _dereq_('./entity');
var util = _dereq_('../utilities');

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
},{"../utilities":7,"./entity":4}],3:[function(_dereq_,module,exports){
var Entity = _dereq_('./entity');
var util = _dereq_('../utilities');

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
    if (this.life < 0){
        return true;
    } else {
        return false;
    }
}

module.exports = Bullet;
},{"../utilities":7,"./entity":4}],4:[function(_dereq_,module,exports){
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
},{}],5:[function(_dereq_,module,exports){
var Entity = _dereq_('./entity');
var Bullet = _dereq_('./bullet.js');
var util = _dereq_('../utilities');

var turnSpeed = 0.08;
var accelerationAmount = 0.2;
var damping = 0.97;

/**
 * Ship entity
 * @param {number} x x position
 * @param {number} y y position
 */
function Ship(x, y, id){
    var velX = 0;
    var velY = 0;
    var radius = 10;
    Entity.call(this, x, y, velX, velY, radius);
    this.acceleration = 0;
    this.lastFired = 0;
    this.fireRate = 400;
    this.id = id;
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
    var now = Date.now()
    if (now - this.lastFired > this.fireRate){
        var x = this.x + (Math.cos(this.angle) * this.radius);
        var y = this.y + (Math.sin(this.angle) * this.radius);
        var velX = this.velX + (Math.cos(this.angle) * Bullet.baseSpeed);
        var velY = this.velY + (Math.sin(this.angle) * Bullet.baseSpeed);
        this.lastFired = now;
        return new Bullet(x, y, velX, velY, this.id);
    }
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
},{"../utilities":7,"./bullet.js":3,"./entity":4}],6:[function(_dereq_,module,exports){
var Ship = _dereq_('./entities/ship');
var Bullet = _dereq_('./entities/bullet');
var Asteroid = _dereq_('./entities/asteroid');

var Quadtree = _dereq_('quadtree');

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
    this.qtree = new Quadtree.Quadtree(0, 0, 0, this.width, this.height);
}

Multiroids.prototype.addShip = function addShip(x, y){
    this.entities.ships.push(new Ship(x, y, Date.now()));
}
Multiroids.prototype.addBullet = function addBullet(bullet){
    this.entities.bullets.push(bullet);
}
Multiroids.prototype.addAsteroid = function addAsteroid(){
    this.entities.asteroids.push(new Asteroid(0, 0));
}
Multiroids.prototype.update = function update(){
    this.qtree.clear();
    this.ctx.clearRect(0, 0, 300, 300)
    var now = Date.now()
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
                    var possible_collides = this.qtree.retrieve(currentEntity);
                    for (var k = 0; k < possible_collides.length; k++){
                         var otherEntity = possible_collides[k];
                         if ((currentEntity !== otherEntity) &&
                            (currentEntity.id !== otherEntity.id) && 
                            (currentEntity.detectCollide(otherEntity))){
                            console.log('collide');
                            currentEntity.collide = true;
                            otherEntity.collide = true;
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
},{"./entities/asteroid":2,"./entities/bullet":3,"./entities/ship":5,"quadtree":1}],7:[function(_dereq_,module,exports){
module.exports.randRange = function randRange(min, max) {
    return min + (Math.random() * ((max - min) + 1));
};

// TODO: Add necessary attribution
if (typeof Object.create === 'function') {
    // implementation from standard node.js 'util' module
    module.exports.inherits = function inherits(ctor, superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
    };
} else {
    // old school shim for old browsers
    module.exports.inherits = function inherits(ctor, superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function() {};
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
    };
}
},{}]},{},[6])
(6)
});