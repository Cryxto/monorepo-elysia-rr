export class AxiomQueryHelper {
  private queries: string[] = [];

  constructor(private dataset: string) {}

  pipe() {
    this.queries.push('|');
    return this;
  }

  where(field: string, condition: string, value: string | number) {
    this.queries.push(['where', field, condition, value].join(' '));
    return this;
  }

  raw(query: string) {
    this.queries.push(query);
    return this;
  }

  query(...arg: (string | number)[]) {
    this.queries.push(arg.join(' '));
    return this;
  }

  function(
    functionName: string,
    argument?: string,
    argStyle?: 'square bracket',
  ) {
    this.queries.push(
      `${functionName}(${(argStyle === 'square bracket' ? `['${argument}']` : argument) || ''})`,
    );
    return this;
  }

  getFinalQuery() {
    this.queries.unshift('|');
    this.queries.unshift(`['${this.dataset}']`);
    return this.queries.join(' ');
  }
}

export function createAxiomQuery(dataset: string) {
  return new AxiomQueryHelper(dataset);
}
