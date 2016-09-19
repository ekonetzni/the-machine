import cv2
import sys
import random
import os
import numpy
import time
import random

class Painter(object):

  def generate(self, sourceVideo):
    video = cv2.VideoCapture(sourceVideo)
    numFrames = video.get(cv2.CAP_PROP_FRAME_COUNT)

    #image = self.readSpecific(video, random.randint(1,numFrames))
    success, image = video.read()

    return self.midleHorizontal(image)


  def readSpecific(self, video, requestedFrame):
    current = 0
    while current <= requestedFrame:
      success, image = video.read()
      current += 1

    return image


  def midleHorizontal(self, source):
    """
    Takes a sample pixel from the midline of each row
    makes the row that color.
    """
    _longEdge = 10800
    numRows, numColumns = self._getDimensions(source)
    mid = numColumns / 2
    factor = int(_longEdge / numRows)
    image = numpy.empty([numRows * factor, numColumns * factor, 3], numpy.uint8)

    for n in range((numRows * factor) - 1):
      color = self._getColor(source, (n, mid), invert=True)
      startRow = n * factor
      endRow = startRow + factor

      source[startRow:endRow, 0:(numColumns * factor)] = color

    return image


  def writeImage(self, path, image):
    cv2.imwrite(path, image)


  def _getDimensions(self, image=None):
    if image is None:
      width = self.vid.get(cv2.CAP_PROP_FRAME_WIDTH)
      height = self.vid.get(cv2.CAP_PROP_FRAME_HEIGHT)
      return int(height), int(width)
    else:
      return (len(image), len(image[0]))


  def _invertColor(self, color):
    return map(lambda x: 255 - x, color)

  def _getColor(self, image, index, invert=False):
    color = []
    color.append(image.item(index[0], index[1], 0))
    color.append(image.item(index[0], index[1], 1))
    color.append(image.item(index[0], index[1], 2))
    return self._invertColor(color) if invert else color


  def __init__(self):
    """
    Videographer
    """
    self.currentFrame = 0

