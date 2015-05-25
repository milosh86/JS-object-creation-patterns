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

  return function factory(param) {
    return {
      	name: name,
      	method: method,
		local: {name:'local name'},
		param: param // local	

    };
  };
})();

var obj1 = factory('param 1');
var obj2 = factory('param 2');

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

// 2. Prefixing Private Members with an underscore (just a convention, does not force any restrictions)
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
// Inheritance

// Inheritance between 2 constructor functions
function Parent(name) {
	this.name = name;
}
Parent.prototype.getName = function() {return this.name;};

function Child(name, type) {
	this.type = type;
	Parent.call(this, name);
}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
Child.prototype.super = Parent.prototype; 
Child.prototype.getName = function () {return this.super.getName.call(this)};
Child.prototype.getType = function () {return this.type;};

// helper method
function inherit(Child, Parent) {
    Child.prototype = Object.create(Parent.prototype);
    //Child.prototype.constructor = Child;
	// or
	Object.defineProperty(Child.prototype, 'constructor', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: Child
	});
     Child.super = Parent.prototype;
}

// extend - inheritance by copying
function extend(Child, Parent) {
	var p = Parent.prototype;
	var c = Child.prototype;
	for (var i in p) {
		c[i] = p[i];
	}
	c.super = p;
}

// multiple inheritance is done with clasic extend

// parasitic inheritance
function parent () {
	return {type:'parent', value: 'hello from parent'};
}
function child() {
	// 1. instance an object
	var obj = parent(); // or Object.create(parent())
	
	// 2. enrich it with new props
	obj.type = 'child';
	obj.value = 'hello from child';
	// 3. return new object
	return obj;
	
}

 

