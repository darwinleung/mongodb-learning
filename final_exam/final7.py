
# Andrew Erlichson
# MongoDB, Inc. 
# M101P - Copyright 2015, All Rights Reserved


import pymongo
import datetime
import sys

# establish a connection to the database
connection = pymongo.MongoClient("mongodb://localhost")
        

db=connection.finalq7
albums = db.albums
images = db.images

pipeline = [\
{"$unwind": "$images"},\
{"$group": {"_id": "{}", "nonorphan": {"$addToSet": "$images"}}}\
]

lst = next(albums.aggregate(pipeline))["nonorphan"]

cursor = images.find()
for i in cursor:
    if i["_id"] not in lst:
        images.remove(i["_id"])
