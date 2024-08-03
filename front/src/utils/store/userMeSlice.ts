import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Input, MetaData, User, UserSign, } from '../types';
import { setIsLoading, updateApiStatus } from './apiStatusSlice';
import { RootState } from './index';
import { userApi } from '../api/apiUser';
import { ApiError } from '../errors';
import { clearLocalPosts } from './localPostsSlice';



const initialState: User = {
    avatar: '',
    email: '',
    name: '',
    _id: '',
    isLoggedIn: false
}


const userMeSlice = createSlice({
    name: 'userMe',
    initialState,
    reducers: {
        updateUserMe(state, action: PayloadAction<User>) {
            return { ...state, ...action.payload };
        }


    }

});

const { updateUserMe } = userMeSlice.actions;


export default userMeSlice.reducer;




export const authUser = createAsyncThunk(
    'userMe/authUser', async (_, { dispatch, getState }) => {
        try {
            dispatch(setIsLoading(true));
            const { appMode, userMe } = (getState() as RootState)
            let response = { message: 'ok', statusCode: 200 };
            if (appMode.mode === 'online') {

                const { content, metaData } = await userApi.getUserMe();

                content.isLoggedIn = true
                response = { message: metaData.message, statusCode: metaData.statusCode };
                dispatch(updateUserMe(content))



            } else if (appMode.mode === 'offline') {
                const storrage = localStorage.getItem('persist:root')
                if (!storrage) {
                    throw new Error('в кэше пусто')
                }

                const store = await JSON.parse(storrage);
                const content = await JSON.parse(store.userMe)

                if (content.name) {

                    content.isLoggedIn = true
                    response = { message: `Вы авторизированы как ${content.name}.`, statusCode: 200 };
                    dispatch(updateUserMe(content))

                } else if (userMe.name) {

                    const newUser = { ...userMe }
                    newUser.isLoggedIn = true
                    response = { message: `Вы авторизированы как ${content.name}.`, statusCode: 200 };
                    dispatch(updateUserMe(newUser))

                } else {
                    throw new Error('Вы не можете авторизироваться через кэш')
                }



            }

            dispatch(updateApiStatus(response))

        } catch (error: unknown) {
            console.log(error);
            const { message = 'undefined error :::', statusCode = 500 } = error as MetaData
            dispatch(updateApiStatus({ message, statusCode }))

        } finally {
            dispatch(setIsLoading(false))
        }
    }


)


export const signUp = createAsyncThunk(
    'userMe/signUp', async (userVal: UserSign, { dispatch, getState }) => {
        try {

            dispatch(setIsLoading(true));
            const { appMode } = (getState() as RootState);
            let response = { message: 'ok', statusCode: 200 };
            console.log(appMode);

            if (appMode.mode === 'online') {

                const { metaData } = await userApi.signUp(userVal);
                response = { message: metaData.message, statusCode: metaData.statusCode };
                dispatch(updateApiStatus(response));
                await dispatch(authUser());



            } else if (appMode.mode === 'offline') {
                const newUser = { name: (userVal.name as string), email: userVal.email, _id: new Date().getTime().toString(), avatar: 'no avatar' };
                dispatch(updateUserMe(newUser));
                response = { message: `Вы зарегистрированы как ${newUser.name}`, statusCode: 200 };
                await dispatch(authUser());

            }


        }
        catch (error: unknown) {
            const { message, statusCode = 500 } = error as MetaData
            dispatch(updateApiStatus({ message, statusCode }))

        }
        finally {
            dispatch(setIsLoading(false))
        }
    }
)


