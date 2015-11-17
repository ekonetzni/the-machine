from consultant import Consultant
import cv2
import sys
import random
import os
import numpy
import time

class Videographer(Consultant):
  
  def midlineSwitch(self, image):
    """
    This plays well with width probably.
    """
    if not image is None:
      numRows, numColumns = self._getDimensions(image)

      mid = numColumns / 2

      direction = "left"

      for row in range(numRows - 1):
        color = self._getColor(image, (row, mid))
        if row % 20 == 0:
            direction = 'left' if direction == 'right' else 'right'
        
        if direction == 'left':
          image[row, 0:mid] = color
        else:
          image[row, mid:numColumns] = color

    self._update_progress()
    return image

  def midlineWidth(self, image, width):
    """
    Makes shit like, 18 colors. If that's what you want.
    """
    if not image is None:
      numRows, numColumns = self._getDimensions(image)

      mid = numColumns / 2

      direction = 'left'
      for row in range(numRows - 1):
        if width > 0 and row % width == 0: # Every nth row
          color = self._getColor(image, (row, mid))
          if row % 10 == 0:
            direction = 'left' if direction == 'right' else 'right'

          for i in range(width):
            try:
              if direction == 'left':
                image[row - i, 0:mid] = color
                image[row + i, 0:mid] = color
              else:
                image[row - i, mid:numColumns] = color
                image[row + i, mid:numColumns] = color
            except: # Yeah there'll be index errors. whatev.
              pass

    self._update_progress()
    return image 


  def midlineHorizontalVerticalBreaks(self, image):
    """
    Takes a sample pixel from the midline of each row
    makes the row that color
    """
    if not image is None:
      numRows, numColumns = self._getDimensions(image)

      mid = numColumns / 2

      for row in range(numRows - 1):
        color = self._getColor(image, (row, mid))
        for column in range(numColumns - 1):
          if column % 15 > 0 and row % 2 == 0:
            image[row, column] = color

    self._update_progress()
    return image

  def midlineGrid(self, image):
    """
    Takes a sample pixel from the midline of each row
    makes the row that color
    """
    if not image is None:
      numRows, numColumns = self._getDimensions(image)

      mid = numColumns / 2

      for row in range(numRows - 1):
        if row % 25 > 0:
          color = self._getColor(image, (row, mid))
          for column in range(numColumns - 1):
            if column % 25 > 0:
              image[row, column] = color

    self._update_progress()
    return image


  def midlineExclusion(self, image):
    """
    Takes a sample pixel from the midline of each row
    makes the row that color
    """
    if not image is None:
      numRows, numColumns = self._getDimensions(image)

      mid = numColumns / 2

      for row in range(numRows - 1):
        color = self._getColor(image, (row, mid))
        for column in range(numColumns - 1):
          if self.eMap.item(row, column) < 255:
            image[row, column] = color

    self._update_progress()
    return image

  def midlineHorizontal(self, image, width=0, exclusion=False):
    """
    Takes a sample pixel from the midline of each row
    makes the row that color
    """
    if not image is None:
      numRows, numColumns = self._getDimensions(image)

      mid = numColumns / 2

      for row in range(numRows - 1):
        if width > 0 and row % width == 0: # Every 5th row
          color = self._getColor(image, (row, mid))
          for i in range(width):
            try:
              image[row - i, 0:numColumns] = color
              image[row + i, 0:numColumns] = color
            except: # Yeah there'll be index errors. whatev.
              pass

    self._update_progress()
    return image

  def auto(self, settings, method="midlineVertical"):
    # This def needs to be more pythonic but eh, it works.
    videos = os.listdir(settings["source"])
    #self.eMap = self.generateOverlay(cv2.imread('/Users/ekonetzni/Dropbox/code/the-machine/assets/rectangle-overlay-2.jpg'))
    for video in videos:
      if video[:1] == '.':
        pass
      else:
        print "Processing video %s/%s" % (settings["source"], video)
        self.video("%s/%s" % (settings["source"], video))

        destination = "%s/%s" % (settings["output"], video)
        func = getattr(self, method)

        height, width = self._getDimensions() 
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        fps = self.vid.get(cv2.CAP_PROP_FPS) * float(settings["speed"])

        print "Creating video %s at %ffps" % (destination, fps)
        v = cv2.VideoWriter(destination, fourcc, fps, (width, height))


        moreFrames = True
        while moreFrames:
          image = self.readNextFrame()
          
          #if self.eMap is None and settings["overlay"] is True:
          #  self.eMap = self.generateOverlay(image)

          if numpy.any(image):
            frame = func(image)
            v.write(frame)
          else:
            moreFrames = False
            v.release()

  def video(self, videoFile=False):
    """
    Sets the instance video. This is necessary
    for readNextFrame, etc.
    """
    self.currentFrame = 0

    if videoFile:
      self.vid = cv2.VideoCapture(videoFile)
      self.numFrames = self.vid.get(cv2.CAP_PROP_FRAME_COUNT)
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
    self.currentFrame = 0
    success = True
    count = 0
    vid = cv2.VideoCapture(videoFile)
    while success:
      success, image = vid.read()
      frames.append(image)
      
      if cv2.waitKey == 27:
        break

      count += 1

    self.numFrames = vid.get(cv2.CAP_PROP_FRAME_COUNT)
    vid.release()

    return frames

  def writeAllFrames(self, fileName, frames):
    height, width, channels = frames[0].shape
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    v = cv2.VideoWriter(fileName, fourcc, 15, (width, height)) # filename, FOUR_CC Codec, fps, frameSize, isColor

    print "Writing %d frames..." % len(frames)
    for frame in frames:
      if not frame is None:
        v.write(frame)

    self.currentFrame = 0
    v.release()

  # MODIFICATION METHODS

  def generateOverlay(self, image):
    """
    Accepts an image, converts to grayscale then returns a 
    numpy array of the BW version.
    """
    print "Generating map"
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    (threshold, im_bw) = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)

    return im_bw

  def swirl(self, image):
    # Choose a point
    # Assemble palette
    # Begin grouping out from point
    if not image is None:
      numRows, numColumns = self._getDimensions(image)

      center = image[numRows / 2, numColumns / 2]
      print "Generating palette..."
      palette = self._generatePalette(image)
      print "Palette generated."
      print "Center"
      print center
      #TODO
      distanceFromCenter = 1
      
      for row in range(numRows - 1):
        for column in range(numColumns - 1):
          image[row, column] = [0, 0, 0]

      print "Beginning swirl..."
      for factor in range(5): # Just do it 100 times
        color, palette = self._findSimilar(center, palette)
        print color
        for index in range(-distanceFromCenter, distanceFromCenter + 1):
          # This will produce a square
          try:
            image[x - distanceFromCenter, y + index] = color
            image[x + distanceFromCenter, y + index] = color
            image[x + index, y - distanceFromCenter] = color
            image[x + index, y + distanceFromCenter] = color
          except Exception: # There will be value erros, but I don't care.
            pass
          distanceFromCenter += 1

    #self._update_progress()
    return image

  def breathe(self, videoFile):
    """
    This one takes a very long time
    """
    frames = self.readAllFrames(videoFile)
    x, y = self._getDimensions(frames[0])
    maxFactor = len(frames) / 6
    factor = 1
    locations = []
    self.currentFrame = 0
    self.numFrames = len(frames)
    grow = True

    for i in range(100000):
      locations.append((random.randint(0,x - 1), random.randint(0,y - 1)))

    for image in frames:
      self.currentFrame += 1
      self._update_progress()
      for location in locations:
        image = self._grow(image, location, factor)

      if factor >= maxFactor:
        grow = False
      elif factor <= 0:
        grow = True

      if grow:
        factor += 1
      else:
        factor -= 1

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
      self._update_progress()
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

  def midlineVertical(self, image, width=0):
    """
    Takes a sample pixel from the midline of each column
    makes the column that color
    """
    if not image is None:
      numRows, numColumns = self._getDimensions(image)

      mid = numRows / 2

      for column in range(numColumns - 1):
        color = self._getColor(image, (mid, column))
        if width > 0:
          r = g = b = 0
          for i in range(width):
            b = b + image.item(row - i, mid, 0)
            g = g + image.item(row - i, mid, 1)
            r = r + image.item(row - i, mid, 2)
          color = [b / (width * 2), g  / (width *2), r / (width *2)]
        image[0:numRows, column] = color

    self._update_progress()
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

  def _getDimensions(self, image=None):
    if image is None:
      width = self.vid.get(cv2.CAP_PROP_FRAME_WIDTH)
      height = self.vid.get(cv2.CAP_PROP_FRAME_HEIGHT)
      return int(height), int(width)
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

  def _getColor(self, image, index):
    color = []
    color.append(image.item(index[0], index[1], 0))
    color.append(image.item(index[0], index[1], 1))
    color.append(image.item(index[0], index[1], 2))
    return color

  def _update_progress(self):
    progress = 100 * (float(self.currentFrame) / self.numFrames)
    if progress == 0:
      print "\n"
    sys.stdout.write('\r[{0}] {1}%'.format('#'*(int(progress) / 10), round(progress, 1)))
    sys.stdout.flush()
    self.currentFrame += 1

  def __init__(self):
    """
    Videographer
    """
    self.currentFrame = 0
    self.eMap = None
