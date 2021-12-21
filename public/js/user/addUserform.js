/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable no-undef */

const toastify = Toastify({
    text: 'user is add successfully',
    duration: 3000,
});

const form = document.querySelector('#add__user_form');

// eslint-disable-next-line prefer-arrow-callback
form.onsubmit = async function (event) {
    event.preventDefault();
    const errorPlaceHolders = document.querySelectorAll('p.error');
    for (let i = 0; i < errorPlaceHolders.length; i++) {
        errorPlaceHolders[i].classList.remove('show');
    }

    // prepare the form data
    const formData = await new FormData(form);

    // send the request to the server

    const response = await fetch('/user', {
        method: 'POST',
        body: formData,
    });

    // get response
    const result = await response.json();
    // handle errors
    if (result.error) {
        // error
        Object.keys(result.error).forEach((fieldName) => {
            // select all <p class="error"></p>
            console.log(fieldName);
            const errorPlaceHolder = document.querySelector(`.${fieldName}-error`);
            // show all error p tag
            errorPlaceHolder.classList.add('show');
            errorPlaceHolder.textContent = result.error[fieldName].msg;
        });
    } else {
        // success
        toastify.showToast();
        addUserHide();

        document.querySelector('p.error').classList.remove('show');

        // reload page after 1 second
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
};
