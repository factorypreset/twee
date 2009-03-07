#!/usr/bin/env python

#
# StoryPanel
# A StoryPanel is a container for PassageWidgets. It translates
# between logical coordinates and pixel coordinates as the user
# zooms in and out, and communicates those changes to its widgets.
#
# A discussion on coordinate systems: logical coordinates are notional,
# and do not change as the user zooms in and out. Pixel coordinates
# are extremely literal: (0, 0) is the top-left corner visible to the
# user, no matter where the scrollbar position is.
#
# This class (and PassageWidget) deal strictly in logical coordinates, but
# incoming events are in pixel coordinates. We convert these to logical
# coordinates as soon as possible.
#

import wx, re
from passagewidget import PassageWidget

class StoryPanel (wx.ScrolledWindow):

    def __init__ (self, parent, app, id = wx.ID_ANY, state = None):
        wx.ScrolledWindow.__init__(self, parent, id)
        self.app = app
        self.parent = parent
        
        # inner state
        
        self.passages = []
        
        if (state):
            self.scale = state['scale']
            for passage in state['passages']:
                self.passages.append(PassageWidget(self, self.app, state = passage))
        else:
            self.scale = 1
            self.newPassage(title = StoryPanel.FIRST_TITLE, text = StoryPanel.FIRST_TEXT)

        # events

        self.Bind(wx.EVT_ERASE_BACKGROUND, lambda e: e)
        self.Bind(wx.EVT_PAINT, self.paint)
        self.Bind(wx.EVT_SIZE, self.resize)
        self.Bind(wx.EVT_LEFT_UP, lambda i: self.eachPassage(lambda j: j.setSelected(False)))
        self.Bind(wx.EVT_RIGHT_UP, lambda e: self.PopupMenu(StoryPanelContext(self, e.GetPosition()), e.GetPosition()))

    def newPassage (self, title = None, text = '', pos = (10, 10)):
        """Adds a new PassageWidget to the container."""
        
        # calculate position
        
        pos = self.toLogical(pos)
        
        # defaults
        
        if (not title): title = self.untitledName()
        
        self.passages.append(PassageWidget(self, self.app, title = title, text = text, pos = pos))
        self.resize()

    def removePassage (self, passage):
        """
        Removes a passage from the container. This does not actually delete it from onscreen --
        see PassageWidget.delete() for that.
        """
        self.passages.remove(passage)
        
    def untitledName (self):
        """Returns a string for an untitled PassageWidget."""
        number = 1
        
        for widget in self.passages:
            match = re.match(r'Untitled Passage (\d+)', widget.passage.title)
            if match: number = int(match.group(1)) + 1
                
        return 'Untitled Passage ' + str(number)
    
    def eachPassage (self, function):
        """Runs a function on every passage in the panel."""
        for passage in self.passages:
            function(passage)

    def eachSelectedPassage (self, function):
        """Runs a function on every selected passage in the panel."""
        for passage in self.passages:
            if passage.selected: function(passage)
            
    def findPassage (self, title):
        """Returns a PassageWidget with the title passed. If none exists, it returns None."""
        for passage in self.passages:
            if passage.passage.title == title: return passage
        return None

    def toPixels (self, logicals, scaleOnly = False):
        """
        Converts a tuple of logical coordinates to pixel coordinates. If you need to do just
        a straight conversion from logicals to pixels without worrying about where the scrollbar
        is, then call with scaleOnly set to True.
        """
        converted = (logicals[0] * self.scale, logicals[1] * self.scale)
        if not scaleOnly: converted = self.CalcScrolledPosition(converted)
        return converted

    def toLogical (self, pixels, scaleOnly = False):
        """
        Converts a tuple of pixel coordinates to logical coordinates. If you need to do just
        a straight conversion without worrying about where the scrollbar is, then call with
        scaleOnly set to True.
        """
        converted = (pixels[0] / self.scale, pixels[1] / self.scale)
        if not scaleOnly: converted = self.CalcUnscrolledPosition(converted)
        return converted

    def getSize (self):
        """
        Returns a tuple (width, height) of the smallest rect needed to
        contain all children widgets.
        """
        width, height = 0, 0
        
        for i in self.passages:
            rightSide = i.pos[0] + i.getSize()[0]
            bottomSide = i.pos[1] + i.getSize()[1]
            width = max(width, rightSide)
            height = max(height, bottomSide)
        return (width, height)
    
    def zoom (self, scale):
        """
        Sets zoom to a certain level. Pass a number to set the zoom
        exactly, pass 'in' or 'out' to zoom relatively, and 'fit'
        to set the zoom so that all children are visible.
        """
        if (isinstance(scale, float)):
            self.scale = scale
        else:
            if (scale == 'in'):
                self.scale += 0.2
            if (scale == 'out'):
                self.scale -= 0.2
            if (scale == 'fit'):
                neededSize = self.toPixels(self.getSize(), scaleOnly = True)
                actualSize = self.GetSize()
                widthRatio = actualSize.width / neededSize[0]
                heightRatio = actualSize.height / neededSize[1]
                print 'width ratio', widthRatio, ', height ratio', heightRatio
                self.scale = min(widthRatio, heightRatio)
                self.Scroll(0, 0)
                
        self.scale = max(self.scale, 0.2)
                
        print 'scale now ', self.scale
        for i in self.passages: i.resize()
        self.resize()
        self.Refresh()
        self.parent.updateUI()

    def paint (self, event):
        """Paints widget connectors onscreen."""
        
        # do NOT call self.DoPrepareDC() no matter what the docs may say
        # we already take into account our scroll origin in our
        # toPixels() method
        
        dc = wx.BufferedPaintDC(self)
        dc.SetBackground(wx.Brush(StoryPanel.BACKGROUND_COLOR))      
        dc.Clear()
        dc.SetPen(wx.Pen(StoryPanel.CONNECTOR_COLOR))
                
        for widget in self.passages:            
            start = self.toPixels(widget.getCenter())
            for link in widget.passage.links():
                otherWidget = self.findPassage(link)
                if otherWidget:
                    end = self.toPixels(otherWidget.getCenter())
                    dc.DrawLine(start[0], start[1], end[0], end[1])
                        
    def resize (self, event = None):
        """
        Sets scrollbar settings based on panel size and widgets inside.
        This is designed to always give the user more room than they actually need
        to see everything already created, so that they can scroll down or over
        to add more things.
        """
        neededSize = self.toPixels(self.getSize(), scaleOnly = True)
        visibleSize = self.GetClientSize()
        
        maxWidth = max(neededSize[0], visibleSize[0]) + (visibleSize[0] * 0.5)
        maxHeight = max(neededSize[1], visibleSize[1]) + (visibleSize[1] * 0.5)
        
        self.SetVirtualSize((maxWidth, maxHeight))
        self.SetScrollRate(StoryPanel.SCROLL_SPEED, StoryPanel.SCROLL_SPEED)
    
    def serialize (self):
        """Returns a dictionary of state suitable for pickling."""
        state = { 'scale': self.scale, 'passages': [] }
                
        for widget in self.passages:
            state['passages'].append(widget.serialize())
            
        return state
     
    FIRST_TITLE = 'Start'
    FIRST_TEXT = 'Your story will display this passage first. Edit it by double clicking it.'   
    BACKGROUND_COLOR = '#666666'
    CONNECTOR_COLOR = '#000000'
    SCROLL_SPEED = 10
    EXTRA_SPACE = 200
    
# context menu

class StoryPanelContext (wx.Menu):
    def __init__ (self, parent, pos):
        wx.Menu.__init__(self)
        self.parent = parent
        
        newPassage = wx.MenuItem(self, wx.NewId(), 'New Passage Here')
        self.AppendItem(newPassage)
        self.Bind(wx.EVT_MENU, lambda e: self.parent.newPassage(pos = pos), id = newPassage.GetId())