const checkStatus = (res) => {
    if (!res.ok) {
        let error = new Error(res.statusText);
        error.status = res.status;
        throw error;
    }
    return res;
};

export default {
    get: (url) => {
        return fetch(url).then(checkStatus).then(res => {
            return res.json();
        });
    },
    post: (url, data) => {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(checkStatus).then(res => {
            return res.json();
        });
    },
    delete: (url) => {
        return fetch(url, {
            method: 'DELETE'
        }).then(checkStatus).then(res => {
            return res.json();
        });
    }
}