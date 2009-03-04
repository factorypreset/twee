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

import os, wx

class PassageFrame (wx.Frame):
    
    def __init__ (self, parent, widget, app):
        self.widget = widget
        self.app = app
        wx.Frame.__init__(self, parent, wx.ID_ANY, title = 'Untitled Passage', \
                          size = PassageFrame.DEFAULT_SIZE)
        
        # toolbar
        
        iconPath = self.app.getPath() + os.sep + 'icons' + os.sep
        
        self.toolbar = self.CreateToolBar()
        self.toolbar.SetToolBitmapSize((PassageFrame.TOOLBAR_ICON_SIZE, PassageFrame.TOOLBAR_ICON_SIZE))
        self.toolbar.AddLabelTool(PassageFrame.FULLSCREEN, 'Toggle Fullscreen', \
                                  wx.Bitmap(iconPath + 'fullscreen.png'), \
                                  shortHelp = PassageFrame.FULLSCREEN_TOOLTIP)
        self.toolbar.Realize()
        
        # controls
        
        self.panel = wx.Panel(self)
        
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
        self.bodyInput.SetFont(wx.Font(PassageFrame.BODY_DEFAULT_SIZE, wx.MODERN, \
                                       wx.NORMAL, wx.NORMAL, False, PassageFrame.BODY_DEFAULT_FONT))
        
        # final layout
        
        allSizer = wx.BoxSizer(wx.VERTICAL)
        allSizer.Add(self.topControls, flag = wx.ALL | wx.EXPAND, border = PassageFrame.SPACING * 2)
        allSizer.Add(self.bodyInput, proportion = 1, flag = wx.EXPAND | wx.LEFT | wx.RIGHT | wx.BOTTOM, \
                     border = PassageFrame.SPACING)

        self.panel.SetSizer(allSizer)

        self.syncInputs()
        
        # event bindings
        # we need to do this AFTER setting up initial values
        
        self.titleInput.Bind(wx.EVT_TEXT, self.syncPassage)
        self.tagsInput.Bind(wx.EVT_TEXT, self.syncPassage)
        self.bodyInput.Bind(wx.EVT_TEXT, self.syncPassage)
        
        self.bodyInput.SetFocus()
        self.Show(True)

    def syncInputs (self):
        """Updates the inputs based on the passage's state."""

        print '1, ', self.widget.passage.text
        self.titleInput.SetValue(self.widget.passage.title)
        print '2, ', self.widget.passage.text
        self.bodyInput.SetValue(self.widget.passage.text)
        print '3, ', self.widget.passage.text
    
        tags = ''
        
        for tag in self.widget.passage.tags:
            tags += tag + ' '
            
        self.tagsInput.SetValue(tags)
    
    def syncPassage (self, event = None):
        """Updates the passage based on the inputs; asks our matching widget to repaint."""
        self.widget.passage.title = self.titleInput.GetValue()
        self.widget.passage.text = self.bodyInput.GetValue()
        self.widget.passage.tags = list(self.tagsInput.GetValue().split(' '))
        
        self.SetTitle(self.widget.passage.title)
        self.widget.Refresh()
    
    # control constants
    
    SPACING = 6
    TOOLBAR_ICON_SIZE = 22
    DEFAULT_SIZE = (550, 600)
    TITLE_LABEL = 'Title'
    TAGS_LABEL = 'Tags (separate with spaces)'
    
    # appearance constants
    
    BODY_DEFAULT_SIZE = 11
    BODY_DEFAULT_FONT = 'Consolas'
    FS_DEFAULT_FG = (179, 205, 255)
    FS_DEFAULT_BG = (16, 0, 136)
    
    # menu constants
    
    FULLSCREEN = 1001
    
    # tooltip constants
    
    FULLSCREEN_TOOLTIP = 'Toggle fullscreen view'