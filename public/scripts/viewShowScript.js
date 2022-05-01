const svgs = document.getElementsByClassName('svgImg');
const tup = document.getElementById('tup');
const likesTxt = document.getElementById('likesTxt');
const tdown = document.getElementById('tdown');
const dislikesTxt = document.getElementById('dislikesTxt');
const watched = document.getElementById('watched');
const watchesTxt = document.getElementById('watchesTxt');

for (let x of svgs) {
    x.addEventListener('click', async(event) => {
        /* TODO: add/remove show to/from user's liked/disliked/watched and add/subdract 1 from show's likes/dislikes/watched count! */
        const originalSrc = event.target.src.split('_');
        let changedLike = 0;
        let changedDislike = 0;
        let changedWatches = 0;
        event.target.src = originalSrc[0] + (originalSrc[1].includes('filled') ? '_outline.svg' : '_filled.svg ');
        const id = event.target.id;
        if (id == 'tup' && !originalSrc[1].includes('filled')) {
            likesTxt.textContent = Number(likesTxt.textContent) + 1;
            changedLike += 1;
            /* Cannot like and dislike at the same time! */
            if (tdown.src.includes('filled')) {
                tdown.src = '/public/assets/tdown_outline.svg';
                dislikesTxt.textContent = Number(dislikesTxt.textContent) - 1;
                changedDislike -= 1;
            }
            /* if they like it, they've seen it! */
            if (watched.src.includes('outline')) {
                watched.src = '/public/assets/check_filled.svg';
                watchesTxt.textContent = Number(watchesTxt.textContent) + 1;
                changedWatches += 1;
            }
        } else if (id == 'tup' && originalSrc[1].includes('filled')) {
            likesTxt.textContent = Number(likesTxt.textContent) - 1;
            changedLike -= 1;
        } else if (id == 'tdown' && !originalSrc[1].includes('filled')) {
            dislikesTxt.textContent = Number(dislikesTxt.textContent) + 1;
            changedDislike += 1;
            /* Cannot like and dislike at the same time! */
            if (tup.src.includes('filled')) {
                tup.src = '/public/assets/tup_outline.svg';
                likesTxt.textContent = Number(likesTxt.textContent) - 1;
                changedLike -= 1;
            }
            tup.src = '/public/assets/tup_outline.svg';
            /* if they don't like it, they've seen it! */
            if (watched.src.includes('outline')) {
                watched.src = '/public/assets/check_filled.svg';
                watchesTxt.textContent = Number(watchesTxt.textContent) + 1;
                changedWatches += 1;
            }
        } else if (id == 'tdown' && originalSrc[1].includes('filled')) {
            dislikesTxt.textContent = Number(dislikesTxt.textContent) - 1;
            changedDislike -= 1;
        } else if (id == 'watched' && !originalSrc[1].includes('filled')) {
            watchesTxt.textContent = Number(watchesTxt.textContent) + 1;
            changedWatches += 1;
        } else if (id == 'watched' && originalSrc[1].includes('filled')) {
            watchesTxt.textContent = Number(watchesTxt.textContent) - 1;
            changedWatches -= 1;
        }

        /* TODO send data to database */
        await updateShowCounts(changedLike, changedDislike, changedWatches);
    })
}

/* Sends data to the database to update the show counts */
const updateShowCounts = async(likes, dislikes, watches) => {
    const showId = window.location.href.split('/view/')[1];
    const requestOptions = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            likes: likes,
            dislikes: dislikes,
            watches: watches
        })
    };
    return fetch('http://localhost:3000/shows/updateShowCounts/' + showId, requestOptions);
};