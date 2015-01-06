!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Multiroids=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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
},{"../utilities":6,"./entity":3}],2:[function(_dereq_,module,exports){
var Entity = _dereq_('./entity');
var util = _dereq_('../utilities');

/**
 * Bullet entity
 * @param {number} x     x position
 * @param {number} y     y position
 * @param {number} speed speed
 */
function Bullet(x, y, velX, velY){
    var radius = 2;
    Entity.call(this, x, y, velX, velY, radius);
    this.life = 3000;
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
},{"../utilities":6,"./entity":3}],3:[function(_dereq_,module,exports){
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
/**
 * Draw entity to the given context
 */
Entity.prototype.draw = function draw(ctx){
    ctx.moveTo(this.x, this.y);
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
};

module.exports = Entity;
},{}],4:[function(_dereq_,module,exports){
var Entity = _dereq_('./entity');
var util = _dereq_('../utilities');

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
},{"../utilities":6,"./entity":3}],5:[function(_dereq_,module,exports){
var Ship = _dereq_('./entities/ship');
var Bullet = _dereq_('./entities/bullet');
var Asteroid = _dereq_('./entities/asteroid');

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
},{"./entities/asteroid":1,"./entities/bullet":2,"./entities/ship":4}],6:[function(_dereq_,module,exports){
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
},{}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ViZW5wYWNrL0RvY3VtZW50cy93b3JrL211bHRpcm9pZHMvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvZWJlbnBhY2svRG9jdW1lbnRzL3dvcmsvbXVsdGlyb2lkcy9zcmMvZW50aXRpZXMvYXN0ZXJvaWQuanMiLCIvaG9tZS9lYmVucGFjay9Eb2N1bWVudHMvd29yay9tdWx0aXJvaWRzL3NyYy9lbnRpdGllcy9idWxsZXQuanMiLCIvaG9tZS9lYmVucGFjay9Eb2N1bWVudHMvd29yay9tdWx0aXJvaWRzL3NyYy9lbnRpdGllcy9lbnRpdHkuanMiLCIvaG9tZS9lYmVucGFjay9Eb2N1bWVudHMvd29yay9tdWx0aXJvaWRzL3NyYy9lbnRpdGllcy9zaGlwLmpzIiwiL2hvbWUvZWJlbnBhY2svRG9jdW1lbnRzL3dvcmsvbXVsdGlyb2lkcy9zcmMvZmFrZV82MWRkNDdkMy5qcyIsIi9ob21lL2ViZW5wYWNrL0RvY3VtZW50cy93b3JrL211bHRpcm9pZHMvc3JjL3V0aWxpdGllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBFbnRpdHkgPSByZXF1aXJlKCcuL2VudGl0eScpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMnKTtcblxuLyoqXG4gKiBBc3Rlcm9pZCBlbnRpdHlcbiAqIEBwYXJhbSB7bnVtYmVyfSB4IHggcG9zaXRpb25cbiAqIEBwYXJhbSB7bnVtYmVyfSB5IHkgcG9zaXRpb25cbiAqL1xuZnVuY3Rpb24gQXN0ZXJvaWQoeCwgeSl7XG4gICAgdmFyIHZlbFggPSB1dGlsLnJhbmRSYW5nZSg1LCAxMCk7XG4gICAgdmFyIHZlbFkgPSB1dGlsLnJhbmRSYW5nZSg1LCAxMCk7XG4gICAgdmFyIHJhZGl1cyA9IHV0aWwucmFuZFJhbmdlKDYsIDgpO1xuICAgIEVudGl0eS5jYWxsKHRoaXMsIHgsIHksIHZlbFgsIHZlbFksIHJhZGl1cyk7XG59XG5cbnV0aWwuaW5oZXJpdHMoQXN0ZXJvaWQsIEVudGl0eSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXN0ZXJvaWQ7IiwidmFyIEVudGl0eSA9IHJlcXVpcmUoJy4vZW50aXR5Jyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWxpdGllcycpO1xuXG4vKipcbiAqIEJ1bGxldCBlbnRpdHlcbiAqIEBwYXJhbSB7bnVtYmVyfSB4ICAgICB4IHBvc2l0aW9uXG4gKiBAcGFyYW0ge251bWJlcn0geSAgICAgeSBwb3NpdGlvblxuICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkIHNwZWVkXG4gKi9cbmZ1bmN0aW9uIEJ1bGxldCh4LCB5LCB2ZWxYLCB2ZWxZKXtcbiAgICB2YXIgcmFkaXVzID0gMjtcbiAgICBFbnRpdHkuY2FsbCh0aGlzLCB4LCB5LCB2ZWxYLCB2ZWxZLCByYWRpdXMpO1xuICAgIHRoaXMubGlmZSA9IDMwMDA7XG59XG5cbnV0aWwuaW5oZXJpdHMoQnVsbGV0LCBFbnRpdHkpO1xuXG5CdWxsZXQuYmFzZVNwZWVkID0gMTtcblxuQnVsbGV0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUodGltZURlbHRhKXtcbiAgICB0aGlzLm1vdmUoKTtcbiAgICB0aGlzLmxpZmUgLT0gdGltZURlbHRhO1xuICAgIGlmICh0aGlzLmxpZmUgPCAwKXtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCdWxsZXQ7IiwiLyoqXG4gKiBHYW1lIGVudGl0eVxuICogQHBhcmFtIHtudW1iZXJ9IHggICAgIHggcG9zaXRpb25cbiAqIEBwYXJhbSB7bnVtYmVyfSB5ICAgICB5IHBvc2l0aW9uXG4gKiBAcGFyYW0ge251bWJlcn0gc3BlZWQgc3BlZWRcbiAqL1xuZnVuY3Rpb24gRW50aXR5KHgsIHksIHZlbFgsIHZlbFksIHJhZGl1cyl7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIHRoaXMudmVsWCA9IHZlbFg7XG4gICAgdGhpcy52ZWxZID0gdmVsWTtcbiAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcbiAgICB0aGlzLmFuZ2xlID0gMDtcbn1cbi8qKlxuICogTW92ZSBlbnRpdHlcbiAqL1xuRW50aXR5LnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24gbW92ZSgpe1xuICAgIHRoaXMueCArPSB0aGlzLnZlbFg7XG4gICAgdGhpcy55ICs9IHRoaXMudmVsWTtcbn07XG4vKipcbiAqIFVwZGF0ZSBlbnRpdHlcbiAqL1xuRW50aXR5LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUoKXtcbiAgICByZXR1cm4gZmFsc2U7XG59O1xuLyoqXG4gKiBEcmF3IGVudGl0eSB0byB0aGUgZ2l2ZW4gY29udGV4dFxuICovXG5FbnRpdHkucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbiBkcmF3KGN0eCl7XG4gICAgY3R4Lm1vdmVUbyh0aGlzLngsIHRoaXMueSk7XG4gICAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMsIDAsIE1hdGguUEkgKiAyKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRW50aXR5OyIsInZhciBFbnRpdHkgPSByZXF1aXJlKCcuL2VudGl0eScpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMnKTtcblxudmFyIHR1cm5TcGVlZCA9IDAuMDg7XG52YXIgYWNjZWxlcmF0aW9uQW1vdW50ID0gMC4yO1xudmFyIGRhbXBpbmcgPSAwLjk3O1xuXG4vKipcbiAqIFNoaXAgZW50aXR5XG4gKiBAcGFyYW0ge251bWJlcn0geCB4IHBvc2l0aW9uXG4gKiBAcGFyYW0ge251bWJlcn0geSB5IHBvc2l0aW9uXG4gKi9cbmZ1bmN0aW9uIFNoaXAoeCwgeSl7XG4gICAgdmFyIHZlbFggPSAwO1xuICAgIHZhciB2ZWxZID0gMDtcbiAgICB2YXIgcmFkaXVzID0gMTA7XG4gICAgRW50aXR5LmNhbGwodGhpcywgeCwgeSwgdmVsWCwgdmVsWSwgcmFkaXVzKTtcbiAgICB0aGlzLmFjY2VsZXJhdGlvbiA9IDA7XG4gICAgdGhpcy5sYXN0RmlyZWQgPSAwO1xuICAgIHRoaXMuZmlyZVJhdGUgPSA0MDA7XG59XG5cbnV0aWwuaW5oZXJpdHMoU2hpcCwgRW50aXR5KTtcblxuU2hpcC5wcm90b3R5cGUudHVybkxlZnQgPSBmdW5jdGlvbiB0dXJuTGVmdCgpe1xuICAgIHRoaXMuYW5nbGUgLT0gdHVyblNwZWVkO1xufTtcblNoaXAucHJvdG90eXBlLnR1cm5SaWdodCA9IGZ1bmN0aW9uIHR1cm5SaWdodCgpe1xuICAgIHRoaXMuYW5nbGUgKz0gdHVyblNwZWVkO1xufTtcblNoaXAucHJvdG90eXBlLmVuZ2FnZVRocnVzdGVycyA9IGZ1bmN0aW9uIGVuZ2FnZVRocnVzdGVycygpe1xuICAgIHRoaXMuYWNjZWxlcmF0aW9uICs9IGFjY2VsZXJhdGlvbkFtb3VudDtcbiAgICB0aGlzLnZlbFggKz0gKE1hdGguY29zKHRoaXMuYW5nbGUpICogYWNjZWxlcmF0aW9uQW1vdW50KTtcbiAgICB0aGlzLnZlbFkgKz0gKE1hdGguc2luKHRoaXMuYW5nbGUpICogYWNjZWxlcmF0aW9uQW1vdW50KTtcbn07XG5TaGlwLnByb3RvdHlwZS5maXJlID0gZnVuY3Rpb24gZmlyZSgpe1xuXG59O1xuU2hpcC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlKGRlbHRhVGltZSl7XG4gICAgdGhpcy5hY2NlbGVyYXRpb24gKj0gZGFtcGluZztcbiAgICB0aGlzLnZlbFggKj0gZGFtcGluZztcbiAgICB0aGlzLnZlbFkgKj0gZGFtcGluZztcbiAgICB0aGlzLnggPSB0aGlzLnggKyB0aGlzLnZlbFg7XG4gICAgdGhpcy55ID0gdGhpcy55ICsgdGhpcy52ZWxZO1xuICAgIHJldHVybiBmYWxzZTtcbiAgICAvLyBJZiBoaXQsIGRlc3RydWN0XG59O1xuU2hpcC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uIGRyYXcoY3R4KXtcbiAgICB2YXIgeCA9IHRoaXMueDtcbiAgICB2YXIgeSA9IHRoaXMueTtcbiAgICB2YXIgYW5nbGUgPSB0aGlzLmFuZ2xlO1xuICAgIHZhciByYWRpdXMgPSB0aGlzLnJhZGl1cztcbiAgICB2YXIgUEkgPSBNYXRoLlBJO1xuICAgIHZhciB4MSA9IHggKyAoTWF0aC5jb3MoYW5nbGUpICogcmFkaXVzKTtcbiAgICB2YXIgeTEgPSB5ICsgKE1hdGguc2luKGFuZ2xlKSAqIHJhZGl1cyk7XG4gICAgdmFyIHgyID0geCArIChNYXRoLmNvcyhhbmdsZSArICgoNypQSSkvNikpICogcmFkaXVzKTtcbiAgICB2YXIgeTIgPSB5ICsgKE1hdGguc2luKGFuZ2xlICsgKCg3KlBJKS82KSkgKiByYWRpdXMpO1xuICAgIHZhciB4MyA9IHggKyAoTWF0aC5jb3MoYW5nbGUgKyAoNypQSSkpICogKHJhZGl1cyAvIDIpKTtcbiAgICB2YXIgeTMgPSB5ICsgKE1hdGguc2luKGFuZ2xlICsgKDcqUEkpKSAqIChyYWRpdXMgLyAyKSk7XG4gICAgdmFyIHg0ID0geCArIChNYXRoLmNvcyhhbmdsZSArICgoNSpQSSkvNikpICogcmFkaXVzKTtcbiAgICB2YXIgeTQgPSB5ICsgKE1hdGguc2luKGFuZ2xlICsgKCg1KlBJKS82KSkgKiByYWRpdXMpO1xuICAgIGN0eC5tb3ZlVG8oeDEsIHkxKTtcbiAgICBjdHgubGluZVRvKHgyLCB5Mik7XG4gICAgY3R4LmxpbmVUbyh4MywgeTMpO1xuICAgIGN0eC5saW5lVG8oeDQsIHk0KTtcbiAgICBjdHgubGluZVRvKHgxLCB5MSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNoaXA7IiwidmFyIFNoaXAgPSByZXF1aXJlKCcuL2VudGl0aWVzL3NoaXAnKTtcbnZhciBCdWxsZXQgPSByZXF1aXJlKCcuL2VudGl0aWVzL2J1bGxldCcpO1xudmFyIEFzdGVyb2lkID0gcmVxdWlyZSgnLi9lbnRpdGllcy9hc3Rlcm9pZCcpO1xuXG5mdW5jdGlvbiBNdWx0aXJvaWRzKGN0eCwgd2lkdGgsIGhlaWdodCl7XG4gICAgdGhpcy5jdHggPSBjdHg7XG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIHRoaXMubGFzdFVwZGF0ZSA9IERhdGUubm93KClcbiAgICB0aGlzLmtleXMgPSB7fTtcbiAgICB0aGlzLmVudGl0aWVzID0ge1xuICAgICAgICBzaGlwczogW10sXG4gICAgICAgIGJ1bGxldHM6IFtdLFxuICAgICAgICBhc3Rlcm9pZHM6IFtdXG4gICAgfTtcbn1cblxuTXVsdGlyb2lkcy5wcm90b3R5cGUuYWRkU2hpcCA9IGZ1bmN0aW9uIGFkZFNoaXAoeCwgeSl7XG4gICAgdGhpcy5lbnRpdGllcy5zaGlwcy5wdXNoKG5ldyBTaGlwKHgsIHkpKTtcbn1cbk11bHRpcm9pZHMucHJvdG90eXBlLmFkZEJ1bGxldCA9IGZ1bmN0aW9uIGFkZEJ1bGxldCh4LCB5LCB2ZWxYLCB2ZWxZKXtcbiAgICB0aGlzLmVudGl0aWVzLmJ1bGxldHMucHVzaChuZXcgQnVsbGV0KHgsIHksIHZlbFgsIHZlbFkpKTtcbn1cbk11bHRpcm9pZHMucHJvdG90eXBlLmFkZEFzdGVyb2lkID0gZnVuY3Rpb24gYWRkQXN0ZXJvaWQoKXtcbiAgICB0aGlzLmVudGl0aWVzLmFzdGVyb2lkcy5wdXNoKG5ldyBBc3Rlcm9pZCgwLCAwKSk7XG59XG5NdWx0aXJvaWRzLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUoKXtcbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgMzAwLCAzMDApXG4gICAgdmFyIG5vdyA9IERhdGUubm93KClcbiAgICB2YXIgZGVsdGFUaW1lID0gIG5vdyAtIHRoaXMubGFzdFVwZGF0ZTtcbiAgICB0aGlzLmxhc3RVcGRhdGUgPSBub3c7XG4gICAgdmFyIGVudGl0aWVzID0gdGhpcy5lbnRpdGllcztcbiAgICB0aGlzLmhhbmRsZUV2ZW50cygpO1xuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgIGZvciAodmFyIGVudGl0eSBpbiB0aGlzLmVudGl0aWVzKXtcbiAgICAgICAgaWYgKGVudGl0aWVzLmhhc093blByb3BlcnR5KGVudGl0eSkpe1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGVudGl0aWVzW2VudGl0eV0ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pe1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50RW50aXR5ID0gZW50aXRpZXNbZW50aXR5XVtpXTtcbiAgICAgICAgICAgICAgICB2YXIgZGVzdHJ1Y3QgPSBjdXJyZW50RW50aXR5LnVwZGF0ZShkZWx0YVRpbWUpO1xuICAgICAgICAgICAgICAgIGlmIChkZXN0cnVjdCl7XG4gICAgICAgICAgICAgICAgICAgIGVudGl0aWVzW2VudGl0eV0uc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50RW50aXR5LnggPiB0aGlzLndpZHRoKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRFbnRpdHkueCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRFbnRpdHkueCA8IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEVudGl0eS54ID0gdGhpcy53aWR0aDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudEVudGl0eS55ID4gdGhpcy5oZWlnaHQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEVudGl0eS55ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudEVudGl0eS55IDwgMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50RW50aXR5LnkgPSB0aGlzLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbnRpdGllc1tlbnRpdHldW2ldLmRyYXcodGhpcy5jdHgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICB0aGlzLmN0eC5jbG9zZVBhdGgoKTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy51cGRhdGUuYmluZCh0aGlzKSk7XG59XG5NdWx0aXJvaWRzLnByb3RvdHlwZS5oYW5kbGVFdmVudHMgPSBmdW5jdGlvbiBoYW5kbGVFdmVudHMoKXtcbiAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcbiAgICB2YXIgc2hpcCA9IHRoaXMuZW50aXRpZXNbJ3NoaXBzJ11bMF07XG4gICAgaWYgKHRoaXMua2V5c1szN10pe1xuICAgICAgICBzaGlwLnR1cm5MZWZ0KCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmtleXNbMzhdKXtcbiAgICAgICAgc2hpcC5lbmdhZ2VUaHJ1c3RlcnMoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMua2V5c1szOV0pe1xuICAgICAgICBzaGlwLnR1cm5SaWdodCgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5rZXlzWzMyXSl7XG4gICAgICAgIGlmIChub3cgLSBzaGlwLmxhc3RGaXJlZCA+IHNoaXAuZmlyZVJhdGUpe1xuICAgICAgICAgICAgdmFyIHggPSBzaGlwLnggKyAoTWF0aC5jb3Moc2hpcC5hbmdsZSkgKiBzaGlwLnJhZGl1cyk7XG4gICAgICAgICAgICB2YXIgeSA9IHNoaXAueSArIChNYXRoLnNpbihzaGlwLmFuZ2xlKSAqIHNoaXAucmFkaXVzKTtcbiAgICAgICAgICAgIHZhciB2ZWxYID0gc2hpcC52ZWxYICsgKE1hdGguY29zKHNoaXAuYW5nbGUpICogQnVsbGV0LmJhc2VTcGVlZCk7XG4gICAgICAgICAgICB2YXIgdmVsWSA9IHNoaXAudmVsWSArIChNYXRoLnNpbihzaGlwLmFuZ2xlKSAqIEJ1bGxldC5iYXNlU3BlZWQpO1xuICAgICAgICAgICAgdGhpcy5hZGRCdWxsZXQoeCwgeSwgdmVsWCwgdmVsWSk7XG4gICAgICAgICAgICBzaGlwLmxhc3RGaXJlZCA9IG5vdztcbiAgICAgICAgfVxuICAgIH1cbn07XG5NdWx0aXJvaWRzLnByb3RvdHlwZS5wcmVzc2VkID0gZnVuY3Rpb24gcHJlc3NlZChrZXkpe1xuICAgIHRoaXMua2V5c1trZXldID0gdHJ1ZTtcbn07XG5NdWx0aXJvaWRzLnByb3RvdHlwZS51bnByZXNzZWQgPSBmdW5jdGlvbiB1bnByZXNzZWQoa2V5KXtcbiAgICB0aGlzLmtleXNba2V5XSA9IGZhbHNlO1xufTtcbk11bHRpcm9pZHMucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gc3RhcnQoKXtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy51cGRhdGUuYmluZCh0aGlzKSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE11bHRpcm9pZHM7IiwibW9kdWxlLmV4cG9ydHMucmFuZFJhbmdlID0gZnVuY3Rpb24gcmFuZFJhbmdlKG1pbiwgbWF4KSB7XG4gICAgcmV0dXJuIG1pbiArIChNYXRoLnJhbmRvbSgpICogKChtYXggLSBtaW4pICsgMSkpO1xufTtcblxuLy8gVE9ETzogQWRkIG5lY2Vzc2FyeSBhdHRyaWJ1dGlvblxuaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgICBtb2R1bGUuZXhwb3J0cy5pbmhlcml0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgICAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvcjtcbiAgICAgICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG59IGVsc2Uge1xuICAgIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gICAgbW9kdWxlLmV4cG9ydHMuaW5oZXJpdHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICAgICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3I7XG4gICAgICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uKCkge307XG4gICAgICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGU7XG4gICAgICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKCk7XG4gICAgICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvcjtcbiAgICB9O1xufSJdfQ==
(5)
});
