/*
  FOR LEARNING PURPOSES ONLY.
  WORK IN PROGRESS. 
*/
// ---------------------------------------------------
// Simple object creation (no prototypes, no privacy):
// ---------------------------------------------------

// 1. Object literal
var obj = {name: 'object literal', method: function () {return 'Method: ' + this.name}};

// 2. Constructor
function Constructor() {
  if (!(this instanceof Constructor))
    return new Constructor;

  this.name = 'constructor function';
  this.method = function () {
    return 'Method: ' + this.name;
  };
}

var obj = new Constructor();

// 3. Object.create
var obj = Object.create(null);
obj.name = 'Object.create';
obj.method = function () {
  return 'Method: ' + this.name;
};

// 4. Factory function
function createObj() {
  return {
    name: 'factory function',
    method: function () {
      return 'Method: ' + this.name;
    }
  };
}

// ------------------------------------------------------
// Sharing common properties/behavior through prototypes:
// (delegation)
// ------------------------------------------------------

// 1. Constructor function
function Constructor() {
  if (!(this instanceof Constructor)) // or use 'use strict' to prevent nasty bugs with 'this' when Constructor is invoked without 'new'
    return new Constructor;

  this.name = 'constructor function';
  
}

Constructor.prototype.method = function(){
  return 'Method: ' + this.name;
};

var obj1 = new Constructor();
var obj2 = new Constructor();
obj1.method === obj2.method // true
obj1.name === obj2.name // false

// 2. Object.create
var commonProps = {
  name: 'shared name', 
  method: function () {return 'shared method: ' + this.name}
};
var obj1 = Object.create(commonProps);
var obj2 = Object.create(commonProps);
obj2.name = 'local name'; // overwrite name property

obj1.method === obj2.method // true
obj1.name === obj2.name // false

// 3.1 Factory function + closure
var factory = (function(){
  // all common properties are shared through closure
  var name = 'shared name';
  var method = function () {return 'shared method: ' + this.name};

  return function factory() {
    return {
      name: name,
      method: method,
      local: {name:'local name'}

    }
  };
})();

var obj1 = factory();
var obj2 = factory();

obj1.method === obj2.method; // true
obj1.name === obj2.name; // true
obj1.local === obj2.local; // false

// 3.2 Factory function + closure + Object.create
var factory = (function(){
  // all common properties are shared through closure
  var proto = {
    name: 'shared name',
    method: function () {return 'shared method: ' + this.name}
  };

  return function factory() {
    var obj = Object.create(proto);
    obj.local = {name:'local name'};
    return obj;
  };
})();

var obj1 = factory();
var obj2 = factory();

obj1.method === obj2.method; // true
obj1.name === obj2.name; // true
obj1.local === obj2.local; // false
// --------------------------------------------
// Creation of objects with private properties:
// See http://fitzgeraldnick.com/weblog/53/ for 
// more info on this topic.
// --------------------------------------------

// 1. Closing Over Private Data in the Constructor or Factory function

// 1.1 Factory function
var factory = function () {
 
  var myPrivateVar, myPrivateMethod;
 
  // A private counter variable
  myPrivateVar = 0;
 
  // A private function which logs any arguments
  myPrivateMethod = function(foo) {
      console.log(foo);
  };
 
  return {
 
    // A public variable
    myPublicVar: "foo",
 
    // A public function utilizing privates
    myPublicFunction: function(bar) {
 
      // Increment our private counter
      myPrivateVar++;
 
      // Call our private method using bar
      myPrivateMethod(bar);
 
    }
  };
 
};

// 1.2 Constructor function
var Constructor = function () {
  if (!(this instanceof Constructor)) // or use 'use strict' to prevent nasty bugs with 'this' when Constructor is invoked without 'new'
    return new Constructor;

  var myPrivateVar, myPrivateMethod;
 
  // A private counter variable
  myPrivateVar = 0;
 
  // A private function which logs any arguments
  myPrivateMethod = function(foo) {
      console.log(foo);
  };
 
  // A public variable
  this.myPublicVar = "foo";
 
  // A public function utilizing privates
  this.myPublicFunction = function(bar) {
 
    // Increment our private counter
    myPrivateVar++;
 
    // Call our private method using bar
    myPrivateMethod(bar);
 
  };
  
 
};

