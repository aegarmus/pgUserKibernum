import { writer } from 'node:repl';
import util from 'node:util'

const COLORS = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    red: "\x1b[31m",
    magenta: "\x1b[35m",
    gray: "\x1b[90m"
};

export class Logger {
    #context

    constructor(context = 'APP') {
        this.#context = context
    }

    #formatDate(date) {
        const pad = value => String(value).padStart(2, '0')

        const year = date.getFullYear();
        const month = pad(date.getMonth());
        const day = pad(date.getDate())
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        return `${year}-${month}-${day} -- ${hours}:${minutes}:${seconds}`
    }

    #print({ level, color, writer, message, meta={} }) {
        const timestamp = this.#formatDate(new Date())

        const levelText = `${color}${level}${COLORS.reset}`
        const contextText = `${COLORS.yellow}[${this.#context}]${COLORS.reset}`
        const messageText = `${color} ${message} ${COLORS.reset}`

        writer(`${COLORS.magenta}[${timestamp}] ${levelText} ${contextText} ${messageText}`)

        if(Object.keys(meta).length > 0) {
            console.log(
                `${COLORS.gray}${util.inspect(meta, {
                    depth: 4,
                    colors: true,
                    compact: false
                })}${COLORS.reset}
                
                `
            )
        }
    }

    info(message, meta={}) {
        this.#print({
            level: 'INFO',
            color: COLORS.green,
            writer: console.log,
            message, 
            meta
        })
    }

    debug(message, meta={}) {
        this.#print({
            level: "DEBUG",
            color: COLORS.blue,
            writer: console.debug,
            message,
            meta,
        });
    }

    warn(message, meta={}) {
        this.#print({
            level: "WARN",
            color: COLORS.yellow,
            writer: console.warn,
            message,
            meta,
        });
    }

    error(message, meta={}) {
        this.#print({
            level: "ERROR",
            color: COLORS.red,
            writer: console.error,
            message,
            meta,
        });
    }
}