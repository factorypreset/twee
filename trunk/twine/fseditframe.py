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
    
    def __init__ (self, parent, app, frame = None, title = '', initialText = '', callback = lambda i: i):
        wx.Frame.__init__(self, parent, wx.ID_ANY, title = title, size = (400, 400))
        self.app = app
        self.callback = callback
        self.frame = frame
        
        # margins
        
        self.marginPanel = wx.Panel(self)
        marginSizer = wx.BoxSizer(wx.VERTICAL)  # doesn't really matter
        self.marginPanel.SetSizer(marginSizer)
        
        # content
        
        self.panel = wx.Panel(self.marginPanel)
        sizer = wx.BoxSizer(wx.VERTICAL)
        marginSizer.Add(self.panel, 1, flag = wx.EXPAND | wx.LEFT | wx.RIGHT, border = 100)
        
        # controls
        
        self.editCtrl = wx.stc.StyledTextCtrl(self.panel, style = wx.NO_BORDER | wx.TE_NO_VSCROLL | \
                                              wx.TE_MULTILINE | wx.TE_PROCESS_TAB)
        self.editCtrl.SetMargins(0, 0)
        self.editCtrl.SetMarginWidth(1, 0)
        self.editCtrl.SetWrapMode(wx.stc.STC_WRAP_WORD)
        self.editCtrl.SetText(initialText)
        self.editCtrl.SetUseHorizontalScrollBar(False)
        self.editCtrl.SetUseVerticalScrollBar(False)
        
        self.directions = wx.StaticText(self.panel, label = FullscreenEditFrame.DIRECTIONS)
        labelFont = wx.SystemSettings.GetFont(wx.SYS_DEFAULT_GUI_FONT)
        labelFont.SetPointSize(FullscreenEditFrame.LABEL_FONT_SIZE)
        self.directions.SetFont(labelFont)
        
        self.applyPrefs()
        sizer.Add(self.editCtrl, 1, flag = wx.EXPAND | wx.ALL)
        sizer.Add(self.directions, 0, flag = wx.TOP | wx.BOTTOM, border = 6)
        self.panel.SetSizer(sizer)
        
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
        
    def applyPrefs (self):
        """
        Applies user preferences to this frame.
        """
        editFont = wx.Font(self.app.config.ReadInt('fsFontSize'), wx.FONTFAMILY_MODERN, \
                           wx.FONTSTYLE_NORMAL, wx.NORMAL, False, self.app.config.Read('fsFontFace'))
        bgColor = self.app.config.Read('fsBgColor')
        textColor = self.app.config.Read('fsTextColor')
        
        self.panel.SetBackgroundColour(bgColor)
        self.marginPanel.SetBackgroundColour(bgColor)        
        
        self.editCtrl.SetBackgroundColour(bgColor)
        self.editCtrl.SetForegroundColour(textColor)
        self.editCtrl.StyleSetBackground(wx.stc.STC_STYLE_DEFAULT, bgColor)
        self.editCtrl.SetCaretForeground(textColor)
        self.editCtrl.SetSelBackground(True, textColor)
        self.editCtrl.SetSelForeground(True, bgColor)
        
        defaultStyle = self.editCtrl.GetStyleAt(0)
        self.editCtrl.StyleSetForeground(defaultStyle, textColor)      
        self.editCtrl.StyleSetBackground(defaultStyle, bgColor)      
        self.editCtrl.StyleSetFont(defaultStyle, editFont)

        self.directions.SetForegroundColour(textColor)

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
    LABEL_FONT_SIZE = 12