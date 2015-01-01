var ObjectConstructor = (function () {

    // 'static' private members - shared by all ObjectConstructor instances, but not directly available through object API 
    var staticPrivateData = {data:"I am private and also shared by all ObjectConstructor instances"};
    function staticPrivateMethod() {
        return "I am private and also shared by all ObjectConstructor instances";
    }

    // constructor function
    function ObjectConstructor(param1, param2) {
        if (!(this instanceof ObjectConstructor)) {
            return new ObjectConstructor();
        }

        // private members - created for each object instance
        var privateData = {data:"I am private and created for each ObjectConstructor instance"};

        function privateMethod() {
            return "I am private and created for each ObjectConstructor instance";
        }

        // public members - created for each object instance
        this.property1 = param1;
        this.property2 = param2;

        this.setPrivateData = function (msg) {
            console.log(privateMethod());
            console.log(staticPrivateMethod());
            if (msg) {
                privateData.data = msg;
            }
        };
        this.getPrivateData = function () {
            return privateData;
        };
    }

    /* 'static', public members */
    ObjectConstructor.prototype.sayHello = function () {
        return 'hello, I am public method, shared by all ObjectConstructor instances';
    };

    ObjectConstructor.prototype.data = {type: 'shared, public data',name: 'PSTech', location:'Belgrade, Serbia', numOfEmployees: 330};

    ObjectConstructor.prototype.setStaticPrivateData = function (msg) {
        if (msg) {
            staticPrivateData.data = msg;
        }
    };
    ObjectConstructor.prototype.getStaticPrivateData = function () {
        return staticPrivateData;
    };
    
    return ObjectConstructor;
})();


