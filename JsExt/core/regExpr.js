(function regExpr(Module) {
    var regExpr = {
        rhtmlSuffix: /HTML$/i,
        rnothtmlwhite: /[^\x20\t\r\n\f]+/g
    }

    Module.register("regExpr", regExpr);
})(Module);