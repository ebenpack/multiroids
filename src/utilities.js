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