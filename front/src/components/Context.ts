import React from "react";
import { AppSettings, User, appMode } from "../utils/types";


export const CurrentContext = React.createContext<{ userData: User | null, appMode: appMode, appSettings: AppSettings }>({
    userData: null,
    appMode: { mode: 'online' },
    appSettings: {
        statsMustOpen: false,
        startAppMode:'online',
        profitHideComplited: false, 
        profitSorting: '',
        loseHideComplited: false, 
        loseSorting: '',
        noticeMustOpen: false
    }
});