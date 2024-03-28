import api from './APIClient.js';

let userName = document.getElementById('student-name');
let currentAvatar = document.getElementById('current-avatar');
let logoutButton = document.querySelector('#logout-button');
let howlsDiv = document.querySelector('#howls');
let howlText = document.getElementById('howl-text');
let howlButton = document.querySelector('#howl-button');

// Ensure user is logged in
api.getCurrentUser().then(user => {
    userName.innerText = '@' + user.username;
    userName.addEventListener('click', e => {  // Links to account page
        document.location = './' + user.username;
    });
    currentAvatar.src = user.avatar;
    logoutButton.addEventListener('click', async e => {  // Log out, then redirect to login page
        await api.logOut();
        document.location = './login';
    });
}).catch(error => {  // Not logged in
    if (error.status === 401) {
        document.location = './login';
    }
});

// Compares howls in reverse chronological order
function compareHowls(a, b) {
    let aDate = new Date(a.datetime);
    let bDate = new Date(b.datetime);

    if (aDate > bDate) {
        return -1;
    } else if (aDate < bDate) {
        return 1;
    } else {
        return 0;
    }
};

// Retrieves all howls posted by accounts followed by the current user
api.getHowlsByFollow().then( async howls => {
    let howlArray = [];
    howls.forEach(user => {
        user.forEach(howl => {
            howlArray.push(howl);
        });
    });
    await api.getCurrentUser().then(async user => {  // Retrieves the current user's own howls to add to the list of howls
        await api.getHowlsByUser(user.id).then(howlList => {
            howlList.forEach(howl => {
                howlArray.push(howl);
            });
        });
    });
    howlArray.sort(compareHowls);  // Sort the howls
    howlArray.forEach(howl => {
        let newCard = document.createElement('div');
        newCard.classList.add('card', 'howlCard');

        let cardBody = document.createElement('div');
        cardBody.classList.add('d-flex', 'flex-column', 'card-body');

        let howlHeader = document.createElement('div');
        howlHeader.classList.add('d-flex', 'howl-header', 'align-items-center');

        // Account image
        let howlAvatar = document.createElement('img');
        howlAvatar.classList.add('user-avatar');
        async function getAvatar() {
            howlAvatar.src = await api.getUserById(howl.userId).then(user => {
                return user.user.avatar;
            });
        };
        getAvatar();

        let userFirstName = document.createElement('p');
        let userLastName = document.createElement('p');
        let userTag = document.createElement('p');
        userFirstName.classList.add('user-first-name');
        userLastName.classList.add('user-last-name');
        userTag.classList.add('user-tag');
        async function getUserName() {
            await api.getUserById(howl.userId).then(user => {
                userTag.innerText = '@' + user.user.username;
                userTag.addEventListener('click', e => {  // Links to account page
                    document.location = './' + user.user.username;
                });
                userFirstName.innerText = user.user.first_name;
                userLastName.innerText = user.user.last_name;
            });
        };
        getUserName();

        // Configure howl date based on retrieved datetime
        let howlDate = document.createElement('p');
        howlDate.classList.add('howl-date');
        let newDate = new Date(howl.datetime);
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        howlDate.innerText = months[newDate.getMonth()];
        howlDate.innerText += ' ' + newDate.getDate() + ' ' + newDate.getFullYear() + ', ';
        let hour = newDate.getHours();
        let suffix = 'AM';
        if (hour === 0) {
            hour = 12;
        } else if (hour >= 12) {
            suffix = 'PM';
            if (hour > 12) {
                hour -= 12;
            }
        }
        howlDate.innerText += hour + ':';
        if (newDate.getMinutes() < 10) {
            howlDate.innerText += '0';
        }
        howlDate.innerText += newDate.getMinutes() + ' ' + suffix;

        // Howl text
        let howlText = document.createElement('p');
        howlText.innerText = howl.text;

        howlHeader.appendChild(howlAvatar);
        howlHeader.appendChild(userFirstName);
        howlHeader.appendChild(userLastName);
        howlHeader.appendChild(userTag);
        howlHeader.appendChild(howlDate);
        cardBody.appendChild(howlHeader);
        cardBody.appendChild(howlText);
        newCard.appendChild(cardBody);
        howlsDiv.appendChild(newCard);
    });
});

