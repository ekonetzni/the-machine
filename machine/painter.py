import cv2
import sys
import random
import os
import numpy
import time

class Painter(object):

  def generate(self, sourceVideo):
    video = cv2.VideoCapture(sourceVideo)
    numFrames = video.get(cv2.CAP_PROP_FRAME_COUNT)

    image = self.readSpecific(video, numFrames / 2) # Middle frame of the video

    return self.midleHorizontal(image)


  def readSpecific(self, video, requestedFrame):
    current = 0
    while current <= requestedFrame:
      success, image = video.read()
      current += 1

    return image


  def midleHorizontal(self, image):
    """
    Takes a sample pixel from the midline of each row
    makes the row that color.
    """
    if not image is None:
      numRows, numColumns = self._getDimensions(image)

      mid = numColumns / 2

      for row in range(numRows - 1):
        color = self._getColor(image, (row, mid))
        image[row, 0:numColumns] = color

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


  def _getColor(self, image, index):
    color = []
    color.append(image.item(index[0], index[1], 0))
    color.append(image.item(index[0], index[1], 1))
    color.append(image.item(index[0], index[1], 2))
    return color


  def __init__(self):
    """
    Videographer
    """
    self.currentFrame = 0

