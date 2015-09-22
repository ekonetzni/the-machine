import os, sys
sys.path.insert(0, os.path.abspath('..'))

from machine.consultants.videographer import Videographer
import cv2
import click
import numpy as np

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
    #groupBySimilarity(image)
    #_findReddest(image)

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