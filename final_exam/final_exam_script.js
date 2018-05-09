// final exam
// question 1

db.messages.findOne({"headers.From":"andrew.fastow@enron.com", "headers.To": "jeff.skilling@enron.com"})

// answer: 3

// question 2

db.messages.aggregate([
    { $project: { "from" : "$headers.From" , "to" : "$headers.To" } },
    { $unwind: "$to"},
    { $group:{ _id: { "email_id" : "$_id", "from" : "$from"}, "to": { $addToSet:"$to" } } },
    { $unwind: "$to" },
    { $project: { "_id": 0, "email_id": "$_id.email_id", "from" : "$_id.from" , "to" : "$to" } },
    { $group: {"_id": { "from": "$from","to": "$to" } , "count": {"$sum":1} } },
    { $sort : { "count": -1 }}
    ])

// question 3

db.messages.update(
   {  "headers.Message-ID" : "<8147308.1075851042335.JavaMail.evans@thyme>" },
   { $push: { "headers.To": "mrpotatohead@mongodb.com" } }
)


// question 7

// first import
mongoimport --db finalq7 --collection images --file images.json
mongoimport --db finalq7 --collection albums --file albums.json

//find all images ID in album (non-orphan)

db.albums.aggregate(
   [
     {
        $unwind: "$images"
        },
     {
       $group:
         {
           _id: {},
           nonorphan: { $addToSet: "$images" }
         }
     }
   ]
)

pipeline = [
{"$unwind": "$images"},
{"$group": {"_id": "0", "nonorphan": {"$addToSet": "$images"}}}
]


// > db.images.find().count()
// 89737

// > db.images.find({"tags":"kittens"}).count()
// 44822