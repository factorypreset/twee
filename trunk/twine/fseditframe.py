#!/usr/bin/env python

#
# FullscreenEditFrame
# This opens a modal fullscreen editor with some text. When the user's done,
# this calls the callback function passed to the constructor with the new text.
#
# A lot of the stuff dealing with wx.stc.StyledTextCtrl comes from:
# http://www.psychicorigami.com/2009/01/05/a-5k-python-fullscreen-text-editor/
#

import wx, wx.stc

class FullscreenEditFrame (wx.Frame):
    
    def __init__ (self, parent, frame = None, title = '', initialText = '', callback = lambda i: i):
        wx.Frame.__init__(self, parent, wx.ID_ANY, title = title, size = (400, 400))
        self.callback = callback
        self.frame = frame
        
        # margins
        
        marginPanel = wx.Panel(self)
        marginPanel.SetBackgroundColour(FullscreenEditFrame.BG_COLOR)
        marginSizer = wx.BoxSizer(wx.VERTICAL)  # doesn't really matter
        marginPanel.SetSizer(marginSizer)
        
        # content
        
        panel = wx.Panel(marginPanel)
        panel.SetBackgroundColour(FullscreenEditFrame.BG_COLOR)
        sizer = wx.BoxSizer(wx.VERTICAL)
        marginSizer.Add(panel, 1, flag = wx.EXPAND | wx.LEFT | wx.RIGHT, border = 100)
        
        # controls
        
        self.editCtrl = wx.stc.StyledTextCtrl(panel, style = wx.NO_BORDER | wx.TE_NO_VSCROLL | \
                                              wx.TE_MULTILINE | wx.TE_PROCESS_TAB)
        self.editCtrl.SetMargins(0, 0)
        self.editCtrl.SetMarginWidth(1, 0)
        self.editCtrl.SetWrapMode(wx.stc.STC_WRAP_WORD)
        self.editCtrl.SetText(initialText)
        self.editCtrl.SetUseHorizontalScrollBar(False)
        self.editCtrl.SetUseVerticalScrollBar(False)
        
        directions = wx.StaticText(panel, label = FullscreenEditFrame.DIRECTIONS)
        
        # colors + layout

        editFont = wx.Font(FullscreenEditFrame.DEFAULT_FONT_SIZE, wx.FONTFAMILY_MODERN, \
                           wx.FONTSTYLE_NORMAL, wx.NORMAL, False, FullscreenEditFrame.DEFAULT_FONT)
        labelFont = wx.SystemSettings.GetFont(wx.SYS_DEFAULT_GUI_FONT)
        labelFont.SetPointSize(FullscreenEditFrame.LABEL_FONT_SIZE)
        
        self.editCtrl.SetBackgroundColour(FullscreenEditFrame.BG_COLOR)
        self.editCtrl.SetForegroundColour(FullscreenEditFrame.FG_COLOR)
        self.editCtrl.StyleSetBackground(wx.stc.STC_STYLE_DEFAULT, FullscreenEditFrame.BG_COLOR)
        self.editCtrl.SetCaretForeground(FullscreenEditFrame.FG_COLOR)
        self.editCtrl.SetSelBackground(True, FullscreenEditFrame.FG_COLOR)
        self.editCtrl.SetSelForeground(True, FullscreenEditFrame.BG_COLOR)
        
        defaultStyle = self.editCtrl.GetStyleAt(0)
        self.editCtrl.StyleSetForeground(defaultStyle, FullscreenEditFrame.FG_COLOR)      
        self.editCtrl.StyleSetBackground(defaultStyle, FullscreenEditFrame.BG_COLOR)      
        self.editCtrl.StyleSetFont(defaultStyle, editFont)

        directions.SetForegroundColour(FullscreenEditFrame.FG_COLOR)
        directions.SetFont(labelFont)

        sizer.Add(self.editCtrl, 1, flag = wx.EXPAND | wx.ALL)
        sizer.Add(directions, 0, flag = wx.TOP | wx.BOTTOM, border = 6)
        panel.SetSizer(sizer)
        
        # events
        
        self.Bind(wx.EVT_KEY_DOWN, self.keyListener)
        self.editCtrl.Bind(wx.EVT_KEY_DOWN, self.keyListener)
        
        self.editCtrl.SetFocus()
        self.editCtrl.SetSelection(0, 0)
        self.Show(True)
        self.ShowFullScreen(True)

    def close (self):
        self.callback(self.editCtrl.GetText())
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
        
        event.Skip()
        
    DIRECTIONS = 'Press Escape to close this passage, F12 to leave fullscreen.'
    DEFAULT_FONT = 'Consolas'
    DEFAULT_FONT_SIZE = 18
    LABEL_FONT_SIZE = 12
    BG_COLOR = '#100088'
    FG_COLOR = '#afcdff'