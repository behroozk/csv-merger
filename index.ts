#!/usr/bin/env node

import commander from 'commander';

import { getUniqueColumns } from './src/csv/unique_columns';
import { writeWithColumns } from './src/csv/write_with_columns';
import { IMergeOptions } from './src/types/merge_options.interface';

export async function merge(
    inputFiles: string[],
    partialOptions: Partial<IMergeOptions> = {},
): Promise<string | boolean> {
    const options: IMergeOptions = formOptions(partialOptions);
    const uniqueColumns: string[] = await getUniqueColumns(inputFiles);
    let isFirstOutput: boolean = true;
    let output: string = '';

    for (const inputFile of inputFiles) {
        output += await writeWithColumns(
            inputFile, uniqueColumns, isFirstOutput, options,
        );

        isFirstOutput = false;
    }

    if (options.writeOutput) {
        return output === '';
    }

    return output;
}

function formOptions(partialOptions: Partial<IMergeOptions>): IMergeOptions {
    const options: IMergeOptions = {
        ...{
            commandLineExecution: false,
            outputPath: 'merged.csv',
            writeOutput: false,
            quoted: false,
        },
        ...partialOptions,
    };

    return options;
}

async function main(): Promise<void> {
    if (require.main !== module) { // required as module
        return;
    }

    commander
        .version('0.1.0', '-v, --version')
        .arguments('<input_files...>')
        .option('-o, --output <merged_file>', 'Merged CSV file path')
        .action((inputFiles?: string[]) => {
            if (inputFiles && inputFiles.length > 0) {
                merge(inputFiles, {
                    commandLineExecution: true,
                    outputPath: commander.output,
                    writeOutput: true,
                });
            }
        })
        .parse(process.argv);

    return;
}

main();

export { IMergeOptions };
