from consultant import Consultant

import os
import wave
import scikits.audiolab as audio
import numpy as np
import random

class AudioTech(Consultant):
  """
  in ./notes/
  a
  b
  bb
  c
  cs
  d
  e
  eb
  f
  fs
  g
  gs
  """
  # 1 second of audio is 20 frames
  def go(self, filename):
    self.source = audio.Sndfile(filename, 'r')

  def trumpet(self, image, frames):
    height, width = self._getDimensions(image)
    g, b, r = self._getColor(image, (height / 2, width / 2))
    x = (g + b + r) / 3
    frames = None

    force = length = note = None

    if x == 0:
      force = "mezzo-forte"
    else:
      if g > b and g > r:
        force = "forte"
      elif b > r and b > g:
        force = "pianissimo"
      else:
        force = "fortissimo"

    if random.randint(0, 1) == 0:
      length = '025'
    else:
      length = '05'



  def rhythm(self, image):
    height, width = self._getDimensions(image)
    color = self._getColor(image, (height / 2, width / 2))
    x = (color[0] + color[1] + color[2]) / 3
    frames = None

    if x < 25:
      frames = self.notes["c"][0:14700]
      self.lastNote = self.notes["c"]
    elif x < 45:
      frames = self.notes["bb"][0:14700]
      self.lastNote = self.notes["bb"]
    elif x < 90:
      frames = self.notes["a"][0:14700]
      self.lastNote = self.notes["a"]
    elif x < 115:
      frames = self.notes["eb"][0:14700]
      self.lastNote = self.notes["eb"]
    elif x < 135:
      frames = self.notes["f"][0:14700]
      self.lastNote = self.notes["f"]
    else:
      frames = self.lastNote[14701:29400]

    return frames

  def staccato(self, image):
    height, width = self._getDimensions(image)
    color = self._getColor(image, (height / 2, width / 2))
    x = (color[0] + color[1] + color[2]) / 3
    frames = None

    if x < 25:
      frames = self.notes["c"][0:14700]
      self.lastNote = self.notes["c"]
    elif x < 45:
      frames = self.notes["bb"][0:14700]
      self.lastNote = self.notes["bb"]
    elif x < 90:
      frames = self.notes["a"][0:14700]
      self.lastNote = self.notes["a"]
    elif x < 115:
      frames = self.notes["eb"][0:14700]
      self.lastNote = self.notes["eb"]
    elif x < 135:
      frames = self.notes["f"][0:14700]
      self.lastNote = self.notes["f"]
    else:
      frames = self.lastNote[14701:29400]

    return frames


  def endRecording(self):
    self.snd.close()

  def beginRecording(self, filename):
    fmat = audio.Format("wav")
    self.snd = audio.Sndfile(filename, 'w', fmat, 2, 44100)

  def write(self, frames):
    self.snd.write_frames(frames)
    self.snd.sync()

  def playChord(self, chord):
    try:
      audio.play(self.chords[chord].T)
    except Exception as detail:
      print "unknown chord"
      print detail

  def play(self, note):
    try:
      audio.play(self.notes[note].T)
    except Exception as detail:
      print "Probably a bad note"
      print detail

  def _getDimensions(self, image):
    return (len(image), len(image[0]))

  def _getColor(self, image, index):
    color = []
    color.append(image.item(index[0], index[1], 0))
    color.append(image.item(index[0], index[1], 1))
    color.append(image.item(index[0], index[1], 2))
    return color

  def _map_chords(self):
    self.chords = {}
    self.chords['c'] = self.notes['c'] + self.notes['e'] + self.notes['g']
    self.chords['d'] = self.notes['d'] + self.notes['fs'] + self.notes['a']
    #self.chords['e'] = self.notes['e'] + self.notes['gs'] + self.notes['b']
    self.chords['f'] = self.notes['f'] + self.notes['a'] + self.notes['c']
    self.chords['g'] = self.notes['g'] + self.notes['b'] + self.notes['d']
    self.chords['a'] = self.notes['a'] + self.notes['cs'] + self.notes['e']


  def loadInstrument(self, directory):
    sounds = {}
    for sound in os.listdir(directory):
      if sound[0] is not '.':
        instrument, note, length, force, normal = sound.split('_')
        
        if not sounds.get(force):
          sounds[force] = {}

        if not sounds[force].get(length):
          sounds[force][length] = {}  

        sounds[force][length][note] = audio.wavread('%s%s' % (directory, sound))[0]

    return sounds


  def __init__(self, notesDir='/Users/ekonetzni/Dropbox/code/the-machine/machine/consultants/notes/'): # Lazy mapping
    self.notes = {}
    self.instruments = {
      'trumpet'   : self.loadInstrument('./sounds/trumpet/')
    }


    for wav in os.listdir(notesDir):
      name, extension = wav.split('.')
      if extension == 'wav':
        self.notes[name], self.sr, self.audioFormat = audio.wavread('%s%s' % (notesDir, wav))

    self._map_chords()







