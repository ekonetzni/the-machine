import { control } from '../utils';

export type MethodArgs = {
  previousTargets?: Array<any>;
  params: any;
  context: any;
  name?: string;
};

// result here should always maintain the same type as currentTarget on Method.execute
export type MethodResult<T> = {
  result: T;
  name: string;
  args: MethodArgs;
};

export abstract class Method<T, U> {
  abstract readonly name: string;

  constructor() {}

  protected readonly log = (msg: string, meta?: any) =>
    control(msg, this.name, meta);

  public abstract async execute(
    currentTarget: T,
    args: MethodArgs
  ): Promise<MethodResult<U>>;
}
