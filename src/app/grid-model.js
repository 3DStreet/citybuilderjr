/* global AFRAME */
/**
 * change gltf-model of element by model name
 *
 */
AFRAME.registerComponent('grid-model', {
  schema: {
    model: {type: 'string', default: ''}
  },
  addGltfModel: function (modelName) {
    const el = this.el;
    const sceneEl = el.sceneEl;

    if (sceneEl.catalogIsloaded) {
        el.setAttribute('gltf-model', './' + sceneEl.systems.state.state.model.list[modelName].dist);
    } else {
      sceneEl.addEventListener('catalogIsLoaded', () => {
        el.setAttribute('gltf-model', './' + sceneEl.systems.state.state.model.list[modelName].dist);
      })
    }    
  },  
  update: function(oldData) {
    this.addGltfModel(this.data.model);
  }
});
