#!/usr/bin/env node
import * as program from 'commander'

import makeMarkdown from './index'
import {version} from '../package.json'

program
    .version(version)
    .option('-H, --host [host]', 'Host', '127.0.0.1')
    .option('-p, --port [port]', 'Port', 5432)
    .option('-u, --user [user]', 'User', 'postgres')
    .option('-W, --password [password]', 'Password')
    .option('-d, --database [database]', 'Database', 'postgres')
    .option('-f, --format [format]', 'Output format (markdown| html)', 'html')
    .option('-o, --output [output]', 'Output file name', 'index.md')
    .option('-l, --locale [locale]', 'Locale', 'ru')
    .option('-i, --ignore <ignore>', 'Pattern of objects to ignore')
    .parse(process.argv)

makeMarkdown(program)
