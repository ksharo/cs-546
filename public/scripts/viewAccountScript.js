// var buttons = document.querySelectorAll(".btn").length;
window.onload = function() {
    const updateReview = async(content, show) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                review: content,
                id: show
            })
        };
        return fetch('http://localhost:3000/review/update', requestOptions);
    };
    var buttons = document.getElementsByTagName('button');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", async(event) => {
            let review = document.getElementById("review_"+event.target.id);
            let updatedContent = review.value.trim();
            if(updatedContent == ""){
                return;
            }
            try{
                let result = await updateReview(updatedContent, event.target.id);
                return result;    
            }catch(e){
                throw(e);
            }
        });
    }
}

