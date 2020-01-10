require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const movies = require('./movies.json');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function authentication(req, res, next) {
    const serverKey = process.env.API_KEY;
    const authToken = req.get('Authorization');

    if (!authToken || authToken !== serverKey) {
        res.status(401).json({ error: "Unauthorized"})
    }

    next();

})

function handleGetMovie(req, res) {
    
    let results = movies;
    
    // PROCESS GENRE 
    if (req.query.genre) {
        results = results.filter((result) => {
            
            return result.genre.toLowerCase().includes(req.query.genre.toLowerCase()); 

        })
    }

    // PROCESS COUNTRY 
    if (req.query.country) {
        results = results.filter((result) => {
            
            return result.country.toLowerCase().includes(req.query.country.toLowerCase()); 

        })
    }

    // PROCESS VOTE
    if (req.query.vote) {
        results = results.filter((result) => {
            
            return result.avg_vote >= Number(req.query.vote) 

        })
    }
    
    
    res.json(results);
}

app.get('/', (req, res) => {
    res.send('It works!');
})

app.get('/movie', handleGetMovie)

app.listen(8000, () => {
    console.log('Server Started Listening On Port 8000');
})
