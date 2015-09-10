from consultant import Consultant
import cv2

class Videographer(Consultant):

  def video(self, videoFile=False):
    """
    Sets the instance video. This is necessary
    for readNextFrame, etc.
    """
    if videoFile:
      self.vid = cv2.VideoCapture(videoFile)
    else:
      return self.vid

  def convertFrame(self, frame, outputType="array"):
    converted = []
    rowNum = 1

    for row in frame:
      columnNum = 1
      for pixel in row:
        if outputType == "json":
          p = "{\n\t \"x\" : %d,\n\t \"y\" : %d,\n\t \"r\" : %d,\n\t \"g\" : %d,\n\t \"b\" : %d }" % (rowNum, columnNum, pixel[0], pixel[1], pixel[2])
          converted.append(p)
        elif outputType == "array":
          p = [rowNum, columnNum, pixel[0], pixel[1], pixel[2]]
          converted.append(p)

        columnNum += 1

      rowNum += 1

    return converted

  def readNextFrame(self):
    success,image = self.vid.read()
    if success:
      return image
    else:
      return False

  def writeImage(self, path, image):
    cv2.imwrite(path, image)

  def readAllFrames(self, videoFile=False):
    if not videoFile:
      videoFile = self.vid

    frames = []
    success = True
    count = 0
    vid = cv2.VideoCapture(videoFile)
    while success:
      success, image = vid.read()
      frames.append(image)
      
      if cv2.waitKey == 27:
        break

      count += 1

    vid.release()
    return frames


  def writeAllFrames(self, fileName, frames):
    height, width, channels = frames[0].shape
    fourcc = cv2.cv.CV_FOURCC(*'mp4v')
    v = cv2.VideoWriter(fileName, fourcc, 30, (width, height)) # filename, FOUR_CC Codec, fps, frameSize, isColor

    index = 0
    print "Writing %d frames..." % len(frames)
    for frame in frames:
      if not index == len(frames) - 1: # if not last frame
        v.write(frame)
      index += 1

    v.release()

  def __init__(self):
    """
    Videographer
    """
