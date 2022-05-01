const modalBk = document.getElementById('modalBackdrop');
const manualBk = document.getElementById('manualBackdrop');
const clickToClose = document.getElementById('fullCover');
const addBtn = document.getElementById('addShow');
const closeBtn = document.getElementById('dontAdd');

/* form data */
const newShowForm = document.getElementById('newShowForm');
const errorMessage = document.getElementById('hiddenAddShowError');
const nameInput = document.getElementById('showName');
const imgInput = document.getElementById('imgLink');
const startInput = document.getElementById('startYear');
const endInput = document.getElementById('endYear');
const languageInput = document.getElementById('language');
const numEpInput = document.getElementById('numEpisodes');
const runtimeInput = document.getElementById('runtime');
const genresInput = document.getElementById('genres');
const summaryInput = document.getElementById('summary');

/* set up listener on form submission to add new manual show */
newShowForm.addEventListener('submit', async(event) => {
    event.preventDefault();

    try {
        const name = nameInput.value.trim();
        const img = imgInput.value.trim();
        const start = startInput.value.trim();
        const end = endInput.value.trim();
        const lang = languageInput.value.trim();
        const numEp = numEpInput.value.trim();
        const runtime = runtimeInput.value.trim();
        const genres = genresInput.value.trim();
        const summary = summaryInput.value.trim();
        /* Error check all inputs */

        // TODO: error check inputs
        // name should be at least one character
        // image is not required
        // start must be between 1900 and 2023
        // end is not required, but if given must be between 1900 and 2023
        // language must be a string, but is not required
        // number of episodes is not required but should be a number
        // runtime is not required but should be a number
        // genres should be turned into an array separated by commas
        // summary is required and should be a string at least 20 characters long, fewer than 500 characters
        const result = await addManualShow(name, img, start, end, lang, numEp, runtime, summary, genres);
        if (result.ok) {
            const show = await result.json();
            window.location.href = 'http://localhost:3000/shows/view/' + show.show._id;
        }
    } catch (e) {
        // TODO: show error on page
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