#!/usr/bin/env python

#
# App
# This bootstraps our application and keeps track of preferences, etc.
#

import sys, os, wx, re
from storyframe import StoryFrame

class App:

    def __init__ (self):
        """Initializes the application."""
        self.wxApp = wx.PySimpleApp()
        self.frame = StoryFrame(None, app = self)
        self.wxApp.MainLoop()

    def getPath (self):
        """Returns the path to the executing script or application."""
        scriptPath = os.path.realpath(sys.path[0])
        
        # OS X py2app'd apps will direct us right into the app bundle
        
        scriptPath = re.sub('[^/]+.app/Contents/Resources', '', scriptPath)
        
        # Windows py2exe'd apps add an extraneous library.zip at the end
        
        scriptPath = scriptPath.replace('\\library.zip', '')
        return scriptPath

# start things up if we were called directly

if __name__ == "__main__":
    App()