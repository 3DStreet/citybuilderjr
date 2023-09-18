# citybuilderjr

* source assets from kaykit https://kaylousberg.itch.io/city-builder-bits
* audit.js and pipeline.js scripts using donmccurdy's gltf-transform package
* screenshot-glb script from shopify

gltf model pipeline utilities

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
* TODO: add option such as --update (or -u) gltf-audit.json which will match src name with each file and add a new key / value pair of 'dist' key and value of new glb path

## screenshot-glb
example usage:
`$ screenshot-glb -i input.glb -o test.png`
* create a screenshot using the screenshot-glb script
* glb is required, doesn't work with gltf ([issue](https://github.com/Shopify/screenshot-glb/issues/98))
* TODO: script to run screenshot-glb across all glb in a dist json
* TODO: script to add output image file name in 

## Potential usage
npm run audit - get json
-- add optional input path

ideal usage
npm run gltf-audit
- generates the gltf-audit.json

npm run gltf-build
- updates gltf-audit.json with glb paths
- 

npm run generate-screenshots -i ./dist/models/kaykit/ -o ./dist/models/kaykit/

-i input is /dist/models/kaykit/[name].glb
-o /dist/models/kaykit/[name].jpg
