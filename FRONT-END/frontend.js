// import { json } from "body-parser";
// import { error } from "console";
// import { response } from "express";

// import { error } from "console";
// import { response } from "express";

document.addEventListener('DOMContentLoaded', () => {
	const rollPage = document.querySelector('.roll-page');
	const openRollPageBtn = Array.from(document.querySelectorAll('.popular-btn'));
	let moviesData = null;

	//! roll-page
	const fetchMovies = async () => {
		if (moviesData === null) {
			try {
				const response = await fetch('http://localhost:5000/');
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				moviesData = await response.json();
				console.log(moviesData);
			} catch (error) {
				console.log('Fetch error:', error);
			}
		}
	}

	openRollPageBtn.forEach(button => {                            //! shown openRollPage and external data
		button.addEventListener('click', async () => {
			await fetchMovies();

			// create html elements with classes
			const moviesListContainer = document.querySelector('.card-box');
			moviesListContainer.innerHTML = '';

			moviesData.forEach(movie => {
				const movieCard = document.createElement('div');
				movieCard.classList.add('card');

				const img = document.createElement('img');
				img.classList.add('card__img');
				img.src = movie.image;
				img.alt = movie.title;

				const info = document.createElement('div');
				info.classList.add('card__info');

				const leftContainer = document.createElement('div');
				leftContainer.classList.add('card__left');

				const title = document.createElement('h3');
				title.classList.add('card__title', 'kreon');
				title.innerHTML = `${movie.title}`

				const details = document.createElement('div');
				details.classList.add('card__details', 'kreon');
				details.innerHTML = `
								<p>${movie.year}</p>
								<p>${movie.genre[0] ? movie.genre[0] : ""}</p>
								<p>${movie.genre[1] ? movie.genre[1] : ""}</p>
							`;

				const rate = document.createElement('div');
				rate.classList.add('card__rate', 'kreon');
				rate.innerHTML = `
								<p><span>★</span> ${movie.rating}</p>
							`

				leftContainer.appendChild(title);
				leftContainer.appendChild(details);

				info.appendChild(leftContainer);
				info.appendChild(rate);

				movieCard.appendChild(img);
				movieCard.appendChild(info);

				moviesListContainer.appendChild(movieCard);
			});

			rollPage.classList.toggle('show');
			if (navBar.classList.contains('show')) {
				navBar.classList.remove('show');
				overlay.classList.remove('show')
			}
		});
	});



	//! nav-bar
	const closeBtn = document.querySelector('.close-btn');
	const burgerBtn = document.querySelector('.burger-btn');
	const navBar = document.querySelector('.nav-bar');
	const overlay = document.querySelector('.overlay')

	const toggleNav = () => {
		const isVisible = navBar.classList.contains('show');

		if (isVisible) {
			navBar.classList.remove('show');
			overlay.classList.remove('show');

			setTimeout(() => {
				overlay.style.visibility = "hidden";
			}, 500);
		} else {
			navBar.classList.add('show');
			overlay.style.visibility = 'visible';
			overlay.classList.add('show');
		}
	}

	burgerBtn.addEventListener('click', toggleNav);
	closeBtn.addEventListener('click', toggleNav);





	//! search-btn
	const searchBtn = document.querySelectorAll('.search-btn');
	const navMenu = document.querySelector('.nav-menu');
	const searchInput = document.querySelector('.search-field')
	const headerContent = document.querySelector('.header__content')

	searchBtn.forEach(button => {
		button.addEventListener('click', () => {
			headerContent.classList.toggle('show');
			searchInput.classList.toggle('show');
			navMenu.classList.toggle('hidden');
		});
	});

	//! click in another zones
	document.addEventListener('click', (e) => {
		if (!navBar.contains(e.target) && !burgerBtn.contains(e.target) && navBar.classList.contains('show')) {
			navBar.classList.remove('show');
		}
		if (!rollPage.contains(e.target) && rollPage.classList.contains('show') && !openRollPageBtn.some(btn => btn.contains(e.target))) {
			rollPage.classList.remove('show');
		}
	});

	const debounce = (func, delay) => {
		let timeoutId;
		return (...args) => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			timeoutId = setTimeout(() => {
				func(...args);
			}, delay)
		}
	}

	const searchResults = document.querySelector('.search-field__container');
	const resultList = searchResults.querySelector('ul');

	const fetchMoviesList = async (query) => {                     // call to back-end with query
		try {
			const response = await fetch(`http://localhost:5000/search?q=${query}`);
			const result = await response.json();
			return result;
		} catch (error) {
			console.log(error);
			return [];
		}
	};

	// const visualData = (id, imageUrl, title, year, ) => {

	// }

	const searchMovies = async (query) => {
		if (query.length === 0) {
			console.log('no res');
			return;
		}
		const movies = await fetchMoviesList(query);

		const movieList = document.querySelector('.search-field__list');
		movieList.innerHTML = '';

		const searchFieldInput = document.querySelector('.search-field__input')
		searchFieldInput.style.borderRadius ="15px 15px 0px 0px";
		


		movies.forEach(movieItem => {
			const listItem = document.createElement('li');
			listItem.classList.add('list-item');
			listItem.dataset.movieId = movieItem.id;                 // !change

			const listItemLeft = document.createElement('div');
			listItemLeft.classList.add('list-item__left');

			const img = document.createElement('img');
			img.classList.add('list-item__img');
			img.src = movieItem.i.imageUrl;                 // !change
			img.alt = movieItem.l;                          // !change

			const listItemInfo = document.createElement('div');
			listItemInfo.classList.add('list-item__info', 'koulen-regular');

			const title = document.createElement('h3');
			title.classList.add('list-item__title');
			title.textContent = movieItem.l;                      // !change

			const year = document.createElement('p');
			year.classList.add('list-item__text');
			year.textContent = movieItem.y;                      // !change

			const actorsContainer = document.createElement('div');
			actorsContainer.classList.add('list-item__genre');

			const actorsText = document.createElement('p');
			actorsText.classList.add('list-item__text');
			actorsText.textContent = movieItem.s;                 // !change

			actorsContainer.appendChild(actorsText);

			listItemInfo.appendChild(title);
			listItemInfo.appendChild(year);
			listItemInfo.appendChild(actorsContainer);

			listItemLeft.appendChild(img);
			listItemLeft.appendChild(listItemInfo);

			const listItemRight = document.createElement('div');
			listItemRight.classList.add('list-item__right');

			const addBtn = document.createElement('div');
			addBtn.classList.add('list-item__addBtn');

			const square = document.createElement('img');
			square.classList.add('list-item__square');
			square.src = 'images/fav-square.png';


			const squareText = document.createElement('p');
			squareText.classList.add('list-item__addTofav-text', 'koulen-regular');
			squareText.textContent = 'add to fav-list';

			addBtn.append(square);
			addBtn.append(squareText);

			listItemRight.appendChild(addBtn);

			listItem.appendChild(listItemLeft);
			listItem.appendChild(listItemRight);

			movieList.appendChild(listItem);

			square.dataset.checked = 'false';
			square.addEventListener('click', (event) => {                   //! another function
				const isChecked = square.dataset.checked === 'true';
				square.src = isChecked ? 'images/fav-square.png' : 'images/check.png';
				square.dataset.checked = !isChecked;

				const listItem = event.target.closest('.list-item');
				const movieId = listItem.dataset.movieId;
				if (!isChecked) {
					const movieData = {
						i: { imageUrl: listItem.querySelector('.list-item__img').src },
						l: listItem.querySelector('.list-item__title').textContent,
						y: listItem.querySelector('.list-item__text').textContent,
						s: listItem.querySelector('.list-item__genre').textContent,
						id: listItem.dataset.movieId
					};

					fetch('http://localhost:5000/save-movie', {
						method: 'POST',
						headers: {
							"Content-Type": 'application/json',     // вказівка для сервера, щоб той знав як обробляти дані
						},
						body: JSON.stringify(movieData)
					})
						.then(response => {
							if (response.ok) {
								console.log('Movie saved successfully');
							} else {
								console.log('Error saving movie');
							}
						})
						.catch(error => console.error('Fetch error:', error));
				} else {
					fetch(`http://localhost:5000/delete-movie/${movieId}`, {
						method: 'DELETE'
					})
						.then(response => {
							if (response.ok) {
								console.log('Movie deleted successfully');
							} else {
								console.log('Error deleting movie');
							}
						})
						.catch(error => console.error('Fetch error:', error));
				}
			});
		});
	};

	const debouncedSearch = debounce((event) => {
		const query = event.target.value.trim();
		searchMovies(query);
	}, 500);
	searchInput.addEventListener('input', debouncedSearch);



	//! roll fav-list
	const favListBtn = document.querySelector('.fav-list-btn');
	const fetchFavouriteList = async () => {
		try {
			const response = await fetch('http://localhost:5000/get-favourite-movies/');
			if (!response.ok) {
				throw new Error('Network respinse was no ok');
			}
			moviesData = await response.json();
			console.log(moviesData);
		} catch (error) {
			console.log('Fetch err: ', error);
		}
	};

	favListBtn.addEventListener('click', async () => {
		await fetchFavouriteList();
		const favList = document.querySelector('.list-fav');
		favList.innerHTML = '';

		moviesData.forEach(movieItem => {
			const listItem = document.createElement('li');
			listItem.classList.add('list-item');
			listItem.movieId = movieItem.id;

			const listItemLeft = document.createElement('div');
			listItemLeft.classList.add('list-item__left');

			const img = document.createElement('img');
			img.classList.add('list-item__img');
			img.src = movieItem.img;
			img.alt = movieItem.title;

			const listItemInfo = document.createElement('div');
			listItemInfo.classList.add('list-item__info', 'koulen-regular');

			const title = document.createElement('h3');
			title.classList.add('list-item__title');
			title.textContent = movieItem.title;

			const year = document.createElement('p');
			year.classList.add('list-item__text');
			year.textContent = movieItem.year;

			const actorsContainer = document.createElement('div');
			actorsContainer.classList.add('list-item__genre');

			const actorsText = document.createElement('p');
			actorsText.classList.add('list-item__text');
			actorsText.textContent = movieItem.actors;

			actorsContainer.appendChild(actorsText);

			listItemInfo.appendChild(title);
			listItemInfo.appendChild(year);
			listItemInfo.appendChild(actorsContainer);

			listItemLeft.appendChild(img);
			listItemLeft.appendChild(listItemInfo);

			const listItemRight = document.createElement('div');
			listItemRight.classList.add('list-item__right');

			const addBtn = document.createElement('div');
			addBtn.classList.add('list-item__addBtn');

			const square = document.createElement('img');
			square.classList.add('list-item__square');
			square.src = 'images/fav-square.png';


			const squareText = document.createElement('p');
			squareText.classList.add('list-item__addTofav-text', 'koulen-regular');
			squareText.textContent = 'add to fav-list';

			addBtn.append(square);
			addBtn.append(squareText);

			listItemRight.appendChild(addBtn);

			listItem.appendChild(listItemLeft);
			listItem.appendChild(listItemRight);

			favList.appendChild(listItem);
		});
		const favSection = document.querySelector('.roll-page-fav');
		favSection.classList.toggle('show');

	});

});






