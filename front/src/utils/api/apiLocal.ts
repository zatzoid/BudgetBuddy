import { CashDataFromClient, CashDataPatch, EmailModalParams } from "../types";
import { Api } from "./api";

//const CURRENT_LINK = process.env.NODE_ENV !== 'development' ? 'https://api.zatzoid-projects.ru' : 'http://localhost:3000';
const CURRENT_LINK = 'http://localhost:3000'

/* const CURRENT_LINK = window.innerWidth < 710 ?'http://192.168.0.15:3000' : 'http://localhost:3000'; */
interface options {
    link: string
}


class localPostAPI extends Api {
    private _link: string;
    private _headers: { 'Content-Type': string; };
    constructor(options: options) {
        super()
        this._link = options.link;
        this._headers = { 'Content-Type': 'application/json' }
    }
   
 
    async getLocalPosts() {
        return fetch(`${this._link}/local-posts`, {
            method: 'GET',
            headers: this._headers,
            credentials: 'include'
        })
            .then(this._checkError)
            .catch(this._errorHandler)
    }
    
    async createLocalPost(data: { choisenMonth: number, choisenYear: number }) {
        const { choisenMonth, choisenYear } = data;
        return fetch(`${this._link}/local-posts`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({ choisenMonth, choisenYear }),
            credentials: 'include'
        })
            .then(this._checkError)
            .catch(this._errorHandler)
    }

    async putCashDataLocalPost(data: CashDataFromClient) {
        console.log('putCshd::', data);
        const { cashData, postId } = data;
        return fetch(`${this._link}/local-posts/${postId}`, {
            method: 'PUT',
            headers: this._headers,
            body: JSON.stringify({ cashData }),
            credentials: 'include'
        })
            .then(this._checkError)
            .catch(this._errorHandler)
    }
    async deleteCashDataLocalPost(data: CashDataPatch) {
        const { postId } = data.cashData.profit || data.cashData.lose
        return fetch(`${this._link}/local-posts/${postId}`, {
            method: 'DELETE',
            headers: this._headers,
            body: JSON.stringify(data),
            credentials: 'include'
        })
            .then(this._checkError)
            .catch(this._errorHandler)
    }
    async mailReminder(data: EmailModalParams) {
        return fetch(`${this._link}/local-posts/remind`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({ data }),
            credentials: 'include'
        })
            .then(this._checkError)
            .catch(this._errorHandler)
    }
    async patchLPCashData(data: CashDataPatch) {
        const { postId } = data.cashData.profit ?? data.cashData.lose

        return fetch(`${this._link}/local-posts/${postId}`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({ data }),
            credentials: 'include'
        })
            .then(this._checkError)
            .catch(this._errorHandler)
    }

}

export const localPostApi = new localPostAPI({
    link: CURRENT_LINK,
})