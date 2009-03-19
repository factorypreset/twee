#!/usr/bin/env python

#
# PassageFrame
# A PassageFrame is a window that allows the user to change the contents
# of a passage. This must be paired with a PassageWidget; it gets to the
# underlying passage via it, and also notifies it of changes made here.
#
# This doesn't require the user to save his changes -- as he makes changes,
# they are automatically updated everywhere.
#

import os, wx, re
from fseditframe import FullscreenEditFrame

class PassageFrame (wx.Frame):
    
    def __init__ (self, parent, widget, app):
        self.widget = widget
        self.app = app
        wx.Frame.__init__(self, parent, wx.ID_ANY, title = 'Untitled Passage - ' + self.app.NAME, \
                          size = PassageFrame.DEFAULT_SIZE)
        
        # Passage menu
        
        passageMenu = wx.Menu()
        
        passageMenu.Append(wx.ID_CLOSE, '&Close\tCtrl-W')
        self.Bind(wx.EVT_MENU, lambda e: self.Destroy(), id = wx.ID_CLOSE)        
        
        passageMenu.Append(PassageFrame.PASSAGE_FULLSCREEN, 'Edit &Fullscreen\tF12')
        self.Bind(wx.EVT_MENU, self.openFullscreen, id = PassageFrame.PASSAGE_FULLSCREEN)
        
        passageMenu.AppendSeparator()
        passageMenu.Append(wx.ID_SAVE, '&Save Story\tCtrl-S')
        self.Bind(wx.EVT_MENU, self.widget.parent.parent.save, id = wx.ID_SAVE)
        
        passageMenu.Append(PassageFrame.PASSAGE_REBUILD_STORY, '&Rebuild Story\tCtrl-R')
        self.Bind(wx.EVT_MENU, self.widget.parent.parent.rebuild, id = PassageFrame.PASSAGE_REBUILD_STORY)
        
        # Edit menu
        
        editMenu = wx.Menu()
        editMenu.Append(wx.ID_UNDO, '&Undo\tCtrl-Z')
        editMenu.AppendSeparator()
        editMenu.Append(wx.ID_CUT, 'Cu&t\tCtrl-X')
        editMenu.Append(wx.ID_COPY, '&Copy\tCtrl-C')
        editMenu.Append(wx.ID_PASTE, '&Paste\tCtrl-V')
        editMenu.Append(wx.ID_SELECTALL, 'Select &All\tCtrl-A')

        # menus
        
        self.menus = wx.MenuBar()
        self.menus.Append(passageMenu, '&Passage')
        self.menus.Append(editMenu, '&Edit')
        self.SetMenuBar(self.menus)

        # controls
        
        self.panel = wx.Panel(self)
        allSizer = wx.BoxSizer(wx.VERTICAL)
        self.panel.SetSizer(allSizer)
        
        # title/tag controls
        
        self.topControls = wx.Panel(self.panel)
        topSizer = wx.FlexGridSizer(3, 2, PassageFrame.SPACING, PassageFrame.SPACING)
        
        titleLabel = wx.StaticText(self.topControls, style = wx.ALIGN_RIGHT, label = PassageFrame.TITLE_LABEL)
        self.titleInput = wx.TextCtrl(self.topControls)
        tagsLabel = wx.StaticText(self.topControls, style = wx.ALIGN_RIGHT, label = PassageFrame.TAGS_LABEL)
        self.tagsInput = wx.TextCtrl(self.topControls)
        topSizer.Add(titleLabel)
        topSizer.Add(self.titleInput, 1, flag = wx.EXPAND | wx.ALL)
        topSizer.Add(tagsLabel)
        topSizer.Add(self.tagsInput, 1, flag = wx.EXPAND | wx.ALL)
        topSizer.AddGrowableCol(1, 1)
        self.topControls.SetSizer(topSizer)
        
        # body text
        
        self.bodyInput = wx.TextCtrl(self.panel, style = wx.TE_MULTILINE | wx.TE_PROCESS_TAB)
        
        # final layout
        
        allSizer.Add(self.topControls, flag = wx.ALL | wx.EXPAND, border = PassageFrame.SPACING)
        allSizer.Add(self.bodyInput, proportion = 1, flag = wx.EXPAND | wx.LEFT | wx.RIGHT | wx.BOTTOM, \
                     border = PassageFrame.SPACING)
        self.applyPrefs()
        self.syncInputs()
        
        # event bindings
        # we need to do this AFTER setting up initial values
        
        self.titleInput.Bind(wx.EVT_TEXT, self.syncPassage)
        self.tagsInput.Bind(wx.EVT_TEXT, self.syncPassage)
        self.bodyInput.Bind(wx.EVT_TEXT, self.syncPassage)
        self.Bind(wx.EVT_CLOSE, self.closeFullscreen)
        
        if not re.match('Untitled Passage \d+', self.widget.passage.title):
            self.bodyInput.SetFocus()
        self.Show(True)

    def syncInputs (self):
        """Updates the inputs based on the passage's state."""
        self.titleInput.SetValue(self.widget.passage.title)
        self.bodyInput.SetValue(self.widget.passage.text)
    
        tags = ''
        
        for tag in self.widget.passage.tags:
            tags += tag + ' '
            
        self.tagsInput.SetValue(tags)
        self.SetTitle(self.widget.passage.title + ' - ' + self.app.NAME)
    
    def syncPassage (self, event = None):
        """Updates the passage based on the inputs; asks our matching widget to repaint."""
        self.widget.passage.title = self.titleInput.GetValue()
        self.widget.passage.text = self.bodyInput.GetValue()
        self.widget.passage.tags = []
        
        for tag in self.tagsInput.GetValue().split(' '):
            if tag != '': self.widget.passage.tags.append(tag)
        
        self.SetTitle(self.widget.passage.title + ' - ' + self.app.NAME)
        self.widget.Refresh()
        self.widget.parent.Refresh()
        self.widget.parent.parent.setDirty(True)
    
    def openFullscreen (self, event = None):
        """Opens a FullscreenEditFrame for this passage's body text."""
        self.Hide()
        self.fullscreen = FullscreenEditFrame(None, self.app, \
                                              title = self.widget.passage.title + ' - ' + self.app.NAME, \
                                              initialText = self.widget.passage.text, \
                                              callback = self.setBodyText, frame = self)
    
    def closeFullscreen (self, event = None):
        """Closes this editor's fullscreen counterpart, if any."""
        try: self.fullscreen.Destroy()
        except: pass
        event.Skip()
       
    def setBodyText (self, text):
        """Changes the body text field directly."""
        self.bodyInput.SetValue(text)
        self.Show(True)
        
    def applyPrefs (self):
        """Applies user prefs to this frame."""
        bodyFont = wx.Font(self.app.config.ReadInt('windowedFontSize'), wx.MODERN, wx.NORMAL, \
                           wx.NORMAL, False, self.app.config.Read('windowedFontFace'))
        self.bodyInput.SetFont(bodyFont)        
        
    # control constants
    
    DEFAULT_SIZE = (550, 600)
    SPACING = 6
    TITLE_LABEL = 'Title'
    TAGS_LABEL = 'Tags (separate with spaces)'
        
    # menu constants (not defined by wx)
    
    PASSAGE_FULLSCREEN = 1002
    PASSAGE_REBUILD_STORY = 1005