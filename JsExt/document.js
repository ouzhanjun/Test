jsDom.Document = function () {
    
}

jsDom.Document.ready = function () {
    document.onreadystatechange = function () {
        switch (document.readyState) {
            case "loading":
                // document 仍在加载
                console.log("loading");
                break;
            case "interactive":
                // DOMContentLoaded 文档已被解析，"正在加载"状态结束，但是诸如图像，样式表和框架之类的子资源仍在加载
                console.log("interactive");
                break;
            case "complete":
                // load 文档和所有子资源已完成加载。表示 load 状态的事件即将被触发
                console.log("complete");
                break;
        }
    }
}