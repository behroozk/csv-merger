# csv-merger

Merge multiple CSV files into one

## Installation

To install locally:

```sh
npm install csv-merger
```

To install globally:

```sh
npm install -g csv-merger
```

## Standalone Use Case

To use as a standalone application, install globally. To get help

```sh
csv-merger -h
```

To merge multiple `csv` files into a single `csv`:

```sh
csv-merger -o output.csv input1.csv input2.csv input3.csv ...
```

If output filename is not provided via `-o` option, output filename will be set to `merged.csv` by default.

## Local Use Case

To use locally, install the package in the local directory. Then, the package can be imported as:

```js
const csvMerger = require('csv-merger');
```

The package includes `merge` function with the following arguments:

```js
csvMerger.merge(inputFiles, options);
```

`inputFiles` is a string array containing the path to input CSV files. `options` object is optional and has the following format:

```js
options = {
    outputPath, // string: path to the output CSV file
    writeOutput, // boolean: if true, the output will be written to a file, otherwise will be returned by the function
    quoted, // boolean: if true will wrap all values in quotes, otherwise values will be unquoted
}
```

The `merge` function returns a promise. If the `writeOutput` option is `true`, the function returns a boolean promise, which is `true` if file is successfully written, and `false` otherwise. If `writeOutput` is set to `false` (default value), the `merge` function returns a string promise containing the CSV output.
