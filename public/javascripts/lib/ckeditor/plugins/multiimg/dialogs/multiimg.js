(function() {
    CKEDITOR.dialog.add("multiimg",
        function(a) {
            var src = "/common/public/javascripts/lib/ckeditor/plugins/multiimg/iframehtml/iframe_html.html";
            return {
                title: "批量上传图片",
                minWidth: "660px",
                minHeight:"400px",
                contents: [{
                    id: "tab1",
                    label: "",
                    title: "",
                    expand: true,
                    width: "420px",
                    height: "300px",
                    padding: 0,
                    elements: [{
                        type: "html",
                        style: "width:660px;height:400px",
                        html: '<iframe id="uploadFrame" src="'+src+'?v=' +new Date().getSeconds() + '" frameborder="0"></iframe>'
                    }]
                }],
                // when the dialog ended width ensure,"onOK" will be executed.
                onOk: function() {
                    var ins = a;
                    var num = window.imageUrls.length;
                    var imgHtml = "";

                    for(var i=0;i<num;i++){
                        imgHtml += "<p><img src=\"" + window.imageUrls[i] + "\" /></p>";
                    }
                    ins.insertHtml(imgHtml);
                    window.imageUrls=[];
                },
                onShow: function () {
                    document.getElementById("uploadFrame").setAttribute("src",src+"?v="+new Date().getSeconds());
                }
            }
        })
})();