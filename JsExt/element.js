jsDom.element = {
    createNode: function (htmltag) {
        //将一段html 转换为 Document Object Model （文档对象模型）,而不影响到当前的html内容，可以通过document.implementation.createHTMLDocument创建一个新的document实现
        var doc=document.implementation.createHTMLDocument( "" );
        let tempNode = doc.createElement('div');
        tempNode.innerHTML = htmltag;
        return tempNode.firstChild;
    },
    createDocumentFragment: function (htmltag) {
        var doc=document.implementation.createHTMLDocument( "" );
        let fragContainer = doc.createDocumentFragment();
        let frag = doc.createRange().createContextualFragment(htmltag);

        fragContainer.appendChild(frag);
        return fragContainer.firstChild;
    }
}