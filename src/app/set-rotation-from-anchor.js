/* global AFRAME, THREE */

AFRAME.registerComponent('set-rotation-from-anchor', {
    schema: {
        anchorId: {type: 'selector'} // such as 'city-container'
    },

    init: function () {
        this.anchorEl = null;
        if (!this.data.anchorId) {     // if no anchorId, find first anchor in scene with query selector [anchored]
            this.anchorEl = document.querySelector('[anchored]')
        } else {        // if exists then try queryselect
            this.anchorEl = document.querySelector(this.data.anchorId);
        }
    },

    tick: function() { // should this be throttled? how often should the anchor update pose? it seems to do so a lot!
        if (this.anchorEl && this.anchorEl.object3D) {
            this.el.object3D.quaternion.copy(this.anchorEl.object3D.quaternion);
        }
    }
    
})