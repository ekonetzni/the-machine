import os, sys
sys.path.insert(0, os.path.abspath('..'))

from machine.consultants.videographer import Videographer
import cv2
import click
import numpy as np

def midlineDominate(image):
  """
  Takes a sample pixel from the midline of each row
  makes the row that color
  """
  if not image is None:
    numRows, numColumns = _getDimensions(image)

    mid = numColumns / 2

    for row in range(0, numRows - 1):
      color = image[row, mid]
      for column in range(0, numColumns - 1):
        image[row, column] = color

  return image

def swapColumns(image):
  numRows, numColumns = _getDimensions(image)

  for row in range(0, numRows - 1):
    if row % 2 == 0:
      for column in range(0, numColumns - 1):
        target = column + 5
        if target > 639:
          target = target - 639
        image[row, column] = image[row, target]

  return image

def shift(image, amount):
  numRows, numColumns = _getDimensions(image)

  for row in range(0, numRows - 1):
    target = row + amount 
    if target > numRows - 1:
      target = target - numRows - 1

    image[row] = image[target]

  return image

def _getDimensions(image):
  return (len(image), len(image[0]))


@click.command()
@click.option('--service', 
              help='The name of the service you\'d like to request')
@click.option('--video',
              help="Full path to the video to be modified")
@click.option('--out',
              help="The out directory")
def run(service, video, out):
  v = Videographer()
  v.video(video)
  
  # We're just going to work on one image at a time for now.
  image = v.readNextFrame()

  if service == 'swap-columns':
    v.writeImage('%s/swapColumns.jpg' % out, swapColumns(image))
  elif service == 'shift':
    print "Shifting stuff"
    v.writeImage('%s/shifted.jpg' % out, swapStuff(image))
  elif service == 'dominate':
    print "Color dominating"
    v.writeAllFrames(out, map(midlineDominate, v.readAllFrames(video)))
  else:
    print len(image[0])

  #cv2.imshow('image', image)
  #cv2.waitKey(0)
  #cv2.destroyAllWindows()

if __name__ == '__main__':
  run()


def generateJson():
  v = Videographer()
  v.video('./assets/chesapeake-480.mp4')

  jsonPixels = []

  json = v.convertFrameToJson(v.readNextFrame(), "json")

  with open('./pixels.json', 'w') as f:
    f.write("{\n\t\"pixels\" : [")
    f.write(",\n".join(json))
    f.write("\t]\n}")

  print "json generated"