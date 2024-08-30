import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import mongoose from "mongoose";

const PORT = 5000;
const app = express();
const DB_URL = 'mongodb+srv://HayBitlay:test__Max04__CHer@clusteroffilms.aqegy0s.mongodb.net/?retryWrites=true&w=majority&appName=ClusterOfFilms';

//! middlewares
app.use(cors());
app.use(express.json());

//! connect to DB — only async
mongoose.connect(DB_URL) // here is promis (succseful or not connection) 
	.then(() => console.log('Database connected!'))
	.catch(error => console.error('Database connection error:', error));



app.get('/', async (req, res) => {
	try {
		const url = 'https://imdb-top-100-movies.p.rapidapi.com/';
		const options = {
			method: 'GET',
			headers: {
				'x-rapidapi-key': '5aca5469a1mshc6c7decfc68f95fp1ba45ejsnc1cbd63887b1',
				'x-rapidapi-host': 'imdb-top-100-movies.p.rapidapi.com'
			}
		}
		const response = await fetch(url, options);
		const data = await response.json();

		const movies = data.map(movie => ({
			image: movie.image,
			title: movie.title,
			year: movie.year,
			rating: movie.rating,
			genre: movie.genre.slice(0, 2)
		}));
		res.status(200).json(movies);
	} catch (err) {
		console.error('error:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

app.get('/search', async (req, res) => {
	const query = req.query.q;
	const url = `https://imdb8.p.rapidapi.com/auto-complete?q=${encodeURIComponent(query)}`;

	const options = {
		method: 'GET',
		headers: {
			'x-rapidapi-key': '5aca5469a1mshc6c7decfc68f95fp1ba45ejsnc1cbd63887b1',
			'x-rapidapi-host': 'imdb8.p.rapidapi.com'
		}
	};

	try {
		const response = await fetch(url, options);
		const result = await response.json();
		res.status(200).json(result.d)
	} catch (error) {
		console.log('Err fetching data: ', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

const movieSchema = new mongoose.Schema({
	img: String,
	title: String,
	year: Number,
	actors: String,
	id: String
});

const Movie = mongoose.model("Movie", movieSchema);

app.post('/save-movie', (req, res) => {
	const movieData = req.body;         // get data from client
	console.log(movieData);
	
	const movie = new Movie({
		img: movieData.i.imageUrl,
		title: movieData.l,
		year: movieData.y,
		actors: movieData.s,
		id: movieData.id
	});

	movie.save()
		.then(result => res.status(200).send('Movie saved!'))
		.catch(error => res.status(500).send('Error saving movie: ' + error.message));
});

app.delete('/delete-movie/:id', (req, res) => {
	const movieId = req.params.id;               // get id from client

	Movie.findOneAndDelete({ id: movieId })      // delete movie with the same id
		.then (result => {
			if (result) {
				res.status(200).send('Movie deleted!');
			} else {
				res.status(404).send('Movie not found');
			}
		})
		.catch(error => res.status(500).send('Error deleting movie: ' + error.message));
});

app.get('/get-favourite-movies', async (req, res) => {
	try {
		const movies = await Movie.find();
		console.log(movies);
		
		res.json(movies);
	} catch (error) {
		console.error("Error fetching favourite movies: ", error);
        res.status(500).json({ message: 'Server error' });		
	}
});



async function startApp() {
	try {
		app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT));
	} catch (error) {
		console.log(error);
	}
}

startApp();