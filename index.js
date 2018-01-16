
class Cliy {

	constructor(options) {

		this.name = 'program';
		this.version = '0.0.0';
		this.operations = [
			{
				key: 'v',
				name: 'version',
				method: async function () {
					console.log(`${this.version}`);
				}.bind(this)
			},
			{
				key: 'h',
				name: 'help',
				method: async function () {
					let text = `\n   Usage: ${this.name} <operation> [...]\n\n   Operations:`;

					for (let operation of this.operations) {
						text += '\n      ';
						if (operation.key) text += `-${operation.key} `;
						if (operation.name) text += `--${operation.name} `;
						if (operation.description) text += `${operation.description} `;
					}

					console.log(text);
				}.bind(this)
			}
		];

		this.setup(options);
	}

	async setup(options) {
		options = options || {};
		this.name = options.name || this.name;
		this.version = options.version || this.version;
		this.operations = options.operations ? this.add(options.operations) : this.operations;
	}

	async add(data) {
		if (!data) throw new Error('Operation required');

		if (data.constructor === Array) {

			for (let operation of data) {
				await this.add(operation);
			}

			return;
		}

		let exists = await this.has(data.name, data.key);
		if (exists) throw new Error('Operation name or key exists');

		this.operations.push(data);
	}

	async find(name, key) {
		if (!name && !key) throw new Error('Missing name or key parameter');

		for (let operation of this.operations) {
			if (operation.name === name || operation.key === key) {
				return operation;
			}
		}

		return null;
	}

	async execute(name, key, value) {
		let result;
		let operation = await this.find(name, key);

		if (operation) {
			result = result ? [result, value] : [value];
			result = await operation.method.apply(null, result);
		} else {
			throw new Error(`Cant find operation ${name}`);
		}
	}

	async parse(args) {
		let result = [];

		for (let arg of args) {
			if (arg.slice(0, 2) === '--') {
				let name = arg.slice(2);
				result.push({
					name: name
				});
			} else if (arg.slice(0, 1) === '-') {
				let keys = arg.split('').slice(1);
				for (let key of keys) {
					result.push({
						key: key
					});
				}
			} else {
				if (result[result.length-1].value) {
					result[result.length-1].value += (' ' + arg);
				} else {
					result[result.length-1].value = arg;
				}
			}
		}

		return result;
	}

	async has(name, key) {
		if (!name && !key) throw new Error('Missing name or key parameter');
		let result = await this.find(name, key);
		return result ? true : false;
	}

	async run(argv) {
		this.argv = argv;
		this.path = argv[0];
		this.file = argv[1];

		let operations = await this.parse(argv.slice(2));

		for (let operation of operations) {
			await this.execute(operation.name, operation.key, operation.value);
		}

	}

}

module.exports = Cliy;
