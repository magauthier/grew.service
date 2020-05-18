const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 4000;

const mongoose = require('mongoose');

const plantRoutes = express.Router();
const PlantModel = require('./model');


app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/plantdb', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function () {
    console.log('MongoDB connected');
})



plantRoutes.route('/').get(function (req, res) {
    PlantModel.find(function (err, plants) {
        if (err) {
            console.log(err);
        } else {
            res.json(plants);
        }
    })
})

plantRoutes.route('/:id').get(function (req, res) {
    let id = req.params.id;
    PlantModel.findById(id, function (err, plant) {
        res.json(plant);
    })
});

plantRoutes.route('/add').post(function (req, res) {
    console.log('add: ' + req.body);
    let plantModel = new PlantModel(req.body);
    plantModel.save()
        .then(plant => {
            res.status(200).json({
                'plant': plant.plant_name + ' was added'
            });
        })
        .catch(err => {
            res.status(400).send('adding failed : ' + err);
        })
});

plantRoutes.route('/update/:id').post(function (req, res) {
    PlantModel.findById(req.params.id, function (err, plant) {
        if (!plant) {
            res.status(404).send('data was not found');
        } else {             
            plant.plant_name = req.body.plant_name;
            plant.plant_category = req.body.plant_category;
            plant.plant_grew = req.body.plant_grew;
            
            plant.save().then(plant => {
                res.json('Updated');
            }).catch(err => {
                res.status(400).send('Update error : ' + err);
            })
        }

    })
})

plantRoutes.route('/remove/:id').post( (req, res) => {
    PlantModel.findById(req.params.id, (err, plant) => {
        if (!plant) {
            res.status(404).send('data not found');
        } else {             
            plant.remove().then(plant => {
                res.json('Removed: ' + plant._id);
            }).catch(err => {
                res.status(400).send('Remove error : ' + err);
            })
        }

    })
})


app.use('/plants', plantRoutes);

app.listen(PORT, function () {
    console.log('Server is running on Port: ' + PORT);
})
