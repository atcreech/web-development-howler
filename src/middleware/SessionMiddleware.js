const crypto = require('crypto');

const userSessions = {};

const COOKIE_NAME = 'Howler';

exports.SessionMiddleware = (req, res, next) => {
    if(!req.cookies[COOKIE_NAME]) {  // Not logged in
        res.status(401).json({error: 'User Not Authenticated'});
        return;
    } else {
        let sessionId = req.cookies[COOKIE_NAME];
        if(!userSessions[sessionId]) {  // Incorrect session
          this.endSession(req, res);
          res.status(401).json({error: 'User Not Authenticated'});
          return;
        }
        else {  // Logged in correctly
          req.session = userSessions[sessionId]
          next();
        }
    }
}

exports.startSession = (req, res, user) => {
    let newSessionId = generateSessionId();
    let newSessionData = {
        user: user
    }

    res.cookie(COOKIE_NAME, newSessionId, {  // Send a cookie with the session information
        httpOnly: true,
        secure: true,
        maxAge: 10 * 60 * 1000  // Expires after 10 minutes
    });

    userSessions[newSessionId] = newSessionData;
}

exports.endSession = (req, res) => {
    let sessionId = req.cookies[COOKIE_NAME];
    if (sessionId) {
        delete userSessions[sessionId];
    }
    res.cookie(COOKIE_NAME, "", {  // Update the cookie to be blank and expire immediately
        httpOnly: true,
        secure: true,
        maxAge: -10000
    });
}

function generateSessionId() {
    return crypto.randomBytes(256).toString('hex')
}