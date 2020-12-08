(function Deferred(Module, $promise) {
    function deferred() {
        this.when = function(){

        }
    }


    Module.register("deferred", deferred);

})(Module, Module.require("promise"));