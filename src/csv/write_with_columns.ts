import logger from 'console';
import csvParse from 'csv-parse';
import csvStringify from 'csv-stringify';
import fs from 'fs';
import { Transform } from 'stream';

import { IMergeOptions } from '../types/merge_options.interface';

export function writeWithColumns(
    inputFile: string,
    uniqueColumns: string[],
    isFirstOutput: boolean,
    options: IMergeOptions,
): Promise<string> {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(inputFile);

        const csvParesr = csvParse({ columns: true });
        const csvStringifier = csvStringify({ header: isFirstOutput, columns: uniqueColumns, quoted: options.quoted });

        const outputStream = readStream
            .pipe(csvParesr)
            .pipe(csvStringifier)
            .pipe(new StatsStream(inputFile));

        if (options.writeOutput) {
            const writeStream = fs.createWriteStream(options.outputPath, {
                flags: isFirstOutput ? 'w' : 'a',
            });

            outputStream
                .pipe(writeStream)
                .on('close', () => {
                    return resolve('');
                })
                .on('error', reject);
        } else {
            let data: string = '';

            outputStream
                .on('data', (chunk: Buffer | string) => {
                    data += chunk.toString();
                })
                .on('error', reject)
                .on('finish', () => {
                    resolve(data);
                });
        }
    });
}

export class StatsStream extends Transform {
    private rowCount: number = 0;

    constructor(private file: string) {
        super();
    }

    // tslint:disable-next-line:variable-name
    public _transform(chunk: Buffer, _encoding: string, next: () => void): void {
        const stringContent: string = chunk.toString();
        const rowsLength: number = (stringContent.match(/\n/g) || []).length;
        this.rowCount += rowsLength;

        this.push(chunk);

        next();
    }

    public _flush(next: () => void) {
        next();
        logger.log(`merged ${this.rowCount} rows from ${this.file}`);
    }
}
