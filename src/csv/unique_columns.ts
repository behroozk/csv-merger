import csvParse from 'csv-parse';
import { promisify } from 'util';

const csvParseAsync = promisify<string, string[][]>(csvParse);
import { firstLine } from '../lib/first_line';

export async function getUniqueColumns(inputFiles: string[]): Promise<string[]> {
    const uniqueColumnsSet: Set<string> = new Set();

    for (const inputFile of inputFiles) {
        const headerString: string = await firstLine(inputFile);
        const header = (await csvParseAsync(headerString))[0];

        header.forEach((column) => {
            uniqueColumnsSet.add(column);
        });
    }

    const uniqueColumns: string[] = Array.from(uniqueColumnsSet);

    return uniqueColumns;
}
