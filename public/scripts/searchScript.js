const newsearchForm = document.getElementById('newSearch');
const smallsearchinput = document.getElementById('smallSearch');
const addSearch = document.getElementById('addSearch');

if (newsearchForm) {
    newsearchForm.addEventListener('submit', async(event) => {
        event.preventDefault();
        errorMessage.style.display = 'none';
        const searchTerm = smallsearchinput.value.trim();
        if (searchTerm == '') {
            errorMessage.textContent = 'Please enter a search term into the field';
            errorMessage.style.display = 'block';
        } else {
            window.location.href = 'http://localhost:3000/shows/search/' + searchTerm;
        }
    })
}

if (addSearch) {
    addSearch.addEventListener('submit', async(event) => {
        event.preventDefault();
        errorMessage.style.display = 'none';
        const searchTerm = smallsearchinput.value.trim();
        if (searchTerm == '') {
            errorMessage.textContent = 'Please enter a search term into the field';
            errorMessage.style.display = 'block';
        } else {
            window.location.href = 'http://localhost:3000/shows/search/' + searchTerm;
        }
    })
}