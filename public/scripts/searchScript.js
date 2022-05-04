/* TODO: 
 * add form handler and error checking for search form
 * */

/* search form */
const searchInput = document.getElementById('smallSearch');
const searchForm = document.getElementById('newSearch');

/* set up listener for searching a new term */
searchForm.addEventListener('submit', async(event) => {
    event.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm == '') {
        // TODO show error on page
    } else {
        window.location.href = 'http://localhost:3000/shows/search/' + searchTerm;
    }
})