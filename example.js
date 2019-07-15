#!/usr/bin/env node

// node example.js -abc foo bar -d bat=baz

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
                description: 'I am an Operation',
                options: [
                    'opt1',
                    { name: 'opt2', description: 'I am an Option' },
                ],
                async handler (options, results, parameters) {
                    console.log(`a options: ${JSON.stringify(values)}`);
                    console.log(`a results: ${JSON.stringify(results)}`);
                    console.log(`a parameters: ${JSON.stringify(parameters)}`);
                    console.log(`\n`);
					return 'one';
				},
				operations: [
					{
						key: 'b',
						name: 'two',
                        async handler (options, results, parameters) {
                            console.log(`b options: ${JSON.stringify(options)}`);
                            console.log(`b results: ${JSON.stringify(results)}`);
                            console.log(`b parameters: ${JSON.stringify(parameters)}`);
                            console.log(`\n`);
							return 'two'
						}
					},
					{
						key: 'c',
						name: 'three',
                        async handler (options, results, parameters) {
                            console.log(`c options: ${JSON.stringify(options)}`);
                            console.log(`c results: ${JSON.stringify(results)}`);
                            console.log(`c parameters: ${JSON.stringify(parameters)}`);
                            console.log(`\n`);
							return 'three'
						}
					}
				]
			},
            {
				key: 'd',
				name: 'four',
                options: [ 'bat' ],
                async handler (options, results, parameters) {
                    console.log(`d options: ${JSON.stringify(options)}`);
                    console.log(`d results: ${JSON.stringify(results)}`);
                    console.log(`d parameters: ${JSON.stringify(parameters)}`);
                    console.log(`\n`);
					return 'four';
				}
			}
		]
	});

	await program.run(process.argv);

}()).catch(console.error);
