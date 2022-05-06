const noShows = document.getElementById('no-shows-found');

function live() {
    if (noShows) {
        noShows.style.display = 'hidden';
    }
    let cards = document.querySelectorAll('.card')
    let search_query = document.getElementById("searchbox").value;
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].getElementsByTagName('div')[0].getElementsByTagName('h3')[0].innerText.toLowerCase().includes(search_query.toLowerCase()) || cards[i].getElementsByTagName('div')[0].getElementsByTagName('p')[0].innerText.toLowerCase().includes(search_query.toLowerCase())) {
            cards[i].classList.remove("is-hidden");
        } else {
            cards[i].classList.add("is-hidden");
        }
    }
    if (cards.length == document.getElementsByClassName('is-hidden').length) {
        if (noShows) {
            noShows.style.display = 'block';
        }
    }
}