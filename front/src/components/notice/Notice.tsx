import { useEffect, useState } from "react";
import {  MetaData } from "../../utils/types";
interface props {
    resMessage: MetaData | null
}

export default function Notice(props: props) {
    const [isShow, setIsShow] = useState<boolean>(true);

    useEffect(() => {
        if (props.resMessage !== null) {
            setIsShow(true);
            setTimeout(() => {
                closeNotice()
            }, 5000);
        }
        else {
            setIsShow(false)
        }


    }, [props.resMessage]);

    function closeNotice() {
        setIsShow(false);
    }
    return (
        <>{props.resMessage !== null &&
            props.resMessage.message !== undefined ? <div className={`notice ${isShow && 'notice__active'}`}>
                <p className="notice__message">{props.resMessage.statusCode}</p>
            <p className="notice__message">{props.resMessage.message}</p>
            <button
                onClick={() => { closeNotice() }}
                className="notice__close">x</button>
        </div> : ''
        }
        </>
    )
}