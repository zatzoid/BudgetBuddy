import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CashData, CashDataFromClient, CashDataPatch, LocalPost, MetaData } from "../types";
import { RootState } from "./index";
import { setIsLoading, updateApiStatus } from "./apiStatusSlice";
import { localPostApi } from "../api/apiLocal";

const initialState: LocalPost[] = []


const localPostsSlice = createSlice({
    name: 'localPosts',
    initialState,
    reducers: {
        updateLP(state, action: PayloadAction<LocalPost | LocalPost[]>) {

            if (Array.isArray(action.payload)) {
                return action.payload
            } else {
                const payload: LocalPost = (action.payload as LocalPost);

                // localPosts[]
                return state.map((post: LocalPost) => {
                    if (post._id === payload._id) {
                        return payload;
                    }
                    return post;
                })

            }

        },
        clearLp() {
            return initialState
        }



    }

});
const { updateLP, clearLp } = localPostsSlice.actions;
export default localPostsSlice.reducer;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
/* function _endOfRequest(dispatch: any, meta: MetaData, content: LocalPost[] | LocalPost | null = null) {
    const { message = 'unknown error :::', statusCode = 555 } = meta
    if (content !== null) {
        dispatch(updateLP((content as LocalPost)))
    }
    dispatch(updateApiStatus({ message, statusCode }))
    dispatch(setIsLoading(false))

} */
export const clearLocalPosts = createAsyncThunk(
    'localPosts/getLPList', async (_, { dispatch }) => {
        dispatch(clearLp())
    })

export const getLPList = createAsyncThunk(
    'localPosts/getLPList', async (_, { dispatch, getState }) => {

        try {
            console.log('call getlplist');
            dispatch(setIsLoading(true));
            const { appMode } = (getState() as RootState)
            let meta = { message: 'ok', statusCode: 200 };
            let data = []

            if (appMode.mode === 'online') {

                const { content, metaData } = await localPostApi.getLocalPosts();
                meta = metaData
                data = content

            } else if (appMode.mode === 'offline') {

                const storrage = localStorage.getItem('persist:root')
                if (!storrage) {
                    throw new Error('в кэше пусто')
                }
                const { localPosts } = await JSON.parse(storrage);
                data = await JSON.parse(localPosts)
                meta = { message: `Загружено ${data?.length} постов из кэша`, statusCode: 200 }

            }
            dispatch(updateLP((data as LocalPost)))
            dispatch(updateApiStatus(meta))


        } catch (error: unknown) {
            const { message = 'undefined error :::', statusCode = 500 } = error as MetaData
            dispatch(updateApiStatus({ message, statusCode }))

        } finally {
            dispatch(setIsLoading(false))
        }
    })

export const createLPel = createAsyncThunk(
    'localPosts/createLPel',
    async (date: { choisenMonth: number, choisenYear: number },
        { dispatch, getState }) => {

        try {
            dispatch(setIsLoading(true));
            const { appMode, localPosts, userMe } = (getState() as RootState)
            let meta: MetaData = { message: 'ok', statusCode: 200 };
            let data: LocalPost[] = localPosts


            if (appMode.mode === 'online') {
                const { content, metaData } = await localPostApi.createLocalPost(date);
                data = [...data, content] as LocalPost[];
                meta = { message: metaData.message, statusCode: metaData.statusCode }


            } else if (appMode.mode === 'offline') {
                const newLPel: LocalPost = {
                    owner: (userMe._id as string),
                    posted: false,
                    _id: new Date().getTime().toString(),
                    cashData: {
                        profit: [],
                        lose: []
                    },
                    createdAt: new Date().toISOString(),
                    choisenMonth: date.choisenMonth,
                    choisenYear: date.choisenYear
                }

                data = [...data, newLPel];
                meta = { message: `Пост создан`, statusCode: 200 }
            }

            dispatch(updateApiStatus(meta))
            dispatch(updateLP(data))
        } catch (error: unknown) {
            console.log(error);
            const { message = 'undefined error :::', statusCode = 500 } = error as MetaData
            dispatch(updateApiStatus({ message, statusCode }))

        } finally {
            dispatch(setIsLoading(false))
        }
    }
)

export const putCashDataLP = createAsyncThunk(
    'localPosts/putCashDataLP', async (dataToPut: CashDataFromClient, { dispatch, getState }) => {

        try {
            dispatch(setIsLoading(true));
            const { appMode, localPosts } = (getState() as RootState)
            let meta = { message: 'ok', statusCode: 200 };
            let data

            if (appMode.mode === 'online') {
                const { content, metaData } = await localPostApi.putCashDataLocalPost(dataToPut);
                data = content;
                meta = metaData

            } else if (appMode.mode === 'offline') {
                const { cashData, postId } = dataToPut;
                const kinde = (Object.keys(cashData)[0] as 'profit' | 'lose')




                const newCashData = {
                    _id: new Date().getTime().toString(),
                    data: cashData[kinde].data,
                    reminde: {
                        status: null,
                        data: null
                    },
                    postId: postId,
                    category: cashData[kinde].category,
                    statusComplited: false,
                    createdAt: new Date().toISOString()
                };

                //глубокое копирование, потому что этот ебучий getState не дает менять значения
                const copyLP = await JSON.parse(JSON.stringify(localPosts));

                data = copyLP.map((el: LocalPost) => {
                    if (el._id !== postId) {
                        return el
                    } else {
                        console.log(Object.getOwnPropertyDescriptor(el.cashData[kinde], 'length'));
                        el.cashData[kinde] = [...el.cashData[kinde], newCashData];

                        return el
                    }
                })
                console.log(data);


                meta = { message: 'Запись добавлена', statusCode: 200 }


            }


            dispatch(updateLP(data))
            dispatch(updateApiStatus(meta))
        } catch (error: unknown) {
            console.log(error);
            const { message = 'undefined error :::', statusCode = 500 } = error as MetaData
            dispatch(updateApiStatus({ message, statusCode }))

        } finally {
            dispatch(setIsLoading(false))
        }
    }
)


