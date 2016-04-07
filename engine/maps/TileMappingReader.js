"use strict";

class TileMappingReader extends AjaxReader {
    constructor() {
        super();
    }

    get(cb) {
        return super.get("/maps/tile-mapping.json", cb);
    }
}
