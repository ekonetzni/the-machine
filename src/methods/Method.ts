import { control } from '../utils';

export type MethodArgs = {
  previousTargets?: Array<any>;
  params: any;
  context: any;
  name?: string;
};

// result here should always maintain the same type as currentTarget on Method.execute
export type MethodResult = {
  result: any;
  name: string;
  args: MethodArgs;
};

export abstract class Method {
  abstract readonly name: string;

  constructor() {}

  protected readonly log = (msg: string, meta?: any) =>
    control(msg, this.name, meta);

  public abstract async execute(
    currentTarget: any,
    args: MethodArgs
  ): Promise<any>;
}
