const editForm = document.getElementById('editForm');
const firstNameInput = document.getElementById('editFirstName');
const lastNameInput = document.getElementById('editLastName');
const screenNameInput = document.getElementById('editScreenName');
const imgBox = document.getElementById('chosenImg');

let img = null;

editForm.addEventListener('submit', async(event) => {
    event.preventDefault();
    await saveChanges(firstNameInput.value, lastNameInput.value, screenNameInput.value, img);
    window.location.href = 'http://localhost:3000/account/edit';
});


/* Turns edit mode on so that users can change their profile */
const editOn = () => {
    const editables = document.getElementsByClassName('editable');
    const uneditables = document.getElementsByClassName('uneditable');
    for (let i = 0; i < uneditables.length; i++) {
        uneditables[i].style.display = 'none';
    }
    for (let i = 0; i < editables.length; i++) {
        editables[i].style.display = 'flex';
        editables[i].classList.add('verticalFlex');
        if (i === 0) {
            editables[i].focus();
        }
    }
};

/* grabs the url for the file */
const imgChosen = (event, link) => {
    event.preventDefault();
    img = link;
    imgBox.src = link;
}

const userHome = (event) => {
    event.preventDefault();
    window.location.href = 'http://localhost:3000/account/view';
}

/* Checks the data to make sure it is valid and then sends it to the database */
const saveChanges = async(firstName, lastName, screenName, img) => {
    /* TODO: check for validity of variables */
    const requestOptions = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            editFirstName: firstName,
            editLastName: lastName,
            editScreenName: screenName,
            editImg: img ? img : ''
        })
    };
    return fetch('http://localhost:3000/account/edit', requestOptions);
};