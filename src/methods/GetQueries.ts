import { Method, MethodArgs } from './Method';
import { getRandomInt } from '../utils';
import feedparser from 'feedparser-promised';

export class GetQueries extends Method<undefined, string[]> {
  public readonly name: string = 'get-queries';

  public execute = async (_currentTarget: undefined, args: MethodArgs) => {
    const { settings } = args.context;
    const selectedFeed =
      settings.feeds[getRandomInt(0, settings.feeds.length - 1)];
    const items = await feedparser.parse(selectedFeed);
    this.log(`Rss result: ${items.length} items`);

    return {
      result: items.map((item: any) => item.title),
      name: this.name,
      args,
    };
  };
}
