"use strict";

class MapReader extends AjaxReader {
    constructor() {
        super();
    }

    get(filename, cb) {
        return super.get('/maps/' + filename + ".json", cb);
    }
}
