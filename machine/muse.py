import ConfigParser
import feedparser
import os

from apiclient.discovery import build
from pytube import YouTube

class Muse(object):

  def getQueries(self, urls):
    queries = []

    for u in urls:
      feed = feedparser.parse(u)

      for entry in feed['entries']:
        queries.append(entry['title'])
        
    return queries


  def download(self, url):
    storage = self.config.get('youtube', 'storage')
    yt = YouTube(url)
    video = yt.filter('mp4')[-1] # This will get us the highest res version.
    lockFile = '%s/%s.mp4.lck' % (storage, video.filename)

    try:
      open(lockFile, 'a').close()
      video.download(storage)
      os.remove(lockFile)
      return True
    except:
      return False

  def search(self, query, maxResults):
    """
    Search youtube and return a list of URLs
    for matched videos.
    """
    urls = []
    yt = build("youtube", "v3", developerKey=self.config.get('youtube', 'key'))
    results = yt.search().list(
      q=query, 
      part="id,snippet", 
      maxResults=maxResults
    ).execute()

    for r in results.get("items", []):
      if r["id"]["kind"] == "youtube#video":
        urls.append("https://www.youtube.com/watch?v=%s" % r["id"]["videoId"])

    return urls

  def __init__(self, configPath):
    self.config = ConfigParser.ConfigParser()
    self.config.read(configPath)