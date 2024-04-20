
import fakeUser from '../fakeDataBase/user.json'
import { ApiRes, UserExtends } from "../types"

class FakeUserApi {

    constructor() {

    }
    async _getUser(): Promise<UserExtends> {

        return fakeUser.data
    }
    _createResponse(statusCode: number, content: UserExtends): ApiRes {
        let message = ''
        if (statusCode >= 200 && statusCode <= 399) {
            message = 'Все ок'
        } else if (statusCode >= 400) {
            message = 'Какая то проблема'
        }

        return { metaData: { message: message, statusCode: statusCode }, content: content }
    }


    async getUserMe(): Promise<ApiRes> {
        const data = await this._getUser()
        return this._createResponse(200, data)
    }



}

export const fakeUserApi = new FakeUserApi()