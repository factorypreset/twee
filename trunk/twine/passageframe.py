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
        
        self.outLinksMenu = wx.Menu()
        self.outLinksMenuTitle = passageMenu.AppendMenu(wx.ID_ANY, 'Outgoing Links', self.outLinksMenu)
        self.inLinksMenu = wx.Menu()
        self.inLinksMenuTitle = passageMenu.AppendMenu(wx.ID_ANY, 'Incoming Links', self.inLinksMenu)
        self.brokenLinksMenu = wx.Menu()
        self.brokenLinksMenuTitle = passageMenu.AppendMenu(wx.ID_ANY, 'Broken Links', self.brokenLinksMenu)

        passageMenu.Append(PassageFrame.PASSAGE_EDIT_SELECTION, '&Edit Selection\tCtrl-E')
        self.Bind(wx.EVT_MENU, lambda e: self.openOtherEditor(title = self.getSelectionLink()), \
                  id = PassageFrame.PASSAGE_EDIT_SELECTION)

        passageMenu.AppendSeparator()
        
        passageMenu.Append(wx.ID_SAVE, '&Save Story\tCtrl-S')
        self.Bind(wx.EVT_MENU, self.widget.parent.parent.save, id = wx.ID_SAVE)
        
        passageMenu.Append(PassageFrame.PASSAGE_REBUILD_STORY, '&Rebuild Story\tCtrl-R')
        self.Bind(wx.EVT_MENU, self.widget.parent.parent.rebuild, id = PassageFrame.PASSAGE_REBUILD_STORY)

        passageMenu.AppendSeparator()

        passageMenu.Append(PassageFrame.PASSAGE_FULLSCREEN, '&Fullscreen View\tF12')
        self.Bind(wx.EVT_MENU, self.openFullscreen, id = PassageFrame.PASSAGE_FULLSCREEN)

        passageMenu.Append(wx.ID_CLOSE, '&Close Passage\tCtrl-W')
        self.Bind(wx.EVT_MENU, lambda e: self.Destroy(), id = wx.ID_CLOSE)        
        
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
        self.updateSubmenus()
        
        # event bindings
        # we need to do this AFTER setting up initial values
        
        self.titleInput.Bind(wx.EVT_TEXT, self.syncPassage)
        self.tagsInput.Bind(wx.EVT_TEXT, self.syncPassage)
        self.bodyInput.Bind(wx.EVT_TEXT, self.syncPassage)
        self.Bind(wx.EVT_CLOSE, self.closeFullscreen)
        self.Bind(wx.EVT_UPDATE_UI, self.updateUI)
        
        if not re.match('Untitled Passage \d+', self.widget.passage.title):
            self.bodyInput.SetFocus()
            self.bodyInput.SetInsertionPoint(self.bodyInput.GetLastPosition())
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
        self.updateSubmenus()
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
        
    def openOtherEditor (self, event = None, title = None):
        """
        Opens another passage for editing. If it does not exist, then
        it creates it next to this one and then opens it. You may pass
        this a string title OR an event. If you pass an event, it presumes
        it is a wx.CommandEvent, and uses the exact text of the menu as the title.
        """

        # this is a bit retarded
        # we seem to be receiving CommandEvents, not MenuEvents,
        # so we can only see menu item IDs
        # unfortunately all our menu items are dynamically generated
        # so we gotta work our way back to a menu name
        
        if not title: title = self.menus.FindItemById(event.GetId()).GetLabel()
        found = False

        # check if the passage already exists
        
        for widget in self.widget.parent.widgets:
            if widget.passage.title == title:
                found = True
                editingWidget = widget
                break
        
        if not found:
            editingWidget = self.widget.parent.newWidget(title = title, pos = self.widget.pos)
       
        editingWidget.openEditor()
       
    def setBodyText (self, text):
        """Changes the body text field directly."""
        self.bodyInput.SetValue(text)
        self.Show(True)
        
    def getSelectionLink (self):
        """Returns the body input's current selection, minus whitespace and other crud."""
        return self.bodyInput.GetStringSelection().strip(""" "'<>[]""")
        
    def updateUI (self, event):
        """Updates menus."""
        
        # edit selection
        
        editSelected = self.menus.FindItemById(PassageFrame.PASSAGE_EDIT_SELECTION)
        selection = self.getSelectionLink()
        
        if selection != '':
            if len(selection) < 25:
                editSelected.SetItemLabel('Edit "' + selection + '"\tCtrl-E')
            else:
                editSelected.SetItemLabel('Edit Selection\tCtrl-E')
            editSelected.Enable(True)
        else:
            editSelected.SetItemLabel('Edit Selection\tCtrl-E')
            editSelected.Enable(False)

    def updateSubmenus (self):
        """
        Updates our passage menus. This should be called sparingly, i.e. not during
        a UI update event, as it is doing a bunch of removing and adding of items.
        """
                
        # separate outgoing and broken links
        
        outgoing = []
        incoming = []
        broken = []
        
        for link in self.widget.passage.links():
            found = False
            
            for widget in self.widget.parent.widgets:
                if widget.passage.title == link:
                    outgoing.append(link)
                    found = True
                    break
                
            if not found: broken.append(link)

        # incoming links

        for widget in self.widget.parent.widgets:
            if self.widget.passage.title in widget.passage.links():
                incoming.append(widget.passage.title)
                
        # repopulate the menus

        def populate (menu, links):
            for item in menu.GetMenuItems():
                menu.DeleteItem(item)
            
            if len(links):   
                for link in links:
                    item = menu.Append(wx.ID_ANY, link)
                    self.Bind(wx.EVT_MENU, self.openOtherEditor, item)
            else:
                item = menu.Append(wx.ID_ANY, '(None)')
                item.Enable(False)

        outTitle = 'Outgoing Links'
        if len(outgoing) > 0: outTitle += ' (' + str(len(outgoing)) + ')'
        self.outLinksMenuTitle.SetText(outTitle)
        populate(self.outLinksMenu, outgoing)

        inTitle = 'Incoming Links'
        if len(incoming) > 0: inTitle += ' (' + str(len(incoming)) + ')'
        self.inLinksMenuTitle.SetText(inTitle)
        populate(self.inLinksMenu, incoming)
        
        brokenTitle = 'Broken Links'
        if len(broken) > 0: brokenTitle += ' (' + str(len(broken)) + ')'
        self.brokenLinksMenuTitle.SetText(brokenTitle)
        populate(self.brokenLinksMenu, broken)
        
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
    
    PASSAGE_FULLSCREEN = 1001
    PASSAGE_EDIT_SELECTION = 1002
    PASSAGE_REBUILD_STORY = 1003