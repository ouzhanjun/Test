(function RegExpr(Module) {
    var regExpr = {
        rhtmlSuffix: /HTML$/i,
        rnothtmlwhite: /[^\x20\t\r\n\f]+/g,
        rcheckableType:/^(?:checkbox|radio)$/i
    }

    Module.register("regExpr", regExpr);
})(Module);