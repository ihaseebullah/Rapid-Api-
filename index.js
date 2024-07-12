const http = require('https');
const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const raw = require('./raw/raw');
const { default: axios } = require('axios');
const { Cardio } = require('./Models/cardio');
const { Chest } = require('./Models/chest');
const { Neck } = require('./Models/neck');
const { Shoulders } = require('./Models/shoulders');
const { lowerArms } = require('./Models/lowerArms');
const { lowerLegs } = require('./Models/lowerLegs');
const { Back } = require('./Models/back');
const { Mixed } = require('./Models/Mixed');
const app = express()
const bodyParts = ["back", "cardio", "chest", "lower arms", "lower legs", "neck", "shoulders", "upper arms", "upper legs", "waist"]
mongoose.connect('mongodb+srv://admin:ESkp0sknEgP1YpaK@cluster0.bp2y7j1.mongodb.net/workout').then(() => {
    console.log('Success connecting to the database')
})
app.use(bodyparser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    res.status(200).json({ message: "For grabing data from rapid api please visit (/api/getData) with parsing api string in the body as link" })
})

app.get('/api/getData', async (req, res) => {
    try {
        const options = {
            method: 'GET',
            url: 'https://exercisedb.p.rapidapi.com/exercises',
            params: {
                limit: 5000,
                offset: 0
            },
            headers: {
                'x-rapidapi-key': 'fdbbe63d91msh00d480099f021e7p1544f3jsn7cc3705c89c8',
                'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        console.log(response.data.length)
        let count = 0;
        for (const piece of response.data) {
            try {
                const newExercise = new Mixed({
                    bodyPart: piece.bodyPart,
                    equipment: piece.equipment,
                    gifUrl: piece.gifUrl,
                    id: piece.id,
                    name: piece.name,
                    target: piece.target,
                    instructions: piece.instructions,
                    secondaryMuscles: piece.secondaryMuscles
                });

                await newExercise.save();
                count++;
            } catch (e) {
                console.error(`Error saving exercise: ${piece.name}`, e.message);
                continue;
            }

        }

        res.status(200).json({ message: `Data loaded successfully, ${count} exercises added to the database` });
    } catch (error) {
        console.error('Error fetching or saving exercises:', error);
        res.status(500).json({ message: 'Failed to fetch or save exercises' });
    }
})
app.get('/api/loadData', async (req, res) => {
    let count = 0
    try {
        raw.data.forEach(async (piece) => {
            const newExcersie = new Exercise({
                bodyPart: piece.bodyPart,
                equipment: piece.equipment,
                gifUrl: piece.gifUrl,
                id: piece.id,
                name: piece.name,
                target: piece.target,
                instructions: piece.instructions,
                secondaryMuscles: piece.secondaryMuscles

            })
            await newExcersie.save().then(() => count += 1)
        });
        res.status(200).json({ message: `Data loaded successfully, ${count} exercises added to the database` })

    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Failed to load data" })
    }

})
app.listen(3000, () => console.log('App is listening on port 3000'))