// Configure button to post a new howl
howlButton.addEventListener('click', async e => {
    let userId;
    let datetime;
    let text;

    await api.getCurrentUser().then(user => {  // Get current user id
        userId = user.id;
    });

    // Format the current date
    let currentDate = new Date();
    datetime = currentDate.getUTCFullYear() + '-';
    if (currentDate.getUTCMonth() + 1 < 10) {
        datetime += '0';
    }
    datetime += currentDate.getUTCMonth() + 1 + '-';
    if (currentDate.getUTCDate() < 10) {
        datetime += '0';
    }
    datetime += currentDate.getUTCDate() + 'T';
    if (currentDate.getUTCHours() < 10) {
        datetime += '0';
    }
    datetime += currentDate.getUTCHours() + ':';
    if (currentDate.getUTCMinutes() < 10) {
        datetime += '0';
    }
    datetime += currentDate.getUTCMinutes() + ':';
    if (currentDate.getUTCSeconds() < 10) {
        datetime += '0';
    }
    datetime += currentDate.getUTCSeconds() + 'Z';

    // Value in the textarea on the home page
    text = howlText.value;

    if (text) {  // Only creates a howl if text is present
        await api.createHowl(userId, datetime, text).then(howl => {
            let newCard = document.createElement('div');
            newCard.classList.add('card', 'howlCard');

            let cardBody = document.createElement('div');
            cardBody.classList.add('d-flex', 'flex-column', 'card-body');

            let howlHeader = document.createElement('div');
            howlHeader.classList.add('d-flex', 'howl-header', 'align-items-center');

            // Account image
            let howlAvatar = document.createElement('img');
            howlAvatar.classList.add('user-avatar');
            async function getAvatar() {
                howlAvatar.src = await api.getUserById(howl.userId).then(user => {
                    return user.user.avatar;
                });
            };
            getAvatar();

            let userFirstName = document.createElement('p');
            let userLastName = document.createElement('p');
            let userTag = document.createElement('p');
            userFirstName.classList.add('user-first-name');
            userLastName.classList.add('user-last-name');
            userTag.classList.add('user-tag');
            async function getUserName() {
                await api.getUserById(howl.userId).then(user => {
                    userTag.innerText = '@' + user.user.username;
                    userTag.addEventListener('click', e => {  // Links to account page
                        document.location = './' + user.user.username;
                    });
                    userFirstName.innerText = user.user.first_name;
                    userLastName.innerText = user.user.last_name;
                });
            };
            getUserName();

            // Configures howl date based on retrieved datetime
            let howlDate = document.createElement('p');
            howlDate.classList.add('howl-date');
            let newDate = new Date(howl.datetime);
            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            howlDate.innerText = months[newDate.getMonth()];
            howlDate.innerText += ' ' + newDate.getDate() + ' ' + newDate.getFullYear() + ', ';
            let hour = newDate.getHours();
            let suffix = 'AM';
            if (hour === 0) {
                hour = 12;
            } else if (hour >= 12) {
                suffix = 'PM';
                if (hour > 12) {
                    hour -= 12;
                }
            }
            howlDate.innerText += hour + ':';
            if (newDate.getMinutes() < 10) {
                howlDate.innerText += '0';
            }
            howlDate.innerText += newDate.getMinutes() + ' ' + suffix;

            // Howl text
            let howlText = document.createElement('p');
            howlText.innerText = howl.text;

            howlHeader.appendChild(howlAvatar);
            howlHeader.appendChild(userFirstName);
            howlHeader.appendChild(userLastName);
            howlHeader.appendChild(userTag);
            howlHeader.appendChild(howlDate);
            cardBody.appendChild(howlHeader);
            cardBody.appendChild(howlText);
            newCard.appendChild(cardBody);
            howlsDiv.insertBefore(newCard, howlsDiv.firstChild);
        });
    }
});