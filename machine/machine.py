import socket
import thread
import sys
import ConfigParser
import pickle
import cv2

from consultants.buyer import Buyer
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
            "overlay"   : self.config.get('settings', 'overlay'),
            "method"    : self.config.get('settings', 'method')
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
                
    def devMode(self):
        while True:
            # retrieve user input
            self.state["action"] = str.lower(raw_input(self.prompt))
            if self.state["action"] == "quit":
                break
            else:
                inputs = self.state["action"].split()
                self._set_action(inputs.pop(0))
                self.state["action"](inputs)
    
    def network(self):
        # Create and bind our server socket.
        server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server.bind((self.config.get('settings', 'host'), self.config.get('settings', 'port')))
        server.listen(self.config.get('settings', 'agents'))
        
        while True:
            sys.stderr.write("Waiting for connection...\n")
            client, addr = server.accept()
            sys.stderr.write("...connected from: %(address)s\n" % {'address' : addr})
            try:
                thread.start_new_thread(self.agent, (client, addr))
            except Exception:
                sys.stderr.write("Exploded!\n")
        
        server.close()

    ### ACTIONS ###
    
    def evaluate(self):
        """
        Called in loop to simulate running the machine.
        """
        # Handle general business of the bureaucracy.
            # Buyers work
            # Committees meet
            # New Requests checked

        ### Buying Loop ###
        print "evaluate"


    def agent(self, client, addr):
        """
        The thread agent for network mode.
        """
        while True:
            client.send(self.prompt)
            data = client.recv(self.config.get('settings', 'buffer_size'))
            if data:
                self.state["action"] = str.lower(data)
                if not self.handle_action():
                    break
                else:
                    client.send("\n".join(self.state["message"]))
                    self.state["message"] = []
            else:
                break
        
        client.close()
    
    def _set_action(self, action):
        try:
            self.state["action"] = getattr(self, action)
        except AttributeError:
            print "Machine does not know how to do that."

    def _save_data(self):
        try:
            pickle.dump(self.state, open("%s/obj/state.obj" % self.config.get('settings', 'path'), 'w'))
            return True
        except Exception:
            return False
    
    def _load_data(self):
        try:
            self.state = pickle.load(open("%s/obj/state.obj" % self.config.get('settings', 'path'), 'rb'))
            return True
        except Exception:
            return False
    
    def get_state(self):
        return self.state



m = Machine("./config/machine.cfg")
m.start()          