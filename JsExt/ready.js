
jsDom.isReady = false;

function completed() {
    jsDom.isReady = true;
    document.removeEventListener("DOMContentLoaded", completed);
    window.removeEventListener("load", completed);
}

jsDom.ready = function () {
    switch (document.readyState) {
        case "loading":
            // document 仍在加载
            document.addEventListener("DOMContentLoaded", completed);
            window.addEventListener("load", completed);
            break;
        default:
            setTimeout(completed);
            break;
    }
}

jsDom.ready();