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

  # MODIFICATION METHODS

  def midlineHorizontal(self, image):
    """
    Takes a sample pixel from the midline of each row
    makes the row that color
    """
    if not image is None:
      numRows, numColumns = self._getDimensions(image)

      mid = numColumns / 2

      for row in range(numRows - 1):
        color = image[row, mid]
        for column in range(numColumns - 1):
          image[row, column] = color

    return image

  def groupBySimilarity(self, image):
    numRows, numColumns = self._getDimensions(image)
    new = image
    mid = numColumns / 2

    for row in range(numRows - 1):
      color = image[row, mid]
      for column in range(numColumns - 1):
        if _isSimilar(image[row, column], color, 10):
          # What do I want to do here?
          print image[row, column]
          print "similar"
          print color


  def findReddest(self, image):
    numRows, numColumns = self._getDimensions(image)
    location = (0, 0)
    highestR = 0

    for row in range(numRows - 1):
      for column in range(numColumns - 1):
        blue, green, red = image[row, column]
        total = red + green + blue

        ratio = _calculateColorRatio(red, total)
        rg = _calculateColorRatio(red, green)
        rb = _calculateColorRatio(red, blue)

        if ratio > highestR and (rg > 1.1 or rb > 1.1) and red > 20 and red > green and red > blue:
          # So it's got a high R, but the G and B need to be far away.
          highestR = ratio
          location = (row, column)
          print "Ratio %f, RG %f, RB %f" % (highestR, rg, rb)
          print "Red %d, %d" % location

    x, y = location
    print "Final %d, %d" % (x, y)
    print image[x][y]

  # UTILITY FUNCTIONS

  def _getDimensions(self, image, dimension="both"):
    if dimension == "rows":
      return len(image)
    elif dimension == "columns":
      return len(image[0])
    else:
      return (len(image), len(image[0]))

  def _calculateColorRatio(self, a, b):
    if b > 0:
      return float(a) / float(b)
    elif a > 0:
      return 1
    else:
      return 0

  def _isSimilar(self, a, b, sensitivity=20):
    if ((a[0] > b[0] - sensitivity / 2 and a[0] < b[0] + sensitivity / 2) and
        (a[1] > b[1] - sensitivity / 2 and a[1] < b[1] + sensitivity / 2) and
        (a[2] > b[2] - sensitivity / 2 and a[2] < b[2] + sensitivity / 2)):
      return True
    else:
      return False

  def __init__(self):
    """
    Videographer
    """
