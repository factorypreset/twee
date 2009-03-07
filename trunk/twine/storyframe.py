#!/usr/bin/env python

# 
# StoryFrame
# A StoryFrame displays an entire story. Its main feature is an
# instance of a StoryPanel, but it also has a menu bar and toolbar.
#

import wx, os, math, urllib, pickle
from tiddlywiki import TiddlyWiki
from storypanel import StoryPanel

class StoryFrame (wx.Frame):
    
    def __init__(self, parent, app, pos = None, state = None):
        wx.Frame.__init__(self, parent, wx.ID_ANY, title = StoryFrame.DEFAULT_TITLE, \
                          size = StoryFrame.DEFAULT_SIZE, pos = pos)     
        self.app = app
        self.parent = parent

        # inner state
        
        if (state):
            self.buildDestination = state['buildDestination']
            self.saveDestination = state['saveDestination']
            self.target = state['target']
            self.storyPanel = StoryPanel(self, app, state = state['storyPanel'])
        else:
            self.buildDestination = ''
            self.saveDestination = ''
            self.target = 'sugarcane'
            self.storyPanel = StoryPanel(self, app)
                
        # File menu
        
        fileMenu = wx.Menu()
        
        fileMenu.Append(wx.ID_NEW, '&New Story\tCtrl-Shift-N')
        self.Bind(wx.EVT_MENU, self.newFrame, id = wx.ID_NEW)
        
        fileMenu.Append(wx.ID_OPEN, '&Open Story...\tCtrl-O')
        self.Bind(wx.EVT_MENU, self.open, id = wx.ID_OPEN)
        
        fileMenu.AppendSeparator()
        
        fileMenu.Append(wx.ID_SAVE, '&Save Story\tCtrl-S')
        self.Bind(wx.EVT_MENU, self.save, id = wx.ID_SAVE)
        
        fileMenu.Append(wx.ID_SAVEAS, 'S&ave Story As...\tCtrl-Shift-S')
        self.Bind(wx.EVT_MENU, self.saveAs, id = wx.ID_SAVEAS)

        fileMenu.Append(wx.ID_REVERT_TO_SAVED, '&Revert to Saved')
        fileMenu.AppendSeparator()
        
        fileMenu.Append(wx.ID_CLOSE, '&Close\tCtrl-W')
        self.Bind(wx.EVT_MENU, lambda e: self.Destroy(), id = wx.ID_CLOSE)
        
        # Edit menu
        
        editMenu = wx.Menu()
        editMenu.Append(wx.ID_UNDO, '&Undo\tCtrl-Z')
        editMenu.AppendSeparator()
        editMenu.Append(wx.ID_CUT, 'Cu&t\tCtrl-X')
        editMenu.Append(wx.ID_COPY, '&Copy\tCtrl-C')
        editMenu.Append(wx.ID_PASTE, '&Paste\tCtrl-V')
        
        editMenu.Append(wx.ID_DELETE, '&Delete')
        self.Bind(wx.EVT_MENU, lambda e: self.storyPanel.eachSelectedPassage(lambda i: i.delete()), id = wx.ID_DELETE)

        editMenu.Append(wx.ID_SELECTALL, 'Select &All\tCtrl-A')
        self.Bind(wx.EVT_MENU, lambda e: self.storyPanel.eachPassage(lambda i: i.setSelected(True, exclusive = False)), id = wx.ID_SELECTALL)
        
        editMenu.AppendSeparator()
        editMenu.Append(wx.ID_PREFERENCES, 'Preferences...')
        
        # View menu
 
        viewMenu = wx.Menu()
        
        viewMenu.Append(wx.ID_ZOOM_IN, 'Zoom &In\t=')
        self.Bind(wx.EVT_MENU, lambda e: self.storyPanel.zoom('in'), id = wx.ID_ZOOM_IN)
        
        viewMenu.Append(wx.ID_ZOOM_OUT, 'Zoom &Out\t-')
        self.Bind(wx.EVT_MENU, lambda e: self.storyPanel.zoom('out'), id = wx.ID_ZOOM_OUT)
        
        viewMenu.Append(wx.ID_ZOOM_FIT, 'Zoom to &Fit\t0')
        self.Bind(wx.EVT_MENU, lambda e: self.storyPanel.zoom('fit'), id = wx.ID_ZOOM_FIT)

        viewMenu.Append(wx.ID_ZOOM_100, 'Zoom &100%\t1')
        self.Bind(wx.EVT_MENU, lambda e: self.storyPanel.zoom(1), id = wx.ID_ZOOM_100)
        
        viewMenu.AppendSeparator()
        viewMenu.Append(StoryFrame.VIEW_SNAP, 'Snap to &Grid')
        viewMenu.Append(StoryFrame.VIEW_CLEANUP, '&Clean Up Passages')
        viewMenu.AppendSeparator()
        
        viewMenu.Append(StoryFrame.VIEW_TOOLBAR, '&Toolbar', kind = wx.ITEM_CHECK)
        self.Bind(wx.EVT_MENU, self.toggleToolbar, id = StoryFrame.VIEW_TOOLBAR)

        # Story menu

        storyMenu = wx.Menu()
        
        storyMenu.Append(StoryFrame.STORY_NEW_PASSAGE, '&New Passage\tCtrl-N')
        self.Bind(wx.EVT_MENU, self.storyPanel.newPassage, id = StoryFrame.STORY_NEW_PASSAGE)
        
        storyMenu.Append(wx.ID_EDIT, '&Edit Passage\tCtrl-E')
        self.Bind(wx.EVT_MENU, lambda e: self.storyPanel.eachSelectedPassage(lambda i: i.openEditor(e)), id = wx.ID_EDIT)
        
        storyMenu.Append(wx.ID_DELETE, '&Delete Passage')
        self.Bind(wx.EVT_MENU, lambda e: self.storyPanel.eachSelectedPassage(lambda i: i.delete()), id = wx.ID_DELETE)
 
        storyMenu.AppendSeparator()
        
        storyMenu.Append(StoryFrame.STORY_BUILD, '&Build Story...\tCtrl-B')
        self.Bind(wx.EVT_MENU, self.build, id = StoryFrame.STORY_BUILD)        
        
        storyMenu.Append(StoryFrame.STORY_REBUILD, '&Rebuild Story\tCtrl-R')
        self.Bind(wx.EVT_MENU, self.rebuild, id = StoryFrame.STORY_REBUILD) 
        
        storyMenu.Append(StoryFrame.STORY_PROOF, '&Proof Story...')
        self.Bind(wx.EVT_MENU, self.proof, id = StoryFrame.STORY_PROOF) 


        # Story Format submenu
        
        storyFormatMenu = wx.Menu()
        
        storyFormatMenu.Append(StoryFrame.STORY_FORMAT_SUGARCANE, '&Sugarcane', kind = wx.ITEM_CHECK)
        self.Bind(wx.EVT_MENU, lambda e: self.setTarget('sugarcane'), id = StoryFrame.STORY_FORMAT_SUGARCANE) 
        
        storyFormatMenu.Append(StoryFrame.STORY_FORMAT_JONAH, '&Jonah', kind = wx.ITEM_CHECK)
        self.Bind(wx.EVT_MENU, lambda e: self.setTarget('jonah'), id = StoryFrame.STORY_FORMAT_JONAH) 
        
        storyFormatMenu.Append(StoryFrame.STORY_FORMAT_TW2, 'TiddlyWiki &2', kind = wx.ITEM_CHECK)
        self.Bind(wx.EVT_MENU, lambda e: self.setTarget('tw2'), id = StoryFrame.STORY_FORMAT_TW2) 
        
        storyFormatMenu.Append(StoryFrame.STORY_FORMAT_TW1, 'TiddlyWiki &1', kind = wx.ITEM_CHECK)
        self.Bind(wx.EVT_MENU, lambda e: self.setTarget('tw'), id = StoryFrame.STORY_FORMAT_TW1) 
        
        storyFormatMenu.AppendSeparator()
        storyFormatMenu.Append(StoryFrame.STORY_FORMAT_HELP, '&About Story Formats')        
        
        storyMenu.AppendMenu(wx.ID_ANY, 'Story &Format', storyFormatMenu)
        
        # add menus
        
        self.menus = wx.MenuBar()
        self.menus.Append(fileMenu, '&File')
        self.menus.Append(editMenu, '&Edit')
        self.menus.Append(viewMenu, '&View')
        self.menus.Append(storyMenu, '&Story')
        self.SetMenuBar(self.menus)

        # add toolbar

        iconPath = self.app.getPath() + os.sep + 'icons' + os.sep
        
        self.toolbar = self.CreateToolBar()
        self.toolbar.SetToolBitmapSize((StoryFrame.TOOLBAR_ICON_SIZE, StoryFrame.TOOLBAR_ICON_SIZE))
        
        self.toolbar.AddLabelTool(StoryFrame.STORY_NEW_PASSAGE, 'New Passage', \
                                  wx.Bitmap(iconPath + 'newpassage.png'), \
                                  shortHelp = StoryFrame.NEW_PASSAGE_TOOLTIP)
        self.Bind(wx.EVT_TOOL, lambda e: self.storyPanel.newPassage(), id = StoryFrame.STORY_NEW_PASSAGE)
        
        self.toolbar.AddSeparator()
        
        self.toolbar.AddLabelTool(wx.ID_ZOOM_IN, 'Zoom In', \
                                  wx.Bitmap(iconPath + 'zoomin.png'), \
                                  shortHelp = StoryFrame.ZOOM_IN_TOOLTIP)
        self.Bind(wx.EVT_TOOL, lambda e: self.storyPanel.zoom('in'), id = wx.ID_ZOOM_IN)
        
        self.toolbar.AddLabelTool(wx.ID_ZOOM_OUT, 'Zoom Out', \
                                  wx.Bitmap(iconPath + 'zoomout.png'), \
                                  shortHelp = StoryFrame.ZOOM_OUT_TOOLTIP)
        self.Bind(wx.EVT_TOOL, lambda e: self.storyPanel.zoom('out'), id = wx.ID_ZOOM_OUT)  
          
        self.toolbar.AddLabelTool(wx.ID_ZOOM_FIT, 'Zoom to Fit', \
                                  wx.Bitmap(iconPath + 'zoomfit.png'), \
                                  shortHelp = StoryFrame.ZOOM_FIT_TOOLTIP)
        self.Bind(wx.EVT_TOOL, lambda e: self.storyPanel.zoom('fit'), id = wx.ID_ZOOM_FIT)
        
        self.toolbar.AddLabelTool(wx.ID_ZOOM_100, 'Zoom to 100%', \
                                  wx.Bitmap(iconPath + 'zoom1.png'), \
                                  shortHelp = StoryFrame.ZOOM_ONE_TOOLTIP)
        self.Bind(wx.EVT_TOOL, lambda e: self.storyPanel.zoom(1.0), id = wx.ID_ZOOM_100)

        self.showToolbar = True
        self.toolbar.Realize()
        self.updateUI()
        self.Show(True)
        
    def newFrame (self, event = None):
        """Opens a new StoryFrame a bit below and to to the right of this one."""
        pos = self.GetPosition()
        pos.x += 25
        pos.y += 25
        StoryFrame(None, app = self.app, pos = (pos.x, pos.y))
    
    def open (self, event = None):
        """Opens a story file of the user's choice."""
        dialog = wx.FileDialog(self, 'Open Story', os.getcwd(), "", \
                               "Tweepad Story (*.tws)|*.tws", \
                               wx.OPEN | wx.FD_CHANGE_DIR)
                                                          
        if dialog.ShowModal() == wx.ID_OK:
            openedFile = open(dialog.GetPath(), 'r')
            StoryFrame(None, app = self.app, state = pickle.load(openedFile))
            openedFile.close()
                        
        dialog.Destroy()
    
    def saveAs (self, event = None):
        """Asks the user to choose a file to save state to, then passes off control to save()."""
        dialog = wx.FileDialog(self, 'Save Story As', os.getcwd(), "", \
                         "Tweepad Story (*.tws)|*.tws", \
                           wx.SAVE | wx.FD_OVERWRITE_PROMPT | wx.FD_CHANGE_DIR)
    
        if dialog.ShowModal() == wx.ID_OK:
            self.saveDestination = dialog.GetPath()
            self.save(None)
        
        dialog.Destroy()
        self.updateUI()
        
    def save (self, event = None):
        if (self.saveDestination == ''):
            self.saveAs()
            return
        
        dest = open(self.saveDestination, 'w')
        pickle.dump(self.serialize(), dest)
        dest.close()
        self.updateUI()

    def build (self, event):
        """Asks the user to choose a location to save a compiled story, then passed control to rebuild()."""
        dialog = wx.FileDialog(self, 'Build Story', os.getcwd(), "", \
                         "Web Page (*.html)|*.html", \
                           wx.SAVE | wx.FD_OVERWRITE_PROMPT | wx.FD_CHANGE_DIR)
    
        if dialog.ShowModal() == wx.ID_OK:
            self.buildDestination = dialog.GetPath()
            self.rebuild(None, True)
        
        dialog.Destroy()
                
    def rebuild (self, event, displayAfter = False):
        """Builds an HTML version of the story. Pass whether to open the destination file \
           afterwards."""

        # open destination for writing
        
        dest = open(self.buildDestination, 'w')

        # assemble our tiddlywiki and write it out
        
        tw = TiddlyWiki()
        
        for widget in self.storyPanel.passages:
            tw.addTiddler(widget.passage)
        
        dest.write(tw.toHtml(self.app, self.target))
        dest.close()

        # open browser if requested
        
        if displayAfter:
            path = 'file://' + urllib.pathname2url(self.buildDestination)
            path = path.replace('file://///', 'file:///')
            wx.LaunchDefaultBrowser(path)    

    def proof (self, event = None):
        """Builds an RTF version of the story. Pass whether to open the destination file \
           afterwards."""
           
        # ask for our destination
        
        dialog = wx.FileDialog(self, 'Proof Story', os.getcwd(), "", \
                         "RTF Document (*.rtf)|*.rtf", \
                           wx.SAVE | wx.FD_OVERWRITE_PROMPT | wx.FD_CHANGE_DIR)
        
        if dialog.ShowModal() == wx.ID_OK:
            path = dialog.GetPath()
            dialog.Destroy()
        else:
            dialog.Destroy()
            return
        
        # open destination for writing
        
        dest = open(path, 'w')
        
        # assemble our tiddlywiki and write it out
        
        tw = TiddlyWiki()
        
        for widget in self.storyPanel.passages:
            tw.addTiddler(widget.passage)
        
        dest.write(tw.toRtf())
        dest.close()
        
    def setTarget (self, target):
        self.target = target
        self.updateUI()
        
    def updateUI (self):
        """Adjusts menu items to reflect the current state."""
        
        # window title
        
        if self.saveDestination == '':
            title = StoryFrame.DEFAULT_TITLE
        else:
            bits = os.path.splitext(self.saveDestination)
            title = os.path.basename(bits[0])
        
        percent = str(int(round(self.storyPanel.scale * 100)))

        self.SetTitle(title + ' (' + percent + '%) - ' + self.app.NAME)
        
        # File menu
        
        revertItem = self.menus.FindItemById(wx.ID_REVERT_TO_SAVED)
        revertItem.Enable(self.saveDestination != '')
        
        # View menu
        
        toolbarItem = self.menus.FindItemById(StoryFrame.VIEW_TOOLBAR)
        toolbarItem.Check(self.showToolbar)
        
        # Story menu
        
        rebuildItem = self.menus.FindItemById(StoryFrame.STORY_REBUILD)
        rebuildItem.Enable(self.buildDestination != '')
        
        # Story format submenu
        
        formatItems = {}
        formatItems['sugarcane'] = self.menus.FindItemById(StoryFrame.STORY_FORMAT_SUGARCANE)
        formatItems['jonah'] = self.menus.FindItemById(StoryFrame.STORY_FORMAT_JONAH)
        formatItems['tw'] = self.menus.FindItemById(StoryFrame.STORY_FORMAT_TW1)
        formatItems['tw2'] = self.menus.FindItemById(StoryFrame.STORY_FORMAT_TW2)
        
        for key in formatItems:
            formatItems[key].Check(self.target == key)
        
    def toggleToolbar (self, event):
        """Toggles the toolbar onscreen."""
        if (self.showToolbar):
            self.showToolbar = False
            self.toolbar.Hide()
        else:
            self.showToolbar = True
            self.toolbar.Show()
            
        self.updateUI()
        
    def serialize (self):
        """Returns a dictionary of state suitable for pickling."""
        return { 'target': self.target, 'buildDestination': self.buildDestination, \
                 'saveDestination': self.saveDestination, \
                 'storyPanel': self.storyPanel.serialize() }
    
    # menu constants
    # (that aren't already defined by wx)
    
    FILE_PAGE_SETUP = 106       # release 3 :)
    FILE_PRINT = 107            # release 3
    FILE_IMPORT_SOURCE = 108    # release 2
    FILE_EXPORT_SOURCE = 109    # release 2
        
    VIEW_SNAP = 305
    VIEW_CLEANUP = 306
    VIEW_TOOLBAR = 307
    
    STORY_NEW_PASSAGE = 401
    STORY_BUILD = 404
    STORY_REBUILD = 405
    STORY_PROOF = 406
    
    STORY_FORMAT_SUGARCANE = 407
    STORY_FORMAT_JONAH = 408
    STORY_FORMAT_TW1 = 409
    STORY_FORMAT_TW2 = 410
    STORY_FORMAT_HELP = 411

    # tooltip labels
    
    NEW_PASSAGE_TOOLTIP = 'Add a new passage to your story'
    ZOOM_IN_TOOLTIP = 'Zoom in'
    ZOOM_OUT_TOOLTIP = 'Zoom out'
    ZOOM_FIT_TOOLTIP = 'Zoom so all passages are visible onscreen'
    ZOOM_ONE_TOOLTIP = 'Zoom to 100%'

    # size constants
    
    DEFAULT_SIZE = (800, 600)
    TOOLBAR_ICON_SIZE = 22
    
    # misc stuff
    
    DEFAULT_TITLE = 'Untitled Story'