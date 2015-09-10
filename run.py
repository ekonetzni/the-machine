from ../machine.consultants.videographer import Videographer
import cv2

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

def removeEveryOtherPixel():
  v = Videographer()
  frames = v.readAllFrames('./assets/chesapeake-480.mp4')
  newFrames = []
  index = 0

  for image in frames:
    #if index == len(frames) - 1:
      #break
    # video is 640 x 360
    # Set the rows between 400 and 500 to white
    #for row in range(0, 359):
    #  if row % 2 == 0:
     #   for column in range(0, 639):
      #    if row % 2 == 0:
       #     if not column % 2 == 0:
        #      image[row, column] = [0,0,0]
      #else:
       # for column in range(0, 639):
        #  if not row % 2 == 0:
         #   if column % 2 == 0:
          #    image[row, column] = [0,0,0]

    print "Appending frame %d" % index
    newFrames.append(image)
    index += 1

  v.writeAllFrames('./remove.avi', newFrames)

def swapColumns():
  v = Videographer()
  v.video('./assets/chesapeake-480.mp4')
  image = v.readNextFrame()

  for row in range(0, 360):
    if row % 2 == 0:
      for column in range(0, 640):
        image[row, column] = image[row + 1, column]

  v.writeImage('./swapColumns.jpg', image)

removeEveryOtherPixel()