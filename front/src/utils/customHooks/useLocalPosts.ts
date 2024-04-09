import { useState } from "react";
import { localPostApi } from "../api/apiLocal";
import { CashDataPatch, CashDataFromClient, LocalPost, MetaData } from '../types'

interface callBackResMsg {
    callBackResMsg: (data: MetaData) => void
}

export const useLocalPosts = (data: callBackResMsg) => {
    const [LPList, setLPList] = useState<LocalPost[]>([]);
    const [isLoadingLP, setIsloadingLP] = useState<boolean>(false);

    function _onLoading() {
        setIsloadingLP(true)
    }

    function _endOfRequest(response: unknown) {
        const apiRes = response as MetaData;
        setIsloadingLP(false);
        data.callBackResMsg(apiRes);
       
    }
   /*  function _errorHandler(err: unknown) {
        const apiRes = err as MetaData;
        setIsloadingLP(false);
        data.callBackResMsg(apiRes);
    } */


    async function getLPList() {
        _onLoading()
        try {
            const { content, metaData } = await localPostApi.getLocalPosts();
            console.log('getLpList::', content);
            setLPList(content)
            _endOfRequest({ message: metaData.message, statusCode: metaData.statusCode })
        }
        catch (e) {
            console.log(e);
            _endOfRequest(e)
        }

    }



    async function createLPel(date: { choisenMonth: number, choisenYear: number }) {
        _onLoading()
        try {
            const { content, metaData } = await localPostApi.createLocalPost(date);
            const prevLP = [...LPList, content] as LocalPost[];
            setLPList(prevLP);
            _endOfRequest({ message: metaData.message, statusCode: metaData.statusCode })
        }
        catch (e) {
            _endOfRequest(e)
        }
    }


    async function putCashDataLP(dataToPut: CashDataFromClient) {
        _onLoading()
        try {
            const { content, metaData } = await localPostApi.putCashDataLocalPost(dataToPut);
            refreshPost(metaData, content);
            _endOfRequest({ message: metaData.message, statusCode: metaData.statusCode })
        }
        catch (e) { _endOfRequest(e) }
    }


    async function deleteCashDataLP(dataTo: CashDataPatch) {
        _onLoading()
        try {
            const { content, metaData } = await localPostApi.deleteCashDataLocalPost(dataTo);
            refreshPost(metaData, content);
        }
        catch (e) { _endOfRequest(e) }

    }



    async function patchLPCashData(dataTo: CashDataPatch) {
        _onLoading()
        const { content, metaData } = await localPostApi.patchLPCashData(dataTo);
        refreshPost(metaData, content);
    }



    function refreshPost(res: MetaData, data: LocalPost) {
        _onLoading();

        const indexToUpdate = LPList.findIndex(item => item._id === data._id);

        if (indexToUpdate !== -1) {
            const updatedLPList = [...LPList];
            updatedLPList[indexToUpdate] = data;
            _endOfRequest(res)
            setLPList(updatedLPList);
        } else {
            _endOfRequest({ message: 'Объект не найден в массиве.', statusCode: 404 })
        }


    }
    return { getLPList, createLPel, putCashDataLP, deleteCashDataLP, refreshPost, patchLPCashData, LPList, isLoadingLP }
}