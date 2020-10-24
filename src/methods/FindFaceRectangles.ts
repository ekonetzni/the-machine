/* Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
 *   result: any
 *   name: string
 *   args: {previousTargets: [], params, context, name })
 * }
 */
import { Method, MethodArgs, MethodResult } from './Method';

import { control } from '../utils';
import cv from 'opencv4nodejs';

const _sortByNumDetections = result =>
  result.numDetections
    .map((num, idx) => ({ num, idx }))
    .sort((n0, n1) => n1.num - n0.num)
    .map(({ idx }) => idx);

export class FindFaceRectangles extends Method {
  public readonly name: string = 'find-face-rectangles';

  public async execute(
    currentTarget: any,
    args: MethodArgs
  ): Promise<MethodResult> {
    const video = new cv.VideoCapture(currentTarget);
    const faceClassifier = new cv.CascadeClassifier(
      cv.HAAR_FRONTALFACE_DEFAULT
    );

    let frameNum = 1;
    let frame = video.read();
    let isFaceFound = false;
    let rectangle;
    let faces;
    // Assume 30 frames per second, read video in 5
    // second increments looking for a face
    // (every 150 frames)
    while (frame && !isFaceFound) {
      frameNum += 1;
      frame = video.read();
      if (frameNum % 150 === 0) {
        faces = faceClassifier.detectMultiScale(frame.bgrToGray(), 1.03, 50);
        isFaceFound = !!faces.objects.length;

        process.env.DEBUG && this.log(faces);

        const { selectedFileName, settings } = args.context;
        const processedFileName = `ORIGINAL-${selectedFileName}.jpg`;
        const destinationPath = `${settings.output}/${processedFileName}`;
        if (process.env.DEBUG) {
          cv.imwrite(destinationPath, frame);
        }
      }
    }

    this.log(`Found faces on frame ${frameNum}`);

    return {
      result: frame,
      name: this.name,
      args: {
        ...args,
        context: {
          ...args.context,
          faceRectangles: faces.objects,
        },
      },
    };
  }
}
