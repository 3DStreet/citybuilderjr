/* global AFRAME */

const COLORS = { 
  'Blue':'#6199D5',
  'Red': '#E54661', 
  'Green':'#61D576', 
  'Yellow':'#E0D629',
  'Purple':'#CA29E0'
};

const TILES = { 
  'Water':'13',
  'Grass': '23', 
  'Sand':'33', 
  'Road':'12',
  'Intersection':'22',
  'T-Intersection':'23',
  'Turn':'11',
  'Tree1':'21',
  'Tree2':'31',
};

const INITIAL_STATE = {
  color: {
    list: COLORS,
    index: 0,
    name: '',
    hex: '',
  },
  tile: {
    list: TILES,
    index: 0,
    name: '',
    atlas: '',
  }
}

AFRAME.registerState({
  initialState: INITIAL_STATE,
  handlers: {
    decreaseColorIndex: function (state) { 
      state.color.index -= 1;
      if (state.color.index < 0) { state.color.index = 0 }
    },
    increaseColorIndex: function (state) {
      state.color.index += 1;
      if (state.color.index >= Object.keys(state.color.list).length ) { state.color.index -= 1 }
    },
    decreaseTileIndex: function (state) { 
      state.tile.index -= 1;
      if (state.tile.index < 0) { state.tile.index = 0 }
    },
    increaseTileIndex: function (state) {
      state.tile.index += 1;
      if (state.tile.index >= Object.keys(state.tile.list).length ) { state.tile.index -= 1 }
    }

  },
  computeState: function (newState, payload) {
    newState.color.name = getColorNameFromState(newState);
    newState.color.hex = getColorHexFromState(newState);
    newState.tile.name = getTileNameFromState(newState);
    newState.tile.atlas = getTileAtlasFromState(newState);
    
  }
});

function getColorNameFromState(state) {
  const colorsKey = Object.keys(state.color.list)[state.color.index]; // 'Blue' if index = 0
  return colorsKey;
}

function getColorHexFromState(state) {
  const colorsKey = getColorNameFromState(state);
  return state.color.list[colorsKey];  
}

function getTileNameFromState(state) {
  const atlasKey = Object.keys(state.tile.list)[state.tile.index]; 
  return atlasKey;
}

function getTileAtlasFromState(state) {
  const atlasKey = getTileNameFromState(state);
  return state.tile.list[atlasKey];
}

/**
 * Set color for material based on current index from state
 */
AFRAME.registerComponent('set-color-from-state', {
  dependencies: ['material'],

  init: function () {
    this.el.setAttribute('material', 'color', getColorHexFromState(AFRAME.scenes[0].systems.state.state));
  }
});
