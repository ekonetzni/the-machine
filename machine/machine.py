import socket
import thread
import sys
import ConfigParser
import pickle
import cv2

#from consultants.buyer import Buyer
from consultants.videographer import Videographer

class Machine(object):
    """
    This is a basic engine for running the machine.
    It is responsible for handling user input, managing machine state
    and firing appropriate actions via the clerks.
    """
    def __init__(self, config_file):
        self.config = ConfigParser.ConfigParser()
        path = config_file
        sys.stderr.write("Starting with config from %s\n" % path)
        self.config.read(path)
        # Settings
        self.prompt = self.config.get('general', 'prompt')
        
        self.actions = {}
        # action mappings.
        #for verb, control in config.items('actions'):
        #    klass = getattr(controllers, control)
        #    self.actions[verb] = klass()
    
        if self._load_data():
            pass
        else:
            try:     
                # Application state
                self.state = {
                    "action"    : 'null',
                    "message"   : []
                }
                #self._save_data()
            except IOError:
                pass
        
        #klass = getattr(models, config.get('general', 'model'))
        #self.model = klass("generic","configpath")
    
    
    def start(self):
        """
        The primary sim loop regardless of mode.
        """
        try:
            func = getattr(self, self.config.get('settings', 'mode'))
            func()
        except AttributeError as detail:
            print "Machine has encountered a problem."
            print detail

    def imageMode(self):
        prompt = "image mode > "
        
        while True:
            rawInput = raw_input(prompt).split()
            self.state["action"] = rawInput[0]
            if self.state["action"] == "quit":
                break
            elif self.state["action"] == "go":
                v = Videographer()
                v.video(rawInput[2])
                try:
                    func = getattr(v, rawInput[1])
                    cv2.imshow('image.jpg', func(v.readNextFrame(), exclusion=True))
                except AttributeError as detail:
                    print detail

    def videoMode(self):
        prompt = "video mode >"
        settings = {
            "source"    : self.config.get('settings', 'source'),
            "output"    : self.config.get('settings', 'output'),
            "speed"     : self.config.get('settings', 'speed'),
            "method"    : self.config.get('settings', 'method'),
            "overlays"  : self.config.get('settings', 'overlays')
        }

        while True:
            rawInput = raw_input(prompt).split()
            self.state["action"] = rawInput[0]
            if self.state["action"] == "quit":
                break
            elif self.state["action"] == "set":
                print "Setting %s to %s" % (rawInput[1], rawInput[2])
                settings[rawInput[1]] = rawInput[2]
            elif self.state["action"] == "settings":
                for setting, value in settings.iteritems():
                    print "%s is set to %s" % (setting, value)
            elif self.state["action"] == "go":
                v = Videographer()
                v.auto(settings, method=settings["method"])
            elif self.state["action"] == "audio":
                v = Videographer()
                v.audio(settings)
            elif self.state["action"] == 'overlays':
                v = Videographer()
                v.autoOverlay(settings)



m = Machine("./config/machine.cfg")
m.start()          
