from bureaucrat import Bureaucrat
from consultants.videographer import Videographer
from task import Task

import click
import cv2

class Clerk(Bureaucrat):

  def initiate(self, **kwargs):
    print "initiating"
    if 'service' in kwargs:
      service = kwargs.get('service', 'default')
      if service == 'video':
        t = Task(service='video', duration=kwargs.get('duration'), out=kwargs.get('out'))
      else:
        print 'Default service executed'

      print "%s, %s, %s" % (t.service, t.duration, t.out)


  def assignWork(self, options):
    # This should determine by some means the task to be completed
    # notify a bureaucrat
    pass

  def __init__(self):
    """
    Accepts Requests
    """

@click.command()
@click.option('--service', 
              help='The name of the service you\'d like to request')
@click.option('--video',
              help="Full path to the video to be modified")
@click.option('--out',
              help="The out directory")
@click.option('--duration',
              help="The duration for the final video")
def run(service, video, out, duration=300):
  v = Videographer()
  if service == "video":
    c = Clerk()
    c.initiate(service="video", duration=duration, out=out)
  else:
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
    pass
    #image = v.readNextFrame()
    #palette = v._generatePalette(image)

    #cv2.imshow('image', im)
    #cv2.waitKey(0)
    #cv2.destroyAllWindows()

if __name__ == '__main__':
  run()