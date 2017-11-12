
const Package = require('../package');
Cli.version = Package.version;

function Cliy () {
	// this.error = 'Missing or incorrect command';
	this.commands = [];
}

Cliy.prototype.add = function (data) {


};

Cliy.prototype.find = function (name) {
	for (var i = 0, l = this.commands.length; i < l; i++) {
		if (this.commands[i].name === name) {
			return this.commands[i];
		}
	}
};

Cliy.prototype.execute = function (name, args) {
	var cmd = this.find(name);
	if (cmd) {
		
	} else {
		console.log('Command not found: ' + name);
	}
};

Cliy.prototype.run = function (argv) {
	this.argv = argv;
	this.file = argv[1];

	var cmd = args[0];

	if (!cmd) {
		console.log(help);
	} else if (cmd === 'h' || cmd === 'help' || cmd === '-h' || cmd === '-H' || cmd === '--help') {
		console.log(help);
	} else if (cmd === 'v' || cmd === 'version' || cmd === '-v' || cmd === '-V' || cmd === '--version') {
		console.log(version);
	} else {
		this.execute(cmd, args);
	}
}

module.exports = Cliy;
