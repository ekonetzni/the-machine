import socket
import threading
import sys

class Server(object):

    def listen(self, agent):
        # Create and bind our server socket.
        server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server.bind((self.config['host'], self.config['port']))
        server.listen(self.config['agents'])
        
        while True:
            sys.stderr.write("Waiting for connection...\n")
            client, addr = server.accept()
            sys.stderr.write("...connected from: %(address)s\n" % {'address' : addr})
            try:
                agent = threading.Thread(target=agent)
            except Exception:
                sys.stderr.write("Exploded!\n")
        
        server.close()

    def __init__(self, config):
        """
        Config: {
            host: Some hostname <localhost>
            port: Listening port
            agents: # of agents
        }
        """
        self.config = config