

function isMobileReq() {
    return /mobile/i.test(navigator.userAgent);
}


function isEmpty(obj){
    return obj === undefined || obj === null
}


function base64ToBlob(code) {
    let parts = code.split(';base64,');
    let contentType = parts[0].split(':')[1];
    let raw = window.atob(parts[1]);
    let rawLength = raw.length;

    let uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], {type: contentType});
}


function downloadBase64(fileName, content) {
    let aLink = document.createElement('a');
    let blob = this.base64ToBlob(content);

    let evt = document.createEvent("HTMLEvents");
    //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
    evt.initEvent("click", true, true);
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    //兼容火狐
    aLink.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));
}


function downloadFile(fileFullName,fileFullType,content){
    const blob = new Blob([content], { type:  fileFullType});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileFullName;
    a.click();
    a.remove();
}


// 导出word
function wordExport(contentNode) {
    var static = {
        mhtml: {
            top: "Mime-Version: 1.0\nContent-Base: " + location.href + "\nContent-Type: Multipart/related; boundary=\"NEXT.ITEM-BOUNDARY\";type=\"text/html\"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset=\"utf-8\"\nContent-Location: " + location.href + "\n\n<!DOCTYPE html>\n<html>\n_html_</html>",
            head: "<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n<style>\n_styles_\n</style>\n</head>\n",
            body: "<body>_body_</body>"
        }
    };
    var options = {
        maxWidth: 624
    };

    // Clone selected element before manipulating it
    var markup = $(contentNode).clone();

    // Remove hidden elements from the output
    markup.each(function() {
        var self = $(this);
        if (self.is(':hidden')) self.remove();
    });

    // Handle <code> tags within .highlight class
    markup.find('.highlight code').each(function() {
        var content = $(this).html();
        var classes = $(this).attr('class');
        var styles = 'font-family: Consolas, \'Courier New\', Courier, monospace; background: #f5f5f5; border: 1px solid #ccc; padding: 2px 4px; display: inline-block; white-space: pre-wrap;';

        // Replace the <code> tag with a styled <div>
        $(this).replaceWith('<div style="' + styles + '" class="' + classes + '">' + content + '</div>');
    });

    // Handle <pre> tags
    markup.find('pre').each(function() {
        var content = $(this).html();
        var styles = 'white-space: pre-wrap; background: #f5f5f5; border: 1px solid #ccc; padding: 10px; overflow: auto; font-family: Consolas, \'Courier New\', Courier, monospace;';

        // Replace the <pre> tag with a styled <div>
        $(this).replaceWith('<div style="' + styles + '">' + content + '</div>');
    });

    // Embed all images using Data URLs
    var images = [];
    var img = markup.find('img');
    for (var i = 0; i < img.length; i++) {
        // Calculate dimensions of output image
        var w = Math.min(img[i].width, options.maxWidth);
        var h = img[i].height * (w / img[i].width);
        // Create canvas for converting image to data URL
        var canvas = document.createElement("CANVAS");
        canvas.width = w;
        canvas.height = h;
        // Draw image to canvas
        var context = canvas.getContext('2d');
        context.drawImage(img[i], 0, 0, w, h);
        // Get data URL encoding of image
        var uri = canvas.toDataURL("image/png");
        $(img[i]).attr("src", img[i].src);
        img[i].width = w;
        img[i].height = h;
        // Save encoded image to array
        images[i] = {
            type: uri.substring(uri.indexOf(":") + 1, uri.indexOf(";")),
            encoding: uri.substring(uri.indexOf(";") + 1, uri.indexOf(",")),
            location: $(img[i]).attr("src"),
            data: uri.substring(uri.indexOf(",") + 1)
        };
    }

    // Prepare bottom of mhtml file with image data
    var mhtmlBottom = "\n";
    for (const element of images) {
        mhtmlBottom += "--NEXT.ITEM-BOUNDARY\n";
        mhtmlBottom += "Content-Location: " + element.location + "\n";
        mhtmlBottom += "Content-Type: " + element.type + "\n";
        mhtmlBottom += "Content-Transfer-Encoding: " + element.encoding + "\n\n";
        mhtmlBottom += element.data + "\n\n";
    }
    mhtmlBottom += "--NEXT.ITEM-BOUNDARY--";

    // Load CSS styles for <pre> and <code> tags
    var styles = `
        pre {
            background: #f5f5f5;
            border: 1px solid #ccc;
            padding: 10px;
            overflow: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: Consolas, 'Courier New', Courier, monospace;
        }
    `;

    // Aggregate parts of the file together
    var fileContent = static.mhtml.top.replace("_html_", static.mhtml.head.replace("_styles_", styles) + static.mhtml.body.replace("_body_", markup.html())) + mhtmlBottom;

    // Create a Blob with the file contents
    var blob = new Blob([fileContent], {
        type: "application/msword;charset=utf-8"
    });

    return blob;
}

