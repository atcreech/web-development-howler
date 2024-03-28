import RequestClient from './RequestClient.js';

const logIn = (username) => {
    return RequestClient.post('/api/users/login', {username: username});
};

const logOut = () => {
    return RequestClient.post('/api/users/logout');
}

const getCurrentUser = () => {
    return RequestClient.get('/api/users/current');
};

const createHowl = (userId, datetime, text) => {
    return RequestClient.post('/api/howls', {userId: userId, datetime: datetime, text: text});
};

const getHowlsByUser = (userId) => {
    return RequestClient.get(`/api/users/${userId}/howls`);
};

const getHowlsByFollow = () => {
    return RequestClient.get('/api/users/current/following/howls');
};

const getUserById = (userId) => {
    return RequestClient.get(`/api/users/${userId}`);
};

const getUserByName = (username) => {
    return RequestClient.get(`/api/user-by-name/${username}`);
}

const getFollowsById = (userId) => {
    return RequestClient.get(`/api/users/${userId}/following`);
};

const followUser = (otherUserId) => {
    return RequestClient.post(`/api/users/current/following`, {userId: otherUserId});
};

const unfollowUser = (otherUserId) => {
    return RequestClient.delete(`/api/users/current/following/${otherUserId}`);
}

export default {
    logIn,
    logOut,
    getCurrentUser,
    createHowl,
    getHowlsByUser,
    getHowlsByFollow,
    getUserById,
    getUserByName,
    getFollowsById,
    followUser,
    unfollowUser
};