#!/usr/bin/env python

#
# App
# This bootstraps our application and keeps track of preferences, etc.
#

import sys, os, locale, wx, re
from storyframe import StoryFrame
from prefframe import PreferenceFrame

class App:

    def __init__ (self):
        """Initializes the application."""
        locale.setlocale(locale.LC_ALL, '')
        self.wxApp = wx.PySimpleApp()
        self.config = wx.Config('Twine')
        self.recentFiles = wx.FileHistory(App.RECENT_FILES)
        self.recentFiles.Load(self.config)
        self.stories = []
        self.newStory()
        self.wxApp.MainLoop()
        
    def newStory (self, event = None):
        self.stories.append(StoryFrame(parent = None, app = self))
        
    def openDialog (self, event = None):
        """Opens a story file of the user's choice."""
        opened = False
        dialog = wx.FileDialog(self, 'Open Story', os.getcwd(), "", "Tweepad Story (*.tws)|*.tws", \
                               wx.OPEN | wx.FD_CHANGE_DIR)                                        
        if dialog.ShowModal() == wx.ID_OK:
            opened = True
            self.open(dialog.GetPath())
                    
        dialog.Destroy()

    def openRecent (self, index):
        """Opens a recently-opened file."""
        self.open(self.recentFiles.GetHistoryFile(index))
    
    def open (self, path):
        """Opens a specific story file."""
        openedFile = open(path, 'r')
        self.stories.append(StoryFrame(None, app = self, state = pickle.load(openedFile)))
        self.app.recentFiles.AddFileToHistory(path)
        self.app.recentFiles.Save(self.config)
        openedFile.close()
        
    def exit (self, event = None):
        """Closes all open stories, implicitly quitting."""
        map(lambda s: s.Close(), self.stories)
        
    def showPrefs (self, event = None):
        """Shows the preferences dialog."""
        if (not hasattr(self, 'prefFrame')):
            self.prefFrame = PreferenceFrame(self)
        else:
            try:
                self.prefFrame.Raise()
            except wx._core.PyDeadObjectError:
                # user closed the frame, so we need to recreate it
                delattr(self, 'prefFrame')
                self.showPrefs(event)           
        
    def about (self, event = None):
        """Shows the about dialog."""
        info = wx.AboutDialogInfo()
        info.SetName('Twine')
        info.SetVersion('beta 1')
        info.SetDescription('\nA tool for creating interactive stories\nwritten by Chris Klimas\n\nhttp://gimcrackd.com/etc/src/')
        info.SetCopyright('The Twee compiler and associated JavaScript files in this application are released under the GNU Public License.\n\nThe files in the targets directory are derivative works of Jeremy Ruston\'s TiddlyWiki project and are used under the terms of its license.')
        wx.AboutBox(info)
    
    def storyFormatHelp (self, event = None):
        """Opens the online manual to the section on story formats."""
        wx.LaunchDefaultBrowser('http://gimcrackd.com/etc/doc/#simple,storyformats')
    
    def openDocs (self, event = None):
        """Opens the online manual."""
        wx.LaunchDefaultBrowser('http://gimcrackd.com/etc/doc/')
        
    def openGroup (self, event = None):
        """Opens the Google group."""
        wx.LaunchDefaultBrowser('http://groups.google.com/group/tweecode/')
        
    def reportBug (self, event = None):
        """Opens the online bug report form."""
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
    RECENT_FILES = 5

# start things up if we were called directly

if __name__ == "__main__":
    App()