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

import wx, re, rectmath
from passagewidget import PassageWidget

class StoryPanel (wx.ScrolledWindow):

    def __init__ (self, parent, app, id = wx.ID_ANY, state = None):
        wx.ScrolledWindow.__init__(self, parent, id)
        self.app = app
        self.parent = parent
        
        # inner state
        
        self.snapping = False
        self.passages = []
        self.draggingMarquee = False
        self.draggingWidgets = False
        
        if (state):
            self.scale = state['scale']
            for passage in state['passages']:
                self.passages.append(PassageWidget(self, self.app, state = passage))
            if (hasattr(state, 'snapping')) and state['snapping']: self.snapping = True
        else:
            self.scale = 1
            self.newPassage(title = StoryPanel.FIRST_TITLE, text = StoryPanel.FIRST_TEXT)

        # cursors
        
        self.dragCursor = wx.StockCursor(wx.CURSOR_SIZING)
        self.badDragCursor = wx.StockCursor(wx.CURSOR_NO_ENTRY)
        self.defaultCursor = wx.StockCursor(wx.CURSOR_ARROW)
        self.SetCursor(self.defaultCursor)

        # events

        self.Bind(wx.EVT_ERASE_BACKGROUND, lambda e: e)
        self.Bind(wx.EVT_PAINT, self.paint)
        self.Bind(wx.EVT_SIZE, self.resize)
        self.Bind(wx.EVT_LEFT_DOWN, self.startMarquee)
        self.Bind(wx.EVT_LEFT_UP, lambda i: self.eachPassage(lambda j: j.setSelected(False)))
        self.Bind(wx.EVT_RIGHT_UP, lambda e: self.PopupMenu(StoryPanelContext(self, e.GetPosition()), e.GetPosition()))
        self.Bind(wx.EVT_MIDDLE_UP, lambda e: self.newPassage(pos = e.GetPosition()))

    def newPassage (self, title = None, text = '', pos = None):
        """Adds a new PassageWidget to the container."""
        
        # have to put this inside the method body
        
        if not pos: pos = StoryPanel.INSET
        
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
        
    def snapPassage (self, passage):
        """Snaps a passage to our grid if self.snapping is set."""
        if self.snapping:
            pos = list(passage.pos)
            
            for coord in range(0, 1):
                distance = pos[coord] % StoryPanel.GRID_SPACING
                if (distance > StoryPanel.GRID_SPACING / 2):
                    pos[coord] += StoryPanel.GRID_SPACING - distance
                else:
                    pos[coord] -= distance
                pos[coord] += StoryPanel.INSET[coord]
                
            passage.moveTo(pos)
            self.Refresh()
            
    def cleanup (self):
        """Snaps all passages to the grid."""
        oldSnapping = self.snapping
        self.snapping = True
        self.eachPassage(self.snapPassage)
        self.snapping = oldSnapping
        self.parent.setDirty(True)
        self.Refresh()

    def toggleSnapping (self):
        """Toggles whether snapping is on."""
        self.snapping = self.snapping is not True

    def startMarquee (self, event):
        """Starts a marquee selection."""
        if not self.draggingMarquee:
            self.draggingMarquee = True
            self.dragOrigin = self.CalcScrolledPosition(event.GetPosition())
            self.dragCurrent = event.GetPosition()
            self.dragRect = rectmath.pointsToRect(self.dragOrigin, self.dragOrigin)
            
            # deselect everything
            
            for widget in self.passages:
                widget.setSelected(False, False)
            
            # grab mouse focus
            
            self.Bind(wx.EVT_MOUSE_EVENTS, self.followMarquee)
            self.CaptureMouse()
            self.Refresh()

    def followMarquee (self, event):
        """Follows the mouse during a marquee selection."""
        if event.LeftIsDown():
            self.oldDirtyRect = self.dragRect
            self.dragCurrent = self.CalcScrolledPosition(event.GetPosition())
            self.dragRect = rectmath.pointsToRect(self.dragOrigin, self.dragCurrent)
             
            # select all enclosed widgets
            
            logicalRect = self.dragRect
            logicalRect.SetTopLeft(self.toLogical((logicalRect.x, logicalRect.y)))
            logicalRect.SetWidth(self.toLogical((logicalRect.width, -1), scaleOnly = True)[0])
            logicalRect.SetHeight(self.toLogical((logicalRect.height, -1), scaleOnly = True)[0])
            
            for widget in self.passages:
                widget.setSelected(widget.intersects(logicalRect), False)
            
            self.oldDirtyRect.Inflate(2, 2)   # don't know exactly, but sometimes we're off by 1
            self.Refresh(True, self.oldDirtyRect)
        else:
            self.draggingMarquee = False
                        
            # clear event handlers
            
            self.Bind(wx.EVT_MOUSE_EVENTS, None)
            self.ReleaseMouse()            
            self.Refresh()
            
    def startDrag (self, event, clickedWidget):
        """
        Starts a widget drag. The initial event is caught by PassageWidget, but
        it passes control to us so that we can move all selected widgets at once.
        """
        if not self.draggingWidgets:
            self.draggingWidgets = True
            self.clickedWidget = clickedWidget
            self.actuallyDragged = False
            self.dragCurrent = clickedWidget.ClientToScreen(event.GetPosition())
            self.dragCurrent = self.ScreenToClient(self.dragCurrent)
            
            print self.dragCurrent
            
            # have selected widgets remember their original position
            # in case they need to snap back to it after a bad drag
            
            for passage in self.passages:
                if passage.selected: passage.predragPos = passage.pos
            
            # grab mouse focus
            
            self.Bind(wx.EVT_MOUSE_EVENTS, self.followDrag)
            self.CaptureMouse()
        
    def followDrag (self, event):
        """Follows mouse motions during a widget drag."""
        if event.LeftIsDown():
            self.actuallyDragged = True
            
            # find change in position
            deltaX = event.GetPosition()[0] - self.dragCurrent[0]
            deltaY = event.GetPosition()[1] - self.dragCurrent[1]
            
            deltaX = self.toLogical((deltaX, -1), scaleOnly = True)[0]
            deltaY = self.toLogical((deltaY, -1), scaleOnly = True)[0]
            
            print (deltaX, deltaY)
            
            # offset selected passages
            
            self.eachSelectedPassage(lambda p: p.offset(deltaX, deltaY))
            self.dragCurrent = event.GetPosition()
                        
            # if there any overlaps, then warn the user with a bad drag cursor
            
            goodDrag = True
            
            for passage in self.passages:
                if passage.selected and passage.intersectsAny():
                    goodDrag = False
                    break
                
            if goodDrag:
                self.SetCursor(self.dragCursor)
            else:
                self.SetCursor(self.badDragCursor)
            
            # figure out our dirty rect
            
            dirtyRect = wx.Rect(0, 0, 0, 0)
            
            for passage in self.passages:
                if passage.selected:
                    dirtyRect = dirtyRect.Union(passage.dirtyPixelRect())
            
            self.Refresh(True, dirtyRect)
        else:
            self.draggingWidgets = False

            if self.actuallyDragged:
                # is this a bad drag?
    
                goodDrag = True
                
                for passage in self.passages:
                    if passage.selected and passage.intersectsAny():
                        goodDrag = False
                        break
                    
                if goodDrag:
                    self.eachSelectedPassage(lambda p: self.snapPassage(p))
                    self.parent.setDirty(True)
                    self.resize()
                else:
                    self.eachSelectedPassage(lambda p: p.moveTo(p.predragPos))
            else:
                # change the selection
                self.clickedWidget.setSelected(True, not event.ShiftDown())
        
            # general cleanup
            
            self.Bind(wx.EVT_MOUSE_EVENTS, None)
            self.ReleaseMouse()        
            self.SetCursor(self.defaultCursor)
            self.Refresh()
        
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
            
    def hasSelection (self):
        """Returns whether any passages are selected."""
        for passage in self.passages:
            if passage.selected: return True
        return False
            
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
        oldScale = self.scale
        
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
        scaleDelta = self.scale - oldScale
        
        # figure out what our scroll bar positions should be moved to
        # to keep in scale
        
        origin = list(self.GetViewStart())
        origin[0] += scaleDelta * origin[0]
        origin[1] += scaleDelta * origin[1]
        
        for i in self.passages: i.resize()
        self.resize()
        self.Refresh()
        self.Scroll(origin[0], origin[1])
        self.parent.updateUI()

    def paint (self, event):
        """Paints marquee selection and widget connectors onscreen."""
        
        # do NOT call self.DoPrepareDC() no matter what the docs may say
        # we already take into account our scroll origin in our
        # toPixels() method
        
        dc = wx.PaintDC(self)
        
        # background
        
        dc.SetBackground(wx.Brush(StoryPanel.BACKGROUND_COLOR))      
        dc.Clear()
        
        # connectors
        
        dc.SetPen(wx.Pen(StoryPanel.CONNECTOR_COLOR))
        
        for widget in self.passages:            
            start = self.toPixels(widget.getCenter())
            for link in widget.passage.links():
                otherWidget = self.findPassage(link)
                if otherWidget:
                    end = self.toPixels(otherWidget.getCenter())
                    dc.DrawLine(start[0], start[1], end[0], end[1])
        
        # marquee selection
        
        if self.draggingMarquee:
            dc.SetPen(wx.Pen(StoryPanel.SELECT_COLOR, style = wx.DOT))
            dc.SetBrush(wx.Brush('#000000', style = wx.TRANSPARENT))
            dc.DrawRectangle(self.dragRect.x, self.dragRect.y, self.dragRect.width, self.dragRect.height)
            
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
    
    INSET = (10, 10)
    FIRST_TITLE = 'Start'
    FIRST_TEXT = 'Your story will display this passage first. Edit it by double clicking it.'   
    BACKGROUND_COLOR = '#2e3436'
    CONNECTOR_COLOR = '#888a85'
    SELECT_COLOR = '#ffffff'
    SCROLL_SPEED = 10
    EXTRA_SPACE = 200
    GRID_SPACING = 140
    
# context menu

class StoryPanelContext (wx.Menu):
    def __init__ (self, parent, pos):
        wx.Menu.__init__(self)
        self.parent = parent
        
        newPassage = wx.MenuItem(self, wx.NewId(), 'New Passage Here')
        self.AppendItem(newPassage)
        self.Bind(wx.EVT_MENU, lambda e: self.parent.newPassage(pos = pos), id = newPassage.GetId())