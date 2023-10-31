import React, { useEffect, useState } from "react";

export default function Notice(props) {
    const [isShow, setIsShow] = useState(true);
    const [timeOutId, setTimeOutId] = useState(null);
    useEffect(() => {
        console.log(props.resMessage)
        if (props.resMessage !== null) {
            setIsShow(true);
            const timeOutShow = setTimeout(() => {
                closeNotice()
                clearTimeout(timeOutId);
            }, 5000);
            setTimeOutId(timeOutShow);
        }
        else {
            setIsShow(false)
        }
        return () => {
            if (timeOutId) {
                clearTimeout(timeOutId);
            }
        };

    }, [props.resMessage]);

    function closeNotice() {
        setIsShow(false);
        if (timeOutId) {
            clearTimeout(timeOutId);
        }
        setIsShow(false);
    }
    return (
        <>{props.resMessage !== null &&
            props.resMessage.message !== undefined ? <div className={`notice ${isShow && 'notice__active'}`}>
            <p className="notice__message">{props.resMessage.message}</p>
            <button
                onClick={() => { closeNotice() }}
                className="notice__close">x</button>
        </div> : ''
        }
        </>
    )
}