export const signIn = createAsyncThunk(
    'userMe/signIn', async (userVal: UserSign, { dispatch, getState }) => {
        try {
            dispatch(setIsLoading(true));
            const { appMode } = (getState() as RootState);
            let response = { message: 'ok', statusCode: 200 };


            if (appMode.mode === 'online') {

                const { metaData } = await userApi.signIn(userVal);
                response = { message: metaData.message, statusCode: metaData.statusCode };
                dispatch(updateApiStatus(response));
                await dispatch(authUser());
                //navigate('/local-posts');


            } else if (appMode.mode === 'offline') {
                const newUser = { name: userVal.name, email: userVal.email, _id: new Date().getTime().toString(), avatar: 'no avatar' }
                response = { message: `Вы зарегистрированы как ${newUser.name}`, statusCode: 200 };
                await dispatch(authUser());

                // navigate('/local-posts');

            }


        }
        catch (error: unknown) {
            const { message, statusCode = 500 } = error as MetaData
            dispatch(updateApiStatus({ message, statusCode }))

        }
        finally {
            dispatch(setIsLoading(false))
        }
    }
)


export const signOut = createAsyncThunk(
    'userMe/signOut', async (_, { dispatch, getState }) => {
        try {
            dispatch(setIsLoading(true));
            const { appMode } = (getState() as RootState);
            let response = { message: 'ok', statusCode: 200 };
            const data = initialState


            if (appMode.mode === 'online') {

                const { metaData } = await userApi.signOut();
                response = { message: metaData.message, statusCode: metaData.statusCode };


            } else if (appMode.mode === 'offline') {

                response = { message: `Вы вышли зи аккаунта`, statusCode: 200 };
            }

            dispatch(updateApiStatus(response));
            dispatch(updateUserMe(data));
            dispatch(clearLocalPosts())

            // navigate('/sign-in');


        }
        catch (error: unknown) {
            const { message, statusCode = 500 } = error as MetaData
            dispatch(updateApiStatus({ message, statusCode }))

        }
        finally {
            dispatch(setIsLoading(false))
        }
    }
)



export const changeUserInfo = createAsyncThunk(
    'userMe/changeUserInfo', async (userVal: Input, { dispatch, getState }) => {
        try {
            dispatch(setIsLoading(true));
            const { appMode, userMe } = (getState() as RootState);
            let response = { message: 'ok', statusCode: 200 };
            if (appMode.mode === 'online') {

                const { content, metaData } = await userApi.changeProfile(userVal);

                response = { message: metaData.message, statusCode: metaData.statusCode };
                dispatch(updateUserMe(content))



            }
            else if (appMode.mode === 'offline') {
                const { email, name } = userVal;

                const userData = { ...userMe }

                if (!userData.name || !userData.email) {
                    throw new ApiError('Данные юзера не найдены', 404)
                }

                userData.name = name;
                userData.email = email;
                response = { message: 'данные изменены', statusCode: 200 }

                dispatch(updateUserMe(userData))
            }

            dispatch(updateApiStatus(response));

            // navigate('/sign-in');

        }
        catch (error: unknown) {
            const { message, statusCode = 500 } = error as MetaData
            dispatch(updateApiStatus({ message, statusCode }))

        }
        finally {
            dispatch(setIsLoading(false))
        }
    }
)


export const deleteUserMe = createAsyncThunk(
    'userMe/deleteUserMe', async (email: string, { dispatch, getState }) => {
        try {
            dispatch(setIsLoading(true));
            const { appMode } = (getState() as RootState);
            let response = { message: 'ok', statusCode: 200 };

            if (appMode.mode === 'online') {

                const { metaData } = await userApi.deleteUserMe(email);
                dispatch(updateUserMe({ name: '', avatar: '', email: '', _id: '', isLoggedIn: false }))
                //navigate('./sign-up');
                response = { message: metaData.message, statusCode: metaData.statusCode };


            } else if (appMode.mode === 'offline') {

                response = { message: 'signOut succese', statusCode: 200 };
                // navigate('/sign-in');
            }

            dispatch(updateApiStatus(response));

            // navigate('/sign-in');

        }
        catch (error: unknown) {
            const { message, statusCode = 500 } = error as MetaData
            dispatch(updateApiStatus({ message, statusCode }))

        }
        finally {
            dispatch(setIsLoading(false))
        }
    }
)
