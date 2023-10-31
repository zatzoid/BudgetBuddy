import React, { useState } from "react";
import { userApi } from "../api/apiUser";
import { useNavigate } from "react-router-dom";
export const useUser = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [isLoadingUser, setIsloadingUser] = useState(false);
    const [userResMsg, setUserResMsg] = useState(null);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    function _onError(e) {
        setIsloadingUser(false)
        setUserResMsg(e.message);
        if (e.statusCode === 400) {
            setUserResMsg(`Введенны не корректные данные в поле ${e.validation.body.keys[0]}`);
            return
        }


        console.log(e)
    }
    function _onLoading() {
        setIsloadingUser(true)
        setUserResMsg(null)
    }
    function _successLoading(data) {
        setIsloadingUser(false);
        setUserResMsg(data);
    }

    async function signUp(data) {
        _onLoading()
        try {
            const signUpStatus = await userApi.signUp(data);
            if (signUpStatus.ok) {
                await auth()
                _successLoading(signUpStatus.message)
            } else {
                _successLoading(signUpStatus.message)
            }

        }
        catch (e) {
            _onError(e)
        }
    };
    async function auth() {

        try {
            const getUserData = await userApi.getUserMe();
            if (getUserData.ok) {
                const userData = await getUserData.json();
                setUserData(userData.data.userData);
                setLoggedIn(true);
                navigate('/local-posts');
                return { success: true }
            }
            else {
                navigate('/sign-in');
                return { success: false, message: 'Ошибка авторизации' }
            }
        }
        catch (e) {
            console.log(e)
        }
    };
    async function signIn(data) {
        _onLoading()
        try {
            const signUpStatus = await userApi.signIn(data);
            await auth()
            setIsloadingUser(false);
            setUserResMsg({ message: signUpStatus.message, status: true });

        }
        catch (e) {
            _onError(e)
        }

    };
    async function signOut() {
        _onLoading()
        try {
            const signUpStatus = await userApi.signOut();
            _successLoading( { message: signUpStatus.message, status: true })
            navigate('/sign-in')

        }
        catch (e) {
            _onError(e)
        }
    };
    async function changeUserInfo(data) {
        _onLoading()
        try {
            const newUserData = await userApi.changeProfile(data);
            const userData = await newUserData.json();
            if (newUserData.ok) {
                _successLoading({ message: userData.data.message, status: true });
                setUserData(userData.data.userData);
                return { success: true }
            } else {
                _onError(userData);
                return { success: false }

            }
        }
        catch (e) {
            _onError(e)
            return { success: false }
        }
    }



    return { loggedIn, signUp, signIn, signOut, changeUserInfo, isLoadingUser, userResMsg, userData, auth }
}