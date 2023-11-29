/* global AFRAME */

const COLORS = { 
  'Blue':'#6199D5',
  'Red': '#E54661', 
  'Green':'#61D576', 
  'Yellow':'#E0D629',
  'Purple':'#CA29E0'
};

const MODELS = { 
  'watertower': {
    "dist": "dist/models/watertower.glb",
    "img": "dist/img/watertower.jpg"
  },
  'tree_E': {
    "dist": "dist/models/tree_E.glb",
    "img": "dist/img/tree_E.jpg"
  }, 
  'road_junction': {
    "dist": "dist/models/road_junction.glb",
    "img": "dist/img/road_junction.jpg"
  }, 
  'road_straight': {
    "dist": "dist/models/road_straight.glb",
    "img": "dist/img/road_straight.jpg"
  }, 
  'building_F': {
    "dist": "dist/models/building_F.glb",
    "img": "dist/img/building_F.jpg"
  }
};

const INITIAL_STATE = {
  color: {
    list: COLORS,
    index: 0,
    name: '',
    hex: '',
  },
  model: {
    list: MODELS,
    index: 0,
    name: '',
    img: '',
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
    decreaseModelIndex: function (state) { 
      state.model.index -= 1;
      if (state.model.index < 0) { state.model.index = 0 }
    },
    increaseModelIndex: function (state) {
      state.model.index += 1;
      if (state.model.index >= Object.keys(state.model.list).length ) { state.model.index -= 1 }
    },
    addModel: function (state, payload) {
      state.model.list[payload.name] = {
        'dist': payload.dist,
        'img': payload.img
      }
    }
    /* example usage of `addModel` handler
      var payload =   {
        "name": "tree_E",
        "src": "src/models/kaykit/tree_E.gltf",
        "dist": "dist/models/tree_E.glb",
        "img": "dist/img/tree_E.jpg"
      },
      AFRAME.scenes[0].emit('addModel', payload);
    */

  },
  computeState: function (newState, payload) {
    newState.color.name = getColorNameFromState(newState);
    newState.color.hex = getColorHexFromState(newState);
    newState.model.name = getModelNameFromState(newState);
    newState.model.img = getModelImgFromState(newState);
    newState.model.path = getModelPathFromState(newState);
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

function getModelNameFromState(state) {
  const modelKey = Object.keys(state.model.list)[state.model.index]; 
  return modelKey;
}

function getModelImgFromState(state) {
  const modelKey = getModelNameFromState(state);
  return state.model.list[modelKey].img;
}

function getModelPathFromState(state) {
  const modelKey = getModelNameFromState(state);
  return state.model.list[modelKey].dist;
}

/**
 * Load models from catalog json
 */
AFRAME.registerComponent('load-catalog', {
  schema: {
    source: {type: 'selector'}
  },
  init: function () {
    this.jsonCatalogData = JSON.parse(this.data.source.data);
    console.log(this.jsonCatalogData)
    for (let i = 0; i < this.jsonCatalogData.length; i++) {
      const modelMetadataObject = this.jsonCatalogData[i];
      AFRAME.scenes[0].emit('addModel', modelMetadataObject);
    }
  }
});

/**
 * Set color for material based on current index from state
 */
AFRAME.registerComponent('set-color-from-state', {
  dependencies: ['material'],

  init: function () {
    this.el.setAttribute('material', 'color', getColorHexFromState(AFRAME.scenes[0].systems.state.state));
  }
});

AFRAME.registerComponent('set-model-from-state', {
  init: function () {
    this.runOnce = true;
  },
  update: function () {
    if (this.runOnce) {
      this.el.setAttribute('gltf-model', 'url(./' + getModelPathFromState(AFRAME.scenes[0].systems.state.state) + ')');
      this.el.setAttribute('scale', '0.125 0.125 0.125');
      this.runOnce = false;
    }
  }
});
