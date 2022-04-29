/* Requests a show to be added to the database */
const addShow = async(showId) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    };
    return fetch('http://localhost:3000/shows/add/' + showId, requestOptions);
};