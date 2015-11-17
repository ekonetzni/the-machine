import os, sys
sys.path.insert(0, os.path.abspath('..'))

from machine.consultants.videographer import Videographer
from machine.consultants.buyer import Buyer

import cv2
import click
import numpy as np


def colorCompare(a, b):
  return paletteSum(a) - paletteSum(b)

def paletteSum(color):
  return int(color[0]) + int(color[1]) + int(color[2])

# NOTE: It seems values are actually stored as BGR.

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

  if service == 'midline-h':
    print "Using midline horizontal processing..."
    v.writeAllFrames(out, map(v.midlineHorizontal, v.readAllFrames(video)))
  elif service == 'midline-v':
    print "Using midline vertical processing..."
    v.writeAllFrames(out, map(v.midlineVertical, v.readAllFrames(video)))
  elif service == 'midline-d':
    print "Using midline diagonal processing..."
    cv2.imshow('image', v.midlineDiagonal(v.readNextFrame()))
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    #v.writeAllFrames(out, map(v.midlineDiagonal, v.readAllFrames(video)))
  elif service == 'sorted-asc-horizontal':
    print "Sorting with black first"
    v.writeAllFrames(out, map(v.blackToWhite, v.readAllFrames(video)))
  elif service == 'sorted-asc-vertical':
    print "Sorting with black first"
    v.writeAllFrames(out, map(v.blackToWhiteVertical, v.readAllFrames(video)))
  elif service == 'breathe':
    print "Breathing..."
    v.writeAllFrames(out, v.breathe(video))
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
    b = Buyer('../assets/')
    b.download("https://www.youtube.com/watch?v=bha24P9uw-E")

    #cv2.imshow('image', im)
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