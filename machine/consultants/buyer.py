from consultant import Consultant
from apiclient.discovery import build
from pytube import YouTube

class Buyer(Consultant):

  def download(self, url):
    yt = YouTube(url)
    video = yt.filter('mp4')[-1] # This will get us the highest res version.
    try:
      video.download(self.storageDir)
      return True
    except:
      return False

  def search(self, key, query, maxResults):
    """
    Search youtube and return a list of URLs
    for matched videos.
    """
    urls = []
    yt = build("youtube", "v3", developerKey=key)
    results = yt.search().list(
      q=query, 
      part="id,snippet", 
      maxResults=maxResults
    ).execute()

    for r in results.get("items", []):
      if r["id"]["kind"] == "youtube#video":
        urls.append("https://www.youtube.com/watch?v=%s" % r["id"]["videoId"])

    return urls

  def __init__(self, storageDir):
    self.storageDir = storageDir