#
# Project
#
# A project is a collection of source files, a target, and a destination file.
#

import sys, pickle
from tiddlywiki import TiddlyWiki

class Project:

	def __init__ (self, path = ''):
		if path == '':
			self.sources = []
			self.target = 'jonah'
			self.destination = ''
		else:
			file = open(path, 'r')
			saved = pickle.load(file)
			self.sources = saved.sources
			self.target = saved.target
			self.destination = saved.destination
			file.close()

		
	def build (self):
		tw = TiddlyWiki('twee')
		
		dest = open(self.destination, 'w')
		
		for source in self.sources:
			file = open(source)		
			tw.add_twee(file.read())
			file.close()

		header = open(sys.path[0] + '/targets/' + self.target + '/header.html')
		dest.write(header.read())
		header.close()
		
		dest.write(tw.to_html())
		dest.write('</div></html>')
		dest.close()
		
		return True


	def save (self, path):
		file = open(path, 'w')
		pickle.dump(self, file)
		file.close()
