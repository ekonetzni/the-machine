import os, sys
sys.path.insert(0, os.path.abspath('..'))

from machine.consultants.videographer import Videographer
import cv2
import click
import numpy as np

def hilarity(a, b):
  numRows = numColumns = 0
  
  numRows = min(len(a), len(b))
  numColumns = min(len(a[0]), len(b[0]))
  newImage = np.empty((numRows, numColumns, 3))

  print "%d rows, %d columns" % (numRows, numColumns)

  for row in range(numRows - 1):
    for column in range(numColumns - 1):
      if row % 2 == 0:
        if column % 2 == 0:
          newImage[row, column] = a[row, column]
        else:
          newImage[row, column] = b[row, column]
      else:
        if column % 2 == 0:
          newImage[row, column] = b[row, column]
        else:
          newImage[row, column] = a[row, column]
 
  return newImage



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

def _getDimensions(image, dimension="both"):
  if dimension == "rows":
    return len(image)
  elif dimension == "columns":
    return len(image[0])
  else:
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
  elif service == 'hilarious':
    v1 = Videographer()
    v1.video('../assets/chesapeake-1080.mp4')
    v2 = Videographer()
    v2.video('../assets/water.MOV')

    i1 = v1.readNextFrame()
    i2 = v2.readNextFrame()

    img = hilarity(i1, i2)
    v.writeImage(out, img)

    cv2.imshow('image', img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
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