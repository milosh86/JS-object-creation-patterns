/*
 * THIS IS CREATED ONLY FOR LEARNING PURPOSES.
 *
 * Customized eventuality 'part' function, which adds eventing capabilities to any object.
 * Comparing to original function, customEventuality adds/changes following:
 *   1. on, fire and other method's definitions are not added directly to the passed object. 
 *      Instead, those methods are created and 'stored' in the closure and the passed object ('that') is only enriched with references to methods in closure.
 *      In other words:
 *          var obj1 = {};
 *          var obj2 = {};
 *          customEventuality(obj1);
 *          customEventuality(obj2);
 *          obj1.on === obj2.on // returns true  
 *  2. off method added. It returns true/false.
 *  3. on returns 'off' method instead of 'this'
*/


//****************************************************
// From Javascript The Good Parts - Douglas Crockford
//****************************************************   
var eventuality = function (that) {
    var registry = {};
    
    that.fire = function (event) {
        // Fire an event on an object. The event can be either
        // a string containing the name of the event or an
        // object containing a type property containing the
        // name of the event. Handlers registered by the 'on'
        // method that match the event name will be invoked.
        var array,
            func,
            handler,
            i,
            type = typeof event === 'string' ?
            event : event.type;
        // If an array of handlers exist for this event, then
        // loop through it and execute the handlers in order.
        if (registry.hasOwnProperty(type)) {
            array = registry[type];
            for (i = 0; i < array.length; i += 1) {
                handler = array[i];
                // A handler record contains a method and an optional
                // array of parameters. If the method is a name, look
                // up the function.
                func = handler.method;
                if (typeof func === 'string') {
                    func = this[func];
                }
                // Invoke a handler. If the record contained
                // parameters, then pass them. Otherwise, pass the
                // event object.
                func.apply(this,
                    handler.parameters || [event]);
            }
        }
        return this;
    };

    that.on = function (type, method, parameters) {
        // Register an event. Make a handler record. Put it
        // in a handler array, making one if it doesn't yet
        // exist for this type.
        var handler = {
            method: method,
            parameters: parameters
        };
        if (registry.hasOwnProperty(type)) {
            registry[type].push(handler);
        } else {
            registry[type] = [handler];
        }
        return this;
    };
    return that;
};

// ******************************************
// Based on the above 'eventuality' function 
// from "Javascript The Good Parts" - Douglas Crockford
// ******************************************

var customEventuality = (function () {
    var registry = {};
    
    var on = function (type, method, parameters) {
        // Register an event. Make a handler record. Put it
        // in a handler array, making one if it doesn't yet
        // exist for this type.
        var handler = {
            method: method,
            parameters: parameters
        };

        if (registry.hasOwnProperty(type)) {
            registry[type].push(handler);
        } else {
            registry[type] = [handler];
        }

        // function unsubscribe() {
        //     off(type, handler.method);
        // }      
        return {
            off: function() {
                off(type, handler.method);
            }
        };
      //  return this;
    };
    
    var off = function (type, method) {
        var handlersList, i;

        if (type && !method) {
            if (registry.hasOwnProperty(type)) {
                registry[type] = [];
                return true;
            } 
            return false;
        }
        
        if (registry.hasOwnProperty(type)) {
            handlersList = registry[type];
            for (i = 0; i < handlersList.length; i += 1) {
                if (handlersList[i].method === method) {
                    handlersList.splice(i,1);
                   // break;
                   return true;
                }
            }
        }
        return false;      
//        return this;
    };

    var fire = function (event) {
        // Fire an event on an object. The event can be either
        // a string containing the name of the event or an
        // object containing a type property containing the
        // name of the event. Handlers registered by the 'on'
        // method that match the event name will be invoked.
        var array,
            func,
            handler,
            i,
            type = typeof event === 'string' ? event : event.type;
        // If an array of handlers exist for this event, then
        // loop through it and execute the handlers in order.
        if (registry.hasOwnProperty(type)) {
            array = registry[type];
            for (i = 0; i < array.length; i += 1) {
                handler = array[i];
                // A handler record contains a method and an optional
                // array of parameters. If the method is a name, look
                // up the function.
                func = handler.method;
                if (typeof func === 'string') {
                    func = this[func];
                }
                // Invoke a handler. If the record contained
                // parameters, then pass them. Otherwise, pass the
                // event object.
                func.apply(this,
                    handler.parameters || [event]);
            }
        }
        return this;
    };

    return function (that) {
        that.on = on;
        that.off = off;
        that.fire = fire;

        return that;
    };
})();


// ***************************************
// test memory consuption of above two implementations

// created only because object created with constructors could be easily found in memory profiler output
function CustArray() {this.arr = [];} 

var ev1 = new CustArray();
var ev2 = new CustArray();
var n = 100000;

while(n--){
    var o = {a:n, type: 'ev1'};
    ev1.arr.push(eventuality(o));
};

n = 100000;

while(n--){
    var o = {a:n, type: 'ev2'};
    ev2.arr.push(customEventuality(o));
};