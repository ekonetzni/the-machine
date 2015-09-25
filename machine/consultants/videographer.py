from consultant import Consultant
import cv2
import sys
import random

class Videographer(Consultant):

  def video(self, videoFile=False):
    """
    Sets the instance video. This is necessary
    for readNextFrame, etc.
    """
    self.numFrames = 1
    self.currentFrame = 0

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
    self.numFrames = len(frames)
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

    self.currentFrame = 0
    v.release()

  # MODIFICATION METHODS

  def breathe(self, videoFile):
    frames = self.readAllFrames(videoFile)
    x, y = self._getDimensions(frames[0])
    maxFactor = len(frames) / 6
    factor = 1
    locations = []
    progress = 0
    complete = len(frames)

    for i in range(10000):
      locations.append((random.randint(0,x - 1), random.randint(0,y - 1)))

    for image in frames:
      self._update_progress(progress / complete)
      progress += 1
      for location in locations:
        image = self._grow(image, location, factor)

      if factor >= maxFactor:
        factor = 0

      factor += 1

    return frames

  def _grow(self, image, center, maxFactor):
    if not image is None:
      x, y = center
      color = image[center]

      for factor in range(maxFactor):
        for index in range(-factor, factor + 1):
          # This will produce a square
          try:
            image[x - factor, y + index] = color
            image[x + factor, y + index] = color
            image[x + index, y - factor] = color
            image[x + index, y + factor] = color
          except Exception: # There will be value erros, but I don't care.
            pass

    return image


  def removeColor(self, image, color):
    x, y = self._getDimensions(image)

    for row in range(x - 1):
      for column in range(y - 1):
        if self._isSimilar(image[row, column], color, sensitivity=100):
          image[row, column] = [255, 255, 255]

    return image

  def blackToWhite(self, image, axis="x"):
    if not image is None:
      self.currentFrame += 1
      self._update_progress(100 * (float(self.currentFrame) / self.numFrames))
      x = y = 1
      palette = self._generatePalette(image)
      counter = 0
      if axis == "x":
        x, y = self._getDimensions(image)
      elif axis == "y":
        y, x = self._getDimensions(image)

      for row in range(x - 1):
        for column in range(y - 1):
          if axis == "x":
            image[row, column] = palette[counter]
          elif axis == "y":
            image[column, row] = palette[counter]

          counter += 1

    return image


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

  def midlineVertical(self, image):
    """
    Takes a sample pixel from the midline of each column
    makes the column that color
    """
    if not image is None:
      numRows, numColumns = self._getDimensions(image)

      mid = numRows / 2

      for row in range(numRows - 1):
        for column in range(numColumns - 1):
          color = image[mid, column]
          image[row, column] = color

    return image


  def midlineDiagonal(self, image):
    """
    Takes a sample pixel along the top-left to bottom
    right diagonal and extends that along the same vector.
    """
    numRows, numColumns = self._getDimensions(image)
    newImage = image
    mid = numRows / 2

    for row in range(numRows - 1):
      for column in range(numColumns - 1):
        newImage[row, column] = image[row, column]
        image[row, column] = image[row, column + 1]

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

    # TODO

  # UTILITY FUNCTIONS

  def _findColor(self, color, image, similar=True, sensitivity=20):
    x, y = self._getDimensions(image)
    locations = []

    for row in range(x - 1):
      for column in range(y - 1):
        if self._isSimilar(image[row, column], color):
          locations.append((row, column))

    return locations

  def _findSimilar(self, color, palette):
    """
    Will find similar pixels to the specified color in your
    palette. Will pop items off of palette and return a 
    modified copy.
    Useful if you want to use each pixel only one time.
    """
    similar = []
    index = 0
    for c in palette:
      if self._isSimilar(color, c):
        similar.append(palette.pop(index))
      index += 1

    return (similar, palette)

  def _findReddest(self, image):
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
    # TODO

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

  def _generatePalette(self, image, whiteFirst=False):
    """
    Returns a sorted array of colors present in 'image'
    Disclaimer: I know numpy sorting would be so much faster,
    but since the end resuly is arrays of 3 it doesn't work how I want.
    """
    numRows, numColumns = self._getDimensions(image)
    palette = self._flatten(numRows, numColumns, image)
    return sorted(palette, key=self._paletteSum, reverse=whiteFirst)

  def _flatten(self, numRows, numColumns, image):
    arr = []

    for row in range(numRows - 1):
      for column in range(numColumns - 1):
        arr.append(image[row, column])

    return arr

  def _paletteSum(self, color):
    return int(color[0]) + int(color[1]) + int(color[2])

  def _update_progress(self, progress):
    sys.stdout.write('\r[{0}] {1}%'.format('#'*(int(progress) / 10), progress))
    sys.stdout.flush()

  def __init__(self):
    """
    Videographer
    """
