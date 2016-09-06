import sys
import ConfigParser
import threading

from painter import Painter
from communications import Twilio

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

        sms = Twilio(self.config.get('settings', 'api_path'))
        painter = Painter()

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
                    
                    image = painter.generate(source)

                    painter.writeImage(output, image)

                    sms.send("Completed creation of %s." % output)

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
       