'use strict';

const Color = require('./lib/color.js');

module.exports = class Cliy {

	constructor (data) {

		this._fallback = true;
		this._name = 'program';
		this._version = '0.0.0';

		this.operations = [
			{
				key: 'v',
				name: 'version',
				method: this.version.bind(this)
			},
			{
				key: 'h',
				name: 'help',
				method: this.help.bind(this)
			}
		];

		this.setup(data);
	}

	async setup (data) {
		data = data || {};
		this._name = data.name || this._name;
		this._version = data.version || this._version;
		this._fallback = data.fallback === undefined ? this._fallback : data.fallback;
		if (data.operations) await this.add(data.operations);
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

	async version () {
        return `${this._version}`;
	}

	async help (operation) {
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

        return text;
	}

	async defaults (data) {
		if (!data.operations || !data.operations.length) return;

		data.operations.unshift({
			key: 'h',
			name: 'help',
			method: this.help.bind(this, data)
		});

		for (const operation of data.operations) {
			this.defaults(operation);
		}

	}

	async has (data, operations) {

		if (!data) {
            throw new Error('Cliy.has - name or key argument required');
        }

		operations = operations || this.operations;

		for (const operation of operations) {
			if (data === 'h' || data === 'help' || operation.name === data || operation.key === data) {
				return true;
			}
		}

		return false;
	}

	async find (data, operations) {

		if (!data) {
            throw new Error('Cliy.find - name or key argument required');
        }

		operations = operations || this.operations;

		for (const operation of operations) {
			if (operation.name === data || operation.key === data) {
				return operation;
			}
		}

		return null;
	}

	async add (data, operations) {

		if (!data || typeof data !== 'object') {
            throw new Error('Cliy.add - operation required');
        }

		operations = operations || this.operations;

		if (data.constructor === Array) {
			for (const operation of data) {
				await this.add(operation, operations);
			}
		} else if (data.constructor === Object) {

            if (!data.name) {
                throw new Error('Cliy.add - operation name required');
            }

			if (data.key) {
				const exists = await this.has(data.key);
				if (exists) throw new Error('Cliy.add - operation key exists');
			}

            if (data.name) {
    			const exists = await this.has(data.name);
    			if (exists) throw new Error('Cliy.add - operation name exists');
            }

			await this.defaults(data);

			operations.push(data);
		} else {
			throw new Error('Cliy.add - operation type invalid');
		}

	}

	async execute (operations) {
		let value, name;
		const values = {};
		const parent = operations[0];
		const children = operations.slice(1);

		if (!parent) {
			throw new Error('Cliy.execute - operation parameter required');
		}

		for (const child of children) {

			if (child.method) {
				if (name) values[name] = value;
				value = await child.method.call(this, child.value, values);
				name = child.name;
			}

		}

		if (parent.method) {
			if (name) values[name] = value;
			await parent.method.call(this, parent.value, values);
		}

	}

	async parse (args) {
		let value;
		let position = 0;

		const result = [];

		for (let arg of args) {

			if (arg.startsWith('--')) {
				position = result.length;

				const name = arg.slice(2);
				const operations = result.length ? result[0].operations : this.operations;
				const operation = await this.find(name, operations);

				result.push(operation);

			} else if (arg.startsWith('-')) {
				position = result.length;

				const keys = arg.split('').slice(1);

				for (const key of keys) {

					const operations = result.length ? result[0].operations : this.operations;
					const operation = await this.find(key, operations);

					if (!operation) {
						throw new Error('Cliy.parse - operation name invalid');
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

		const help = operations.find(function (data) {
			return data.key === 'h' || data.name === 'help';
		});

		if (help || !operations.length && this.fallback) {

			if (operations.length === 1) {
				const data = await this.help();
                console.log(data);
			} else {
				const data = await this.help(operations[0]);
                console.log(data);
			}

		} else {
			await this.execute(operations)
		}

	}

}
