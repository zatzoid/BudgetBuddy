import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppSettings } from '../types';


const initialState: AppSettings = {
    statsMustOpen: false,
    startAppMode: 'online',
    profitHideComplited: false,
    profitSorting: '',
    loseHideComplited: false,
    loseSorting: '',
    noticeMustOpen: false
}
type actionAppSettings = Partial<AppSettings>


const appSettingsSlice = createSlice({
    name: 'appSettings',
    initialState,
    reducers: {
        updateAppSettings(state, action: PayloadAction<actionAppSettings>) {
            return { ...state, ...action.payload };
        }

    }

});

export const { updateAppSettings } = appSettingsSlice.actions;
export default appSettingsSlice.reducer;







