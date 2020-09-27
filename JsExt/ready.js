function completed() {
	document.removeEventListener( "DOMContentLoaded", completed, false );
	window.removeEventListener( "load", completed, false );
}

jsDom.ready = function (fn) {
    switch (document.readyState) {
        case "complete":
            // 表示文档还在加载中，即处于“正在加载”状态。
            break;
        case "interactive":
            // 文档已经结束了“正在加载”状态，DOM元素可以被访问。
            // 但是像图像，样式表和框架等资源依然还在加载。
            break;
        case "loading":
            // 页面所有内容都已被完全加载.
            // Use the handy event callback
            document.addEventListener("DOMContentLoaded", completed, false);

            // A fallback to window.onload, that will always work
            window.addEventListener("load", completed, false);
            break;
    }
}

document.onreadystatechange = function () {
    if (document.readyState === "complete") {
      initApplication();
    }
  }