const modalBk = document.getElementById('modalBackdrop');
const manualBk = document.getElementById('manualBackdrop');
const clickToClose = document.getElementById('fullCover');
const addBtn = document.getElementById('addShow');
const closeBtn = document.getElementById('dontAdd');
const fullAddError = document.getElementById('fullAddError');


/* form data */
const newShowForm = document.getElementById('newShowForm');
const addShowErrorMessage = document.getElementById('hiddenAddShowError');
const nameInput = document.getElementById('showName');
const imgInput = document.getElementById('imgLink');
const startInput = document.getElementById('startYear');
const endInput = document.getElementById('endYear');
const languageInput = document.getElementById('language');
const numEpInput = document.getElementById('numEpisodes');
const runtimeInput = document.getElementById('runtime');
const genresInput = document.getElementById('genres');
const summaryInput = document.getElementById('summary');
const addSearchError = document.getElementById('addShowSearchError');

/* search form */
const smallSearchInput = document.getElementById('smallSearch');
const addSearchForm = document.getElementById('addSearch');

/* set up listener for searching a new term */
addSearchForm.addEventListener('submit', async(event) => {
    addSearchError.style.display = 'none';
    event.preventDefault();
    const searchTerm = smallSearchInput.value.trim();
    if (searchTerm == '') {
        addSearchError.textContent = 'Error: Please enter a search term.';
        addSearchError.style.display = 'block';
    } else {
        window.location.href = 'http://localhost:3000/shows/add/' + searchTerm;
    }
})

/* set up listener on form submission to add new manual show */
newShowForm.addEventListener('submit', async(event) => {
    event.preventDefault();
    addShowErrorMessage.style.display = 'none';
    try {
        const name = nameInput.value.trim();
        const img = imgInput.value.trim(); // not required
        const start = startInput.value.trim();
        const end = endInput.value.trim(); // not required
        const lang = languageInput.value.trim(); // not required
        const numEp = numEpInput.value.trim(); // not required
        const runtime = runtimeInput.value.trim(); // not required
        const genres = genresInput.value.trim();
        const summary = summaryInput.value.trim();
        /* Error check all inputs */
        let errorText = '';
        if (name == undefined || name.trim() == '' || name.trim().length < 1) {
            errorText = 'Error: Show Title must be at least one character.'
        }
        // note: no need to error check image link
        else if (start == undefined || isNaN(Number(start)) || Number(start) < 1900 || Number(start) > 2023 || Math.floor(Number(start)) != Number(start)) {
            errorText = 'Error: Start year must be a valid year between 1900 and 2023.';
        } else if ((end != undefined && end.trim() != '') && (isNaN(Number(end)) || Number(end) < 1900 || Number(end) > 2023 || Math.floor(Number(end)) != Number(end) || Number(end) < Number(start))) {
            errorText = 'Error: End year must be a valid year between 1900 and 2023, and after the start year.';
        } else if ((lang != undefined && lang.trim() != '') && lang.trim().length < 2) {
            errorText = 'Error: Language must be at least two characters.';
        } else if ((numEp != undefined && numEp.trim() != '') && (isNaN(Number(numEp)) || Number(numEp) <= 0 || Math.floor(Number(numEp)) != Number(numEp))) {
            errorText = 'Error: Number of episodes must be greater than 0.';
        } else if ((runtime != undefined && runtime.trim() != '') && (isNaN(Number(runtime)) || Number(runtime) <= 0 || Math.floor(Number(runtime)) != Number(runtime))) {
            errorText = 'Error: Runtime must be greater than 0.';
        } else if (genres == undefined || genres.trim() == '' || genres.trim().length < 2) {
            errorText = 'Error: Genres must be at least two characters.';
        } else if (summary == undefined || summary.trim() == '' || summary.trim().length < 20 || summary.trim().length > 500) {
            errorText = 'Error: Summary must be between 20 and 500 characters.';
        }
        if (errorText != '') {
            addShowErrorMessage.textContent = errorText;
            addShowErrorMessage.style.display = 'block';
            addShowErrorMessage.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        const result = await addManualShow(name, img, start, end, lang, numEp, runtime, summary, genres);
        if (result.ok) {
            const show = await result.json();
            window.location.href = 'http://localhost:3000/shows/view/' + show.show._id;
        } else {
            addShowErrorMessage.textContent = 'Error: could not add show to database.';
            addShowErrorMessage.style.display = 'block';
            addShowErrorMessage.scrollIntoView({ behavior: 'smooth' });
        }
    } catch (e) {
        addShowErrorMessage.textContent = e;
        addShowErrorMessage.style.display = 'block';
        addShowErrorMessage.scrollIntoView({ behavior: 'smooth' });
    }
})

/* Requests a show to be added to the database */
const addShow = async(showId) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    };
    const result = await fetch('http://localhost:3000/shows/add/' + showId, requestOptions);
    if (result.ok) {
        const show = await result.json();
        window.location.href = 'http://localhost:3000/shows/view/' + show.show._id;
    } else {
        fullAddError.textContent = 'Error: could not add show to database: ' + result.statusText;
        fullAddError.style.display = 'block';
        fullAddError.scrollIntoView({ behavior: 'smooth' });
    }
};

/* Sends pre-validated show data to the database */
const addManualShow = async(name, image, start, end, lang, numEpisodes, runtime, summary, genres) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            img: image,
            start: start,
            end: end,
            language: lang,
            numEpisodes: numEpisodes,
            runtime: runtime,
            summary: summary,
            genres: genres
        })
    };
    return fetch('http://localhost:3000/shows/addManual', requestOptions);
};

/* Opens the add show confirmation modal */
const openModal = (showId) => {
    modalBk.style.display = 'block';
    addBtn.setAttribute('onclick', "addShow('" + showId + "')");
    closeBtn.setAttribute('onclick', "closeModal()")
    modalBk.setAttribute('onclick', "closeModal()")
}

/* Opens the manual form for adding a show */
const openManualAdd = () => {
    manualBk.style.display = 'block';
    clickToClose.style.display = 'block';
    clickToClose.setAttribute('onclick', "closeManual()")
}

/* Closes the add show confirmation modal */
const closeModal = () => {
    modalBk.style.display = 'none';
}

/* Closes the manual form for adding a show */
const closeManual = () => {
    manualBk.style.display = 'none';
    clickToClose.style.display = 'none';

}