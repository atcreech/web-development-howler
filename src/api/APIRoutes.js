const express = require('express');
const cookieParser = require('cookie-parser');
const apiRouter = express.Router();

apiRouter.use(cookieParser());
apiRouter.use(express.json());

const {SessionMiddleware, startSession, endSession} = require('../middleware/SessionMiddleware');

let followsDAO = require('./followsDAO');
let howlsDAO = require('./howlsDAO');
let usersDAO = require('./usersDAO');

// Authenticate a user
apiRouter.post('/users/login', (req, res) => {
    if (req.body.username) {
        usersDAO.getUserByName(req.body.username).then(user => {
            let output = {
                user: user
            }

            startSession(req, res, user);

            res.json(output);
        }).catch(err => {
            res.status(err.code).json({error: 'Not Authenticated'});
        });
    } else {
        res.status(401).json({error: 'Not Authenticated'});
    }
});

// Log out
apiRouter.post('/users/logout', (req, res) => {
    endSession(req, res);
    res.json({success: true});
});

// Get currently authenticated user's object
apiRouter.get('/users/current', SessionMiddleware, (req, res) => {
    res.json(req.session.user);
});

// Create a new howl
apiRouter.post('/howls', SessionMiddleware, (req, res) => {
    let newHowl = req.body;
    howlsDAO.createHowl(newHowl).then(howl => {
        res.json(howl);
    }).catch(err => {
        res.status(500).json({error: 'Internal Server Error'});
    });
});

// Get howls posted by a specific user
apiRouter.get('/users/:userId/howls', SessionMiddleware, (req, res) => {
    const userId = req.params.userId;
    howlsDAO.getHowlsByUser(userId).then(howls => {
        res.json(howls);
    }).catch(err => {
        res.status(500).json({error: 'Internal Server Error'});
    });
});

// Get howls posted by all users followed by the authenticated user
apiRouter.get('/users/current/following/howls', SessionMiddleware, (req, res) => {
    let currentUser = req.session.user;
    let followedHowls = [];
    followsDAO.getFollowsByUser(currentUser).then(async followed => {
        followed.forEach(user => {
            followedHowls.push(
                howlsDAO.getHowlsByUser(user).then(howls => {
                    return howls;
                }).catch(err => {
                    res.status(500).json({error: 'Internal Server Error'});
                })
            );
        });
        followedHowls = await Promise.all(followedHowls);
        res.json(followedHowls);
    }).catch(err => {
        res.status(500).json({error: 'Internal Server Error'});
    });
});

// Get a specific user's object
apiRouter.get('/users/:userId', SessionMiddleware, (req, res) => {
    const userId = req.params.userId;
    usersDAO.getUserById(userId).then(user => {
        let output = {
            user: user
        }

        res.json(output);
    }).catch(err => {
        res.status(404).json({error: 'User Not Found'});
    });
});

// Get a user by username
apiRouter.get('/user-by-name/:username', SessionMiddleware, (req, res) => {
    usersDAO.getUserByName(req.params.username).then(user => {
        let output = {
            user: user
        }

        res.json(output);
    }).catch(err => {
        res.status(404).json({error: 'User Not Found'});
    });
});

// Get a list of users followed by a specific user
apiRouter.get('/users/:userId/following', SessionMiddleware, (req, res) => {
    const userId = req.params.userId;
    usersDAO.getUserById(userId).then(user => {
        followsDAO.getFollowsByUser(user).then(followed => {
            let output = {
                user: user,
                following: followed
            }
            res.json(output);
        }).catch(err => {
            res.status(500).json({error: 'Internal Server Error'});
        });
    }).catch(err => {
        res.status(500).json({error: 'Internal Server Error'});
    });
});

// Follow a user
apiRouter.post('/users/current/following', SessionMiddleware, (req, res) => {
    let currentUser = req.session.user;
    let otherUser = req.body.userId;
    followsDAO.addFollowing(currentUser, otherUser).then(user => {
        let output = {
            user: user
        }
        res.json(output);
    }).catch(err => {
        res.status(500).json({error: 'Internal Server Error'});
    });
});

// Unfollow a user
apiRouter.delete('/users/current/following/:userId', SessionMiddleware, (req, res) => {
    let currentUser = req.session.user;
    let otherUser = req.params.userId;
    followsDAO.removeFollowing(currentUser, otherUser).then(user => {
        let output = {
            user: user
        }
        res.json(output);
    }).catch(err => {
        res.status(500).json({error: 'Internal Server Error'});
    });
});

module.exports = apiRouter;