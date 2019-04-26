'use strict';

module.exports = {

    code: {

        // style
        reset: [ '\x1b[0m', '\x1b[0m' ],
        bold: [ '\x1b[1m', '\x1b[22m' ],
        dim: [ '\x1b[2m', '\x1b[22m' ],
        italic: [ '\x1b[3m', '\x1b[23m' ],
        underline: [ '\x1b[4m', '\x1b[24m' ],
        blink: [ '\x1b[5m', '\x1b[25m' ],
        inverse: [ '\x1b[7m', '\x1b[27m' ],
        hidden: [ '\x1b[8m', '\x1b[28m' ],
        strike: [ '\x1b[9m', '\x1b[29m' ],

        // foreground
        black: [ '\x1b[30m', '\x1b[39m' ],
        red: [ '\x1b[31m', '\x1b[39m' ],
        green: [ '\x1b[32m', '\x1b[39m' ],
        yellow: [ '\x1b[33m', '\x1b[39m' ],
        blue: [ '\x1b[34m', '\x1b[39m' ],
        magenta: [ '\x1b[35m', '\x1b[39m' ],
        cyan: [ '\x1b[36m', '\x1b[39m' ],
        white: [ '\x1b[37m', '\x1b[39m' ],
        gray: [ '\x1b[90m', '\x1b[39m' ],
        grey: [ '\x1b[90m', '\x1b[39m' ],

        // background
        bgBlack: [ '\x1b[40m', '\x1b[49m' ],
        bgRed: [ '\x1b[41m', '\x1b[49m' ],
        bgGreen: [ '\x1b[42m', '\x1b[49m' ],
        bgYellow: [ '\x1b[43m', '\x1b[49m' ],
        bgBlue: [ '\x1b[44m', '\x1b[49m' ],
        bgMagenta: [ '\x1b[45m', '\x1b[49m' ],
        bgCyan: [ '\x1b[46m', '\x1b[49m' ],
        bgWhite: [ '\x1b[47m', '\x1b[49m' ]

    },

    mix (text, names) {
        const self = this;

        for (let name of names) {

            if (name in self.code === false) {
                throw new Error('Cliy.color - invalid color name');
            }

            text = `${self.code[name][0]}${text}${self.code[name][1]}`;
        }

        return text;
    },

    log (text, names) {
        names = names || [];
        console.log(this.mix(text, names));
    },

    info (text, names) {
        names = names || [ 'green' ];
        console.info(this.mix(text, names));
    },

    warn (text, names) {
        names = names || [ 'yellow' ];
        console.warn(this.mix(text, names));
    },

    error (text, names) {
        names = names || [ 'red' ];
        console.error(this.mix(text, names));
    }

};
