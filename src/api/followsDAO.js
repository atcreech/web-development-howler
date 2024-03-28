let follows = require('../data/follows.json');
let followsArray = Object.values(follows);

module.exports = {
    getFollowsByUser: (currentUser) => {
        return new Promise((resolve, reject) => {
            let userId = currentUser.id;

            followsArray.forEach(user => {  // For each user that has followers
                if (userId === user.userId) {
                    resolve(user.following);  // Return the list of followers for the user
                }
            });
            reject();
        });
    },
    addFollowing: (currentUser, otherUserIdString) => {
        return new Promise((resolve, reject) => {
            let currentId = currentUser.id;
            let otherUserId = +otherUserIdString;

            followsArray.forEach(user => {  // For each user that has followers
                if (currentId === user.userId) {
                    user.following.forEach(followId => {  // For each user in the list of followers
                        if (followId === otherUserId) {
                            reject();
                        }
                    });
                    user.following.push(otherUserId);  // Add the other user to the list of followers for the current user
                    resolve(currentUser);
                }
            });
            reject();
        });
    },
    removeFollowing: (currentUser, otherUserId) => {
        return new Promise((resolve, reject) => {
            let currentId = currentUser.id;
            let otherId = +otherUserId;

            followsArray.forEach(user => {  // For each user that has followers
                if (currentId === user.userId) {
                    user.following.forEach(followId => {  // For each user in the list of followers
                        if (followId === otherId) {
                            user.following.splice(user.following.indexOf(followId), 1);  // Remove the other user from the list of followers for the current user

                            resolve(currentUser);
                        }
                    });
                    reject();
                }
            });
            reject();
        });
    }
};