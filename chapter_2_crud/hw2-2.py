#!/usr/bin/python
# -*- coding: UTF8 -*-

import pymongo
import sys

# Homework 2.2 · Course M101P
#
# Write a program in the language of your choice that will remove the grade
# of type "homework" with the lowest score for each student from the dataset
# that you imported in HW 2.1. Since each document is one grade, it should
# remove one document per student.
# solution copied from https://github.com/olange/learning-mongodb/blob/master/course-m101p/hw2-2-remove.py

connection = pymongo.MongoClient("mongodb://localhost")
db = connection.students
grades = db.grades

try:
	cursor = grades.find( { "type": "homework" }) \
	               .sort( [ ("student_id", pymongo.ASCENDING), \
	               	        ( "score", pymongo.ASCENDING)])
except:
	print "Unexpected error:", sys.exc_info()[ 0]

previous_id = None
student_id = None

for doc in cursor:
 	student_id = doc[ 'student_id']
	if student_id != previous_id:
  		previous_id = student_id
  		print "Removing", doc
  		grades.remove( { '_id': doc[ '_id'] } )


# Draft solution by using js directly
# var removeIdsArray = db.grades.aggregate([{
#     $match: {
#         type: 'homework'
#     }
# }, {
#     $group: {
#         _id: "$student_id",
#         min: {
#             $min: "$score"
#         }
#     }
# }]).toArray().map(function(doc) {
#     return (doc._id, doc.min);
# })

# db.grades.remove({_id: {$in: removeIdsArray}})

# var removeIdsArray = db.grades.group({
#     "key": {
#         "_id": true
#     },
#     "initial": {},
#     "reduce": function(obj, prev) {
#         prev.minimumvaluescore = isNaN(prev.minimumvaluescore) ? obj.score : Math.min(prev.minimumvaluescore, obj.score);
#     },
#     "cond": {
#         "type": "homework"
#     }
# }).toArray().map(function(doc) {
#     return doc._id;
# })