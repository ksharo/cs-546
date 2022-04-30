const modalBk = document.getElementById('modalBackdrop');
const addBtn = document.getElementById('addShow');
const closeBtn = document.getElementById('dontAdd');

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

const openModal = (showId) => {
    modalBk.style.display = 'block';
    addBtn.setAttribute('onclick', "addShow('" + showId + "')");
    closeBtn.setAttribute('onclick', "closeModal()")
    modalBk.setAttribute('onclick', "closeModal()")
}

const closeModal = () => {
    modalBk.style.display = 'none';
}