export const deleteCashDataLP = createAsyncThunk(
    'localPosts/deleteCashDataLP', async (dataTo: CashDataPatch, { dispatch, getState }) => {

        try {
            dispatch(setIsLoading(true));
            const { appMode, localPosts } = (getState() as RootState)
            let meta = { message: 'ok', statusCode: 200 };
            let data

            if (appMode.mode === 'online') {
                const { content, metaData } = await localPostApi.deleteCashDataLocalPost(dataTo);
                meta = metaData
                data = content
            }
            const copyLP: LocalPost[] = await JSON.parse(JSON.stringify(localPosts));
            const kinde = (Object.keys(dataTo.cashData)[0] as 'profit' | 'lose');
            const { postId } = dataTo.cashData[kinde];
            const newCashData = dataTo.cashData[kinde];

            /* const findedLp = localPosts.find(el => el._id === dataTo.cashData[kinde].postId);
            if (!findedLp) {
                throw new ApiError('объект не найден в массиве', 404);
            }
            const filtedCashData = findedLp.cashData[kinde].filter(el => el._id !== dataTo.cashData[kinde]._id);
            findedLp.cashData[kinde] = filtedCashData; */
            data = copyLP.map((el: LocalPost) => {
                if (el._id === postId) {

                    el.cashData[kinde] = el.cashData[kinde].filter((item: CashData) => item._id !== newCashData._id);
                    return el

                } else {
                    return el
                }
            })

            meta = { message: 'Пост удален', statusCode: 200 }



            dispatch(updateLP(data))
            dispatch(updateApiStatus(meta))
        } catch (error: unknown) {
            const { message = 'undefined error :::', statusCode = 500 } = error as MetaData
            dispatch(updateApiStatus({ message, statusCode }))

        } finally {
            dispatch(setIsLoading(false))
        }
    }
)

export const patchLPCashData = createAsyncThunk(
    'localPosts/patchLPCashData', async (dataTo: CashDataPatch, { dispatch, getState }) => {

        try {
            dispatch(setIsLoading(true));
            const { appMode, localPosts } = (getState() as RootState)
            let meta = { message: 'ok', statusCode: 200 };
            let data

            if (appMode.mode === 'online') {

                const { content, metaData } = await localPostApi.patchLPCashData(dataTo);
                meta = metaData;
                data = content

            } else if (appMode.mode === 'offline') {



                const copyLP: LocalPost[] = await JSON.parse(JSON.stringify(localPosts));
                const kinde = (Object.keys(dataTo.cashData)[0] as 'profit' | 'lose');
                const { postId } = dataTo.cashData[kinde];
                const newCashData = dataTo.cashData[kinde];

                /* const findedLp = copyLP.find(el => el._id === dataTo.cashData[kinde].postId);
                if (!findedLp) {
                    throw new ApiError('объект не найден в массиве', 404);
                }
                const cashDataIndex = findedLp.cashData[kinde].findIndex(el => el._id === dataTo.cashData[kinde]._id);
                findedLp.cashData[kinde][cashDataIndex] = dataTo.cashData[kinde] */

                data = copyLP.map((el: LocalPost) => {
                    if (el._id === postId) {

                        el.cashData[kinde] = el.cashData[kinde].map((item: CashData) => {
                            if (item._id === newCashData._id) {
                                return newCashData

                            } else {
                                return item
                            }
                        })
                        return el

                    } else {
                        return el
                    }
                })
                meta = { message: 'Пост обновлен', statusCode: 200 }
            }

            dispatch(updateLP(data))
            dispatch(updateApiStatus(meta))

        } catch (error: unknown) {
            const { message = 'undefined error :::', statusCode = 500 } = error as MetaData
            dispatch(updateApiStatus({ message, statusCode }))

        } finally {
            dispatch(setIsLoading(false))
        }
    }
)


/* 

= createAsyncThunk(
     'localPosts/getLPList', async (_, { dispatch, getState }) => {

        try {
            dispatch(setIsLoading(true));
            const { appMode } = (getState() as RootState)
            let meta = { message: 'ok', statusCode: 200 };
            let data = []

            dispatch(updateLP(data))
             dispatch(updateApiStatus(meta))
        } catch (error: unknown) {
            const { message = 'undefined error :::', statusCode = 500 } = error as MetaData
            dispatch(updateApiStatus({ message, statusCode }))

        } finally {
            dispatch(setIsLoading(false))
        }
    }
)



        */


