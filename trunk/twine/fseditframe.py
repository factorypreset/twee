#!/usr/bin/env python

#
# FullscreenEditFrame
# This opens a modal fullscreen editor with some text. When the user's done,
# this calls the callback function passed to the constructor with the new text.
#

import wx

class FullscreenEditFrame (wx.Frame):
    
    def __init__ (self, parent, frame = None, title = '', initialText = '', callback = lambda i: i):
        wx.Frame.__init__(self, parent, wx.ID_ANY, title = title, size = (400, 400))
        self.callback = callback
        self.frame = frame
        
        # background
        
        panel = wx.Panel(self)
        panel.SetBackgroundColour(FullscreenEditFrame.BG_COLOR)
        sizer = wx.BoxSizer(wx.VERTICAL)
        
        # controls
        
        self.editCtrl = wx.TextCtrl(panel, style = wx.NO_BORDER | wx.TE_MULTILINE | wx.TE_PROCESS_TAB)
        self.editCtrl.SetValue(initialText)
        directions = wx.StaticText(panel, label = FullscreenEditFrame.DIRECTIONS)
        
        # colors + layout

        font = wx.Font(FullscreenEditFrame.DEFAULT_FONT_SIZE, wx.FONTFAMILY_MODERN, wx.FONTSTYLE_NORMAL, wx.NORMAL, False, FullscreenEditFrame.DEFAULT_FONT)
        self.editCtrl.SetBackgroundColour(FullscreenEditFrame.BG_COLOR)
        self.editCtrl.SetForegroundColour(FullscreenEditFrame.FG_COLOR)
        directions.SetForegroundColour(FullscreenEditFrame.FG_COLOR)
        self.editCtrl.SetFont(font)
        directions.SetFont(font)

        sizer.Add(self.editCtrl, 1, flag = wx.EXPAND | wx.ALL)
        sizer.Add(directions, 0, flag = wx.TOP, border = 6)
        panel.SetSizer(sizer)
        
        # events
        
        self.Bind(wx.EVT_CHAR, self.keyListener)
        self.editCtrl.Bind(wx.EVT_CHAR, self.keyListener)
        
        self.editCtrl.SetFocus()
        self.editCtrl.SetSelection(0, 0)
        self.Show(True)
        self.ShowFullScreen(True)

    def close (self):
        self.callback(self.editCtrl.GetValue())
        self.Destroy()

    def keyListener (self, event):
        """
        Listens for a key that indicates this frame should close; otherwise lets the event propagate.
        """
        key = event.GetKeyCode()
        
        if key == wx.WXK_F12:
            self.close()
            
        if key == wx.WXK_ESCAPE:
            self.close()
            self.frame.Destroy()
        
        print key
        event.Skip()
        
    DIRECTIONS = 'Press Escape to close this passage, F12 to leave fullscreen.'
    DEFAULT_FONT = 'Consolas'
    DEFAULT_FONT_SIZE = 18
    BG_COLOR = '#000000'
    FG_COLOR = '#dddddd'