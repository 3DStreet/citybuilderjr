/* global AFRAME */
/**
 * change position of element by it's grid coordinates
 *
 */
AFRAME.registerComponent('grid-coord', {
  schema: {
    gridCoord: {type: 'string', default: ''},
    gridSize: {type: 'number', default: 5},
    gridDivisions: {type: 'number', default: 20}
  },
  init: function () {
    const data = this.data;
    const el = this.el;
    
    if (!data.gridCoord) { return; }

    [this.lon, this.lat] = data.gridCoord.split(',');

    const gridPos = this.stateToLocalGrid(data.gridSize, data.gridDivisions);

    el.setAttribute('position', gridPos);

  },
  // Convert long / lat state grid coordinates to local grid position
  stateToLocalGrid: function (gridSize, gridDivisions) {
    // grid divisions (# of cells) ie 20 divisions
    // grid size (meter) ie 5 meters
    // cellsPerMeter: gridDivisions / gridSize = 4 cells per meter
    const cellsPerMeter = gridDivisions / gridSize;
    const snap = this.el.getAttribute('snap');
    let snapOffset = (snap) ? snap['offset'] : 0.01;

    const [posLong, posLat] = 
      [this.lon, this.lat].map((strVal) => {
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