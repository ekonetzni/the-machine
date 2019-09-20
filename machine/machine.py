import sys
import os
import configparser
import threading
import time
import dropbox

from .painter import Painter
from .muse import Muse

class Machine(object):
    """
    This is a basic engine for running the machine.
    It is responsible for handling user input, and managing the process loop.
    """
    def __init__(self, config_file):
        self.config = configparser.ConfigParser()
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

        muse = Muse(self.config.get('settings', 'api_config'))

        while True and not self.shouldThreadQuit:
            queries = muse.getQueries(self.config.get('feeds', 'urls').split(','))

            for q in queries:
                if self.shouldThreadQuit:
                    break

                urls = muse.search(q, 6)
                throttle = 0

                for u in urls:
                    if self.shouldThreadQuit:
                        break

                    try:
                        muse.download(u)
                    except Exception as e:
                        self._message('Problem downloading something')

                    for n in range(0,30*60):
                        if self.shouldThreadQuit:
                            break
                        
                        time.sleep(1) # lol xD

        self._message("Muse terminated")
        return

    def painterAgent(self, settings):
        self._message("Painter starting")

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
                    lockFile = "%s/%s-%s.jpg.lck" % (settings["output"], time.time(), video)

                    self._message("Painting...")
                    image = painter.generate(source)

                    open(lockFile, 'a').close()
                    painter.writeImage(output, image)
                    os.remove(lockFile)

                    os.remove(source)

        self._message("Painter quitting")
        return

    def galleryAgent(self, settings):
        self._message("Gallery starting")

        apiConfig = configparser.ConfigParser()
        apiConfig.read(self.config.get('settings', 'api_config'))
        dbox = dropbox.Dropbox(apiConfig.get('dropbox', 'token'))

        while True and not self.shouldThreadQuit:
            images = os.listdir(settings['output'])

            for image in images:
                if self.shouldThreadQuit:
                    break

                fullPath = '%s/%s' % (settings['output'], image)
                lockPath = '%s/%s.lck' % (settings['output'], image)

                if image[:1] == '.' or image[-4:] == '.lck' or os.path.exists(lockPath):
                    pass
                else:
                    f = open(fullPath, 'r')
                    dbox.files_upload(f, '/%s/%s' % (apiConfig.get('dropbox', 'directory'), image))
                    f.close()
                    os.rename(fullPath, '%s/%s' % (settings['storage'], image))


    def loop(self):
        prompt = "Generation %s -> " % self.config.get('general', 'generation')
        settings = {
            "source"    : self.config.get('settings', 'source'),
            "output"    : self.config.get('settings', 'output'),
            "method"    : self.config.get('settings', 'method'),
            'storage'   : self.config.get('settings', 'storage')
        }
        painter = threading.Thread(target=self.painterAgent, args=(settings,))
        muse = threading.Thread(target=self.museAgent, args=(settings,))
        gallery = threading.Thread(target=self.galleryAgent, args=(settings,))

        while True:
            action = input(prompt)

            if action == "quit":
                self.shouldThreadQuit = True
                
                # Wait for threads to wrap up
                while painter.isAlive() or muse.isAlive() or gallery.isAlive():
                    pass

                break
            elif action == "go":
                self.shouldThreadQuit = False
                painter.start()
                muse.start()
                gallery.start()
            elif action == "gallery":
                self.shouldThreadQuit = False
                gallery.start()

    def _message(self, message):
        sys.stdout.write('\n{0}\n'.format(message))
        sys.stdout.flush()
       