// 2. Prefixing Private Members with an Underscore (just a convention, does not force any restrictions)
function Constructor() {
  if (!(this instanceof Constructor)) // or use 'use strict' to prevent nasty bugs with 'this' when Constructor is invoked without 'new'
    return new Constructor;

  this.name = 'constructor function';
  this._private = 'private data. Do not access it directly!';
  
}

Constructor.prototype.method = function(){
  return 'Only method should access private data. Data: ' + this._private;
};

// ===========================================
// ===========================================



/* factory function with 'static' functions and properties*/
var contact = (function () {
    function protoF() {
        return 'hello, each object share the same function staticf';
    }
    
    var data = {d:'data'};
    
   
    
    function contact(name, email) {
        return {
            name: name,
            email: email,
            staticf: protoF,
            staticdata: data,
        };
    }
    
    return contact;
}());

/* V2 add static properties to any object passed in */
var contact = (function () {
    function protoF() {
        return 'hello, each object share the same function staticf';
    }
    
    var data = {d:'data'};
    
   
    
    function contact(obj) {
        // pass in already initialized object!
      // name: name,
      // email: email,
      obj.staticf = protoF;
      obj.staticdata = data;
      return obj;

    }
    
    return contact;
}());

var c1 = contact('name', 'email');

/* factory function */
var contact = function (name, email) {
    return {
        name: name,
        email: email,
        f: function() {return 'hello, each object has its own function f!'},
        data: {d:'data'},
    };
};


// ***********************************************

function featureSet1(obj) {
    obj = obj || {};
    
    obj.FS1feature1 = 'fs1_feature1';
    obj.FS1feature2 = 'fs1_feature2';
}
// feature might not need init, but instead a method that is supposed to use 'base' properties should init it for itself. See Backbone's Event.
featureSet1.init = function () {
  var priv = 'local private';

  this.getLocalPriv = function () {
      return priv;
    };

  this.setLocalPriv = function (val) {
      priv = val;
    };

  this.desc = 'FS1 Init';
};

function featureSet2(obj) {
    obj = obj || {};
    
    // static private
    var private = 'private';

    obj.FS2feature1 = 'fs2_feature1';
    obj.FS2feature2 = 'fs2_feature2';
    
    obj.getPrivate = function () {
      return private;
    };

    obj.setPrivate = function (val) {
      private = val;
    };
}

featureSet2.init = function () {
  var priv = 'local private FS2';

  this.getLocalPriv2 = function () {
      return priv;
    };

  this.setLocalPriv2 = function (val) {
      priv = val;
    };

  this.desc = 'FS2 Init';
};

var extend = (function () {
    var features = {
        feature1: featureSet1,
        feature2: featureSet2 
    };
    
    function extend(obj) {
        var args = [].slice.call(arguments, 1);
        extend.inits = [];
        args.forEach(function (f) {
            features[f] && features[f](obj);
            features[f] && extend.inits.push(features[f].init);
        });
        
        return function(obj) {
          extend.inits.forEach(function (f) {f.call(obj);})
        };
    };
    
    extend.addFeature = function (name, feature) {
        if(!features[name] && typeof feature === 'function') {
            features[name] = feature;
        }
    };
    
    return extend;
}());


var proto1 = {
    name: 'some proto object',
    description: 'to be extended...'
};

var init = extend(proto1, 'feature2', 'feature1');

var o1 = Object.create(proto1);
init.call(o1);

// creates new object with given features. If proto is null
function create(proto, [features]) {
  // check if proto is null or object
  var obj = Object.create(proto),
      init;

  if (proto)
    init = extend(proto, [features]);
  else
    init = extend(obj, [features]);
  
  init.call(obj);
  return obj;
}



