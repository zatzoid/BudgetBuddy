import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { MetaData } from '../types';

export type apiStatus = {message: string, statusCode: number, isLoading: boolean}

const initialState: apiStatus ={
    message: 'init',
    statusCode: 500,
    isLoading: false

}


const apiStatusSlice = createSlice({
    name: 'apiStatus',
    initialState,
    reducers: {
        updateApiStatus(state, action: PayloadAction<MetaData>) {
            state.message = action.payload.message
            state.statusCode = action.payload.statusCode
            
        },
        setIsLoading(state, action: PayloadAction<boolean>){
            state.isLoading = action.payload
        }

    }

});

export const { updateApiStatus, setIsLoading } = apiStatusSlice.actions;


export default apiStatusSlice.reducer;