const deleteBtns = document.getElementsByClassName("deleteReviewBtn");
const updateBtns = document.getElementsByClassName('updateReviewBtn');
const editBtns = document.getElementsByClassName('editReviewBtn');
const updateError = document.getElementById('updateReviewsError');
const updateSuccess = document.getElementById('updateReviewsSuccess');


for (let btn of editBtns) {
    btn.addEventListener('click', (event) => {
        /* show the elements in order to update the content of the review */
        updateError.style.display = 'none';
        const reviewId = event.target.id.split('editReview_')[1];
        if (reviewId.trim() == '') {
            updateError.textContent = 'Error: There was a problem editing this review. Please try again later.';
            updateError.style.display = 'block';
            updateError.scrollIntoView({ behavior: 'smooth' });
            return;
        } else {
            const editBox = document.getElementById('review_' + reviewId); // to show
            const updateBtn = document.getElementById('updateReview_' + reviewId); // to show
            const anonLabel = document.getElementById('label_' + reviewId); // to show
            const editBtn = document.getElementById(event.target.id); // to hide
            const uneditable = document.getElementById('uneditable_' + reviewId); // to hide
            if (!editBox || !updateBtn || !editBtn || !uneditable || !anonLabel) {
                updateError.textContent = 'Error: There was a problem editing this review. Please try again later.';
                updateError.style.display = 'block';
                updateError.scrollIntoView({ behavior: 'smooth' });
                return;
            } else {
                editBox.style.display = 'block';
                anonLabel.style.display = 'block';
                updateBtn.style.display = 'inline';
                editBtn.style.display = 'none';
                uneditable.style.display = 'none';
                return;
            }
        }
    })
}

for (let btn of deleteBtns) {
    btn.addEventListener('click', async(event) => {
        updateError.style.display = 'none';
        updateSuccess.style.display = 'none';
        const reviewId = event.target.id.split('deleteReview_')[1];
        if (reviewId.trim() == '') {
            updateError.textContent = 'Error: There was a problem deleting this review. Please try again later.';
            updateError.style.display = 'block';
            updateError.scrollIntoView({ behavior: 'smooth' });
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
            updateSuccess.textContent = 'Review deleted!';
            updateSuccess.style.display = 'block';
            updateSuccess.scrollIntoView({ behavior: 'smooth' });
            const formToHide = document.getElementById('updateForm_' + reviewId);
            // make it appear deleted
            if (formToHide) {
                formToHide.style.display = 'none';
            } else {
                window.location.reload();
            }
            return;
        } else {
            updateError.textContent = 'Error: There was a problem deleting this review. Please try again later.';
            updateError.style.display = 'block';
            updateError.scrollIntoView({ behavior: 'smooth' });
            return;
        }
    });
}

window.onload = function() {
    const updateReview = async(content, reviewId, anonymous) => {
        const requestOptions = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                review: content,
                id: reviewId,
                anonymous: anonymous.toString()
            })
        };
        return fetch('http://localhost:3000/review/update', requestOptions);
    };
    for (let i = 0; i < updateBtns.length; i++) {
        updateBtns[i].addEventListener("click", async(event) => {
            event.preventDefault();
            updateError.style.display = 'none';
            updateSuccess.style.display = 'none';
            const reviewId = event.target.id.split('updateReview_')[1];
            // error check review id
            if (reviewId.trim() == '') {
                updateError.textContent = 'Error: There was a problem updating this review. Please try again later.';
                updateError.style.display = 'block';
                updateError.scrollIntoView({ behavior: 'smooth' });
                return;
            }
            let review = document.getElementById("review_" + reviewId);
            if (!review) {
                updateError.textContent = 'Error: There was a problem updating this review (content not found). Please try again later.';
                updateError.style.display = 'block';
                updateError.scrollIntoView({ behavior: 'smooth' });
                return;
            }
            let updatedContent = review.value.trim();
            // error check updated content
            if (updatedContent == "") {
                updateError.textContent = 'Error: You cannot update your review to be empty! Please consider deleting it instead.';
                updateError.style.display = 'block';
                updateError.scrollIntoView({ behavior: 'smooth' });
                return;
            }
            // error check anonymous checkbox
            const checkbox = document.getElementById('anonymous_' + reviewId);
            let anon = false;
            if (checkbox) {
                anon = checkbox.checked;
                if (anon != true && anon != false) {
                    updateError.textContent = 'Error: There was a problem updating this review (checkbox does not have checked attribute!). Please try again later.';
                    updateError.style.display = 'block';
                    updateError.scrollIntoView({ behavior: 'smooth' });
                    return;
                }
            } else {
                updateError.textContent = 'Error: There was a problem updating this review (checkbox not found!). Please try again later.';
                updateError.style.display = 'block';
                updateError.scrollIntoView({ behavior: 'smooth' });
                return;
            }
            try {
                let result = await updateReview(updatedContent, reviewId, anon);
                if (result.ok) {
                    updateSuccess.textContent = 'Review updated!';
                    updateSuccess.style.display = 'block';
                    updateSuccess.scrollIntoView({ behavior: 'smooth' });
                    const editBox = document.getElementById('review_' + reviewId); // to hide
                    const updateBtn = document.getElementById('updateReview_' + reviewId); // to hide
                    const anonLabel = document.getElementById('label_' + reviewId); // to hide
                    const editBtn = document.getElementById('editReview_' + reviewId); // to show
                    const uneditable = document.getElementById('uneditable_' + reviewId); // to show
                    if (!editBox || !updateBtn || !editBtn || !uneditable || !anonLabel) {
                        // just reload to get the p element back if an element is having problems
                        window.location.reload();
                        return;
                    } else {
                        uneditable.textContent = updatedContent;
                        editBox.style.display = 'none';
                        updateBtn.style.display = 'none';
                        editBtn.style.display = 'inline';
                        uneditable.style.display = 'block';
                        anonLabel.style.display = 'none';
                        return;
                    }
                } else {
                    updateError.textContent = 'Error: There was a problem updating this review. Please try again later.';
                    updateError.style.display = 'block';
                    updateError.scrollIntoView({ behavior: 'smooth' });
                    return;
                }
            } catch (e) {
                updateError.textContent = 'There was a problem updating this review: ' + e;
                updateError.style.display = 'block';
                updateError.scrollIntoView({ behavior: 'smooth' });
                return;
            }
        });
    }
}