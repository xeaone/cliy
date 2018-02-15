#!/usr/bin/env node

const Cliy = require('./index');
const Package = require('./package');

(async function() {

	const program = new Cliy();

	await program.setup({
		name: 'test',
		order: '',
		version: Package.version,
		operations: [
			{
				key: '1',
				name: 'one',
				method: async function () {
					console.log(arguments);
				},
				options: [
					{
						key: '2',
						name: 'two',
						method: async function () {
							console.log(arguments);
							return 'two'
						}
					},
					{
						key: '3',
						name: 'three',
						method: async function () {
							console.log(arguments);
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
