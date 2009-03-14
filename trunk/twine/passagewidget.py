#!/usr/bin/env python

#
# PassageWidget
# A PassageWidget is a box standing in for a proxy for a single
# passage in a story. Users can drag them around, double-click
# to open a PassageFrame, and so on.
#
# This must have a StoryPanel as its parent.
#
# See the comments on StoryPanel for more information on the
# coordinate systems are used here. In general, you should
# always pass methods logical coordinates, and expect back
# logical coordinates. Use StoryPanel.toPixels() to convert.
#

import math, wx, wx.lib.wordwrap, storypanel, tiddlywiki
from passageframe import PassageFrame

class PassageWidget (wx.Panel):
    
    def __init__ (self, parent, app, id = wx.ID_ANY, pos = (0, 0), title = '', text = '', state = None):
        # inner state
        
        self.parent = parent
        self.app = app
        self.dragging = False
        self.pos = (0, 0)
        pos = list(pos)
        
        if state:
            self.passage = state['passage']
            pos = state['pos']
            self.selected = state['selected']
        else:
            self.passage = tiddlywiki.Tiddler('')
            self.passage.title = title
            self.passage.text = text   
            self.selected = False
        
            # find an empty space for us to land into
            # we 'cheat' by changing our pos property directly
            # so that we can use intersectsAny(). At the end of
            # the constructor, we call moveTo() anyhow.
            
            originalX = pos[0]
            self.pos = pos
            
            while self.intersectsAny():
                print 'overlaps'
                self.pos[0] += PassageWidget.SIZE * 1.25
                
                rightEdge = self.pos[0] + PassageWidget.SIZE
                maxWidth = self.parent.toLogical((self.parent.GetSize().width - self.parent.EXTRA_SPACE, -1), \
                                                 scaleOnly = True)[0]
                
                if rightEdge > maxWidth:
                    pos[0] = originalX
                    pos[1] += PassageWidget.SIZE * 1.25
                
        wx.Panel.__init__(self, parent, id, size = self.parent.toPixels(self.getSize(), scaleOnly = True), \
                          pos = self.parent.toPixels(self.pos))
                
        # events
        
        self.Bind(wx.EVT_LEFT_DOWN, self.startDrag)
        self.Bind(wx.EVT_LEFT_DCLICK, self.openEditor)
        self.Bind(wx.EVT_RIGHT_UP, lambda e: self.PopupMenu(PassageWidgetContext(self), e.GetPosition()))
        self.Bind(wx.EVT_ERASE_BACKGROUND, lambda e: e)  
        self.Bind(wx.EVT_PAINT, self.paint)
        self.Bind(wx.EVT_SIZE, lambda e: self.Refresh())
        
        self.moveTo(pos)
        self.resize()
    
    def getSize (self):
        """Returns this instance's logical size."""
        return (PassageWidget.SIZE, PassageWidget.SIZE)
            
    def getCenter (self):
        """Returns this instance's center in logical coordinates."""
        pos = list(self.pos)
        pos[0] += self.getSize()[0] / 2
        pos[1] += self.getSize()[1] / 2
        return pos
    
    def getPixelRect (self):
        """Returns this instance's rectangle onscreen."""
        origin = self.parent.toPixels(self.pos)
        size = self.parent.toPixels((PassageWidget.SIZE, -1), scaleOnly = True)[0]
        return wx.Rect(origin[0], origin[1], size, size)
    
    def moveTo (self, pos):
        """
        Moves this instance to the logical position passed. You must
        call this instead of manipulating the pos property directly,
        because this moves the widget to the correct pixel position as well.
        """
        self.pos = pos
        self.SetPosition(self.parent.toPixels(self.pos))
 
    def offset (self, x = 0, y = 0):
        """Offsets this widget's position by logical coordinates."""
        self.moveTo((self.pos[0] + x, self.pos[1] + y))
 
    def setSelected (self, value, exclusive = True):
        """Sets whether this widget should be selected. Pass a false value for \
           exclusive to prevent other widgets from being deselected."""
        if (exclusive):
            self.parent.eachWidget(lambda i: i.setSelected(False, False))
        
        self.selected = value
        self.Refresh()
        
    def startDrag (self, event):
        """Starts a drag and hands off execution to StoryPanel to track it."""
        if not self.parent.hasSelection(): self.setSelected(True)
        self.parent.startDrag(event, self)
    
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

    def delete (self, event = None):
        """Deletes this passage from onscreen."""
        self.parent.removeWidget(self)
        self.Destroy()

    def intersectsAny (self):
        """Returns whether this widget intersects any other in the same StoryPanel."""
        intersects = False
        
        # we do this manually so we don't have to go through all of them
        
        for widget in self.parent.widgets:
            if (widget != self) and (self.intersects(widget)):
                intersects = True
                break

        return intersects

    def intersects (self, other):
        """
        Returns whether this widget intersects another widget or wx.Rect.
        This uses logical coordinates, so you can do this without actually moving the widget onscreen.
        """   
        selfRect = wx.Rect(self.pos[0], self.pos[1], PassageWidget.SIZE, PassageWidget.SIZE)
        
        if isinstance(other, PassageWidget):
            other = wx.Rect(other.pos[0], other.pos[1], PassageWidget.SIZE, PassageWidget.SIZE)
        return selfRect.Intersects(other)

    def resize (self):
        """Resizes widget onscreen based on parent panel scale."""
        size = self.parent.toPixels(self.getSize(), scaleOnly = True)
        size = map(lambda i: max(i, PassageWidget.MIN_PIXEL_SIZE), size)
        pos = self.parent.toPixels(self.pos)
        self.SetDimensions(pos[0], pos[1], size[0], size[1])

    def dirtyPixelRect (self):
        """
        Returns a pixel rectangle of everything that needs to be redrawn for the widget
        in its current position. This includes the widget itself as well as any
        other widgets it links to.
        """            
        dirtyRect = self.getPixelRect()
        
        # first, passages we link to
        
        for link in self.passage.links():
            widget = self.parent.findWidget(link)
            if widget: dirtyRect = dirtyRect.Union(widget.getPixelRect())
        
        # then, those that link to us
        # Python closures are odd, require lists to affect things outside
        
        bridge = [ dirtyRect ]
        
        def addLinkingToRect (widget):
            if self.passage.title in widget.passage.links():
                dirtyRect = bridge[0].Union(widget.getPixelRect())
        
        self.parent.eachWidget(addLinkingToRect)

        return dirtyRect

    def paint (self, event):
        """Paints widget onscreen."""
        dc = wx.BufferedPaintDC(self)
        size = self.GetSize()

        # color scheme
        
        if self.selected: colors = PassageWidget.SELECTED_COLORS
        else: colors = PassageWidget.UNSELECTED_COLORS

        # text font sizes
        # wxWindows works with points, so we need to doublecheck on actual pixels

        titleFontSize = self.parent.toPixels((PassageWidget.TITLE_SIZE, -1))[0]
        titleFontSize = min(titleFontSize, PassageWidget.MAX_TITLE_SIZE)
        excerptFontSize = min(titleFontSize * 0.9, PassageWidget.MAX_EXCERPT_SIZE)
        titleFont = wx.Font(titleFontSize, wx.SWISS, wx.NORMAL, wx.BOLD, False, 'Arial')
        excerptFont = wx.Font(excerptFontSize, wx.SWISS, wx.NORMAL, wx.NORMAL, False, 'Arial')
        titleFontHeight = math.fabs(titleFont.GetPixelSize()[1])
        excerptFontHeight = math.fabs(excerptFont.GetPixelSize()[1])
        
        # inset for text (we need to know this for layout purposes)
        
        inset = titleFontHeight / 3

        # frame

        dc.SetPen(wx.Pen(colors['frame'], 1))
        dc.SetBrush(wx.Brush(colors['body']))     
        dc.DrawRectangle(0, 0, size.width, size.height)

        # title shade

        dc.SetBrush(wx.Brush(colors['titleShade']))
        dc.SetPen(wx.Pen(colors['titleShade'], 1))            
        titleShadeHeight = titleFontHeight + (2 * inset)
        dc.DrawRectangle(1, 1, size.width - 2, titleShadeHeight - 2)
        
        # draw title
        # we let clipping prevent writing over the frame
        
        dc.DestroyClippingRegion()
        dc.SetClippingRect((inset, inset, size.width - (inset * 2), titleShadeHeight - 2))
        dc.SetFont(titleFont)
        dc.SetTextForeground(colors['titleText'])
        dc.DrawText(self.passage.title, inset, inset)
                        
        # draw excerpt

        excerptTop = inset + titleShadeHeight

        # we split the excerpt by line, then draw them in turn
        # (we use a library to determine breaks, but have to draw the lines ourselves)

        dc.DestroyClippingRegion()
        dc.SetFont(excerptFont)
        dc.SetTextForeground(colors['excerptText'])
        excerptText = wx.lib.wordwrap.wordwrap(self.passage.text, size.width - (inset * 2), dc)

        for line in excerptText.split("\n"):
            dc.DrawText(line, inset, excerptTop)
            excerptTop += excerptFontHeight * PassageWidget.LINE_SPACING
            if excerptTop > size.height - inset: break
    
    def serialize (self):
        """Returns a dictionary with state information suitable for pickling."""
        return { 'selected': self.selected, 'pos': self.pos, 'passage': self.passage }
    
    MIN_PIXEL_SIZE = 10
    SIZE = 120
    UNSELECTED_COLORS = { 'frame': '#000000', 'titleShade': '#729fcf', 'body': '#eeeeec', \
                          'titleText': '#ffffff', 'excerptText': '#000000' }
    SELECTED_COLORS = { 'frame': '#ffffff', 'titleShade': '#204a87', 'body': '#000000', \
                        'titleText': '#000000', 'excerptText': '#eeeeec' }
    TITLE_SIZE = 9
    MAX_TITLE_SIZE = 18
    MAX_EXCERPT_SIZE = 10
    LINE_SPACING = 1.2
    
# contextual menu

class PassageWidgetContext (wx.Menu):
    def __init__ (self, parent):
        wx.Menu.__init__(self)
        self.parent = parent
        title = '"' + parent.passage.title + '"'
        
        edit = wx.MenuItem(self, wx.NewId(), 'Edit ' + title)
        self.AppendItem(edit)
        self.Bind(wx.EVT_MENU, self.parent.openEditor, id = edit.GetId())
        
        delete = wx.MenuItem(self, wx.NewId(), 'Delete ' + title)
        self.AppendItem(delete)
        self.Bind(wx.EVT_MENU, self.parent.delete, id = delete.GetId())