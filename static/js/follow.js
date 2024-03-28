import api from './APIClient.js';

let userName = document.getElementById('student-name');
let currentAvatar = document.getElementById('current-avatar');
let logoutButton = document.querySelector('#logout-button');
let howlsDiv = document.querySelector('#howls');
let viewingUserInfo = document.querySelector('#viewing-user-info');
let followList = document.querySelector('#follow-list');
const currentURL = window.location.toString();
let viewingUsername = currentURL.substring(currentURL.lastIndexOf('/') + 1);
let viewingUser;
let currentUser;

// Check to make sure the user is logged in
await api.getCurrentUser().then(user => {
    currentUser = user;
    userName.innerText = '@' + user.username;
    userName.addEventListener('click', e => {  // Send to an account page
        document.location = './' + user.username;
    });
    currentAvatar.src = user.avatar;
    logoutButton.addEventListener('click', async e => {  // Logout then send to login page
        await api.logOut();
        document.location = './login';
    });
}).catch(error => {
    if (error.status === 401) {
        document.location = './login'
    }
});

// Get the account the user is viewing
let getViewingUser = async () => {
    await api.getUserByName(viewingUsername).then(user => {
        viewingUser = user.user;
    });
}
await getViewingUser();

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

// Account page user image
let followAvatar = document.createElement('img');
followAvatar.src = viewingUser.avatar;

// Account page user first and last name
let followName = document.createElement('p');
followName.id = 'follow-name';
followName.innerText = viewingUser.first_name + ' ' + viewingUser.last_name;

// Account page username
let followTag = document.createElement('p');
followTag.id = 'follow-tag'
followTag.innerText = '@' + viewingUser.username;

let followNameTag = document.createElement('div');
followNameTag.classList.add('d-flex', 'flex-column');
followNameTag.appendChild(followName);
followNameTag.appendChild(followTag);

let found = false;

// Determine whether or not the current user follows the user on the page
let findFollow = async () => {
    await api.getFollowsById(currentUser.id).then(object => {
        object.following.forEach(userId => {
            if (userId === viewingUser.id) {
                found = true;
            }
        });
    });
}
await findFollow();

viewingUserInfo.appendChild(followAvatar);
viewingUserInfo.appendChild(followNameTag);

let followButton;

if (found) {  // The user follows the account on the page
    followButton = document.createElement('button');
    followButton.classList.add('btn', 'btn-secondary');
    followButton.innerText = 'Unfollow';
} else if (!found && currentUser.id != viewingUser.id) {  // The user does not follow the account on the page and the account is not the user's account
    followButton = document.createElement('button');
    followButton.classList.add('btn', 'btn-secondary');
    followButton.innerText = 'Follow';
}

if (followButton) {
    followButton.addEventListener('click', e => {
        if (found) {  // Unfollow a followed account
            api.unfollowUser(viewingUser.id);
            followButton.innerText = 'Follow';
            found = false;
        } else {  // Follow an Unfollowed account
            api.followUser(viewingUser.id);
            followButton.innerText = 'Unfollow';
            found = true;
        }
    });
    viewingUserInfo.appendChild(followButton);
}

let followCard = document.createElement('div');
followCard.classList.add('card', 'howlCard');

let followCardBody = document.createElement('div');
followCardBody.classList.add('d-flex', 'flex-column', 'card-body');

let followHeader = document.createElement('div');
followHeader.classList.add('d-flex', 'follow-header');

let followTitle = document.createElement('h5');
followTitle.classList.add('follow-title');
followTitle.innerText = 'Follows:';

let followExpand = document.createElement('h3');
let expanded = false;
followExpand.id = 'follow-expand';
followExpand.innerText = '+';
followExpand.addEventListener('click', e => {
    if (expanded) {  // All followed accounts shown
        expanded = false;
        followExpand.innerText = '+';
        let followChildren = follows.children;
        for (let i = 1; i < followChildren.length; i++) {  // Only show first followed account
            console.log(followChildren[i]);
            followChildren[i].classList.remove('d-flex');
            followChildren[i].style.display = 'none';
        }
    } else {  // Only first followed account shown
        expanded = true;
        followExpand.innerText = '-';
        let followChildren = follows.children;
        for (let i = 1; i < followChildren.length; i++) {  // Show all followed accounts
            console.log(followChildren[i]);
            followChildren[i].classList.add('d-flex');
            followChildren[i].attributes.removeNamedItem('style');
        }
    }
});

let follows = document.createElement('div');
follows.classList.add('d-flex', 'flex-column');

followHeader.appendChild(followTitle);
followHeader.appendChild(followExpand);
followCardBody.appendChild(followHeader);
api.getFollowsById(viewingUser.id).then(object => {  // Get the account's followed accounts
    let count = 0;
    object.following.forEach(userId => {  // For each followed account
        api.getUserById(userId).then(user => {  // Get each account
            let followedUser = document.createElement('div');
            followedUser.classList.add('d-flex', 'align-items-center', 'followed-user');

            // Account image
            let followedUserAvatar = document.createElement('img');
            followedUserAvatar.src = user.user.avatar;
            followedUserAvatar.classList.add('followed-user-avatar')

            // Account first and last name
            let followedUserName = document.createElement('p');
            followedUserName.innerText = user.user.first_name + ' ' + user.user.last_name;
            followedUserName.classList.add('followed-user-name');

            // Account username
            let followedUserTag = document.createElement('p');
            followedUserTag.innerText = '@' + user.user.username;
            followedUserTag.classList.add('followed-user-tag');
            followedUserTag.addEventListener('click', e => {
                document.location = './' + user.user.username;
            });

            if (count !== 0) {  // If it is not the first account listed
                followedUser.classList.remove('d-flex');
                followedUser.style.display = 'none';
            }

            followedUser.appendChild(followedUserAvatar);
            followedUser.appendChild(followedUserName);
            followedUser.appendChild(followedUserTag);
            follows.appendChild(followedUser);
            
            count++;
        });
    });
});
followCardBody.appendChild(follows);
followCard.appendChild(followCardBody);
followList.appendChild(followCard);

api.getHowlsByUser(viewingUser.id).then( async howls => {  // Get the howls authored by the viewed account
    let howlArray = [];
    howls.forEach(howl => {
        howlArray.push(howl);
    });
    howlArray.sort(compareHowls);  // Sort the retrieved howls
    howlArray.forEach(howl => {  // Create a card for each howl
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
        async function getUserName() {  // Get username, first name, and last name
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

        // Format date of howl based on retrieved datetime
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