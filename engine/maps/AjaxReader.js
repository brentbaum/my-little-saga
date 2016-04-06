class AjaxReader {
    constructor() {

    }

    get(filename, cb) {
        getJSON(filename)
            .then(function(data) {
                cb(data);
            });
    }
}

function getJSON(url) {
    'use strict';
    var xhr = new XMLHttpRequest();
    var p = new Promise(function(resolve, reject) {

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(xhr.responseText);
                }
            }
        };
    });
    xhr.open('GET', url);
    xhr.send();
    return p;
}
