import sys
import ConfigParser
import threading

from painter import Painter
from muse import Muse
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

    def museAgent(self, settings):
        print "Muse starting"

        sms = Twilio(self.config.get('settings', 'api_config'))
        muse = Muse()

        while True:
            if self.shouldThreadQuit:
                print "Muse terminated"
                break

            # Check something for new queries
            #urls = muse.search()
            # Search
            # Download

    def painterAgent(self, settings):
        print "Painter starting"

        sms = Twilio(self.config.get('settings', 'api_config'))
        painter = Painter()

        while True:
            if self.shouldThreadQuit:
                print "Painter terminated"
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

                    os.remove(source)

                    sms.send("Completed creation of %s." % output)

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

    def loop(self):
        prompt = "Generation %s -> " % self.config.get('general', 'generation')
        settings = {
            "source"    : self.config.get('settings', 'source'),
            "output"    : self.config.get('settings', 'output'),
            "method"    : self.config.get('settings', 'method'),
        }

        while True:
            action = raw_input(prompt).split()[0]
            painter = threading.Thread(target=self.painterAgent, args=(settings,))
            muse = threading.Thread(target=self.museAgent, args=(settings,))

            if action == "quit":
                self.shouldThreadQuit = True
                
                # Wait for threads to wrap up
                while painter.isAlive() or muse.isAlive():
                    pass

                break
            elif action == "go":
                self.shouldThreadQuit = False
                painter.start()
                muse.start()

       
