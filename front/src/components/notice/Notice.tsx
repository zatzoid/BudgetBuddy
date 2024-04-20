import { useContext, useEffect, useState } from "react";
import { MetaData, appMode } from "../../utils/types";
import { CurrentContext } from "../Context";
interface props {
    resMessage: MetaData | null
    switchMode: (mode: appMode) => void
}

export default function Notice(props: props) {
    const [isShow, setIsShow] = useState<boolean>(true);
    const [apiResStatus, setApiResStatus] = useState<string>('loading');
    const { appMode, appSettings } = useContext(CurrentContext);

    useEffect(() => {
        if (props.resMessage !== null) {
            if (appSettings.noticeMustOpen) {
                setIsShow(true);
            }



            if (props.resMessage.statusCode === 102) {
                setApiResStatus('loading')

            }
            else if (props.resMessage.statusCode >= 200 && props.resMessage.statusCode < 300) {
                setApiResStatus('success')

            }
            else if (props.resMessage.statusCode >= 400) {
                setApiResStatus('fail')
            }
        }
        else {
            setIsShow(false)
        }


    }, [props.resMessage]);



    return (
        <div className="notice" >

            <div className={`notice__message ${isShow ? 'notice__message_active' : ''}`}>
                <div className="notice__message-datas">
                    <p className="notice__message-data">{props.resMessage?.statusCode}<span className={`notice__message-data-color notice__message-data-color_${apiResStatus}`}></span></p>
                    <p className="notice__message-data">{props.resMessage?.message}</p>
                    {props.resMessage?.statusCode && props.resMessage?.statusCode >= 500 && <div className="notice__message-datas-modal">

                        <p className="notice__message-data">Похоже сервер в данный момент не отвечает, можете перейти в другой режим работы</p>

                        <p className="notice__message-data"> Сменить режим работы приложения:</p>
                        <button
                            className="notice__message-btn notice_col-online"

                            onClick={() => props.switchMode({ mode: 'online' })}
                            disabled={appMode.mode === 'online' || props.resMessage?.statusCode === 102}
                            title="работа с сервером">
                            Онлайн</button>

                        <button
                            className="notice__message-btn notice_col-offline"
                            onClick={() => props.switchMode({ mode: 'offline' })}
                            disabled={appMode.mode === 'offline' || props.resMessage?.statusCode === 102}
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