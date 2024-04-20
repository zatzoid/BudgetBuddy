import { useState } from "react";
import { localPostApi } from "../api/apiLocal";
import { CashDataPatch, CashDataFromClient, LocalPost, MetaData, appMode, AppSettings } from '../types'
import { ApiError } from "../errors";



interface data {
    callBackResMsg: (data: MetaData) => void
    startAppSettings: AppSettings
}


export const useLocalPosts = (data: data) => {
    const [LPList, setLPList] = useState<LocalPost[]>([]);
    const [isLoadingLP, setIsloadingLP] = useState<boolean>(false);
    const [appMode, setAppMode] = useState<appMode>({ mode: data.startAppSettings.startAppMode })


    function switchAppModeLp(mode: appMode) {
        setAppMode(mode);
    }




    function _onLoading(isLoading: boolean) {

        if (isLoading) {

            data.callBackResMsg({ message: 'Загрузка...', statusCode: 102 });
        }
        setIsloadingLP(isLoading)

    }

    function refreshPost(res: MetaData, lpData: LocalPost | LocalPost[]) {
        _onLoading(true);
        if (Array.isArray(lpData)) {
            setLPList(lpData);
            _endOfRequest(res, lpData);
            return
        }
        const indexToUpdate = LPList.findIndex(item => item._id === lpData._id);

        if (indexToUpdate !== -1) {
            const updatedLPList = [...LPList];
            updatedLPList[indexToUpdate] = lpData;
            _endOfRequest(res, updatedLPList)
            setLPList(updatedLPList);
        } else {
            _endOfRequest({ message: 'Объект не найден в массиве.', statusCode: 404 })
        }


    }

    function _endOfRequest(response: unknown, lpData: LocalPost[] | null = null) {

        const apiRes = response as MetaData;
        if (apiRes.statusCode === 405 && !apiRes.message) {
            apiRes.message = 'Эта функция не доуступна в текущем режиме работы'
        }
        data.callBackResMsg(apiRes);
        if (lpData !== null) {
            _putLocalPostInLs(lpData)
        }
        _onLoading(false);

    }


    function _putLocalPostInLs(lp: LocalPost[]) {
        const currentLs = localStorage.getItem('localPost');
        if (currentLs) {
            localStorage.removeItem('localPost')
        }

        localStorage.setItem('localPost', JSON.stringify(lp))
    }


    function _getLocalPostFromLs(): LocalPost[] {
        const localLpList = localStorage.getItem('localPost')
        return localLpList !== null ? JSON.parse(localLpList) : []
    }





    async function getLPList() {
        _onLoading(true)
        try {
            if (appMode.mode === 'online') {

                const { content, metaData } = await localPostApi.getLocalPosts();

                refreshPost({ message: metaData.message, statusCode: metaData.statusCode }, content)

            } else if (appMode.mode === 'offline') {

                const parsedList = _getLocalPostFromLs()
                refreshPost({ message: `Загружено ${parsedList?.length} постов из кэша`, statusCode: 405 }, parsedList)


            }
        }
        catch (e) {

            console.log(e);
            _endOfRequest(e);
        }

    }



    async function createLPel(date: { choisenMonth: number, choisenYear: number }) {
        _onLoading(true)

        try {
            if (appMode.mode === 'online') {
                const { content, metaData } = await localPostApi.createLocalPost(date);
                const prevLP = [...LPList, content] as LocalPost[];
                refreshPost({ message: metaData.message, statusCode: metaData.statusCode }, prevLP)

            } else if (appMode.mode === 'offline') {
                const parsedList = _getLocalPostFromLs();
                const newLPel = {
                    owner: 'fakeUser',
                    posted: false,
                    _id: new Date().getTime().toString(),
                    postId: new Date().getTime().toString(),
                    cashData: {
                        profit: [],
                        lose: []
                    },
                    createdAt: new Date(),
                    choisenMonth: date.choisenMonth,
                    choisenYear: date.choisenYear
                }
                parsedList.push((newLPel as LocalPost));

                refreshPost({ message: `Пост создан`, statusCode: 200 }, parsedList)
            }

        }
        catch (e) {
            _endOfRequest(e)
        }
    }


    async function putCashDataLP(dataToPut: CashDataFromClient) {
        _onLoading(true)
        try {
            if (appMode.mode === 'online') {
                const { content, metaData } = await localPostApi.putCashDataLocalPost(dataToPut);
                refreshPost(metaData, content);

            } else if (appMode.mode === 'offline') {

                const parsedList = _getLocalPostFromLs();
                const findedLp = parsedList.find(el => el.postId === dataToPut.postId);

                if (!findedLp) {
                    throw new ApiError('объект не найден в массиве', 404);
                }


                const { cashData } = dataToPut;
                const kinde = (Object.keys(cashData)[0] as 'profit' | 'lose')
                const mainData = cashData[kinde]
                const newCashData = {
                    _id: new Date().getTime().toString(),
                    data: mainData.data,
                    reminde: {
                        status: null,
                        data: null
                    },
                    postId: dataToPut.postId,
                    category: mainData.category,
                    statusComplited: false,
                    createdAt: new Date()
                }

                findedLp.cashData[kinde].push(newCashData);

                refreshPost({ message: 'Запись добавлена', statusCode: 200 }, findedLp)


            }

        }
        catch (e) { _endOfRequest(e) }
    }


    async function deleteCashDataLP(dataTo: CashDataPatch) {
        _onLoading(true)
        try {
            if (appMode.mode === 'online') {
                const { content, metaData } = await localPostApi.deleteCashDataLocalPost(dataTo);
                refreshPost(metaData, content);
            }
            else if (appMode.mode === 'offline') {

                const parsedList = _getLocalPostFromLs();
                const kinde = (Object.keys(dataTo.cashData)[0] as 'profit' | 'lose');

                const findedLp = parsedList.find(el => el.postId === dataTo.cashData[kinde].postId);
                if (!findedLp) {
                    throw new ApiError('объект не найден в массиве', 404);
                }

                const filtedCashData = findedLp.cashData[kinde].filter(el => el._id !== dataTo.cashData[kinde]._id);
                findedLp.cashData[kinde] = filtedCashData;

                refreshPost({ message: 'Пост удален', statusCode: 200 }, findedLp);

            }
        }
        catch (e) { _endOfRequest(e) }

    }



    async function patchLPCashData(dataTo: CashDataPatch) {
        try {
            _onLoading(true)
            if (appMode.mode === 'online') {

                const { content, metaData } = await localPostApi.patchLPCashData(dataTo);
                refreshPost(metaData, content);

            } else if (appMode.mode === 'offline') {

                const parsedList = _getLocalPostFromLs();
                const kinde = (Object.keys(dataTo.cashData)[0] as 'profit' | 'lose');
                const findedLp = parsedList.find(el => el.postId === dataTo.cashData[kinde].postId);

                if (!findedLp) {
                    throw new ApiError('объект не найден в массиве', 404);
                }

                const cashDataIndex = findedLp.cashData[kinde].findIndex(el => el._id === dataTo.cashData[kinde]._id);
                findedLp.cashData[kinde][cashDataIndex] = dataTo.cashData[kinde]

                refreshPost({ message: 'Пост обновлен', statusCode: 200 }, findedLp);
            }

        } catch (e) { _endOfRequest(e) }

    }




    return { getLPList, createLPel, putCashDataLP, deleteCashDataLP, refreshPost, patchLPCashData, switchAppModeLp, LPList, isLoadingLP }
}