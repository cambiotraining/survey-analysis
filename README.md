# Survey Analysis

## Development

### Requirements
You need following tools:

- git: [https://git-scm.com/book/en/v2/Getting-Started-Installing-Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- node: [https://nodejs.org/en/](https://nodejs.org/en/)

### Steps

At first you need to clone this repository:

```bash
git clone https://github.com/cambiotraining/survey-analysis
```

Now move to survey-analysis folder

```bash
cd survey-analysis
```

To install all dependencies:

```bash
npm i
```

To install cli:

```bash
npm i -g
```

To run cli:

```bash
sat help
```

## How to?
### Install cli tool

First you need to clone this repository, run the following command:

```bash
git clone https://github.com/cambiotraining/survey-analysis
```

Now move to survey-analysis folder:

```bash
cd survey-analysis
```

Install all the dependencies:

```bash
npm i
```

Install the cli:
```
npm i -g
```

This will install the cli tool into your local machine. You can verify the installation by running the following command:

```bash
sat help
```

If the above command prints the help, means `sat` is installed. You can use this cli tool anywhere in you local machine.

### Process raw data

It is the first you should do with raw data. Raw survey data comes in all forms. The intention of having a processing step is to prepare a uniform output that can be recognised by downstream processes.

To process raw survey data run the following command:

```bash
sat process -f "*.csv" -o "output_dir"
```
 Few point you need to keep in mind:

 1. `-f` is to specify the input files path pattern. It can be a glob pattern (learn more about glob patterns here: https://www.malikbrowne.com/blog/a-beginners-guide-glob-patterns) or a simple string.

 1. `-o` is to set the output directory. All the processed files will be put into this folder. Make sure the output directory exists otherwise you will get an error.

 ### View csv file

 View only processed CSV files. It will not be helpful if you try to view raw survey data. To view the processed CSV file, run the following command:
```bash
sat view -f "name_of_my_csv_file.csv"
```
This command prints the content of the CSV file in tabular form. It prints a maximum of 10 rows and a few columns. There are a couple of useful options to view run:

```bash
sat view --help
```