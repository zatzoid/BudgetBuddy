const CURRENT_LINK = 'http://localhost:3000';

class userAPI {
    constructor(options) {
        this._link = options.link;
        this._headers = options.headers;
    }
    _checkError(res) {
        return res.json()
            .then(data => {
                if (res.ok) {
                    return data;
                } else {
                    return Promise.reject(data);
                }
            });
    }
    signUp(data) {
        const { name, email, password } = data;
        return fetch(`${this._link}/sign-up`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({ name, email, password }),
            credentials: 'include'
        })
            .then(this._checkError)
    };
    signIn(data) {
        const { email, password } = data;
        return fetch(`${this._link}/sign-in`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        })
            .then(this._checkError)
    };
    signOut() {
        return fetch(`${this._link}/sign-out`, {
            method: 'POST',
            headers: this._headers,
            credentials: 'include'
        })
            .then(this._checkError)
    };
    getUserMe() {
        return fetch(`${this._link}/user-me`, {
            method: 'GET',
            headers: this._headers,
            credentials: 'include'
        })
    };
    changeProfile(data) {
        const { email, name } = data
        return fetch(`${this._link}/user-me`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({ email, name }),
            credentials: 'include'
        })
    };
    deleteUserMe() {
        return fetch(`${this._link}/user-me`, {
            method: 'DELETE',
            headers: this._headers,
            credentials: 'include'
        })
    };
};

export const userApi = new userAPI({
    link: CURRENT_LINK,
    headers: { 'Content-Type': 'application/json' },
})