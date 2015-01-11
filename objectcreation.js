/*
Review of different object creation patterns.  
*/

// classic module pattern Addy Osmani
var myNamespace = (function () {
 
  var myPrivateVar, myPrivateMethod;
 
  // A private counter variable
  myPrivateVar = 0;
 
  // A private function which logs any arguments
  myPrivateMethod = function( foo ) {
      console.log( foo );
  };
 
  return {
 
    // A public variable
    myPublicVar: "foo",
 
    // A public function utilizing privates
    myPublicFunction: function( bar ) {
 
      // Increment our private counter
      myPrivateVar++;
 
      // Call our private method using bar
      myPrivateMethod( bar );
 
    }
  };
 
})();

// Addy Osmani patterns - Christian Heilmann’s Revealing Module pattern
var myRevealingModule = (function () {
 
        var privateVar = "Ben Cherry",
            publicVar  = "Hey there!";
 
        function privateFunction() {
            console.log( "Name:" + privateVar );
        }
 
        function publicSetName( strName ) {
            privateVar = strName;
        }
 
        function publicGetName() {
            privateFunction();
        }
 
 
        // Reveal public pointers to
        // private functions and properties
 
        return {
            setName: publicSetName,
            greeting: publicVar,
            getName: publicGetName
        };
 
    })();
 
myRevealingModule.setName( "Paul Kinlan" );


/* factory function with 'static' functions and properies*/
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



