(function($) {
    const loginBox = $('#loginSection');
    const loginBtn = $('#loginBtn');
    const loginForm = $('#loginForm')
    const homeLink = $('#homeLink');
    const darkCover = $('#fullCover');
    const closeLoginBtn = $('#closeLoginBtn')
    const loginUsername = $('#username');
    const loginPassword = $('#password');
    const loginError = $('#loginError');
    const loginLink = $('#loginLink');
    const loginIcon = $('#loggedInIcon');
    const loggedInitials = $('#loggedInitials');
    const loggedInMenu = $('#loggedInMenu');
    const loggedOutBox = $('#logBox');
    const loggedInBox = $('#rightLogBox');

    loginForm.on('submit', (event) => {
        event.preventDefault();
        loginError.hide();
        /* check for username and password */
        const uLength = loginUsername.val().trim().length;
        const pLength = loginPassword.val().trim().length;
        let errorTxt = '';
        if (uLength < 6) {
            if (uLength == 0) {
                errorTxt = 'Error: Please provide a username!';
            } else {
                errorTxt = 'Error: Username must be at least 6 characters.';
            }
            loginError.text(errorTxt);
            loginError.show();
            return;
        }
        if (pLength < 6) {
            if (pLength == 0) {
                errorTxt = 'Error: Please provide a password!';
            } else {
                errorTxt = 'Error: Password must be at least 6 characters.';
            }
            loginError.text(errorTxt);
            loginError.show();
            return;
        }


        /* if username and password are provided, attempt to log in */
        let requestConfig = {
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                "username": loginUsername.val().trim(),
                "password": loginPassword.val().trim(),
            }),
            url: '/account/login',
            error: (e) => {
                loginError.text('Error (code ' + e.responseJSON.errorStatus + '): ' + e.responseJSON.errorMessage);
                loginError.show();
                return;
            }
        }
        $.ajax(requestConfig).then(function(responseMessage) {
            if (Number(responseMessage.status) == 200) {
                closeLogin();
                loggedOutBox.hide();
                homeLink.hide();
                loggedInBox.show();
                if (responseMessage.user.img.trim() != '') {
                    loginIcon.attr("src", responseMessage.user.img);
                    loginIcon.attr("alt", responseMessage.user.username + "'s Profile Picture");
                    loginIcon.show();
                } else {
                    loggedInitials.text(responseMessage.user.initials);
                    loggedInitials.show();
                }
                loggedInMenu.show();
                return;
            } else {
                loginError.text('Error (code ' + responseMessage.errorStatus + '): ' + responseMessage.errorMessage);
                loginError.show();
                return;
            }
        });
    });

    loginBtn.on('click', () => {
        openLogin();
    });

    loginLink.on('click', () => {
        openLogin();
    });

    darkCover.on('click', () => {
        closeLogin();
    });

    closeLoginBtn.on('click', () => {
        closeLogin();
    });

    function openLogin() {
        loginBox.show();
        loginError.hide();
        loginBtn.hide();
        darkCover.show();
        homeLink.width(380);
    }

    function closeLogin() {
        darkCover.hide();
        loginError.hide();
        loginBox.hide();
        loginBtn.show();
        homeLink.width(200);
    }

})(window.jQuery);