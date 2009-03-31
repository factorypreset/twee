#
# This builds an .exe out of Tweebox for use with Windows.
# Call this with this command line: buildexe.py py2exe

import sys, os
from distutils.core import setup
import py2exe

setup(windows=['app.py'])