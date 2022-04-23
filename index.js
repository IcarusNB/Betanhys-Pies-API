let pieRepo = require('./repos/pieRepo')

//Bring in the Express Server and Create Application
let express = require('express');
let app = express();

//Use the Express Router object
let router = express.Router();

//Configure Middleware to support JSON data parsing in request object
app.use(express.json());

//Create GET to return list of all Pies
router.get('/', function (req, res, next) {
  pieRepo.get(function (data) {
    res.status(200).json({
      "status": 200,
      "statusText": "OK",
      "message": "All Pies Retrieved",
      "data": data
    });
  }, function(err) {
    next(err)
  });
});

// Create GET/search?id=n&name=str to search for pies by 'id' and/or 'name'
router.get('/search', function (req, res, next) {
  let searchObject = {
    "id": req.query.id,
    "name": req.query.name
  };

  pieRepo.search(searchObject, function (data) {
    res.status(200).json({
      "status": 200,
      "statusText": "OK",
      "message": "Searched for Pies.",
      "data": data
    });
  }, function (err) {
    next(err);
  });
});

router.get('/:id', function (req, res, next) {
  pieRepo.getById(req.params.id, function (data) {
    if (data) {
      res.status(200).json({
        "status": 200,
        "statusText": "OK",
        "message": "Single Pie Retrieved",
        "data": data
      });
    } else {
      res.status(400).json({
        "status": 400,
        "statusText": "Not Found",
        "message": "The pie '" + req.params.id + "' could not be found.",
        "error": {
          "code": "NOT_FOUND",
          "message": "The pie '" + req.params.id + "' could not be found."
        }
      })
    }
  }, function (err) {
    next(err);
  });
});

router.post('/', function (req, res, next) {
  pieRepo.insert(req.body, function(data) {
    res.status(201).json({
      "status": 201,
      "statusText": "Created",
      "message": "New Pie Added.",
      "data": data
    });
  }, function(err) {
    next(err);
  });
})

router.put('/:id', function (req, res, next) {
  pieRepo.getById(req.params.id, function (data) {
    if (data) {
      //Attempt to update the data
      pieRepo.update(req.body, req.params.id, function (data) {
        res.status(200).json({
          "status": 200,
          "statusText": "OK",
          "message": "Pie '" + req.params.id + "' updated.",
          "data": data
        })
      })
    } else {
      res.status(404).send({
        "status": 404,
        "statusMessage": "Not Found",
        "message": "The pie '" + req.params.id + "' could not be found.",
        "error": {
          "code": "NOT_FOUND",
          "message": "The pie '" + req.params.id + "' could not be found."
        }
      })
    }
  }, function (err) {
    next(err)
  })
})

router.delete('/:id', function (req, res, next) {
  pieRepo.getById(req.params.id, function (data) {
    if (data) {
      //Attempt to Delete the data
      pieRepo.delete(req.params.id, function(data) {
        res.status(200).json({
          "status": 200,
          "statusText": "OK",
          "message": "The pie '" + req.params.id + "' was deleted.",
          "data": "Pie '" + req.params.id + "' deleted"
        })
      })
    } else {
      res.status(404).send({
        "status": 400,
        "statusText": "Not Found",
        "message": "The pie '" + req.params.id + "' could not be found.",
        "error": {
          "code": "NOT_FOUND",
          "message": "The pie '" + req.params.id + "' could not be found."
        }
      })
    }
  }, function (err) {
    next(err)
  })
})

//Configure Router so all routes are prefixed with /api/v1
app.use('/api', router);

//Create Server to listen on port 5000
var server = app.listen(5000, function () {
  console.log('Node Server is Running on http://localhost:5000')
});