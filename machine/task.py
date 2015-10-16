class Task(object):
  def __init__(self, **kwargs):
    self.service = kwargs.get('outputFormat')
    if 'duration' in kwargs:
      self.duration = kwargs["duration"]
    else:
      raise RequiredAttributeException("Duration is a required attribute for video requests")
          
    if 'out' in kwargs:
      self.out = kwargs.get('out')
    else:
      raise RequiredAttributeException("Output dir <out> is a required attribute")

    self.approved = False
    self.consultant = None

class RequiredAttributeException(Exception):
  def __init__(self, value):
    self.value = value
  def __str__(self):
    return repr(self.value)