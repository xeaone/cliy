
# Cliy
Command Line Interface Library. [example](https://github.com/vokeio/cliy/blob/master/example.js)

## Features
- Auto created help menus

## API
- `name: String` (default: program)
- `version: String` (default: 0.0.0)
- `operations: Array`
	- `operation: Object`
		- `key: String`
		- `name: String`
		- `values: Array<String>`
		- `operations: Array`
		- `description: String`
		- `handler: AsyncFunction`
			- `values: Object` The name value pair of the generated from operation.values and the non named arguments.
			- `results: Object` The name value pair of the returned values from previous operation.
			- `parameters: Array` The remaining arguments from executed operation.
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
