let users = require('../data/users.json');
let userArray = Object.values(users);

module.exports = {
    getUserByName: (username) => {
        return new Promise((resolve, reject) => {
            userArray.forEach(user => {  // For every user
                if (user.username === username) {  // Check for matching usernames
                    resolve(user);
                }
            });

            reject();
        });
    },
    getUserById: (userId) => {
        return new Promise((resolve, reject) => {
            userIdConverted = +userId;

            userArray.forEach(user => {  // For every user
                if (user.id === userIdConverted) {  // Check for matching user id
                    resolve(user);
                }
            });

            reject();
        });
    }
};