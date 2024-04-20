
/* const CURRENT_LINK = window.innerWidth < 710 ?'http://192.168.0.15:3000' : 'http://localhost:3000'; */
import { Input, UserSign } from "../types";
import { Api } from "./api";

//const CURRENT_LINK = process.env.NODE_ENV !== 'development' ? 'https://api.zatzoid-projects.ru' : 'http://localhost:3000';
const CURRENT_LINK = 'http://localhost:3000'


interface options {
    link: string
}

class userAPI extends Api{
    private _link: string;
    private _headers: { 'Content-Type': string; };
    constructor(options: options) {
        super()
        this._link = options.link;
        this._headers = { 'Content-Type': 'application/json' }
    }
    


    getUserMe() {
        return fetch(`${this._link}/user-me`, {
            method: 'GET',
            headers: this._headers,
            credentials: 'include'
        })
            .then(this._checkError)
            .catch(this._errorHandler)


    }


    signUp(data: UserSign) {
        const { name, email, password } = data;
        return fetch(`${this._link}/sign-up`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({ name, email, password }),
            credentials: 'include'
        })
            .then(this._checkError)
            .catch(this._errorHandler)
    }
    signIn(data: UserSign) {

        const { email, password } = data;
        return fetch(`${this._link}/sign-in`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        })
            .then(this._checkError)
            .catch(this._errorHandler)
    }
    signOut() {
        return fetch(`${this._link}/sign-out`, {
            method: 'POST',
            headers: this._headers,
            credentials: 'include'
        })
            .then(this._checkError)
            .catch(this._errorHandler)
    }



    changeProfile(data: Input) {
        const { email, name } = data
        return fetch(`${this._link}/user-me`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({ email, name }),
            credentials: 'include'
        })
            .then(this._checkError)
            .catch(this._errorHandler)
    }
    deleteUserMe(email: string) {
        return fetch(`${this._link}/user-me`, {
            method: 'DELETE',
            headers: this._headers,
            body: JSON.stringify({ email }),
            credentials: 'include'
        })
            .then(this._checkError)
            .catch(this._errorHandler)
    }
}

export const userApi = new userAPI({
    link: CURRENT_LINK
})