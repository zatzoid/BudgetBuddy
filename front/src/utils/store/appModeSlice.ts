import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { appMode } from '../types';
import { setIsLoading, updateApiStatus } from './apiStatusSlice';
import { apiReq } from '../api/apiReq';



const initialState: appMode = {
    mode: 'online'

}


const appModeSlice = createSlice({
    name: 'appMode',
    initialState,
    reducers: {
        updateAppMode(state, action: PayloadAction<appMode>) {
            state.mode = action.payload.mode
        },


    }

});

const { updateAppMode } = appModeSlice.actions;


export default appModeSlice.reducer;

export const getAppModeFromLs = createAsyncThunk(
    'appMode/getAppModeFromLs', async (_, { dispatch }) => {
      
        const storrage = localStorage.getItem('persist:root');
        const { appSettings } = storrage ? await JSON.parse(storrage) : { appSettings: null };
        const { startAppMode } = appSettings ? await JSON.parse(appSettings) : { startAppMode: null };
        if (startAppMode) {
            dispatch(updateAppMode({ mode: startAppMode }))
        } 
    }


)


export const switchAppMode = createAsyncThunk(
    'appMode/switchAppMode', async (data: appMode, { dispatch }) => {
        try {
            dispatch(setIsLoading(true))
            let response = { message: 'ok', statusCode: 200 };


            if (data.mode === 'online') {
                const { metaData } = await apiReq.checkStatus();
                response = metaData

            }

            dispatch(updateAppMode(data));
            dispatch(updateApiStatus(response))

        } catch (error) {
            dispatch(updateApiStatus({ message: 'server dosent work right now', statusCode: 500 }))
        } finally {
            dispatch(setIsLoading(false))
        }
    }


) 