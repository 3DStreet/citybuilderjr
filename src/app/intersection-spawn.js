/* global AFRAME */
/**
 * Spawn entity at the intersection point on click, given the properties passed.
 *
 * `<a-entity intersection-spawn="mixin: box; material.color: red">` will spawn
 * `<a-entity mixin="box" material="color: red">` at intersection point.
 */
AFRAME.registerComponent('intersection-spawn', {
  schema: {
    default: '',
    parse: AFRAME.utils.styleParser.parse,
  },

  init: function () {
    const data = this.data;
    const el = this.el;
    this.helperVector = new THREE.Vector3();
    this.targetEl = document.querySelector('#city-container');

    el.addEventListener(data.event, evt => {
      // don't spawn if class specified in objects property but it is not matched intersected element
      if (data.objects && !evt.detail.intersectedEl.classList.contains(data.objects)) { return; }

      // Create element.
      const spawnEl = document.createElement('a-entity');

      // // Snap intersection point to grid and offset from center.
      // spawnEl.setAttribute('position', evt.detail.intersection.point);

      // Set components and properties.
      Object.keys(data).forEach(name => {
        if (name === 'event' || name === 'objects') { return; }
        AFRAME.utils.entity.setComponentProperty(spawnEl, name, data[name]); // is setAttribute a new version of "set component property"?
      });

      const _worldToLocal = (originalPosition, targetEl) => {
        // snap the intersection location to the gridlines
        const helperVector = this.helperVector;
        helperVector.copy(originalPosition);
        targetEl.object3D.worldToLocal(helperVector);
        return helperVector;
      };

      const localPos = _worldToLocal(evt.detail.intersection.point, this.targetEl); // convert world intersection position to local position
      spawnEl.setAttribute('position', localPos)
      this.targetEl.appendChild(spawnEl);

    });
  }
});