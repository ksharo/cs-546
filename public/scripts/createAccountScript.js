const newAccountForm = document.getElementById('newAccountForm');
const errorMessage = document.getElementById('hiddenCreateAccountError');
const firstNameInput = document.getElementById('newFirstName');
const lastNameInput = document.getElementById('newLastName');
const emailInput = document.getElementById('newEmail');
const screenNameInput = document.getElementById('newScreenName');
const passwordInput = document.getElementById('newPassword');
const confirmInput = document.getElementById('confirmNewPassword');

newAccountForm.addEventListener('submit', async(event) => {
    errorMessage.style.display = 'none';
    event.preventDefault();
    try {
        /* error check variables */
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const email = emailInput.value.trim();
        const screenName = screenNameInput.value.trim();
        const password = passwordInput.value.trim();
        const confirm = confirmInput.value.trim();
        checkAdvancedString(firstName, 'First Name', 1);
        checkAdvancedString(lastName, 'Last Name', 1);
        checkAdvancedString(email, 'Email', 6, false, false, true);
        checkAdvancedString(screenName, 'Screen Name', 6);
        checkAdvancedString(password, 'Password', 6, false, false, false);
        if (password != confirm) {
            throw `Passwords do not match.`
        }
        let result = await createAccount(firstName, lastName, email, screenName, password, confirm);
        if (result.ok) {
            /* refresh page to go to search page */
            window.location.href = 'http://localhost:3000/shows/search';
            return;
        } else {
            const json = await result.json();
            errorMessage.textContent = `${json.errorMessage}  (status code: ${json.errorStatus})`;
            errorMessage.style.display = 'block';
        }
    } catch (e) {
        console.log(e);
        errorMessage.textContent = e;
        errorMessage.style.display = 'block';
    }
});

function checkAdvancedString(str, name = 'Input', minLength = 1, onlyAlphNum = true, spacesAllowed = false, email = false) {
    /* make sure the string is not empty */
    if (str == undefined || str.trim().length == 0) {
        throw `Error: ${name} cannot be empty.`;
    }
    /* check that the email is valid */
    if (email) {
        if (!validator.isEmail(str)) {
            throw `Error: ${name} must be in email format. Example: john@abc.com`;
        }
    }
    /* make sure the string is at least the required length */
    if (str.trim().length < minLength) {
        throw `Error: ${name} must be at least ${minLength} characters.`;
    }
    /* make sure there are no spaces, if spaces are not allowed */
    if (!spacesAllowed && str.trim().includes(' ')) {
        throw `Error: ${name} cannot contain spaces.`;
    }
    /* make sure there are only numbers and letters */
    if (onlyAlphNum) {
        const alphanum = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        for (let x of str) {
            if (!alphanum.includes(x.toLowerCase())) throw `Error: ${name} can only contain letters and numbers.`;
        }
    }
    return true;
}

/* Sends pre-validated data to the database */
const createAccount = async(firstName, lastName, email, screenName, password, confirm) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            newFirstName: firstName,
            newLastName: lastName,
            newEmail: email,
            newScreenName: screenName,
            newPassword: password,
            confirmNewPassword: confirm
        })
    };
    return fetch('http://localhost:3000/account/create', requestOptions);
};