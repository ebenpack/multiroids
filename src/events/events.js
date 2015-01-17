function EventHandler(){
    this.events = {};
}
EventHandler.prototype.on = function(evts, fn, args){
    var eventArray = evts.split(' ');
    for (var i = 0, len = eventArray.length; i < len; i++){
        var e = eventArray[i];
        if (typeof this.events[e] === 'undefined'){
            this.events[e] = [];
        }
        this.events[e].push([fn, args]);
    }
};
EventHandler.prototype.fire = function(evts){
    // Build array of events to fire
    var eventArray = [];
    var tmpArray1 = evts.split(' ');
    for (var i = 0; i < tmpArray1.length; i++){
        var e = tmpArray1[i];
        while (e){
            eventArray.push(e);
            var index = e.lastIndexOf('.');
            if (index > 0){
                eventArray.push(e.substr(index + 1));
                e = e.substring(0, index);
            } else {
                break;
            }
        }
    }
    // Fire events
    for (var i = 0; i < eventArray.length; i++){
        var current = this.events[eventArray[i]];
        if (typeof current !== 'undefined'){
            for (var j = 0, len = current.length; j < len; j++){
                var evt = current[j];
                var args = evt[2] ? evt[2] : [];
                args.unshift({name: eventArray[i]});
                evt[0].apply(evt[1], args);
            }
        }
    }
};

module.exports = EventHandler;