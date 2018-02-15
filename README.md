
# Cliy
Command Line Interface Library.

## Features
- Auto created help menus

## API
- `name: String` (default: program)
- `version: String` (default: 0.0.0)
- `operations: Array`
	- `operation: Object`
		- `key: String`
		- `name: String`
		- `operations: Array`
		- `description: String`
		- `method: AsyncFunction`
			- `argument: String` The argument passed in by the user.
			- `values: Object` The name value pair of the returned values from previous methods.
			<!-- - `operations: Array` The operations in order of invocation. -->
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
- `parse: AsyncFunction`
	- `args: Array`
- `run: AsyncFunction`
	- `arguments: process.argv`

## Authors
[AlexanderElias](https://github.com/AlexanderElias)

## License
[Why You Should Choose MPL-2.0](http://veldstra.org/2016/12/09/you-should-choose-mpl2-for-your-opensource-project.html)
This project is licensed under the MPL-2.0 License
