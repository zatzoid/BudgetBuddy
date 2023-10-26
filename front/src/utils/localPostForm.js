import { useState } from "react";

export default function useLocalPostForm() {
    const [profitValues, setProfitValues] = useState({});
    const [loseValues, setLoseValues] = useState({});
    function resetProfitForm() {
        setProfitValues({})
    };
    function resetLoseForm() {
        setLoseValues({})
    };
    const handleChangeProfit = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        console.log(profitValues)
        setProfitValues({ ...profitValues, [name]: value });
    };
    const handleChangeLose = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        setLoseValues({ ...loseValues, [name]: value });
    };
    return { profitValues, loseValues, resetLoseForm, resetProfitForm, handleChangeLose, handleChangeProfit }

}