import { LocalPost } from "../types"
import fakeLocalPost from '../fakeDataBase/localPosts.json'

class FakeLocalPosts {

    constructor() {

    }
    async _getlocalPosts(): Promise<LocalPost[]> {

        return fakeLocalPost.data
    }


    FgetLocalPosts(): Promise<LocalPost[]> {
        const data = this._getlocalPosts()
        return data
    }


}

export const fakeLocalPostsApi = new FakeLocalPosts()