'use strict';

const Color = require('./lib/color.js');

module.exports = class Cliy {

	constructor (data) {

        this._method = null;
		this._fallback = true;
		this._name = 'program';
		this._version = '0.0.0';

		this.operations = [
			{
				key: 'h',
				name: 'help',
				method: async function () {
                    this.log(await this.help());
                }
			},
			{
				key: 'v',
				name: 'version',
				method: async function () {
                    this.log(await this.version());
                }
			}
		];

		this.setup(data);
	}

	async setup (data) {
		data = data || {};
		this._name = data.name || this._name;
		this._method = data.method || this._method;
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
		let text = `\n   Usage: ${this._name}`;

        const operations = operation ? [{
            key: 'h',
            name: 'help',
        }].concat(operation.operations || []) : this.operations;

		if (operation) {
			text += ` --${operation.name} [operations]`
		} else {
			text += ` <operation>`
		}

		text += ' [...]\n\n   Operations:';

		for (const operation of operations) {
			text += '\n      ';
			if (operation.key) text += `-${operation.key}, `;
			if (operation.name) text += `--${operation.name}   `;
			if (operation.description) text += `${operation.description} `;
		}

		text += '\n';

        return text;
	}

	async add (data) {
		if (!data || typeof data !== 'object') {
            throw new Error('Cliy.add - operation required');
        } else if (data.constructor === Array) {

			for (const operation of data) {
				await this.add(operation);
			}

		} else if (data.constructor === Object) {

            if (!data.name) {
                throw new Error('Cliy.add - operation name required');
            }

    		if (data.key === 'h' || data.key === 'v') {
                throw new Error(`Cliy.add - reserved operation key ${data.key}`);
    		}

    		if (data.name === 'help' || data.name === 'version') {
                throw new Error(`Cliy.add - reserved operation name ${data.name}`);
    		}

    		for (const operation of this.operations) {

    			if (data.key === operation.key) {
                    throw new Error(`Cliy.add - operation key exists ${data.key}`);
    			}

    			if (data.name === operation.name) {
                    throw new Error(`Cliy.add - operation name exists ${data.name}`);
    			}

    		}

			this.operations.push(data);
		} else {
			throw new Error('Cliy.add - operation type invalid');
		}

	}

	async execute (operations) {
        const options = operations[0].options || {};
        const results = operations[0].results || {};
        const parameters = operations[0].parameters || [];

        let operation;
        while (operation = operations.pop()) {

			if (operation.method) {

				const result = await operation.method.apply(this, [options, parameters, results]);

                if (result !== undefined) {
                    results[operation.name] = result;
                }

			}

        }

	}

	async run (argv) {

		this.argv = argv;
		this.path = argv[0];
		this.file = argv[1];

		let value;
		let position = 0;
		const result = [];
        const args = argv.slice(2);

		for (const arg of args) {

			if (arg.startsWith('--')) {
				position = result.length;

				const name = arg.slice(2);

				if (name === 'help') {
                    this.log(await this.help());
                    return;
				}

				const operations = this.operations;
				const operation = operations.find(function (operation) {
                    return operation.key === key;
                });

                if (!operation) {
                    this.log(`${this._name}: invalid operation ${nane}`);
                    return;
                }

				result.push(operation);

			} else if (arg.startsWith('-')) {
				position = result.length;

				const keys = arg.split('').slice(1);

                let previous;

				for (const key of keys) {

                    if (key === 'h') {
                        this.log(await this.help(previous));
                        return;
                    }

					const operations = previous && previous.operations ? previous.operations : this.operations;
					const operation = operations.find(function (operation) {
                        return operation.key === key;
                    });

                    if (!operation) {
                        this.log(`${this._name}: invalid operation ${key}`);
                        return;
                    }

                    previous = operation.operations ? operation : previous;

					result.push(operation);
				}

			} else {
                const operation = result[position];

                operation.options = operation.options || {};
                operation._values = operation._values || operation.values || [];

                if (operation._values) {
                    const name = operation._values.shift();
                    console.log(name);
                    if (name) {
                        operation.options[name] = arg;
                    } else {
                        operation.parameters = operation.parameters || [];
                        operation.parameters.push(arg);
                    }
                }

			}

		}

        if (!result.length) {
            this.log(await this.help());
            return;
        }

        await this.execute(result);
	}

}
