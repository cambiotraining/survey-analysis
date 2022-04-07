#! /usr/bin/env node

const { Command } = require('commander')

const cat = require('./commands/cat')
const extract = require('./commands/extract')
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
Run this after processing raw data.`
    )
    .option('-f, --files <pattern>', 'Path of csv files')
    .option(
        '-o, --output <output file name>',
        'Output file name. Default is output.csv'
    )
    .action(cat)

program
    .command('process')
    .description(
        'This is the first thing you should do. It will process raw survey data'
    )
    .option('-f, --files <pattern>', 'Path of csv files')
    .option(
        '-o, --output <output directory>',
        'Output file name. Default is output.csv'
    )
    .action(processRaw)

program
    .command('view')
    .description(
        'To view csv file. It will only work after processing raw data.'
    )
    .option('-f, --file <path>', 'Path of csv file')
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

program
    .command('extract')
    .description(
        `To extract information from processed survey data
This function is under constructions.    
`
    )
    .argument('<extract-type>', 'Currently, contact is supported')
    .option('-f, --files <pattern>', 'Path of csv files')
    .action(extract)

program.parse()
