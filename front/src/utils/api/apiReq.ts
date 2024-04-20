
/* const CURRENT_LINK = window.innerWidth < 710 ?'http://192.168.0.15:3000' : 'http://localhost:3000'; */

import { Api } from "./api";


//const CURRENT_LINK = process.env.NODE_ENV !== 'development' ? 'https://api.zatzoid-projects.ru' : 'http://localhost:3000';
const CURRENT_LINK = 'http://localhost:3000'


interface options {
    link: string
}

class ReqApi  extends Api{
    private _link: string;
    private _headers: { 'Content-Type': string; };
    constructor(options: options) {
        super()
        this._link = options.link;
        this._headers = { 'Content-Type': 'application/json' }
    }
   
    async checkStatus(){
        return fetch(`${this._link}/status`, {
            method: 'GET',
            headers: this._headers,
            credentials: 'include'
        })
            .then(this._checkError)
    }
   
}

export const apiReq = new ReqApi({
    link: CURRENT_LINK
})