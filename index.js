'use strict';

const Color = require('./lib/color.js');

module.exports = class Cliy {

	constructor (data) {

		this._name = 'program';
		this._version = '0.0.0';

		this.operations = [
			{
				key: 'h',
				name: 'help',
				handler: async function () {
                    this.log(await this.help());
                }
			},
			{
				key: 'v',
				name: 'version',
				handler: async function () {
                    this.log(await this.version());
                }
			}
		];

		this.setup(data);
	}

	async setup (data) {
		data = data || {};
		this._name = data.name || this._name;
		this._version = data.version || this._version;
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

    mix (text, names) {
        return Color.mix(text, names);
    }

	async version () {
        return `${this._version}`;
	}

	async help (data) {
		let text = `\n   Usage: ${this._name}`;

		if (data) {
			text += ` {-${data.key} --${data.name}} [operations]`;
		} else {
			text += ` <operation>`
            data = { key: 'h', name: 'help', operations: this.operations };
		}

    	text += ' [...]';

        if (data.operations) {
    		text += '\n\n   Operations:';
    		for (const operation of data.operations) {
    			text += '\n      ';
    			if (operation.key) text += `-${operation.key}, `;
    			if (operation.name) text += `--${operation.name}, `;
    			if (operation.description) text += `${operation.description} `;
    		}
        }

        if (data.options) {
    		text += '\n\n   Options:';
    		for (const option of data.options) {
    			text += '\n      ';
                if (typeof option === 'string') {
                    text += `${option} `;
                } else {
        			if (option.key) text += `${option.key}, `;
        			if (option.name) text += `${option.name}, `;
        			if (option.description) text += `${option.description} `;
                }
    		}
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

        let _options;
        let _results;
        let _parameters;
        let operation;

        for (let i = operations.length-1; i > -1; i--) {
            const operation = operations[i];

            _options = operations[operation._position]._options || {};
            _results = operations[operation._position]._results || {};
            _parameters = operations[operation._position]._parameters || [];

			if (operation.handler) {

				const result = await operation.handler.apply(this, [ _options, _results, _parameters ]);

                if (result !== undefined) {
                    _results[operation.name] = result;
                }

			}

        }

	}

	async run (argv) {

		this.argv = argv;
		this.path = argv[0];
		this.file = argv[1];

		const result = [];
        const args = argv.slice(2);
		let value, options, position = 0;

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

                operation._position = position
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

                    operation._position = position
                    previous = operation.operations ? operation : previous;

					result.push(operation);
				}

			} else {
                const operation = result[position] = result[position] || {}

                options = operation.options || [];
                operation._options = operation._options || {};
                operation._parameters = operation._parameters || [];

                // need previous operation
                // need to check duplicate options
                if (arg.includes('=')) {

                    const parts = arg.split('=');
                    const option = options.find(function (value) {
                        if (typeof value === 'string' && value === parts[0]) {
                            return true;
                        } else if (typeof value === 'object' && value.name === parts[0]) {
                            return true;
                        } else {
                            return false;
                        }
                    });

                    if (option) {
                        operation._options[parts[0]] = parts[1];
                    } else {
                        operation._parameters.push(arg);
                    }

                } else if (options.length) {
                    const option = options.shift();
                    operation._options[option.name || option] = arg;
                } else {
                    operation._parameters.push(arg);
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
