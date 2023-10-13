# citybuilderjr
## City building demo project showing gltf to app pipeline using gltf-transform and screenshot-glb.
<img src="https://github.com/3DStreet/citybuilderjr/assets/470477/b72f5857-32fe-45a3-8252-3670a1e1ea7d" width=300 />

Features:
* Cross platform -- runs in most web browsers across devices.
* Simple to use -- Click and drag on desktop. Open it on a smartphone and use the device motion sensors. Or [plug in a VR headset](https://immersiveweb.dev/)!
* Quest controller support -- Use Meta Quest headset and controllers to make a scene
* Reusable gltf asset build system -- example to use for other projects

Credits:
* audit.js and pipeline.js scripts using donmccurdy's gltf-transform package
* screenshot-glb script from shopify
* source assets from kaykit https://kaylousberg.itch.io/city-builder-bits
* Continuation of Kieran's work from: https://glitch.com/edit/#!/aframe-2-vr-menus
* Which itself was modified from this original: https://glitch.com/~aframe-aincraft
* Inspired by: https://threejs.org/examples/webgl_interactive_voxelpainter.html
* Built with [A-Frame](https://aframe.io), a web framework for building virtual reality experiences. Make WebVR with HTML and Entity-Component. Works on Vive, Rift, desktop, mobile platforms.

# Build
This repo is intended to show an example of a complete gltf pipeline from exported gltf file through optimization and screenshot generation and a json file to describe the model library for use in front-end apps.

## Build instructions
* (0) `npm install`
* (1) `node gltf-audit.mjs -i ./src/models` - create initial gltf-audit.json output
* (2) `node gltf-build.mjs -i ./src/models -o ./dist/models -u` - create optimized glb models
* (3) `node gltf-screenshots.mjs -i ./dist/models -o ./dist/img -u` - create preview images for each glb

## gltf utility script description

### gltf-audit.js
Generates json file with details about gltf or glb files in project ./src/ path

example usage:
`$ node gltf-audit -i src`

-i is optional to specify a directory to audit

### gltf-build.js
Takes input directory of assets and optimizes each including adding draco compression to an output directory

example usage:
`$ node gltf-build -i src -o dist`
* -i and -o are required
* optional --update (or -u) will assume existence of gltf-audit.json from gltf-audit.js above, and add the newly built glb files under "dist" key
`$ node gltf-build -i src -o dist -u`

### gltf-screenshots.js
Create screenshots for all glb files found in input path using the screenshot-glb script.

example usage
`$ node gltf-screenshots -i ./dist/ -o ./dist/`
`$ node gltf-screenshots -i ./dist/ -o ./dist/ -u`
* optional --update (or -u) will assume existence of gltf-audit.json from gltf-audit.js above, and add the newly built jpg files under "img" key

### screenshot-glb (shopify script)
example usage:
`$ screenshot-glb -i input.glb -o test.png`
* glb is required, doesn't work with gltf ([issue](https://github.com/Shopify/screenshot-glb/issues/98))
