#! /usr/bin/env node

const { Command } = require('commander')

const cat = require('./commands/cat')
const processRaw = require('./commands/process-raw')
const view = require('./commands/view')

const program = new Command()

program
    .name('sa')
    .description('sa is short for survey analysis')
    .version('1.0.0')

program
    .command('cat')
    .description(
        `This will help to concatenate multiple csv files into one csv file.
Make sure all csv files have same set of headers otherwise the output
of this function will now be as expected.
`
    )
    .option('-f, --files <path>', 'Path of csv files')
    .option(
        '-o, --output <output file name>',
        'Output file name. Default is output.csv'
    )
    .action(cat)

program
    .command('process')
    .description('To process raw survey data')
    .option('-f, --files <path>', 'Path of csv files')
    .option(
        '-o, --output <output directory>',
        'Output file name. Default is output.csv'
    )
    .action(processRaw)

program
    .command('view')
    .description('To view csv file.')
    .option('-f, --files <path>', 'Path of csv file')
    .option('-t, --tail <number>', 'Print the last n row(s) of the csv file')
    .option('-h, --head <number>', 'Print the first n row(s) of the csv file')
    .option(
        '-r, --rows <rows...>',
        'Print the specific rows. Usage: sa view -r 1 2 3 10'
    )
    .option(
        '-c, --columns <columns...>',
        'Print the specific columns. Usage: sa view -c 1 2 3 10'
    )
    .action(view)

program.parse()
