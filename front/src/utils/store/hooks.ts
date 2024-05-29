import { TypedUseSelectorHook } from "react-redux"
import { AppDispatch, AppStore, RootState } from "."
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { useStore } from "react-redux"

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppStore: () => AppStore = useStore