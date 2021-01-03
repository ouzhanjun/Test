(function RegExpr(Module) {
    var regExpr = {
        rhtmlSuffix: /HTML$/i,
        rnothtmlwhite: /[^\x20\t\r\n\f]+/g,
        rcheckableType: /^(?:checkbox|radio)$/i,
        rtypenamespace: /^([^.]*)(?:\.(.+)|)/
    }

    Module.register("regExpr", regExpr);
})(Module);