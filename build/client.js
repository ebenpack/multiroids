!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var i;"undefined"!=typeof window?i=window:"undefined"!=typeof global?i=global:"undefined"!=typeof self&&(i=self),(i.multiroidsClient||(i.multiroidsClient={})).js=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var Entity = _dereq_('./entity');
var util = _dereq_('./utilities');

function Asteroid(x, y){
    speed = util.randRange(5,10);
    Entity.call(this, x, y, speed);
}

module.exports = Asteroid;
},{"./entity":3,"./utilities":7}],2:[function(_dereq_,module,exports){
var Entity = _dereq_('./entity');

function Bullet(x, y, speed){
    Entity.call(this, x, y, speed);
}


module.exports = Bullet;
},{"./entity":3}],3:[function(_dereq_,module,exports){
function Entity(x, y, speed){
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.velocityX = 0;
    this.velocityY = 0;
}
Entity.prototype.move = function(){
    this.x += this.velocityX;
    this.y += this.velocityY;
};


module.exports = Entity;
},{}],4:[function(_dereq_,module,exports){
var Multiroids = _dereq_('./multiroids');
},{"./multiroids":5}],5:[function(_dereq_,module,exports){
var Ship = _dereq_('./ship');
var Bullet = _dereq_('./bullet');
var Asteroid = _dereq_('./asteroid');

var ships = [];
var bullets = [];
var asteroids = [];
function addShip(){
    ships.push(new Ship(0, 0));
}
function addBullet(){
    bullets.push(new Bullet(0, 0, 10));
}
function addAsteroid(){
    asteroids.push(new Asteroid(0, 0));
}

module.exports.addShip = addShip;
module.exports.addBullet = addBullet;
module.exports.addAsteroid = addAsteroid;
},{"./asteroid":1,"./bullet":2,"./ship":6}],6:[function(_dereq_,module,exports){
var Entity = _dereq_('./entity');

function Ship(x, y){
    var speed = 0;
    Entity.call(this, x, y, speed);
}


module.exports = Ship;
},{"./entity":3}],7:[function(_dereq_,module,exports){
module.exports.randRange = function(min, max){
    return min + (Math.random() * ((max - min) + 1));
}
},{}]},{},[4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ViZW5wYWNrL0RvY3VtZW50cy93b3JrL211bHRpcm9pZHMvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvZWJlbnBhY2svRG9jdW1lbnRzL3dvcmsvbXVsdGlyb2lkcy9zcmMvYXN0ZXJvaWQuanMiLCIvaG9tZS9lYmVucGFjay9Eb2N1bWVudHMvd29yay9tdWx0aXJvaWRzL3NyYy9idWxsZXQuanMiLCIvaG9tZS9lYmVucGFjay9Eb2N1bWVudHMvd29yay9tdWx0aXJvaWRzL3NyYy9lbnRpdHkuanMiLCIvaG9tZS9lYmVucGFjay9Eb2N1bWVudHMvd29yay9tdWx0aXJvaWRzL3NyYy9mYWtlXzczMGFiOGY1LmpzIiwiL2hvbWUvZWJlbnBhY2svRG9jdW1lbnRzL3dvcmsvbXVsdGlyb2lkcy9zcmMvbXVsdGlyb2lkcy5qcyIsIi9ob21lL2ViZW5wYWNrL0RvY3VtZW50cy93b3JrL211bHRpcm9pZHMvc3JjL3NoaXAuanMiLCIvaG9tZS9lYmVucGFjay9Eb2N1bWVudHMvd29yay9tdWx0aXJvaWRzL3NyYy91dGlsaXRpZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIEVudGl0eSA9IHJlcXVpcmUoJy4vZW50aXR5Jyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzJyk7XG5cbmZ1bmN0aW9uIEFzdGVyb2lkKHgsIHkpe1xuICAgIHNwZWVkID0gdXRpbC5yYW5kUmFuZ2UoNSwxMCk7XG4gICAgRW50aXR5LmNhbGwodGhpcywgeCwgeSwgc3BlZWQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFzdGVyb2lkOyIsInZhciBFbnRpdHkgPSByZXF1aXJlKCcuL2VudGl0eScpO1xuXG5mdW5jdGlvbiBCdWxsZXQoeCwgeSwgc3BlZWQpe1xuICAgIEVudGl0eS5jYWxsKHRoaXMsIHgsIHksIHNwZWVkKTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1bGxldDsiLCJmdW5jdGlvbiBFbnRpdHkoeCwgeSwgc3BlZWQpe1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLnNwZWVkID0gc3BlZWQ7XG4gICAgdGhpcy52ZWxvY2l0eVggPSAwO1xuICAgIHRoaXMudmVsb2NpdHlZID0gMDtcbn1cbkVudGl0eS5wcm90b3R5cGUubW92ZSA9IGZ1bmN0aW9uKCl7XG4gICAgdGhpcy54ICs9IHRoaXMudmVsb2NpdHlYO1xuICAgIHRoaXMueSArPSB0aGlzLnZlbG9jaXR5WTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBFbnRpdHk7IiwidmFyIE11bHRpcm9pZHMgPSByZXF1aXJlKCcuL211bHRpcm9pZHMnKTsiLCJ2YXIgU2hpcCA9IHJlcXVpcmUoJy4vc2hpcCcpO1xudmFyIEJ1bGxldCA9IHJlcXVpcmUoJy4vYnVsbGV0Jyk7XG52YXIgQXN0ZXJvaWQgPSByZXF1aXJlKCcuL2FzdGVyb2lkJyk7XG5cbnZhciBzaGlwcyA9IFtdO1xudmFyIGJ1bGxldHMgPSBbXTtcbnZhciBhc3Rlcm9pZHMgPSBbXTtcbmZ1bmN0aW9uIGFkZFNoaXAoKXtcbiAgICBzaGlwcy5wdXNoKG5ldyBTaGlwKDAsIDApKTtcbn1cbmZ1bmN0aW9uIGFkZEJ1bGxldCgpe1xuICAgIGJ1bGxldHMucHVzaChuZXcgQnVsbGV0KDAsIDAsIDEwKSk7XG59XG5mdW5jdGlvbiBhZGRBc3Rlcm9pZCgpe1xuICAgIGFzdGVyb2lkcy5wdXNoKG5ldyBBc3Rlcm9pZCgwLCAwKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzLmFkZFNoaXAgPSBhZGRTaGlwO1xubW9kdWxlLmV4cG9ydHMuYWRkQnVsbGV0ID0gYWRkQnVsbGV0O1xubW9kdWxlLmV4cG9ydHMuYWRkQXN0ZXJvaWQgPSBhZGRBc3Rlcm9pZDsiLCJ2YXIgRW50aXR5ID0gcmVxdWlyZSgnLi9lbnRpdHknKTtcblxuZnVuY3Rpb24gU2hpcCh4LCB5KXtcbiAgICB2YXIgc3BlZWQgPSAwO1xuICAgIEVudGl0eS5jYWxsKHRoaXMsIHgsIHksIHNwZWVkKTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoaXA7IiwibW9kdWxlLmV4cG9ydHMucmFuZFJhbmdlID0gZnVuY3Rpb24obWluLCBtYXgpe1xuICAgIHJldHVybiBtaW4gKyAoTWF0aC5yYW5kb20oKSAqICgobWF4IC0gbWluKSArIDEpKTtcbn0iXX0=
(4)
});
