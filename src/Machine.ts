require('dotenv').config();

import { Logger } from './utils/Logger';
import { Method, MethodArgs, MethodResult } from './methods/Method';

const { dump, control, logError, exit } = require('./utils');
const config = require('config');
const settings = config.get('settings');

class Machine {
  private log: Logger;
  private readonly methods: Array<Method>;
  private readonly finallyTasks: Array<Method>;

  constructor(methods: Array<Method>, finallyTasks: Array<Method>) {
    this.methods = methods;
    this.finallyTasks = finallyTasks;
  }

  private executor = async (
    previousResult: Partial<MethodResult>,
    currentMethod: Method
  ): Promise<MethodResult> => {
    const { result, args } = await previousResult;
    control(`Executing ${currentMethod.name}`);

    try {
      return await currentMethod.execute(result, {
        params: args.params,
        context: args.context,
      });
    } catch (err) {
      logError('Machine', err);
      throw err;
    }
  };

  public execute = async (initialTarget = {}, context = {}): Promise<void> => {
    const initialValue = {
      result: initialTarget,
      name: 'initial',
      args: {
        params: {},
        context: {
          settings,
          ...context,
        },
      },
    };
    control(`Beginning execution`);

    let result;
    try {
      result = await this.methods.reduce(
        this.executor.bind(this),
        initialValue
      );
    } finally {
      control(`Executing finally block`);
      result = await this.finallyTasks.reduce(
        this.executor.bind(this),
        initialValue
      );
    }

    control(`Result ${dump(result)}`);
  };
}

export default Machine;
