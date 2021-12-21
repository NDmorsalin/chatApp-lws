const deleteErrTost = Toastify({
    text: ' there is a problem to delete user',
    duration: 3000,
});

const deleteTost = Toastify({
    text: 'user is Delete successfully',
    duration: 3000,
});
async function deleteUser(userId) {
    const response = await fetch(`/user/${userId}`, {
        method: 'DELETE',
    });

    const result = response.json();

    if (result.error) {
        deleteErrTost.showToast();
    } else {
        deleteTost.showToast();
        document.getElementById(`${userId}`).remove();
    }
}


