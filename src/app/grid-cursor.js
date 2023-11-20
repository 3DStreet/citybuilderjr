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

    const _worldToLocal = (originalPosition) => {
      // snap the intersection location to the gridlines
      const helperVector = this.helperVector;
      helperVector.copy(originalPosition);
      this.el.object3D.worldToLocal(helperVector);
      return helperVector;
    };

    const _convertLocalToWorld = (localPosition) => {
      // Use Three.js's localToWorld method to convert the position
      const worldPosition = new THREE.Vector3();
      worldPosition.copy(localPosition);
      this.el.object3D.localToWorld(worldPosition);
    
      return worldPosition;
    }

    const localPos = _worldToLocal(intersection.point); // convert to local intersection point
    const localSnapPos = _snapper(localPos, 0.125, 0.25); // use snapping logic which assumes local intersection
    const snapPos = _convertLocalToWorld(localSnapPos); // world snap position

    if (this.oldPos.equals(localSnapPos)) {     // if no change to snapped position, don't move anything
      return;
    }

    this.cursorEl.object3D.position.copy(snapPos);
    this.oldPos.copy(localSnapPos);
    this.cursorEl.emit("cursormoved"); // play sound effect
  }
});
