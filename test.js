#!/usr/bin/env node

const Cliy = require('./index');
const Package = require('./package');

Promise.resolve().then(async function () {

	const options = { name: 'test', version: Package.version };
	const program = new Cliy(options);

	await program.add([
		{
			key: 't',
			name: 'test',
			method: async function () {
				console.log('test');
			}
		}
	]);

	await program.run(process.argv);

}).catch(function (error) {
	console.error(error);
});
