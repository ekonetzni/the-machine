/* Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
 *   result: any
 *   name: string
 *   args: {previousTargets: [], params, context, name })
 * }
 */
import { Method, MethodArgs, MethodResult } from './Method';
import { control } from '../utils';
import fs from 'fs';
import extractFrames from 'ffmpeg-extract-frames';

export class GetFrame extends Method<string, string> {
  public readonly name = 'get-frame';

  public async execute(
    currentTarget: string,
    args: MethodArgs
  ): Promise<MethodResult<string>> {
    if (!fs.existsSync(currentTarget))
      throw new Error("Video file doesn't exist");
    const frames = await extractFrames({
      input: currentTarget,
      output: `${currentTarget}.frame-%d.jpg`,
      offsets: [30 * 10],
    });

    return {
      result: frames[0],
      name: this.name,
      args,
    };
  }
}

const METHOD_NAME = 'getFrame';
const _log = msg => control(msg, METHOD_NAME);

const getFrame = async (currentTarget, args) => {
  const video = new cv.VideoCapture(currentTarget);
  let frame = video.read();
  let i = 0;
  while (frame.empty || i < 300) {
    // This reads about 10ish seconds into the video
    // use to avoid blank title screens.
    frame = video.read();
    i++;
  }
  _log(`Return frame ${frame}`);

  return {
    result: frame,
    name: METHOD_NAME,
    args,
  };
};

module.exports = getFrame;
