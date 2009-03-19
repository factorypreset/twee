#!/usr/bin/python

#
# PreferenceFrame
# This allows the user to set their preferences. Changes automatically update as
# the user makes them; when they're done, they close the window. 
#

import wx

class PreferenceFrame (wx.Frame):
    
    def __init__ (self, app, parent = None):
        self.app = app
        wx.Frame.__init__(self, parent, wx.ID_ANY, title = self.app.NAME + ' Preferences', \
                          style = wx.MINIMIZE_BOX | wx.CLOSE_BOX | wx.CAPTION | wx.SYSTEM_MENU)
        
        panel = wx.Panel(parent = self, id = wx.ID_ANY)
        panelSizer = wx.FlexGridSizer(4, 2, PreferenceFrame.SPACING, PreferenceFrame.SPACING)
        panel.SetSizer(panelSizer)

        self.editorFont = wx.FontPickerCtrl(panel, style = wx.FNTP_FONTDESC_AS_LABEL)
        self.editorFont.SetSelectedFont(self.getPrefFont('windowed'))
        self.editorFont.Bind(wx.EVT_FONTPICKER_CHANGED, lambda e: self.saveFontPref('windowed', \
                             self.editorFont.GetSelectedFont()))
        
        self.fsFont = wx.FontPickerCtrl(panel, style = wx.FNTP_FONTDESC_AS_LABEL)        
        self.fsFont.SetSelectedFont(self.getPrefFont('fs'))
        self.fsFont.Bind(wx.EVT_FONTPICKER_CHANGED, lambda e: self.saveFontPref('fs', \
                         self.fsFont.GetSelectedFont()))
        
        self.fsTextColor = wx.ColourPickerCtrl(panel)
        self.fsTextColor.SetColour(self.app.config.Read('fsTextColor'))
        self.fsTextColor.Bind(wx.EVT_COLOURPICKER_CHANGED, lambda e: self.savePref('fsTextColor', \
                              self.fsTextColor.GetColour()))
        
        self.fsBgColor = wx.ColourPickerCtrl(panel)
        self.fsBgColor.SetColour(self.app.config.Read('fsBgColor'))
        self.fsBgColor.Bind(wx.EVT_COLOURPICKER_CHANGED, lambda e: self.savePref('fsBgColor', \
                              self.fsBgColor.GetColour()))

        panelSizer.Add(wx.StaticText(panel, label = 'Windowed Editor Font'), flag = wx.TOP | wx.LEFT | wx.RIGHT, border = PreferenceFrame.SPACING)
        panelSizer.Add(self.editorFont, flag = wx.TOP | wx.LEFT | wx.RIGHT, border = PreferenceFrame.SPACING)
        panelSizer.Add(wx.StaticText(panel, label = 'Fullscreen Editor Font'), flag = wx.TOP | wx.LEFT | wx.RIGHT, border = PreferenceFrame.SPACING)
        panelSizer.Add(self.fsFont, flag = wx.TOP | wx.LEFT | wx.RIGHT, border = PreferenceFrame.SPACING)
        panelSizer.Add(wx.StaticText(panel, label = 'Fullscreen Editor Text Color'), flag = wx.TOP | wx.LEFT | wx.RIGHT, border = PreferenceFrame.SPACING)
        panelSizer.Add(self.fsTextColor, flag = wx.ALL, border = PreferenceFrame.SPACING)
        panelSizer.Add(wx.StaticText(panel, label = 'Fullscreen Editor Background Color'), flag = wx.BOTTOM | wx.LEFT | wx.RIGHT, border = PreferenceFrame.SPACING)
        
        panelSizer.Add(self.fsBgColor, flag = wx.BOTTOM | wx.LEFT | wx.RIGHT, border = PreferenceFrame.SPACING)

        panelSizer.Fit(self)
        self.Show()
        
    def getPrefFont (self, key):
        """
        Returns a font saved in preferences as a wx.Font instance.
        """
        return wx.Font(self.app.config.ReadInt(key + 'FontSize'), wx.FONTFAMILY_MODERN, \
                       wx.FONTSTYLE_NORMAL, wx.NORMAL, False, self.app.config.Read(key + 'FontFace'))

    def savePref (self, key, value):
        """
        Saves changes to a preference and sends an update message to the application.
        """
        print 'saving', key, value
        
        if isinstance(value, wx.Colour):
            self.app.config.Write(key, value.GetAsString(wx.C2S_HTML_SYNTAX))
            print self.app.config.Read(key)
        elif type(value) is int:
            self.app.config.WriteInt(key, value)
        else:
            self.app.config.Write(key, value)
        
        self.app.applyPrefs()

    def saveFontPref (self, key, font):
        """
        Saves a user-chosen font to preference keys, then sends an update message to the application.
        """
        self.app.config.Write(key + 'FontFace', font.GetFaceName())
        self.app.config.WriteInt(key + 'FontSize', font.GetPointSize())
        self.app.applyPrefs()

    SPACING = 6