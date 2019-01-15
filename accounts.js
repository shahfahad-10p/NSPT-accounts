const express = require('express');
const logger = require('morgan');
const errorhandler = require('errorhandler');
const bodyParser = require('body-parser');
const url = 'mongodb://localhost:27017/NSPT-db';
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/NSPT-db');

let app = express();
app.use(logger('dev'));
app.use(bodyParser.json());

const accountSchema = mongoose.Schema({
    name: String,
    balance: Number
});

let Account = mongoose.model('Accounts', accountSchema);

app.get('/accounts', (req, res) => {
    Account.find((err, result) => {
        if (err) {
            return res.status(501).send();
        }
        res.send(result);
    })
});

app.post('/accounts', (req, res) => {
    let accountToAdd = new Account({
        name: req.body.name,
        balance: req.body.balance
    });

    accountToAdd.save((err, result) => {
        if (err) {
            return res.status(501).send();
        }
        res.status(201).send(result);
    });
});

app.put('/accounts/:id', (req, res) => {
    Account.findOne({ _id: req.params.id }, (err, accountToUpdate) => {
        if (err) return res.status(501).send();

        accountToUpdate.name = req.body.name;
        accountToUpdate.balance = req.body.balance;

        accountToUpdate.save(() => {
            res.send(accountToUpdate);
        });
    });
});

app.delete('/accounts/:id', (req, res) => {
    Account.findOne({ _id: req.params.id }, (err, accountToRemove) => {
        if (err || !accountToRemove) return res.status(501).send();
        accountToRemove.remove(() => {
            res.status(204).send();
        });
    });
});

app.listen(3000);