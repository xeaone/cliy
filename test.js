#!/usr/bin/env node

const Cliy = require('./index');
const Package = require('./package');

// node test -12 test la

(async function() {

	const program = new Cliy();

	await program.setup({
		name: 'test',
		// fallback: false,
		version: Package.version,
		operations: [
			{
				key: '1',
				name: 'one',
				method: async function (argument, values) {
					program.log(`one: ${argument}`, ['green', 'bgWhite', 'bold']);
					program.log(`one: ${JSON.stringify(values)}`, ['white', 'bgBlack', 'underline']);
					return 'one';
				},
				operations: [
					{
						key: '2',
						name: 'two',
						method: async function (argument, values) {
							program.log(`two: ${argument}`, ['blue', 'bgGreen', 'strike']);
							program.log(`two: ${JSON.stringify(values)}`, ['cyan', 'bgWhite', 'italic']);
							return 'two'
						}
					},
					{
						key: '3',
						name: 'three',
						method: async function (argument, values) {
							program.info(`three: ${argument}`);
							program.error(`three: ${JSON.stringify(values)}`);
							return 'three'
						}
					}
				]
			}
		]
	});

	await program.run(process.argv);

}()).catch(function (error) {
	console.log(error);
});
