document.addEventListener('DOMContentLoaded', () => {
	const rollPage = document.querySelector('.roll-page');
	const openRollPageBtn = Array.from(document.querySelectorAll('.popular-btn'));
	let moviesData = null;

	//! roll-page
	const fetchMovies = async () => {                                    //! fetch data
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
								<p>${movie.genre[0] ? movie.genre[0]: ""}</p>
								<p>${movie.genre[1] ? movie.genre[1]: ""}</p>
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

			rollPage.classList.toggle('show');        // open & close roll-page 
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
	
});



