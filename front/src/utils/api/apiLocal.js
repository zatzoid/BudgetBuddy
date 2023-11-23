/* const CURRENT_LINK = 'http://localhost:3000'; */
const CURRENT_LINK = 'https://api.zatzoid-projects.ru';
/* const CURRENT_LINK = window.innerWidth < 710 ?'http://192.168.0.15:3000' : 'http://localhost:3000'; */

class localPostAPI {
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
    getLocalPosts() {
        return fetch(`${this._link}/local-posts`, {
            method: 'GET',
            headers: this._headers,
            credentials: 'include'
        })
            .then(this._checkError)
    };
    createLocalPost(data) {
        const { choisenMonth, choisenYear } = data;
        return fetch(`${this._link}/local-posts`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({ choisenMonth, choisenYear }),
            credentials: 'include'
        })
            .then(this._checkError)
    };
    putCashDataLocalPost(data) {
        const { cashData, postId } = data;
        return fetch(`${this._link}/local-posts/${postId}`, {
            method: 'PUT',
            headers: this._headers,
            body: JSON.stringify({ cashData }),
            credentials: 'include'
        })
            .then(this._checkError)
    };
    deleteCashDataLocalPost(data) {
        const { cashData, postId } = data;
        return fetch(`${this._link}/local-posts/${postId}`, {
            method: 'DELETE',
            headers: this._headers,
            body: JSON.stringify({ cashData }),
            credentials: 'include'
        })
        .then(this._checkError)
    };
    mailReminder(data) {
        return fetch(`${this._link}/local-posts/remind`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({ data }),
            credentials: 'include'
        })
            .then(this._checkError)
    };
    patchLPCashData(data) {
        const { postId } = data.cashData.profit ?? data.cashData.lose;
        return fetch(`${this._link}/local-posts/${postId}`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({ data }),
            credentials: 'include'
        })
            .then(this._checkError)
    }

};

export const localPostApi = new localPostAPI({
    link: CURRENT_LINK,
    headers: { 'Content-Type': 'application/json' },
})