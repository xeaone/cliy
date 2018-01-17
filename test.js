#!/usr/bin/env node

const Cliy = require('./index');
const Package = require('./package');

(async function() {

	const program = new Cliy();

	await program.setup({
		name: 'test',
		version: Package.version,
		operations: [
			{
				key: 't',
				name: 'test',
				method: async function () {
					console.log('test');
				}
			}
		]
	});
	await program.run(process.argv);

}()).catch(function (error) {
	console.log(error);
});
