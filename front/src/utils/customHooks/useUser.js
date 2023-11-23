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
        setUserResMsg(e);
        if (e.statusCode === 400) {
            setUserResMsg(`Введенны не корректные данные в поле ${e.validation.body.keys[0]}`);
            return
        }

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
            await auth();
            navigate('/local-posts');
            _successLoading(signUpStatus.message);
        }
        catch (e) {
            _onError(e)
        }
    };
    async function signIn(data) {
        _onLoading()
        try {
            const signUpStatus = await userApi.signIn(data);
            await auth();
            navigate('/local-posts');
            setIsloadingUser(false);
            setUserResMsg({ message: signUpStatus.message, status: true });
        }
        catch (e) {
            _onError(e)
        }

    };
    async function auth() {
        try {
            const getUserData = await userApi.getUserMe();
            setUserData(getUserData.data.userData);
            setLoggedIn(true);
            return { success: true }
        }
        catch (e) {
            console.log(e)
            return { success: false }
        }
    };

    async function signOut() {
        _onLoading()
        try {
            const signUpStatus = await userApi.signOut();
            _successLoading({ message: signUpStatus.message, status: true });
            setLoggedIn(false);
            navigate('/sign-in');

        }
        catch (e) {
            _onError(e)
        }
    };
    async function changeUserInfo(data) {
        _onLoading()
        try {
            const newUserData = await userApi.changeProfile(data);
            _successLoading({ message: newUserData.data.message, status: true });
            setUserData(newUserData.data.userData);
            return { success: true }
        }
        catch (e) {
            _onError(e)
            return { success: false }
        }
    }
    async function deleteUserMe(data) {
        _onLoading()
        try {
            const deleteStatus = await userApi.deleteUserMe(data);
            _successLoading({ message: deleteStatus.message, status: true });
            setLoggedIn(false);
            navigate('./sign-up');
        } catch (e) {
            _onError(e)
        }
    }



    return { loggedIn, signUp, signIn, signOut, changeUserInfo, deleteUserMe, isLoadingUser, userResMsg, userData, auth }
}