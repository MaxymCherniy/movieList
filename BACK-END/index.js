import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const PORT = 5000;
const app = express();

app.use(cors());


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



async function startApp() {
	try {
		app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT));
	} catch (error) {
		console.log(error);
	}
}

startApp();