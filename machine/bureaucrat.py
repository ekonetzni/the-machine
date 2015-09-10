from worker import Worker
import time
import random


class Bureaucrat(Worker):

	def dally(self, intervalMax=42):
		interval = random.randint(1, intervalMax)
		i = 0
		while i < interval:
			time.sleep(.01)
			i += 1
			
		return "Bureaucrat succesfully dallied!"

	def dawdle(self):
		self.dally(intervalMax=23)
		return "Bureaucrat succesfully dawdled!"

	def _praiseSelf(self):
		return

	def scheduleMeeting(self):
		return

	def createCommittee(self):
		"""
		More or less a factory, except there's only
		one type of committee.
		"""
		return

	def __init__(self):
		"""
		Probably doesn't do much.
		"""