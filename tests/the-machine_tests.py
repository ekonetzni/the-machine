from nose.tools import *
from machine.navigator import Navigator

def test_convertToPoint():
    """
    convertToPoint should take ANYTHING as input and return 
    an x,y coordinate pair.
    """
    n = Navigator()
    print(n.convertToPoint("hello world"))

@classmethod
def setup_class(klass):
    """This method is run once for each class before any tests are run"""

@classmethod
def teardown_class(klass):
    """This method is run once for each class _after_ all tests are run"""

def setUp(self):
    """This method is run once before _each_ test method is executed"""

def teardown(self):
    """This method is run once after _each_ test method is executed"""