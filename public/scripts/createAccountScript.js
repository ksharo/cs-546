(function($) {
    const createAccountForm = $('#newAccountForm');
    const createAccountError = $('#createAccountError');
    const firstNameInput = $('#newFirstName');
    const lastNameInput = $('#newLastName');
    const emailInput = $('#newEmail');
    const usernameInput = $('#newScreenName');
    const passwordInput = $('#newPassword');
    const confirmationInput = $('#confirmNewPassword')

    createAccountForm.on('submit', (event) => {
        event.preventDefault();
        createAccountError.hide();
        const firstName = firstNameInput.val();
        const lastName = lastNameInput.val();
        const email = emailInput.val();
        const username = usernameInput.val();
        const password = passwordInput.val();
        const confirmation = confirmationInput.val();
        try {
            checkString(firstName, 'First Name', 1);
            checkString(lastName, 'Last Name', 1);
            checkString(email, 'Email', 10, false, false, true);
            checkString(username, 'Screen Name', 6);
            checkString(password, 'Password', 6, false, false, false);
            checkString(confirmation, 'First Name', 6, false, false, false);
            if (password != confirmation) {
                throw `Error: Passwords don't match.`;
            }
        } catch (e) {
            createAccountError.text(e);
            createAccountError.show();
        }

    });

    function checkString(str, name = 'Input', minLength = 1, onlyAlphNum = true, spacesAllowed = false, email = false) {
        if (str == undefined || str.trim().length == 0) {
            throw `Error: ${name} cannot be empty.`;
        }
        if (email) {
            if (!validator.isEmail(str)) {
                throw `Error: ${name} must be in email format. Example: john@abc.com`;
            }
        }
        if (str.trim().length < minLength) {
            throw `Error: ${name} must be at least ${minLength} characters.`;
        }
        if (!spacesAllowed && str.trim().includes(' ')) {
            throw `Error: ${name} cannot contain spaces.`;
        }
        if (onlyAlphNum) {
            const alphanum = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            for (let x of str) {
                if (!alphanum.includes(x.toLowerCase())) throw `Error: ${name} can only contain letters and numbers.`;
            }
        }
        return true;
    }
})(window.jQuery);