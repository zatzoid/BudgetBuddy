import React, { useEffect, useState } from "react";
import PostedEl from "../../localPosts/PostedEl/PostedEl";
import imgDefault from '../../../images/user.svg';
import getMonthName from "../../../utils/getMonthName";


export default function PublicEl(props) {
    const [showMore, setShowMore] = useState(false)
    const totalProfit = props.dataEl?.cashData.profit.reduce((acc, item) => acc + Object.values(item)[1], 0);
    const totalLose = props.dataEl?.cashData.lose.reduce((acc, item) => acc + Object.values(item)[1], 0);
    function showMoreInfo() {
        if (showMore) {
            return setShowMore(false)
        }
        setShowMore(true)
    }
    return (
        <>
            <li className={`public-el ${showMore && 'public-el_more'}`}>
                <img className="public-el__diagramm" src={imgDefault} alt="qwe" />
                <p className="public-el__name">{props.dataEl?.owner.name} </p>
                <p className="public-el__date">{`${getMonthName(props.dataEl?.choisenMonth)} ${props.dataEl?.choisenYear}`}</p>
                <div className="public-el__cashdata public-el__cashdata_profit">
                    <p className="public-el__cashdata-text">Общий доход:</p>
                    <p className="public-el__cashdata-text">{totalProfit}</p>
                </div>
                <div className="public-el__cashdata public-el__cashdata_lose">
                    <p className="public-el__cashdata-text">Общий расход:</p>
                    <p className="public-el__cashdata-text">{totalLose}</p>
                </div>
                <p className="public-el__description">{props.dataEl?.description}</p>
                <button
                    onClick={() => { showMoreInfo() }}
                    className={`button__show-more-btn ${showMore && 'button__show-more-btn_active'}`} />
                <ul className={`public-el__show-more-wrapper ${showMore && 'public-el__show-more-wrapper_active'}`}>

                    {Array.isArray(props.dataEl?.cashData.profit) && props.dataEl?.cashData.profit.map((item) => (
                        <PostedEl key={item._id} keyName={Object.keys(item)[1]} value={Object.values(item)[1]} />))}
                    {Array.isArray(props.dataEl?.cashData.lose) && props.dataEl?.cashData.lose.map((item) => (
                        <PostedEl key={item._id} keyName={Object.keys(item)[1]} value={Object.values(item)[1]} />))}
                    <button
                        onClick={() => { showMoreInfo() }}
                        className={`button__show-more-btn button__show-more-btn_list ${showMore && 'button__show-more-btn_active'}`} />
                </ul>
            </li>
        </>
    )
}