const deleteBtns = document.getElementsByClassName("deleteReviewBtn");
const updateBtns = document.getElementsByClassName('updateReviewBtn');

for (let btn of deleteBtns) {
    btn.addEventListener('click', async(event) => {
        const reviewId = event.target.id.split('deleteReview_')[1];
        if (reviewId.trim() == '') {
            // TODO show error
            return;
        }
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        };
        const result = await fetch('http://localhost:3000/review/delete/' + reviewId, requestOptions);
        if (result.ok) {
            // reload for change to take effect on screen
            window.location.reload();
        } else {
            // TODO show error
            return;
        }
    });
}

window.onload = function() {
    const updateReview = async(content, show) => {
        const requestOptions = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                review: content,
                id: show,
                anonymous: false // TODO fix anon
            })
        };
        return fetch('http://localhost:3000/review/update', requestOptions);
    };
    for (let i = 0; i < updateBtns.length; i++) {
        updateBtns[i].addEventListener("click", async(event) => {
            let review = document.getElementById("review_" + event.target.id);
            let updatedContent = review.value.trim();
            if (updatedContent == "") {
                return;
            }
            try {
                let result = await updateReview(updatedContent, event.target.id);
                return result;
            } catch (e) {
                throw (e);
            }
        });
    }
}