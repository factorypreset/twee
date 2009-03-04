#!/usr/bin/env python

#
# StoryPanel
# A StoryPanel is a container for PassageWidgets. It translates
# between logical coordinates and actual coordinates as the user
# zooms in and out, and communicates those changes to its widgets.
#

import wx, re
from passagewidget import PassageWidget

class StoryPanel (wx.ScrolledWindow):

    def __init__ (self, parent, app, id = wx.ID_ANY, state = None):
        wx.ScrolledWindow.__init__(self, parent, id)
        self.app = app
        
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

    def newPassage (self, title = None, text = ''):
        """Adds a new PassageWidget to the container."""
        
        # calculate position
        
        pos = list(self.toLogical(self.GetViewStart()))
        pos[0] += 10
        pos[1] += 10
        
        # defaults
        
        if (not title): title = self.untitledName()
        
        self.passages.append(PassageWidget(self, self.app, title = title, text = text, pos = pos))
        self.resize()
        
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
            
    def findPassage (self, title):
        """Returns a PassageWidget with the title passed. If none exists, it returns None."""
        for passage in self.passages:
            if passage.passage.title == title: return passage
        return None

    def toPixels (self, logicalPos):
        """Converts a tuple of logical coordinates to pixel coordinates."""                
        origin = self.GetViewStart()
        return ((logicalPos[0] * self.scale) + origin[0], (logicalPos[1] * self.scale) + origin[0])

    def toLogical (self, pixelPos):
        """Converts a tuple of pixel coordinates to logical coordinates."""
        origin = list(self.GetViewStart())
        origin[0] /= self.scale
        origin[1] /= self.scale
        return ((pixelPos[0] / self.scale) + origin[0], (pixelPos[1] / self.scale) + origin[0])

    def getLogicalSize (self):
        """Returns a tuple (width, height) of the smallest rect needed to \
           contain all children widgets."""
        
        width, height = 0, 0
        
        for i in self.passages:
            rightSide = i.getLogicalPos()[0] + i.getLogicalSize()[0]
            bottomSide = i.getLogicalPos()[1] + i.getLogicalSize()[1]
            width = max(width, rightSide)
            height = max(height, bottomSide)
            
        return (width, height)
    
    def zoom (self, scale):
        """Sets zoom to a certain level. Pass a number to set the zoom \
           exactly, pass 'in' or 'out' to zoom relatively, and 'fit' \
           to set the zoom so that all children are visible."""
           
        if (isinstance(scale, float)):
            self.scale = scale
        else:
            if (scale == 'in'):
                self.scale += 0.25
            if (scale == 'out'):
                self.scale -= 0.25
            if (scale == 'fit'):
                neededSize = self.getLogicalSize()
                actualSize = self.GetSize()
                widthRatio = actualSize.width / neededSize[0]
                heightRatio = actualSize.height / neededSize[1]
                print 'width ratio', widthRatio, ', height ratio', heightRatio
                self.scale = min(widthRatio, heightRatio)
                self.Scroll(0, 0)
                
        self.scale = max(self.scale, 0)
                
        print 'scale now ', self.scale
        for i in self.passages: i.resize()
        self.resize()
        self.Refresh()

    def paint (self, event):
        """Paints widget connectors onscreen."""
        dc = wx.BufferedPaintDC(self)  
        dc.SetBackground(wx.Brush(StoryPanel.BACKGROUND_COLOR))      
        dc.Clear()
        dc.SetPen(wx.Pen(StoryPanel.CONNECTOR_COLOR))
        
        for widget in self.passages:
            start = widget.getPixelCenter()
            for link in widget.passage.links():
                otherWidget = self.findPassage(link)
                if otherWidget:
                    end = otherWidget.getPixelCenter()
                    dc.DrawLine(start[0], start[1], end[0], end[1])
                        
    def resize (self, event = None):
        """Sets scrollbar settings based on panel size."""
        neededSize = self.toPixels(self.getLogicalSize())
        nativeSize = self.GetSize()
        maxWidth = max(neededSize[0], nativeSize.width) + StoryPanel.EXTRA_SPACE
        maxHeight = max(neededSize[1], nativeSize.height) + StoryPanel.EXTRA_SPACE
        
        print 'resizing StoryPanel to ', maxWidth, ', ', maxHeight
        
        self.SetScrollbars(StoryPanel.SCROLL_SPEED, StoryPanel.SCROLL_SPEED, \
                           maxWidth / StoryPanel.SCROLL_SPEED, \
                           maxHeight / StoryPanel.SCROLL_SPEED)
    
    def serialize (self):
        """Returns a dictionary of state suitable for pickling."""
        state = { 'scale': self.scale, 'passages': [] }
                
        for widget in self.passages:
            state['passages'].append(widget.serialize())
            
        return state
     
    FIRST_TITLE = 'Start'
    FIRST_TEXT = 'Your story will display this passage first. Edit it by double clicking it.'   
    BACKGROUND_COLOR = '#666666'
    CONNECTOR_COLOR = '#0000ff'
    SCROLL_SPEED = 10
    EXTRA_SPACE = 200