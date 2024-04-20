import {  useState } from "react";
import { userApi } from "../api/apiUser.js";
import { useNavigate } from "react-router-dom";
import { AppSettings, Input, MetaData, User, UserSign, appMode } from "../types.js";
import { ApiError } from "../errors.js";
interface AuthStatus {
    success: boolean;
}

interface callBackResMsg {
    callBackResMsg: (data: MetaData) => void
    startAppSettings: AppSettings
}

export const useUser = (data: callBackResMsg) => {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [isLoadingUser, setIsloadingUser] = useState<boolean>(false);
    const [userData, setUserData] = useState<null | User>(null);
    const [appMode, setAppMode] = useState<appMode>({ mode: data.startAppSettings.startAppMode })


    function switchAppModeUser(mode: appMode) {
        setAppMode(mode);
    }


    const navigate = useNavigate();


    function _onLoading(isLoading: boolean) {
        if (isLoading) {

            data.callBackResMsg({ message: 'Загрузка...', statusCode: 102 });
        }
        setIsloadingUser(isLoading)

    }

    function _endOfRequest(response: unknown, userData: User | null = null) {
        const apiRes = response as MetaData;

        if (apiRes.statusCode === 405 && !apiRes.message) {
            apiRes.message = 'Эта функция не доуступна в текущем режиме работы'
        }

        setIsloadingUser(false);
        data.callBackResMsg(apiRes);

        if (userData !== null) {
            _putUserInLs(userData);
            setUserData(userData);
        }

        _onLoading(false);

    }


    function _putUserInLs(userData: User) {
        const currentLs = localStorage.getItem('user');
        if (currentLs) {
            localStorage.removeItem('user')
        }

        localStorage.setItem('user', JSON.stringify(userData))
    }


    function _clearLs() {
        const userData = localStorage.getItem('user');
        const lsData = localStorage.getItem('localPost');
        if (userData) {
            localStorage.removeItem('user')
        }
        if (lsData) {
            localStorage.removeItem('localPost')
        }
    }



    async function auth(): Promise<AuthStatus> {
        _onLoading(true);
        try {
            if (appMode.mode === 'online') {

                const { content, metaData } = await userApi.getUserMe();

                setLoggedIn(true);
                _endOfRequest({ message: metaData.message, statusCode: metaData.statusCode }, content)
                return { success: true }


            } else if (appMode.mode === 'offline') {

                const userData = localStorage.getItem('user');
                const parsedUser = userData !== null ? await JSON.parse(userData) : {}

                if (parsedUser.name) {
                    setLoggedIn(true);
                    _endOfRequest({ message: `Вы авторизированы как ${parsedUser.name}.`, statusCode: 200 }, parsedUser)
                    return { success: true }
                } else {
                    _endOfRequest({ message: `Вы не можете авторизироваться через кэш`, statusCode: 404 })
                    return { success: false }
                }



            } else {
                return { success: false }
            }

        }
        catch (e: unknown) {
            _endOfRequest(e);
            return { success: false }
        }


    }




    async function signUp(userVal: UserSign) {
        _onLoading(true)

        try {
            if (appMode.mode === 'online') {
                _clearLs()
                const { metaData } = await userApi.signUp(userVal);
                _endOfRequest({ message: metaData.message, statusCode: metaData.statusCode });

                await auth();
                navigate('/local-posts');


            } else if (appMode.mode === 'offline') {
                const newUser = { name: userVal.name, email: userVal.email, _id: new Date().getTime().toString(), avatar: 'no avatar' }
                _clearLs();
                _endOfRequest({ message: `Вы зарегистрированы как ${newUser.name}`, statusCode: 200 }, (newUser as User));
                setLoggedIn(true);
                navigate('/local-posts');

            }


        }
        catch (e: unknown) {
            _endOfRequest(e)

        }
    }

    async function signIn(value: UserSign) {
        _onLoading(true)
        try {

            if (appMode.mode === 'online') {

                const { metaData } = await userApi.signIn(value);
                _clearLs()
                _endOfRequest({ message: metaData.message, statusCode: metaData.statusCode });

                await auth();
                navigate('/local-posts');


            } else if (appMode.mode === 'offline') {
                const { success } = await auth();
                if (success) {
                    navigate('/local-posts');
                }
            }


        }
        catch (e) {

            _endOfRequest(e)


        }

    }




    async function signOut() {
        _onLoading(true)
        try {
            if (appMode.mode === 'online') {

                const { metaData } = await userApi.signOut();
                _endOfRequest({ message: metaData.message, statusCode: metaData.statusCode });


            } else if (appMode.mode === 'offline') {

                _endOfRequest({ message: `Вы вышли зи аккаунта`, statusCode: 200 });
            }

            _clearLs();
            setLoggedIn(false);
            navigate('/sign-in');

        }
        catch (e) {
            _endOfRequest(e)
        }
    }

    async function changeUserInfo(userVal: Input) {
        _onLoading(true)
        try {
            if (appMode.mode === 'online') {

                const { content, metaData } = await userApi.changeProfile(userVal);

                _endOfRequest({ message: metaData.message, statusCode: metaData.statusCode }, content);
                return { success: true }


            }
            else if (appMode.mode === 'offline') {
                const { email, name } = userVal;

                const userData = localStorage.getItem('user');
                const parsedUser = userData !== null ? await JSON.parse(userData) : {}

                if (!parsedUser.name || !parsedUser.email) {
                    throw new ApiError('Данные юзера не найдены', 404)
                }

                parsedUser.name = name;
                parsedUser.email = email;
                _endOfRequest({ message: 'данные изменены', statusCode: 200 }, parsedUser);
                return { success: true }

            }

        }
        catch (e) {
            _endOfRequest(e)
            return { success: false }
        }
    }
    async function deleteUserMe(email: string) {
        _onLoading(true)
        try {
            if (appMode.mode === 'online') {

                const { metaData } = await userApi.deleteUserMe(email);
                setLoggedIn(false);
                navigate('./sign-up');
                _endOfRequest({ message: metaData.message, statusCode: metaData.statusCode });


            } else if (appMode.mode === 'offline') {
                _clearLs();
                setLoggedIn(false);
                navigate('/sign-in');
            }

        } catch (e) {
            _endOfRequest(e)
        }
    }



    return { loggedIn, signUp, signIn, signOut, changeUserInfo, deleteUserMe, switchAppModeUser, isLoadingUser, userData, auth }
}