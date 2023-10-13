/**
 * Snap entity to the closest interval specified by `snap`.
 * Offset entity by `offset`.
 */
AFRAME.registerComponent('snap', {
  dependencies: ['position'],

  schema: {
    offset: {type: 'vec3'},
    snap: {type: 'vec3'}
  },

  init: function () {
    var self = this;
    this.originalPos = this.el.getAttribute('position');
    this.el.addEventListener('componentchanged', function (evt) {
      if (evt.detail.name === 'position') {
        self.update()
      };
    });
  },

  update: function () {
    const data = this.data;

    const pos = AFRAME.utils.clone(this.originalPos);
    pos.x = Math.floor(pos.x / data.snap.x) * data.snap.x + data.offset.x;
    pos.y = Math.floor(pos.y / data.snap.y) * data.snap.y + data.offset.y;
    pos.z = Math.floor(pos.z / data.snap.z) * data.snap.z + data.offset.z;

    this.el.setAttribute('position', pos);
  }
});