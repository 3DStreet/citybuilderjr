import { resolve, dirname, parse } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SingleBar, Presets } from 'cli-progress';
import { glob } from 'glob';
import pLimit from 'p-limit';
import draco3d from 'draco3dgltf';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import { NodeIO, Logger } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, flatten, dequantize, join, weld, resample, prune, sparse, draco } from '@gltf-transform/functions';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

// Parse command-line arguments
const argv = yargs(hideBin(process.argv))
    .option('input', {
        alias: 'i',
        description: 'Input directory path',
        type: 'string',
    })
    .option('output', {
        alias: 'o',
        description: 'Output directory path',
        type: 'string',
    })
    .demandOption(['input', 'output'], 'Please provide both input and output paths')
    .help()
    .argv;

// Configure glTF I/O.
await MeshoptDecoder.ready;
await MeshoptEncoder.ready;

const io = new NodeIO()
	.setLogger(new Logger(Logger.Verbosity.WARN))
	.registerExtensions(ALL_EXTENSIONS)
	.registerDependencies({
		'draco3d.decoder': await draco3d.createDecoderModule(),
		'draco3d.encoder': await draco3d.createEncoderModule(),
		'meshopt.decoder': MeshoptDecoder,
		'meshopt.encoder': MeshoptEncoder,
	});

// Set up search on the input directory provided.
const limit = pLimit(4); 
const inputDir = resolve(argv.input);  // Use provided input directory
const paths = (await glob(resolve(inputDir, '**/*.{glb,gltf}')))
	.filter((path) => !parse(path).name.endsWith('_opt'));

const bar = new SingleBar({}, Presets.shades_classic);
bar.start(paths.length, 0);

// Iterate over all models and process.
await Promise.all(paths.map((path) => limit(async () => {
	const document = await io.read(path);

	await document.transform(
		dedup(),
		flatten(),
		dequantize(),
		join(),
		weld(),
		resample(),
		prune({ keepAttributes: false, keepLeaves: false }),
		sparse(),
		draco()
	);

	const name = parse(path).name + '_opt.glb';
	await io.write(resolve(argv.output, name), document);  // Use provided output directory

	bar.increment();
})));

bar.stop();

console.log('🍻  Done!');
