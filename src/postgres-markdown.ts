#!/usr/bin/env node
import * as program from 'commander'

import makeMarkdown from './node'
import {version} from '../package.json'

program
    .version(version)
    .option('-H, --host [host]', 'Host', '127.0.0.1')
    .option('-p, --port [port]', 'Port', 5432)
    .option('-u, --user [user]', 'User', 'postgres')
    .option('-W, --password [password]', 'Password')
    .option('-d, --database [database]', 'Database', 'postgres')
    .option('-o, --output [output]', 'Output file name', 'index.md')
    .option('-l, --locale [locale]', 'Locale', 'ru')
    .option('-i, --ignore <ignore>', 'Pattern of objects to ignore')
    .option('-v, --verbose', 'Verbose output')
    .parse(process.argv)

if (program.verbose) {
    process.env.DEBUG = '*'
}

makeMarkdown(program)
