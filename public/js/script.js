/* eslint-disable func-names */
/* eslint-disable no-undef */
// nav var toggler
const navToggler = document.querySelector('#navToggler');
const navContainer = document.querySelector('#navContainer');

navToggler.addEventListener('click', function () {
    this.classList.toggle('active');
    navContainer.classList.toggle('active');
    this.parentElement.classList.toggle('position-relative');
});

// log out
const logOut = document.getElementById('logOut');

const logOutTost = Toastify({
    text: 'user is Logout successfully',
    duration: 3000,
});

logOut.addEventListener('click', () => {
    fetch('/', {
        method: 'DELETE',
    });

    logOutTost.showToast();

    setInterval(() => {
        window.location.replace('/');
    }, 1000);
});
