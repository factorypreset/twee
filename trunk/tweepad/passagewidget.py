#!/usr/bin/env python

#
# PassageWidget
# A PassageWidget is a box standing in for a proxy for a single
# passage in a story. Users can drag them around, double-click
# to open a PassageFrame, and so on.
#
# This must have a StoryPanel as its parent.
#

import math, wx, wx.lib.wordwrap, storypanel, tiddlywiki
from passageframe import PassageFrame

class PassageWidget (wx.Panel):
    
    def __init__ (self, parent, app, id = wx.ID_ANY, pos = (0, 0), title = '', text = '', state = None):
        # inner state
        
        self.parent = parent
        self.app = app
        self.dragging = False
        self.logicalPos = pos
        
        if state:
            self.passage = state['passage']
            pos = self.parent.toPixels(state['pos'])
            self.selected = state['selected']
        else:
            self.passage = tiddlywiki.Tiddler('')
            self.passage.title = title
            self.passage.text = text   
            self.selected = False
        
            # find an empty space for us to land into
        
            originalX = pos[0]
            
            while self.overlapsOthers():
                self.logicalPos[0] += PassageWidget.LOGICAL_SIZE * 1.25
                
                if self.parent.toPixels((self.logicalPos[0], -1))[0] + PassageWidget.LOGICAL_SIZE > \
                   self.parent.GetSize().width - self.parent.EXTRA_SPACE:
                    self.logicalPos[0] = originalX
                    self.logicalPos[1] += PassageWidget.LOGICAL_SIZE * 1.25
                
        wx.Panel.__init__(self, parent, id, size = self.getPixelSize(), pos = self.getPixelPos())
                
        # cursors
        
        self.defaultCursor = wx.StockCursor(wx.CURSOR_ARROW)
        self.dragCursor = wx.StockCursor(wx.CURSOR_SIZING)
        self.badDragCursor = wx.StockCursor(wx.CURSOR_NO_ENTRY)
        self.SetCursor(self.defaultCursor)
        
        # events
        
        self.Bind(wx.EVT_LEFT_DOWN, self.startDrag)
        self.Bind(wx.EVT_LEFT_UP, self.handleClick)
        self.Bind(wx.EVT_LEFT_DCLICK, self.openEditor)
        self.Bind(wx.EVT_ERASE_BACKGROUND, lambda e: e)  
        self.Bind(wx.EVT_PAINT, self.paint)
        self.Bind(wx.EVT_SIZE, lambda e: self.Refresh())
        
        self.moveTo(pos)
        self.resize()
    
    def getLogicalSize (self):
        """Returns this instance's logical size."""
        return (PassageWidget.LOGICAL_SIZE, PassageWidget.LOGICAL_SIZE)
    
    def getLogicalPos (self):
        """Returns this instance's logical position."""
        return self.logicalPos        
        
    def getPixelSize (self):
        """Returns this instance's pixel dimensions based on the container's scale."""
        return self.parent.toPixels((PassageWidget.LOGICAL_SIZE, PassageWidget.LOGICAL_SIZE))
    
    def getPixelPos (self):
        """Returns this instance's pixel position based on the container's scale."""
        return self.parent.toPixels(self.logicalPos)        

    def getPixelCenter (self):
        """Returns this instance's center in pixel coordinates."""
        pos = list(self.getPixelPos())
        pos[0] += self.getPixelSize()[0] / 2
        pos[1] += self.getPixelSize()[1] / 2
        return pos
 
    def setSelected (self, value, exclusive = True):
        """Sets whether this widget should be selected. Pass a false value for \
           exclusive to prevent other widgets from being deselected."""
        if (exclusive):
            self.parent.eachPassage(lambda i: i.setSelected(False, False))
        
        self.selected = value
        self.Refresh()
        
    def handleClick (self, event):
        """Handles single-clicks on the widget."""
        self.setSelected(True, not event.ShiftDown())
    
    def openEditor (self, event):
        """Opens a PassageFrame to edit this passage."""
        if (not hasattr(self, 'passageFrame')):
            self.passageFrame = PassageFrame(None, self, self.app)
        else:
            try:
                self.passageFrame.Raise()
            except wx._core.PyDeadObjectError:
                # user closed the frame, so we need to recreate it
                delattr(self, 'passageFrame')
                self.openEditor(event)                
                
    def startDrag (self, event):
        """Starts watching mouse events during a drag operation."""
        if not self.dragging:
            self.dragging = True
            self.setSelected(True, not event.ShiftDown())
            self.dragOrigin = event.GetPosition()
            self.predragPosition = self.parent.toPixels(self.logicalPos)
            
            # grab mouse focus
            
            self.Bind(wx.EVT_MOUSE_EVENTS, lambda e: self.followMouse('self', e))
            self.CaptureMouse()
            
            # set cursor
            
            self.SetCursor(self.dragCursor)
            self.Refresh()
        
    def followMouse (self, scope, event):
        """Updates position during a drag operation, preventing overlap with other widgets."""
        if event.LeftIsDown():
            pos = event.GetPosition()
            
            # if the event came from ourself,
            # convert coordinates to global ones
            
            if scope == 'self':
                selfPosition = self.GetPosition()
                pos.x += selfPosition.x
                pos.y += selfPosition.y
                                    
            # offset position by drag origin
            
            pos.x -= self.dragOrigin.x
            pos.y -= self.dragOrigin.y
            self.logicalPos = self.parent.toLogical((pos.x, pos.y))
            
            self.moveTo(self.parent.toPixels(self.logicalPos))

            # if our new position overlaps another widget,
            # give the user a 'bad drag' cursor as warning

            if self.overlapsOthers():
                self.SetCursor(self.badDragCursor)
            else:
                self.SetCursor(self.dragCursor)
                
            # force connectors and widgets to be redrawn
            
            self.parent.Refresh()
            self.parent.eachPassage(lambda i: i.Refresh())
        else:
            self.dragging = False
            
            # snap back to original position if we're overlapping
            
            if self.overlapsOthers():
                self.moveTo(self.predragPosition)
            
            # clear event handlers
            
            self.Bind(wx.EVT_MOUSE_EVENTS, None)
            self.ReleaseMouse()
            
            # reset cursors
            
            self.SetCursor(self.defaultCursor)
            
            # force redraw of parent and self
            
            self.parent.resize()
            self.Refresh()
            
    def moveTo (self, pos):
        """Moves to a pixel point. This prevents a widget from going offscreen, but \
           does not check for collisions with other widgets."""
        size = self.getPixelSize()
        
        parentSize = self.parent.GetSize()
        newPos = list(pos)
        
        # constrain to window dimensions
        
        newPos[0] = min(newPos[0], parentSize.width - size[0])
        newPos[0] = max(newPos[0], 0)
        newPos[1] = min(newPos[1], parentSize.height - size[1])
        newPos[1] = max(newPos[1], 0)

        self.Move(newPos)
        self.Refresh()
        self.logicalPos = self.parent.toLogical(pos)

    def overlapsOthers (self):
        """Returns whether this widget overlaps any other in the same StoryPanel."""
        overlaps = False
        
        for widget in self.parent.passages:
            if (widget != self) and (self.intersects(widget)):
                overlaps = True
                break

        return overlaps

    def intersects (self, other):
        """Returns whether this widget intersects another. Note that this uses logical \
           coordinates, so you can do this without actually moving the widget onscreen."""
           
        selfRect = wx.Rect(self.logicalPos[0], self.logicalPos[1], \
                           PassageWidget.LOGICAL_SIZE, PassageWidget.LOGICAL_SIZE)
        otherRect = wx.Rect(other.logicalPos[0], other.logicalPos[1], \
                            PassageWidget.LOGICAL_SIZE, PassageWidget.LOGICAL_SIZE)
        return selfRect.Intersects(otherRect)

    def resize (self):
        """Resizes widget onscreen based on parent panel scale."""
        
        size = self.getPixelSize()
        size = map(lambda i: max(i, PassageWidget.MIN_PIXEL_SIZE), size)
        pos = self.getPixelPos()
        self.SetDimensions(pos[0], pos[1], size[0], size[1])
    
    def paint (self, event):
        """Paints widget onscreen."""
        dc = wx.BufferedPaintDC(self)
        size = self.GetSize()

        # frame

        if self.selected:
            dc.SetPen(wx.Pen(PassageWidget.SELECTED_COLOR, 2))
        else:
            dc.SetPen(wx.Pen(PassageWidget.FRAME_COLOR, 1))
        
        dc.SetBrush(wx.Brush(PassageWidget.BODY_COLOR))     
        dc.DrawRectangle(0, 0, size.width, size.height)

        # label font sizes

        titleSize = self.parent.toPixels((PassageWidget.TITLE_SIZE, -1))[0]
        excerptSize = min(titleSize * 0.9, PassageWidget.MAX_EXCERPT_SIZE)
        titleFont = wx.Font(titleSize, wx.SWISS, wx.NORMAL, wx.BOLD, False, 'Arial')
        excerptFont = wx.Font(excerptSize, wx.SWISS, wx.NORMAL, wx.NORMAL, False, 'Arial')

        # label sizes
        
        inset = self.parent.toPixels((PassageWidget.LOGICAL_SIZE / 12, -1))[0]
        labelSize = size
        labelSize[0] -= inset * 2
        labelSize[1] -= inset * 2
        
        # draw title
        # we let clipping do our work for us
        
        dc.DestroyClippingRegion()
        dc.SetClippingRect((inset, inset, labelSize[0], labelSize[1]))
        dc.SetFont(titleFont)
        dc.DrawText(self.passage.title, inset, inset)
                
        # draw excerpt

        excerptTop = inset + titleSize + (titleSize * PassageWidget.LINE_SPACING)        
        dc.DestroyClippingRegion()
        dc.SetClippingRect((inset, excerptTop, labelSize[0], labelSize[1] - excerptTop))

        # we split the excerpt by line, then draw them in turn
        # (we use a library to determine breaks, but have to draw the lines ourselves)

        dc.SetFont(excerptFont)
        excerptText = wx.lib.wordwrap.wordwrap(self.passage.text, labelSize[0], dc)

        for line in excerptText.split("\n"):
            dc.DrawText(line, inset, excerptTop)
            excerptTop += excerptSize * PassageWidget.LINE_SPACING
    
    def serialize (self):
        """Returns a dictionary with state information suitable for pickling."""
        return { 'selected': self.selected, 'pos': self.logicalPos, 'passage': self.passage }
    
    MIN_PIXEL_SIZE = 10
    LOGICAL_SIZE = 120
    BODY_COLOR = '#f0f0f0'
    FRAME_COLOR = '#000000'
    SELECTED_COLOR = '#0000ff'
    TITLE_SIZE = 9
    TITLE_COLOR = '#000000'
    MAX_TITLE_SIZE = 18
    MAX_EXCERPT_SIZE = 10
    LINE_SPACING = 1.2
    DRAG_COLOR = '#ff0000'