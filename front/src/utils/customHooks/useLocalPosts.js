import React, { useState } from "react";
import { localPostApi } from "../api/apiLocal";

export const useLocalPosts = () => {
    const [LPList, setLPList] = useState(null);
    const [isLoadingLP, setIsloadingLP] = useState(false);
    const [LPResMsg, setLPResMsg] = useState(null);
    function _onError(e) {
        setIsloadingLP(false)
        setLPResMsg(e.message);
        if (e.statusCode === 400) {
            setLPResMsg(`Введенны не корректные данные в поле ${e.validation.body.keys[0]}`);
            return
        }


        console.log(e)
    }
    function _onLoading() {
        setIsloadingLP(true)
        setLPResMsg(null)
    }
    function _successLoading(data) {
        setIsloadingLP(false);
        if (data) {
            setLPResMsg(data);
        }
    }

    async function getLPList() {
        _onLoading()
        try {
            const LPlistData = await localPostApi.getLocalPosts();
            setIsloadingLP(false);
            setLPList(LPlistData.data)
            if (LPlistData.data.length <= 0) {
                setLPResMsg('У вас еще нет ни одной записи')
            }
        }
        catch (e) {
            _onError(e)
        }

    }
    async function createLPel(data) {
        _onLoading()
        try {
            const newPostdata = await localPostApi.createLocalPost(data);
            setLPList([...LPList, newPostdata.data]);
            _successLoading()
        }
        catch (e) {
            _onError(e)
        }
    };
    async function putCashDataLP(data) {
        _onLoading()
        try {
            const newPostData = await localPostApi.putCashDataLocalPost(data);
            const indexToUpdate = LPList.findIndex(item => item._id === newPostData.data.updatedPost._id);
            if (indexToUpdate !== -1) {
                const updatedLPList = [...LPList];
                updatedLPList[indexToUpdate] = newPostData.data.updatedPost;
                _successLoading({ message: newPostData.data.message, status: true })
                setLPList(updatedLPList);
            } else {
                _onError({ message: 'Объект не найден в массиве.' })
            }
        }
        catch (e) { _onError(e) }
    };
    async function deleteCashDataLP(data) {
        _onLoading()
        const uploadData = {
            postId: data.postId,
            cashData: {
                [data.kinde]: {
                    _id: data._id
                }
            }
        }
        try {
            const newPostDataJSON = await localPostApi.deleteCashDataLocalPost(uploadData);
            const newPostData = await newPostDataJSON.json();
            const indexToUpdate = LPList.findIndex(item => item._id === newPostData.data.updatedPost._id);
            if (indexToUpdate !== -1) {
                const updatedLPList = [...LPList];
                updatedLPList[indexToUpdate] = newPostData.data.updatedPost;
                _successLoading({ message: newPostData.data.message, status: true })
                setLPList(updatedLPList);
            } else {
                _onError({ message: 'Объект не найден в массиве.' })
            }
        }
        catch (e) { _onError(e) };

    }
    function refreshPost(data) {
        _onLoading()
        const indexToUpdate = LPList.findIndex(item => item._id === data.updatedPost._id);
        if (indexToUpdate !== -1) {
            const updatedLPList = [...LPList];
            updatedLPList[indexToUpdate] = data.updatedPost;
            _successLoading({ message: data.message, status: true })
            setLPList(updatedLPList);
        } else {
            _onError({ message: 'Объект не найден в массиве.' })
        }


    };
    return { getLPList, createLPel, putCashDataLP, deleteCashDataLP, refreshPost, LPList, isLoadingLP, LPResMsg }
}