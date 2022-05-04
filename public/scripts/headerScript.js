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
    const hiddenIcon = $('#loggedInIconHidden');
    const hiddenInitials = $('#loggedInitialsHidden');
    const hiddenMenu = $('#loggedInMenuHidden');
    const loggedOutBox = $('#logBox');
    const loggedInBox = $('#rightLogBox');
    const profileMenu = $('#smallMenu');
    const hiddenProfileMenu = $('#smallMenuHidden');
    const sideMenu = $('#sideMenu');
    const hiddenSideMenu = $('#sideMenuHidden');

    loginForm.on('submit', (event) => {
        event.preventDefault();
        loginError.hide();
        /* check for username and password */
        const uLength = loginUsername.val().trim().length;
        const pLength = loginPassword.val().trim().length;
        let errorTxt = '';
        if (uLength < 1) {
            if (uLength == 0) {
                errorTxt = 'Error: Please provide a username!';
            } else {
                errorTxt = 'Error: Username must be at least 1 character.';
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
                /* simply reload if page is shows/view to get like/dislike buttons */
                if (window.location.href.includes('/shows/view')) {
                    window.location.reload();
                }
                closeLogin();
                loggedOutBox.hide();
                homeLink.hide();
                loggedInBox.show();
                if (responseMessage.user.img.trim() != '') {
                    hiddenIcon.attr("src", responseMessage.user.img);
                    hiddenIcon.attr("alt", responseMessage.user.username + "'s Profile Picture");
                    hiddenIcon.show();
                } else {
                    hiddenInitials.text(responseMessage.user.initials);
                    hiddenInitials.show();
                }
                hiddenMenu.show();
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
        /* hide everything when dark cover is clicked */
        if (profileMenu) {
            profileMenu.hide();
            hiddenProfileMenu.hide();
        } else {
            hiddenProfileMenu.hide();
        }
        if (sideMenu) {
            sideMenu.hide();
            hiddenSideMenu.hide();
        } else {
            hiddenSideMenu.hide();
        }
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

const profileMenu = document.getElementById('smallMenu');
const hiddenProfMenu = document.getElementById('smallMenuHidden');
const sideMenu = document.getElementById('sideMenu');
const hiddenSideMenu = document.getElementById('sideMenuHidden');
const darkCover = document.getElementById('fullCover');
const searchForm = document.getElementById('homeSearch');
const searchInput = document.getElementById('searchTerm');
const errorMessage = document.getElementById('editError');


function showProfileMenu() {
    if (profileMenu) {
        profileMenu.style.display = 'block';
    } else {
        hiddenProfMenu.style.display = 'block';
    }
    darkCover.style.display = 'block';
}

function showSideMenu() {
    if (profileMenu) {
        sideMenu.style.display = 'block';
    } else {
        hiddenSideMenu.style.display = 'block';
    }
    darkCover.style.display = 'block';
}

if (searchForm) {
    searchForm.addEventListener('submit', async(event) => {
        event.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm == '') {
            errorMessage.textContent = 'Please enter a show into the field';
            errorMessage.style.display = 'block';
        } else {
            window.location.href = 'http://localhost:3000/shows/search/' + searchTerm;
        }
    })
}