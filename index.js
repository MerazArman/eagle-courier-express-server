const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
// const fileUpload = require('express-fileupload')
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zzdks.mongodb.net/${process.env.DB_DbNAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const port = process.env.PORT || 4050


const app = express();
app.use(cors());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false}));
// app.use(express.static(('doctors')));
// app.use(fileUpload());


client.connect(err => {
  const allServicesCollection = client.db("eagleCourier").collection("allServices");
  const allReviewsCollection = client.db("eagleCourier").collection("allReview");
  const allUsersParcelCollection = client.db("eagleCourier").collection("allUsersParcel");
  const allAdminCollection = client.db("eagleCourier").collection("adminList");
    console.log('database connection success');

    app.post('/addAllServices', (req, res) => {
      const allServices = req.body;
      allServicesCollection.insertMany(allServices)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    })


    app.post('/addAllReviews', (req, res) => {
        const allReviews = req.body;
        allReviewsCollection.insertMany(allReviews)
        .then(result => {
          res.send(result.insertedCount > 0)
        })
      })


    app.get('/showAllServices', (req, res) => {
        allServicesCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })  

    app.get('/showAllReviews', (req, res) => {
        allReviewsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    }) 


    app.get('/showAllServices/:id', (req, res) => {
        const serviceId = req.params.id;
        allServicesCollection.find({key: serviceId})
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })


    app.post('/addUsersOrder', (req, res) => {
      const usersOrder = req.body;
      // console.log(usersOrder);
      allUsersParcelCollection.insertOne(usersOrder)
      .then(result => {
        res.send(result.insertedCount)
      })
  
    })


    app.get('/showYourOrders', (req, res) => {
      // console.log(req.query.email);
        allUsersParcelCollection.find({email: req.query.email})
          .toArray((err, documents) => {
              res.send(documents);
          })
  }) 

//   app.get('/showUsersList',(req, res) =>{
//     booksUsersCollection.find({email: req.query.email})
//     .toArray((err, documents) => {
//         res.send(documents)
//     })
// })


  app.post('/addNewReview', (req, res) => {
    const newReview = req.body;
    console.log(newReview);
    allReviewsCollection.insertOne(newReview)
    .then(result => {
      res.send(result.insertedCount > 0)
    })

  })  


  app.post('/addNewServices', (req, res) => {
    const newService = req.body;
    console.log(newService);
    allServicesCollection.insertOne(newService)
    .then(result => {
      res.send(result.insertedCount > 0)
    })

  })  


  app.get('/showAllOrders', (req, res) => {
    allUsersParcelCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
}) 


app.post('/addNewAdmin', (req, res) => {
  const newAdmin = req.body;
  allAdminCollection.insertOne(newAdmin)
  .then(result => {
    res.send(result)
  })

})



app.post('/isAdmin', (req, res) => {
  const email = req.body.email;
  allAdminCollection.find({ email: email })
      .toArray((err, admins) => {
          res.send(admins.length > 0);
      })
})


// app.patch('/updateStatus/:id', (req, res) => {
//   console.log( req.body.status);
//   allUsersParcelCollection.updateOne({_id: ObjectId(req.params.id)},
//   {
//     $set: {status: req.body.status}
//   })
//   .then(result => {
//     console.log(result);
//   })
// })


app.delete('/deleteService/:id', (req, res) =>{
  allServicesCollection.deleteOne({_id:ObjectId(req.params.id)})
  .then((result) =>{
      // console.log(result)
      res.send(result.deletedCount > 0)
  })
})


    
   

});




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)