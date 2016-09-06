import sys
import ConfigParser
import cv2
import threading

from consultants.videographer import Videographer

class Machine(object):
    """
    This is a basic engine for running the machine.
    It is responsible for handling user input, and managing the process loop.
    """
    def __init__(self, config_file):
        self.config = ConfigParser.ConfigParser()
        path = config_file
        sys.stderr.write("Starting with config from %s\n" % path)
        self.config.read(path)
        # Settings
        self.prompt = self.config.get('general', 'generation')
        
        self.actions = {}
        # action mappings.
        #for verb, control in config.items('actions'):
        #    klass = getattr(controllers, control)
        #    self.actions[verb] = klass()  
    
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

    def agent(self, settings):
        print "Agent starting"

        while True:
            if self.shouldThreadQuit:
                print "Agent terminated"
                break

            videos = os.listdir(settings["source"])

            for video in videos:
                if video[:1] == '.':
                    pass
                else:
                    source = "%s/%s" % (settings["source"], video)
                    output = "%s/%s-%s" % (settings["output"], time.time(), video)
                    
                    v = Videographer(source)
                    func = getattr(v, rawInput[1])
                    cv2.imwrite(path, func(v.readNextFrame(), exclusion=True))

    def loop(self):
        prompt = "Generation %s -> " % self.config.get('general', 'generation')
        settings = {
            "source"    : self.config.get('settings', 'source'),
            "output"    : self.config.get('settings', 'output'),
            "method"    : self.config.get('settings', 'method'),
        }

        while True:
            action = raw_input(prompt).split()[0]
            agent = threading.Thread(target=agent, args=(self,settings,))

            if action == "quit":
                self.shouldThreadQuit = True
                
                # Wait for threads to wrap up
                while agent.isAlive():
                    pass

                break
            elif action == "go":
                agent.start()
       