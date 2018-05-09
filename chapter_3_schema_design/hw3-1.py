#!/usr/bin/python
# -*- coding: UTF8 -*-

import pymongo
import sys

# Homework 3.1 · Course M101P
#
# Write a program in the language of your choice that will remove the
# lowest homework score for each student. Since there is a single document
# for each student containing an array of scores, you will need to update
# the scores array and remove the homework.

connection = pymongo.MongoClient("mongodb://localhost")


def removehomework(student_id):
	db = connection.school
	students = db.students
	min_hw = 99999
	try:
		scores = students.find_one({'_id': student_id},{'_id': 0, 'scores': 1})
		lst = scores["scores"]
		print lst
		for i in lst:
			if i["type"] == "homework":
				if i["score"] < min_hw:
					min_hw = i["score"]
		lst.remove({"score":min_hw,"type":"homework"})
		students.update({'_id':student_id},{"$set":{"scores":lst}})
	except:
		print "Unexpected error:", sys.exc_info()[0]

for i in range(1,201):
	removehomework(i)