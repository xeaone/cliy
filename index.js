'use strict';

const Color = require('./lib/color.js');

module.exports = class Cliy {

	constructor (data) {

		this.fallback = true;
		this.name = 'program';
		this.version = '0.0.0';

		this.operations = [
			{
				key: 'v',
				name: 'version',
				method: this._version.bind(this)
			},
			{
				key: 'h',
				name: 'help',
				method: this._help.bind(this)
			}
		];

		this.setup(data);
	}

	log (text, names) {
		Color.log(text, names);
	}

	info (text, names) {
		Color.info(text, names);
	}

	warn (text, names) {
		Color.warn(text, names);
	}

	error (text, names) {
		Color.error(text, names);
	}

	async _version () {
		console.log(`${this.version}`);
	}

	async _help (operation) {
		let operations;
		let text = `\n   Usage: ${this.name}`;

		if (operation) {
			operations = operation.operations;
			text += ` --${operation.name} [operations]`
		} else {
			text += ` <operation>`
			operations = this.operations;
		}

		text += ' [...]\n\n   Operations:';

		for (let operation of operations) {
			text += '\n      ';
			if (operation.key) text += `-${operation.key}, `;
			if (operation.name) text += `--${operation.name}   `;
			if (operation.description) text += `${operation.description} `;
		}

		text += '\n';

		console.log(text);
	}

	async _defaults (data) {
		if (!data.operations || !data.operations.length) return;

		data.operations.unshift({
			key: 'h',
			name: 'help',
			method: this._help.bind(this, data)
		});

		for (let operation of data.operations) {
			this._defaults(operation);
		}

	}

	async setup (data) {
		data = data || {};
		this.name = data.name || this.name;
		this.version = data.version || this.version;
		this.fallback = data.fallback === undefined ? this.fallback : data.fallback;
		if (data.operations) await this.add(data.operations);
	}

	async has (data, operations) {
		if (!data) throw new Error('Missing name or key parameter');

		operations = operations || this.operations;

		for (let operation of operations) {
			if (data === 'h' || data === 'help' || operation.name === data || operation.key === data) {
				return true;
			}
		}

		return false;
	}

	async find (data, operations) {
		if (!data) throw new Error('Missing name or key parameter');

		operations = operations || this.operations;

		for (let operation of operations) {
			if (operation.name === data || operation.key === data) {
				return operation;
			}
		}

		return null;
	}

	async add (data, operations) {
		if (!data || typeof data !== 'object') throw new Error('Operation required');

		operations = operations || this.operations;

		if (data.constructor === Array) {
			for (let operation of data) {
				await this.add(operation, operations);
			}
		} else if (data.constructor === Object) {
			if (!data.name) throw new Error('Operation name required');

			if (data.key) {
				let keyExists = await this.has(data.key);
				if (keyExists) throw new Error('Operation key exists');
			}

			let nameExists = await this.has(data.name);
			if (nameExists) throw new Error('Operation name exists');

			await this._defaults(data);

			operations.push(data);
		} else {
			throw new Error('Operation type invalid');
		}

	}

	async execute (operations) {
		let values = {};
		let value, name;
		let parent = operations[0];
		let children = operations.slice(1);

		if (!parent) {
			throw new Error('Operation parameter required');
		}

		for (let child of children) {

			if (child.method) {
				if (name) values[name] = value;
				value = await child.method.call(null, child.value, values);
				name = child.name;
			}

		}

		if (parent.method) {
			if (name) values[name] = value;
			await parent.method.call(null, parent.value, values);
		}

	}

	async parse (args) {
		let value;
		let position = 0;
		
		const result = [];

		for (let arg of args) {

			if (arg.slice(0, 2) === '--') {
				position = result.length;

				const name = arg.slice(2);
				const operations = result.length ? result[0].operations : this.operations;
				const operation = await this.find(name, operations);

				result.push(operation);

			} else if (arg.slice(0, 1) === '-') {
				position = result.length;

				const keys = arg.split('').slice(1);

				for (let key of keys) {

					const operations = result.length ? result[0].operations : this.operations;
					const operation = await this.find(key, operations);

					if (!operation) {
						throw new Error('Operation name invalid');
					}

					result.push(operation);

				}

			} else {

				for (let i = position; i < result.length; i++) {
					if (result[i].value) {
						result[i].value += (' ' + arg);
					} else {
						result[i].value = arg;
					}
				}

			}

		}

		return result;
	}

	async run (argv) {

		this.argv = argv;
		this.path = argv[0];
		this.file = argv[1];

		const operations = await this.parse(argv.slice(2));

		let help = operations.find(function (data) {
			return data.key === 'h' || data.name === 'help';
		});

		if (help || !operations.length && this.fallback) {

			if (operations.length === 1) {
				await this._help();
			} else {
				await this._help(operations[0]);
			}

		} else {
			await this.execute(operations)
		}

	}

}
