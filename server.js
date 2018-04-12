var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

app.use(bodyParser.json());
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/companies');

var CompanySchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 3},
    location: {type: String, required: true, minlength: 5},
    employees: [{type: Array}]
}, {timestamps:true});

mongoose.model('Company', CompanySchema);
var Company = mongoose.model('Company');

app.get('/companies', function (req, res) {
    Company.find({}, function(err, foundCompanies) {
        if (err) {
            console.log(err);
            res.json({message: "Error", error: err});
        } else {
            res.json({message: "Success", message: foundCompanies});
        }
    })
})

app.get('/companies/:id', function(req, res) {
    Author.findOne({_id: req.params.id}, function(err, foundCompany) {
        if (err){
            console.log(err);
            res.json({message: "Error", errors: err});
        } else {
            res.json({message: "Success", company: foundCompany})
        }
    })
})

app.post('/companies/new', function(req, res) {
    var company = new Company({
        name: req.body.name,
        location: req.body.location,
        employees: req.body.employees
    })
    company.save(function(err, company) {
        if (err) {
            console.log("in post: ", err);
            res.json({message: "Error", error: err});
        } else {
            res.json({message: "Success", company: company})
        }
    })
})

app.post('/companies/:id/employee', function (req, res) {
    Company.findOne({_id: req.params.id}, function (err, foundCompany) {
        if (err) {
            console.log(err);
            res.json({error: err});
        } else {
            let employees = foundCompany.employees;
            employees += req.body.employees;
            company.save(function(err, company) {
                if (err) {
                    console.log(err);
                    res.json({message: "Error", error: err});
                } else {
                    res.json({message: "Success", company: company})
                }
            })
        }
    })
})

app.put('/companies/:id', function(req, res) {
    Company.updateOne({_id: req.params.id}, {
        name: req.body.name,
        location: req.body.location,
        employees: req.body.employees,
    }, function(err, company) {
        if (err) {
            console.log(err);
            res.json({message: "Error", error: err});
        } else {
            res.json({message: "Success", company: company});
        }
    });
})

app.delete('/authors/:id', function(req, res) {
    Company.findOneAndRemove({_id: req.params.id}, function(err) {
        if (err) {
            console.log(err);
            res.json({message: "Error", error: err});
        } else {
            res.json({message: "Succesfully deleted from db"});
        }
    })
})

app.listen(8000, function(){
    console.log('listening on port 8000')
})