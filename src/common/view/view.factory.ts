export type TrueFields<T> = { [P in keyof T]: true };

export class ViewFactory<Select> {
  construct<DefaultFields extends TrueFields<Select>>(fields: DefaultFields) {
    return <T extends TrueFields<Select>>(select?: T) => {
      return {
        ...fields,
        ...select,
      };
    };
  }
}
