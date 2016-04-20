"use strict";

let cacheInstance = null;
// provides images upon request, ensures that each image is loaded only once

class ImageCache {

    constructor() {
        if (cacheInstance) {
	    	return cacheInstance;
        }
        this.images = {};
		cacheInstance = this;
        return this;
    }

    getImage(imgname, caller){
    	if(imgname in this.images){
    		this.imagePass(this.images[imgname], caller);
    		return this.images[imgname];
    	} else {
    		// load it up
    		var newimg = new Image();
			var exdata = {};			
			newimg.onload = function() {
				cacheInstance.imagePass(cacheInstance.images[imgname], caller);
				//console.log("Loaded " + imgname);
			};
			this.images[imgname] = newimg;
    		newimg.src = 'resources/' + imgname;
    		//console.log("Processed " + imgname);
    		return this.images[imgname];
    	}
    }

    imagePass(img, caller){
		// updates the caller once its image is loaded, or immediately if it already is    
		caller.width = img.width;
    	caller.imageWidth = img.width;
    	caller.height = img.height;
	    caller.loaded = true;
	    if (!!caller.onImageLoad) {
			caller.onImageLoad();
	    }
	}
}