# citybuilderjr

* source assets from kaykit https://kaylousberg.itch.io/city-builder-bits
* audit.js and pipeline.js scripts using donmccurdy's gltf-transform package
* screenshot-glb script from shopify

build instructions
* (1) `node gltf-audit -i src` - create initial gltf-audit.json output
* (2) `node gltf-build -i src -o dist -u` - create optimized glb models
* (2) `node gltf-screenshots -i ./dist/ -o ./dist/ -u` - create preview images for each glb

gltf model pipeline utilities description

## gltf-audit.js
example usage:
`$ node gltf-audit -i src`
* returns json file with details about gltf or glb files in project ./src/ path
* -i is optional to specify a directory to audit

## gltf-build.js
example usage:
`$ node gltf-build -i src -o dist`
* takes input directory of assets and optimizes each including adding draco compression to an output directory
* -i and -o are required
* optional --update (or -u) will assume existence of gltf-audit.json from gltf-audit.js above, and add the newly built glb files under "dist" key
`$ node gltf-build -i src -o dist -u`

## gltf-screenshots.js
example usage
`$ node gltf-screenshots -i ./dist/ -o ./dist/`
`$ node gltf-screenshots -i ./dist/ -o ./dist/ -u`
* optional --update (or -u) will assume existence of gltf-audit.json from gltf-audit.js above, and add the newly built jpg files under "img" key

## screenshot-glb (shopify script)
example usage:
`$ screenshot-glb -i input.glb -o test.png`
* create a screenshot using the screenshot-glb script
* glb is required, doesn't work with gltf ([issue](https://github.com/Shopify/screenshot-glb/issues/98))
* DONE: script to run screenshot-glb across all glb in a dist json
* TODO: script to add output image file name in gltf-audit.json
* DONE: dist path from build.js uses absolute path instead of relative path    "dist": "/Users/kieranfarr/dev/citybuilderjr/dist/building_A_withoutBase_opt.glb"


npm run generate-screenshots -i ./dist/models/kaykit/ -o ./dist/models/kaykit/

-i input is /dist/models/kaykit/[name].glb
-o /dist/models/kaykit/[name].jpg
