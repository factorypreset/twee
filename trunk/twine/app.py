#!/usr/bin/env python

#
# App
# This bootstraps our application and keeps track of preferences, etc.
#

import sys, os, locale, wx, re
from storyframe import StoryFrame

class App:

    def __init__ (self):
        """Initializes the application."""
        locale.setlocale(locale.LC_ALL, '')
        self.wxApp = wx.PySimpleApp()
        self.config = wx.Config('Twine')
        self.recentFiles = wx.FileHistory(5)
        self.recentFiles.Load(self.config)
        self.frame = StoryFrame(None, app = self)
        self.wxApp.MainLoop()
        
    def about (self, event = None):
        info = wx.AboutDialogInfo()
        info.SetName('Twine')
        info.SetVersion('beta 1')
        info.SetDescription('\nA tool for creating interactive stories\nwritten by Chris Klimas\n\nhttp://gimcrackd.com/etc/src/')
        info.SetCopyright('The Twee compiler and associated JavaScript files in this application are released under the GNU Public License.\n\nThe files in the targets directory are derivative works of Jeremy Ruston\'s TiddlyWiki project and are used under the terms of its license.')
        wx.AboutBox(info)
        
    def openDocs (self, event = None):
        wx.LaunchDefaultBrowser('http://gimcrackd.com/etc/doc/')
        
    def openGroup (self, event = None):
        wx.LaunchDefaultBrowser('http://groups.google.com/group/tweecode/')
        
    def reportBug (self, event = None):
        wx.LaunchDefaultBrowser('http://code.google.com/p/twee/issues/entry')

    def getPath (self):
        """Returns the path to the executing script or application."""
        scriptPath = os.path.realpath(sys.path[0])
        
        # OS X py2app'd apps will direct us right into the app bundle
        
        scriptPath = re.sub('[^/]+.app/Contents/Resources', '', scriptPath)
        
        # Windows py2exe'd apps add an extraneous library.zip at the end
        
        scriptPath = scriptPath.replace('\\library.zip', '')
        return scriptPath
    
    NAME = 'Twine'

# start things up if we were called directly

if __name__ == "__main__":
    App()