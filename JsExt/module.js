jsDom.Module = function () {
    this.require = function (path) {
        var mod = require.modules[path];
        if (!mod) throw new Error('failed to require "' + path + '"');
        if (!mod.exports) {
            mod.exports = {};
            mod.call(mod.exports, mod, mod.exports, require.relative(path));
        }
        return mod.exports;
    }

    this.require.modules = {}
    var loadedJsFiles = {}

    this.require.register = function (path, exportModule) {
        var makeModule = function (module, exports, require) {
            module.exports = exportModule;
        }
        require.modules[path] = makeModule;
    }

    this.require.relative = function (parent) {
        return function (p) {
            if ('.' != p.charAt(0)) return require(p);
            var path = parent.split('/');
            var segs = p.split('/');
            path.pop();

            for (var i = 0; i < segs.length; i++) {
                var seg = segs[i];
                if ('..' == seg) path.pop();
                else if ('.' != seg) path.push(seg);
            }

            return require(path.join('/'));
        };
    };

    //dependOnJsFile('myScript.js',callback);
    this.dependOnJsFile = function (jsPath, callback) {
        if (jsPath && !loadedJsFiles[jsPath]) {
            loadedJsFiles[jsPath] = true;
            var script = document.createElement('script'),
                fn = callback || function () { };
            script.type = 'text/javascript';
            //IE
            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState == 'loaded' || script.readyState == 'complete') {
                        script.onreadystatechange = null;
                        fn();
                    }
                };
            } else {
                //其他浏览器
                script.onload = function () {
                    fn();
                };
            }

            script.src = url;
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    }
}