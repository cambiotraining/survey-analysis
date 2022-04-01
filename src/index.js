#! /usr/bin/env node

const { Command } = require('commander')

const cat = require('./commands/cat')
const processRaw = require('./commands/process-raw')

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
        '-h, --headers-row <header rows>',
        'Total number of headers row. Default is 1'
    )
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

program.parse()
