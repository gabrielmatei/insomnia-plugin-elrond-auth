import { PipeTransform } from "@nestjs/common";
const graphqlFields = require('graphql-fields');

export class ParseQueryFieldsPipe implements PipeTransform<any, Promise<string[]>> {
    transform(value: any): Promise<string[]> {
        return new Promise(resolve => {
            const topLevelFields = Object.keys(graphqlFields(value));
            resolve(topLevelFields);
        });
    }
}
