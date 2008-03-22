#!/usr/bin/env python

import sys, os, wx
sys.path.append(os.getcwd() + os.sep + 'lib')
import gui

app = wx.PySimpleApp()
frame = gui.ProjectWindow(None)
app.MainLoop()
