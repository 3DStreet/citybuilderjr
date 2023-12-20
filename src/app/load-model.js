/* global AFRAME */
/**
 * add model to scene ground by its name and grid coordinats.
 *
 * `<a-entity intersection-spawn="mixin: box; material.color: red">` will spawn
 * `<a-entity mixin="box" material="color: red">` at intersection point.
 */
AFRAME.registerComponent('add-model', {
  schema: {
    name: {type: 'string', default: ''},
    gridCoord: {type: 'array', default: []},
    //lat: {type: 'number', default: ''},
    gridSize: {type: 'number', default: 5},
    gridDivisions: {type: 'number', default: 20}
  },

  init: function () {
    const data = this.data;
    const el = this.el;
    const sceneEl = el.sceneEl;
    this.helperVector = new THREE.Vector3();

      if (!data.name && data.gridCoord) { return; }

      const gridPos = this.stateToLocalGrid(data.gridCoord, data.gridSize, data.gridDivisions);

      el.setAttribute('position', gridPos);

      if (sceneEl.catalogIsloaded) {
          el.setAttribute('gltf-model', './' + sceneEl.systems.state.state.model.list[data.name].dist);
      } else {
        sceneEl.addEventListener('catalogIsLoaded', () => {
          el.setAttribute('gltf-model', './' + sceneEl.systems.state.state.model.list[data.name].dist);
        })
      }
  },
  // Convert long / lat state grid coordinates to local grid position
  stateToLocalGrid: function (lon_lat, gridSize, gridDivisions) {
    // grid divisions (# of cells) ie 20 divisions
    // grid size (meter) ie 5 meters
    // cellsPerMeter: gridDivisions / gridSize = 4 cells per meter
    const cellsPerMeter = gridDivisions / gridSize;
    const snap = this.el.getAttribute('snap');
    let snapOffset = (snap) ? snap['offset'] : 0.01;

    const [posLong, posLat] = 
      lon_lat.map((strVal) => {
        const numVal = Number(strVal);        
        // add - or + snap offset is used to snap element to the desired grid cell
        return (numVal + (numVal >= 0 ? -snapOffset : snapOffset )) / cellsPerMeter;
      });
    // console.log(`Lat Y: ${posLat}, Long X: ${posLong}`);

    const localPos = {
      x: posLong, 
      z: posLat * -1
    };
    return localPos;
  }
});