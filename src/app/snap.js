/**
 * Snap entity to the closest interval specified by `snap`.
 * Offset entity by `offset`.
 * If localId provided, then use the entity returned as the local reference space
 */
AFRAME.registerComponent('snap', {
  dependencies: ['position'],

  schema: {
    offset: {type: 'number'},
    snap: {type: 'number'},
    localId: {type: 'selector'}
  },

  init: function () {
    var self = this;
    this.helperVector = new THREE.Vector3();
    this.originalPos = this.el.getAttribute('position');
    this.el.addEventListener('componentchanged', function (evt) {
      if (evt.detail.name === 'position') {
        self.update()
      };
    });
    this.localEl = null;
    if (!!this.data.anchorId) {
      this.localEl = document.querySelector(this.data.localId)
    }
  },

  update: function () {
    // this element should be a child of the parent anchor container
    // then use snapper as usual
    const data = this.data;

    // const pos = AFRAME.utils.clone(this.originalPos);
    // pos.x = Math.floor(pos.x / data.snap) * data.snap + data.offset.x;
    // pos.y = Math.floor(pos.y / data.snap) * data.snap + data.offset.y;
    // pos.z = Math.floor(pos.z / data.snap) * data.snap + data.offset.z;

    // this.el.setAttribute('position', pos);

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

    let snapPos;
    if (this.localEl && this.localEl.object3D) {
      // this.el.object3D.quaternion.copy(this.anchorEl.object3D.quaternion); copy from 
      const localPos = _worldToLocal(this.localEl.object3D.position); // convert world object from which to localize (anchor) to local position of this object
      const localSnapPos = _snapper(localPos, this.data.offset, this.data.snap); // use snapping logic which assumes local intersection
      snapPos = _convertLocalToWorld(localSnapPos); // world snap position
    } else {
      snapPos = _snapper(this.el.object3D.position, this.data.offset, this.data.snap);
    }

    this.el.object3D.position.copy(snapPos);


  }
});