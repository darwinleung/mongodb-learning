use agg
db.products.aggregate([
    {$group:
     {
	 _id:"$manufacturer", 
	 num_products:{$sum:1}
     }
    }
])

db.products.aggregate([
    {$group:
     {
	 _id:"$category", 
	 num_products:{$sum:1}
     }
    }
])

db.zips.aggregate([
    {$group:
     {
	 _id:"$state", 
	 population:{$sum:"$pop"}
     }
    }
])

db.zips.aggregate([
    {$group:
     {
	 _id:"$state", 
	 average_pop:{$avg:"$pop"}
     }
    }
])

db.zips.aggregate([
    {$group:
     {
	 _id: "$city",
	 postal_codes:{$addToSet:"$_id"}
     }
    }
])

db.zips.aggregate([
    {$group:
     {
	 _id:"$state", 
	 pop:{$max:"$pop"}
     }
    }
])

db.zips.aggregate([
    {$project:
     {
	 _id:0,
	 'city': {$toLower:"$city"},
	 'pop': 1,
	 'state': 1,
	 'zip': '$_id'
	}
}
])

db.zips.aggregate([
    {$match:
     {
	 pop: {$gt:100000}
     }
    }
])

db.zips.aggregate([
    {$sort:
     {
	 state: 1,
     city: 1
     }
    }    
])

// hw 5.1
db.posts.aggregate([
    {
        $project:
        {
            "comments.author":1,
            _id:0
        }
    },
    {
        $unwind:"$comments"
    },
    {
        $group:
        {
            _id:"$comments.author",
            count:{$sum:1}
        }
    },
    {
        $sort:
        {
            count:-1
        }
    }
])

//hw5.2

db.zips.aggregate([
    {
        $match:
        {
            $or:
                [{"state":"CA"},{"state":"NY"}]
        }
    },
    {
        $group:
        {
            "_id":
            {"state":"$state",
             "city":"$city"},
            sum_pop:{$sum:"$pop"}
        }
    },
    {
        $match:
        {
            "sum_pop":{$gt: 25000}
        }
    },
    {
        $sort:
        {
            count:-1
        }
    }
])


//hw5.3

// Your task is to calculate the class with the best average student performance. 
// This involves calculating an average for each student in each class of all non-quiz 
// assessments and then averaging those numbers to get a class average. To be clear,
//  each student's average includes only exams and homework grades. 
//  Don't include their quiz scores in the calculation.
// What is the class_id which has the highest average student performance?
// Hint/Strategy: You need to group twice to solve this problem. You must figure
//  out the GPA that each student has achieved in a class and 
//  then average those numbers to get a class average. 
//  After that, you just need to sort. The class with the lowest average is 
//  the class with class_id=2. Those students achieved a class average of 37.6


db.grades.aggregate([
    {
        $unwind:"$scores"
    },
    {
        $match:
        {
            "scores.type":{$ne: "quiz"}
        }
    },
    {
        $group:
        {
            "_id":
            {"student_id":"$student_id",
             "class_id":"$class_id"},
            avg_student_score:{$avg:"$scores.score"}
        }
    },
    {
        $group:
        {
            "_id":
            {"class_id":"$_id.class_id"},
            avg_class_score:{$avg:"$avg_student_score"}
        }
    },
    {
        $sort:
        {
            avg_class_score:-1
        }
    }
])

//hw $substr

// Using the aggregation framework, calculate the sum total of people who are
//  living in a zip code where the city starts with one of those possible first
//   characters. Choose the answer below.

// You will need to probably change your projection to send more info through than
//  just that first character. Also, you will need a filtering step to get rid of 
//  all documents where the city does not start with the select set of initial 
//  characters.

db.zips.aggregate([
    {
        $project:
        {
            first_char:
            {$substr : ["$city",0,1]},
            pop: "$pop"
     }
   },
   {
        $match:
        {
            "first_char":{$in: ["B","D","O","G","N","M"]}
        }
    },
    {
        $group:
        {
            _id: 0,
            total_pop: { $sum: "$pop"}
        }
    }
])