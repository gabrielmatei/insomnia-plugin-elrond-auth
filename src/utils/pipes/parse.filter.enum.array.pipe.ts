import { PipeTransform } from "@nestjs/common";

export class ParseFilterEnumArrayPipe<T extends { [name: string]: unknown }> implements PipeTransform<string[] | undefined, Promise<string | string[] | undefined>> {
  constructor(private readonly type: T) { }

  transform(inputValues: string[] | undefined): Promise<string[] | undefined> {
    return new Promise(resolve => {
      if (inputValues === undefined) {
        return resolve(undefined);
      }

      const enumValues = this.getValues(this.type);

      const filteredValues = inputValues
        .map(value => enumValues.includes(value) ? value : undefined)
        .filter((value): value is string => !!value)
        .distinct();

      resolve(filteredValues);
    });
  }

  private getValues<T extends { [name: string]: unknown }>(value: T): string[] {
    return Object.keys(value).map(key => value[key]).filter(value => typeof value === 'string') as string[];
  }
}
