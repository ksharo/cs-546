const editForm = document.getElementById('editForm');
const firstNameInput = document.getElementById('editFirstName');
const lastNameInput = document.getElementById('editLastName');
const screenNameInput = document.getElementById('editScreenName');
const imgBox = document.getElementById('chosenImg') ? document.getElementById('chosenImg') : document.getElementById('hiddenImg');
const emptyPicBox = document.getElementById('noPic');
const errorMessage = document.getElementById('editError');

let img = null;
/*
 * Checks a given variable (str) with name (name) to see if it is valid according
 * to the following rules: 1. It must exist; 2. If strict=true, it must be alphanumeric
 * 3. It must be a string; 4. It must be at least the minimum length; 5. It must not contain any spaces
 */
function checkString(str, name = 'string', strict = false, minLen = 1) {
    try {
        // check if the variable exists
        if (str == undefined) throw `Expected ${name} parameter, but received nothing.`;
        // make sure that it is a string
        if (typeof(str) != 'string') throw `Expected ${name} to be a string, but received ${typeof(str)} instead.`;
        // check if there are spaces in the variable
        if (str.indexOf(' ') != -1) throw `${name} cannot contain any spaces.`;
        // make sure the variable is at least minimum length
        if (str.trim().length < minLen) throw `Expected ${name} to be at least ${minLen} ${minLen==1 ? 'character' : 'characters'}`;
        // if strict, check for only alphanumeric characters
        if (strict) {
            const alphanum = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            for (let x of str) {
                if (!alphanum.includes(x.toLowerCase())) throw `Expected ${name} to be alphanumeric, but found ${x}.`;
            }
        }
    } catch (e) {
        throw e;
    }
}

editForm.addEventListener('submit', async(event) => {
    errorMessage.style.display = 'none';
    event.preventDefault();
    try {
        /* error check variables */
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const screenName = screenNameInput.value.trim();
        checkString(firstName, 'First Name', true, 1);
        checkString(lastName, 'Last Name', true, 1);
        checkString(screenName, 'Screen Name', true, 6);
        let result = await saveChanges(firstName, lastName, screenName, img);
        if (result.ok) {
            /* refresh page to go to link */
            window.location.href = 'http://localhost:3000/account/edit';
            return;
        } else {
            const json = await result.json();
            errorMessage.textContent = `${json.errorMessage}  (status code: ${json.errorStatus})`;
            errorMessage.style.display = 'block';
        }

    } catch (e) {
        errorMessage.textContent = e;
        errorMessage.style.display = 'block';
    }
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
    if (emptyPicBox && emptyPicBox.style.display != 'none') {
        imgBox.style.display = 'block';
        emptyPicBox.style.display = 'none';
    }
    img = link;
    imgBox.src = link;
}

const userHome = (event) => {
    event.preventDefault();
    window.location.href = 'http://localhost:3000/account/view';
}

/* Sends pre-validated data to the database */
const saveChanges = async(firstName, lastName, screenName, img) => {
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