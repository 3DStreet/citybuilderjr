/* global AFRAME */
/**
 * change rotation of element by rotation value of y-axis
 *
 */
AFRAME.registerComponent('grid-rotation', {
  schema: {
    rotation: {type: 'number', default: 0}
  },
  update: function(oldData) {
    const data = this.data;
    const el = this.el;

    el.setAttribute('rotation', {x:0, y: data.rotation, z: 0});
  }
});