import ConfigParser

from twilio.rest import TwilioRestClient

def Twilio(object):

    def send(self, body):
        client = TwilioRestClient(
                    self.config.get('twilio', 'sid'), 
                    self.config.get('twilio', 'auth')
                )
        
        message = client.messages.create(
                    body=body,
                    to=self.config.get('twilio', 'to'),   
                    from_=self.config.get('twilio', 'phone')
                )

    def __init__(self, configPath):
        self.config = ConfigParser.ConfigParser()
        self.config.read(configPath)