import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../utils/store";
import { useSelector } from "react-redux";
import { switchAppMode } from "../../utils/store/appModeSlice";
import { AppMode } from "../../utils/types";

export default function Notice() {

    
    const [apiResStatus, setApiResStatus] = useState<string>('loading');


    const dispatch = useDispatch<AppDispatch>()
    const apiStatus = useSelector((state: RootState) => state.apiStatus);
    const appMode = useSelector((state: RootState) => state.appMode);
    const appSettings = useSelector((state: RootState) => state.appSettings);
    const [isShow, setIsShow] = useState<boolean>(appSettings.noticeMustOpen);




    useEffect(() => {
        if (apiStatus !== null) {
            if (appSettings.noticeMustOpen) {
                setIsShow(true);
            }



            if (apiStatus.statusCode === 102 || apiStatus.isLoading) {
                setApiResStatus('loading')

            }
            else if (apiStatus.statusCode >= 200 && apiStatus.statusCode < 300) {
                setApiResStatus('success')

            }
            else if (apiStatus.statusCode >= 400) {
                setApiResStatus('fail')
            }
        }
        else {
            setIsShow(false)
        }


    }, [apiStatus]);

    function handleSwitchAppMode(str: AppMode) {
        dispatch(switchAppMode({ mode: str }))
    }


    return (
        <div className="notice" >

            <div className={`notice__message ${isShow ? 'notice__message_active' : ''}`}>
                <div className="notice__message-datas">
                    <p className="notice__message-data">{apiStatus?.statusCode}<span className={`notice__message-data-color notice__message-data-color_${apiResStatus}`}></span></p>
                    <p className="notice__message-data">{apiStatus?.message}</p>
                    {apiStatus?.statusCode && apiStatus?.statusCode >= 500 && <div className="notice__message-datas-modal">

                        <p className="notice__message-data">Похоже сервер в данный момент не отвечает, можете перейти в другой режим работы</p>

                        <p className="notice__message-data"> Сменить режим работы приложения:</p>
                        <button
                            className="notice__message-btn notice_col-online"

                            onClick={() => handleSwitchAppMode('online')}
                            disabled={appMode.mode === 'online' || apiStatus.isLoading}
                            title="работа с сервером">
                            Онлайн</button>

                        <button
                            className="notice__message-btn notice_col-offline"
                            onClick={() => handleSwitchAppMode('offline')}
                            disabled={appMode.mode === 'offline' || apiStatus.isLoading}
                            title="работа в офлайне, тестовый режим работы без сервера, и сохранением данных в самом приложении">
                            Оффлайн</button>

                    </div>}
                </div>

            </div>

            <div className={`notice__circle notice_col-${appMode.mode}`} onClick={() => { setIsShow(!isShow) }}>
                <div className="notice__circle-items">

                    <span className={`notice__circle-item  notice__circle-item_${apiResStatus} notice_col-${appMode.mode} `} id='one'></span>
                    <span className={`notice__circle-item  notice__circle-item_${apiResStatus} notice_col-${appMode.mode} `} id='two'></span>
                    <span className={`notice__circle-item  notice__circle-item_${apiResStatus} notice_col-${appMode.mode} `} id='three'></span>
                </div>

            </div>
        </div>

    )
}