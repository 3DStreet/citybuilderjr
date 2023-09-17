# citybuilderjr

* source assets from kaykit https://kaylousberg.itch.io/city-builder-bits
* audit.js and pipeline.js scripts using donmccurdy's gltf-transform package
* screenshot-glb script from shopify

asset pipeline utilities - 

## audit.js
`$ node audit`
returns csv of gltf assets in project

## pipeline.js
`$ node pipeline`
takes input directory of assets and optimizes each including adding draco compression to an output directory

example usage:
`$ node pipeline -i ./assets/ -o ./dist/`

## screenshot-glb
`$ screenshot-glb -i input.glb -o test.png`
glb is required, doesn't work with gltf ([issue](https://github.com/Shopify/screenshot-glb/issues/98))
create a screenshot using the screenshot-glb script
todo: script to run screenshot-glb across all glbs, or should use output of node audit (which should be json instead of csv anyway)
