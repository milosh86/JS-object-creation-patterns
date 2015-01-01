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





