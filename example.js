#!/usr/bin/env node

const Cliy = require('./index');
const Package = require('./package');

(async function() {

	const program = new Cliy();

	await program.setup({
		name: Package.name,
		version: Package.version,
		operations: [
			{
				key: 'a',
				name: 'one',
                values: [ 'v1', 'v2' ],
                async handler (values, results, parameters) {
                    console.log(`a values: ${JSON.stringify(values)}`);
                    console.log(`a results: ${JSON.stringify(results)}`);
                    console.log(`a parameters: ${JSON.stringify(parameters)}`);
                    console.log(`\n`);
					// program.log(`one: ${argument}`, ['green', 'bgWhite', 'bold']);
					// program.log(`one: ${JSON.stringify(values)}`, ['white', 'bgBlack', 'underline']);
					return 'one';
				},
				operations: [
					{
						key: 'b',
						name: 'two',
                        async handler (values, results, parameters) {
                            console.log(`b values: ${JSON.stringify(values)}`);
                            console.log(`b results: ${JSON.stringify(results)}`);
                            console.log(`b parameters: ${JSON.stringify(parameters)}`);
                            console.log(`\n`);
							// program.log(`two: ${argument}`, ['blue', 'bgGreen', 'strike']);
							// program.log(`two: ${JSON.stringify(values)}`, ['cyan', 'bgWhite', 'italic']);
							return 'two'
						}
					},
					{
						key: 'c',
						name: 'three',
                        async handler (values, results, parameters) {
                            console.log(`c values: ${JSON.stringify(values)}`);
                            console.log(`c results: ${JSON.stringify(results)}`);
                            console.log(`c parameters: ${JSON.stringify(parameters)}`);
                            console.log(`\n`);
							// program.info(`three: ${argument}`);
							// program.error(`three: ${JSON.stringify(values)}`);
							return 'three'
						}
					}
				]
			}
		]
	});

	await program.run(process.argv);

}()).catch(console.error);
