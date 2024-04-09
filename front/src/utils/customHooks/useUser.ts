import { useState } from "react";
import { userApi } from "../api/apiUser.js";
import { useNavigate } from "react-router-dom";
import { Input, MetaData, User, UserSign } from "../types.js";
interface AuthStatus {
    success: boolean;
}

interface callBackResMsg {
    callBackResMsg: (data: MetaData) => void
}

export const useUser = (data: callBackResMsg) => {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [isLoadingUser, setIsloadingUser] = useState<boolean>(false);
    const [userData, setUserData] = useState<null | User>(null);
    const navigate = useNavigate();

    function _onLoading() {
        setIsloadingUser(true)
    }

    function _endOfRequest(response: unknown) {
        const apiRes = response as MetaData;
        setIsloadingUser(false);
        data.callBackResMsg(apiRes);

    }


    async function signUp(userVal: UserSign) {
        _onLoading()
        try {
            const { metaData } = await userApi.signUp(userVal);
            await auth();
            navigate('/local-posts');
            _endOfRequest({ message: metaData.message, statusCode: metaData.statusCode });
        }
        catch (e: unknown) {
            _endOfRequest(e)

        }
    }

    async function signIn(value: UserSign) {
        _onLoading()
        try {
            const { metaData } = await userApi.signIn(value);
            await auth();
            navigate('/local-posts');
            _endOfRequest({ message: metaData.message, statusCode: metaData.statusCode })
        }
        catch (e) {

            _endOfRequest(e)


        }

    }

    async function auth(): Promise<AuthStatus> {
        try {
            const { content, metaData } = await userApi.getUserMe();
            setUserData(content);
            setLoggedIn(true);
            _endOfRequest({ message: metaData.message, statusCode: metaData.statusCode })
            return { success: true }
        }
        catch (e) {
            return { success: false }
        }
    }


    async function signOut() {
        _onLoading()
        try {
            const { metaData } = await userApi.signOut();
            _endOfRequest({ message: metaData.message, statusCode: metaData.statusCode });
            setLoggedIn(false);
            navigate('/sign-in');

        }
        catch (e) {
            _endOfRequest(e)
        }
    }

    async function changeUserInfo(userVal: Input) {
        _onLoading()
        try {
            const { content, metaData } = await userApi.changeProfile(userVal);
            setUserData(content);
            _endOfRequest({ message: metaData.message, statusCode: metaData.statusCode });
            return { success: true }
        }
        catch (e) {
            _endOfRequest(e)
            return { success: false }
        }
    }
    async function deleteUserMe(email: string) {
        _onLoading()
        try {
            const { metaData } = await userApi.deleteUserMe(email);
            setLoggedIn(false);
            navigate('./sign-up');
            _endOfRequest({ message: metaData.message, statusCode: metaData.statusCode });
        } catch (e) {
            _endOfRequest(e)
        }
    }



    return { loggedIn, signUp, signIn, signOut, changeUserInfo, deleteUserMe, isLoadingUser, userData, auth }
}