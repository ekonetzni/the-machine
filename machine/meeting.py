import random

class Meeting(object):
  def __init__(self, location, date, duration):
    self.location = location
    self.date = date
    self.duration = duration

  def meet(self):
    # Timing function, random chance to decide
    return 

  def decide(self):
    return random.randint(0,1)