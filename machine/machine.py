import sys
import os
import ConfigParser
import threading
import time

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
            self._message("Machine has encountered a problem.")
            self._message(detail)

    def museAgent(self, settings):
        self._message("Muse starting")

        sms = Twilio(self.config.get('settings', 'api_config'))
        muse = Muse(self.config.get('settings', 'api_config'))

        while True and not self.shouldThreadQuit:
            queries = muse.getQueries(self.config.get('feeds', 'urls').split(','))

            for q in queries:
                if self.shouldThreadQuit:
                    break

                urls = muse.search(q, 6)
                for u in urls:
                    if self.shouldThreadQuit:
                        break
                        
                    try:
                        muse.download(u)
                    except Exception as e:
                        self._message('Problem downloading something')

        self._message("Muse terminated")
        return

    def painterAgent(self, settings):
        self._message("Painter starting")

        sms = Twilio(self.config.get('settings', 'api_config'))
        painter = Painter()

        while True and not self.shouldThreadQuit:
            videos = os.listdir(settings["source"])

            for video in videos:
                if self.shouldThreadQuit:
                    break

                if video[:1] == '.' or video[-4:] == '.lck' or os.path.exists('%s/%s.lck' % (settings['source'], video)):
                    pass
                else:
                    source = "%s/%s" % (settings["source"], video)
                    output = "%s/%s-%s.jpg" % (settings["output"], time.time(), video)
                    
                    image = painter.generate(source)

                    painter.writeImage(output, image)

                    os.remove(source)

                    sms.send("Completed creation of %s." % output)

        self._message("Painter quitting")
        return

    def loop(self):
        prompt = "Generation %s -> " % self.config.get('general', 'generation')
        settings = {
            "source"    : self.config.get('settings', 'source'),
            "output"    : self.config.get('settings', 'output'),
            "method"    : self.config.get('settings', 'method'),
        }

        while True:
            action = raw_input(prompt)
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

    def _message(self, message):
        sys.stdout.write('\n{0}\n'.format(message))
        sys.stdout.flush()
       
