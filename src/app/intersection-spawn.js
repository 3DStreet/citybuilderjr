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

    el.addEventListener(data.event, evt => {
      // don't spawn if class specified in objects property but it is not matched intersected element
      if (data.objects && !evt.detail.intersectedEl.classList.contains(data.objects)) { return; }

      // Create element.
      const spawnEl = document.createElement('a-entity');

      // Set components and properties.
      Object.keys(data).forEach(name => {
        if (['event', 'objects', 'gridSize', 'gridDivisions'].includes(name)) { return; }
        AFRAME.utils.entity.setComponentProperty(spawnEl, name, data[name]); // is setAttribute a new version of "set component property"?
      });

      const _worldToLocal = (originalPosition, targetEl) => {
        // snap the intersection location to the gridlines
        const helperVector = this.helperVector;
        helperVector.copy(originalPosition);
        targetEl.object3D.worldToLocal(helperVector);
        return helperVector;
      };
      const targetEl = evt.detail.intersection.object.el;
      const localPos = _worldToLocal(evt.detail.intersection.point, targetEl); // convert world intersection position to local position
      console.log('Local Position:', localPos);
      spawnEl.setAttribute('position', localPos)
      targetEl.appendChild(spawnEl);
      const gridPos = this.localToStateGrid(localPos, data.gridSize, data.gridDivisions);
      console.log('Grid Position:', gridPos);
    })
  },
    // Convert local grid position to long / lat state grid coordinates
    localToStateGrid: function (localPos, gridSize, gridDivisions) {
    // grid divisions (# of cells) ie 20 divisions
    // grid size (meter) ie 5 meters
    // cellsPerMeter: gridDivisions / gridSize = 4 cells per meter
    const cellsPerMeter = gridDivisions / gridSize;
    console.log(`cellsPerMeter: ${cellsPerMeter}`);
    const gridLong = localPos.x * cellsPerMeter;
    const gridLat = localPos.z * cellsPerMeter * -1; // A-Frame uses 'z' for depth/forward, we reverse so positive latitude is forward
    console.log(`Converted Lat Y: ${gridLat}, Grid Long X: ${gridLong}`);
    const gridLatRounded = Math.round(gridLat);
    const gridLongRounded = Math.round(gridLong);
    console.log(`Rounded Lat Y: ${gridLatRounded}, Grid Long X: ${gridLongRounded}`)
    return {
      x: gridLongRounded,
      y: gridLatRounded
    };

  }
});