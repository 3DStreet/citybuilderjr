/* global AFRAME, THREE */
/**
 * provide visual indicator of intersected grid as a red box "cursor"
 */

AFRAME.registerComponent("grid-cursor", {
  schema: {
    allowFrom: { default: "*" },
    cursor: { default: "#cursor" }
  },
  init: function() {
    // set initial values and helper vector
    this.helperVector = new THREE.Vector3();
    this.cursorEl = document.querySelector(this.data.cursor); // this should be a component property selector
    this.oldPos = new THREE.Vector3().copy(this.cursorEl.object3D.position);
    
    // Use events to figure out what raycaster is listening so we don't have to hardcode the raycaster.
    this.el.addEventListener("raycaster-intersected", evt => {
      if (evt.detail.el.matches(this.data.allowFrom)) {
        this.raycaster = evt.detail.el;
      }
    });
    this.el.addEventListener("raycaster-intersected-cleared", evt => {
      if (evt.detail.el.matches(this.data.allowFrom)) {
        this.raycaster = null;
      }
    });

    // throttle tick
    this.tick = AFRAME.utils.throttleTick(this.tick, 30, this);

  },

  tick: function() {
    if (!this.raycaster) {
      this.cursorEl.setAttribute("visible", false);
      return;
    } // Not intersecting.

    let intersection = this.raycaster.components.raycaster.getIntersection(
      this.el
    );
    if (!intersection) {
      this.cursorEl.setAttribute("visible", false);
      return;
    }

    this.cursorEl.setAttribute("visible", true);

    const _snapper = (originalPosition, offset, snap) => {
      // snap the intersection location to the gridlines
      const helperVector = this.helperVector;
      helperVector.copy(originalPosition);

      helperVector.x = Math.floor(helperVector.x / snap) * snap + offset;
      helperVector.y = Math.floor(helperVector.y / snap) * snap + offset;
      helperVector.z = Math.floor(helperVector.z / snap) * snap + offset;
      return helperVector;
    };

    const snapPos = _snapper(intersection.point, 0.25, 0.5);

    // if no change to snapped position, don't move anything
    if (this.oldPos.equals(snapPos)) {
      return;
    } // use three.js equals method instead of ===

    this.cursorEl.object3D.position.copy(snapPos);
    this.oldPos.copy(snapPos);
    this.cursorEl.emit("cursormoved"); // play sound effect
  }
});
