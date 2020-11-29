(function Module($window) {

    var Module = function () {
        this.require = function (path) {
            var mod = this.modules[path];
            if (!mod) throw new Error('failed to require "' + path + '"');
            if (!mod.exports) {
                mod.exports = {};
                mod.call(mod.exports, mod, mod.exports, this.relative(path));
            }
            return mod.exports;
        }

        this.modules = {}
        this.loadedJsFiles = {}
        this.initIsDone = false;

        this.register = function (path, exportModule) {
            var makeModule = function (module, exports, require) {
                module.exports = exportModule;
            }
            this.modules[path] = makeModule;
        }

        this.relative = function (parent) {
            return function (p) {
                if ('.' != p.charAt(0)) return this.require(p);
                var path = parent.split('/');
                var segs = p.split('/');
                path.pop();

                for (var i = 0; i < segs.length; i++) {
                    var seg = segs[i];
                    if ('..' == seg) path.pop();
                    else if ('.' != seg) path.push(seg);
                }

                return this.require(path.join('/'));
            };
        };

        this.init = function () {
            if (this.initisDone)
                return;
            var elems = document.getElementsByTagName("script");
            for (var i in elems) {
                var match = /src="(.*)"/.exec(elems[i].outerHTML);
                var jsPath = match && match[1];
                if (jsPath && !this.loadedJsFiles[jsPath]) {
                    this.loadedJsFiles[jsPath] = true;
                }
            }
            this.initIsDone = true;
        }

        //dependOnJsFile('myScript.js',callback);
        this.dependOnJsFile = function (jsPath, callback) {
            !this.initIsDone && this.init();
            if (jsPath && !this.loadedJsFiles[jsPath]) {
                this.loadedJsFiles[jsPath] = true;
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

                script.src = jsPath;
                document.getElementsByTagName('head')[0].appendChild(script);
            }
        }
    }

    if ($window.Module === undefined) {
        $window.Module = new Module();
        $window.Module.init();
    }
})(window);


