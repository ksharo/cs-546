/* TODO: 
 * add form handler and error checking for search form
 * */

/* Note: form handler was added to headerscript */

/* search form */

const newsearchForm = document.getElementById('newSearch');
const smallsearchinput = document.getElementById('smallSearch');
const addSearch = document.getElementById('addSearch');
 
    if(newsearchForm){
        newsearchForm.addEventListener('submit', async(event) => {
            event.preventDefault();
            const searchTerm = smallsearchinput.value.trim();
            if (searchTerm == '') {
                //TODO
                errorMessage.textContent = 'Please enter a show into the field';
                errorMessage.style.display = 'block';
            } else {
                window.location.href = 'http://localhost:3000/shows/search/' + searchTerm;
            }
        })
    }
    
    if(addSearch){
        addSearch.addEventListener('submit', async(event) => {
            event.preventDefault();
            const searchTerm = smallsearchinput.value.trim();
            if (searchTerm == '') {
                //TODO
                errorMessage.textContent = 'Please enter a show into the field';
                errorMessage.style.display = 'block';
            } else {
                window.location.href = 'http://localhost:3000/shows/search/' + searchTerm;
            }
        })
    }