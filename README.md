
# Cliy
Command Line Interface Library. [example](https://github.com/vokeio/cliy/blob/master/example.js)

## Features
- Configuration based API
- Auto created help menus

## Example
```js
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
                description: 'I am an Operation',
                options: [
                    'opt1',
                    { name: 'opt2', description: 'I am an Option' },
                ],
                async handler (options, results, parameters) {
                    console.log(`a options: ${JSON.stringify(values)}`);
                    console.log(`a results: ${JSON.stringify(results)}`);
                    console.log(`a parameters: ${JSON.stringify(parameters)}`);
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
							return 'two'
						}
					}
				]
			}
		]
	});

	await program.run(process.argv);

}()).catch(console.error);
```

## API
- `name: String` (default: program)
- `version: String` (default: 0.0.0)
- `operations: Array`
	- `operation: Object`
		- `key: String`
		- `name: String`
		- `description: String`
		- `options: Array<String,Object>`
		- `operations: Array<Object>`
		- `handler: AsyncFunction`
			- `options: Object` An object of name value pairs generated from the arguments following an operation.
			- `results: Object` An object of name value pairs generated from the returned results from an operation.
			- `parameters: Array` The remaining arguments from an operation.
- `setup: AsyncFunction`
	- `options: Object`
- `has: AsyncFunction`
	- `data: String` Name or key
- `find: AsyncFunction`
	- `data: String` Name or key
<!-- - `remove: AsyncFunction`
	- `operation: Object` -->
- `add: AsyncFunction`
	- `operation: Object`
- `execute: AsyncFunction`
	- `operations: Array`
		- `operation: Object`
<!-- - `parse: AsyncFunction`
	- `args: Array` -->
- `run: AsyncFunction`
	- `arguments: process.argv`
- `log: Function` Will print to console with color and style.
	- `text: String`
	- `colors: Array`
- `info: Function` Will print to console with color and style. (Default color `green`)
	- `text: String`
	- `colors: Array`
- `warn: Function` Will print to console with color and style. (Default color `yellow`)
	- `text: String`
	- `colors: Array`
- `error: Function` Will print to console with color and style. (Default color `red`)
	- `text: String`
	- `colors: Array`

## Colors
- Style
	- reset
	- bold
	- dim
	- italic
	- underline
	- blink
	- inverse
	- hidden
	- strike
- Foreground
	- black
	- red
	- green
	- yellow
	- blue
	- magenta
	- cyan
	- white
	- gray
	- grey
- Background
	- bgBlack
	- bgRed
	- bgGreen
	- bgYellow
	- bgBlue
	- bgMagenta
	- bgCyan
	- bgWhite

## Authors
[Vokeio](https://github.com/vokeio)

## License
[Why You Should Choose MPL-2.0](http://veldstra.org/2016/12/09/you-should-choose-mpl2-for-your-opensource-project.html)
This project is licensed under the MPL-2.0 License
