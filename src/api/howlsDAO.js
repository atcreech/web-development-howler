let howls = require('../data/howls.json');
let howlsArray = Object.values(howls);

module.exports = {
    createHowl: (newHowl) => {
        return new Promise((resolve, reject) => {
            try {
                if (!newHowl.id) {  // Howl does not already have an id
                    newHowl.id = howlsArray.length + 1;
                }
                howlsArray.push(newHowl);  // Add howl
                resolve(newHowl);
            } catch(err) {
                reject(err);
            }
        });
    },
    getHowlsByUser: (userId) => {
        return new Promise((resolve, reject) => {
            let userHowls = [];
            userId = +userId;

            howlsArray.forEach(howl => {  // For every howl
                if (howl.userId === userId) {  // Check for matching user id
                    userHowls.push(howl);
                }
            });

            resolve(userHowls);
        });
    }
};