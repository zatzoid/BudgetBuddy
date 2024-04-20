import { useState } from 'react'
import './select.css'

interface props {
    optionsArray: { value: string, name: string }[]
    selectName: string
    iconIsNeed?: boolean | null
    zIndex?: number | null
    defaultVal?: string | null
    callBack: (e: React.ChangeEvent<HTMLInputElement>) => void

}
export default function Select(props: props) {

    const [choisen, setChoisen] = useState<string>(getStartVal());
    const [isShow, setIsShow] = useState<boolean>(false)

    function handlechange(e: React.ChangeEvent<HTMLInputElement>, name: string) {
        setChoisen(name);
        setIsShow(false)
        props.callBack(e)

    }
    function getStartVal(): string {
        const obj = props.optionsArray.find(el => el.value === props.defaultVal);

        return obj ? obj.name : 'ничего не выбрано'
    }

    return (
        <div onClick={() => setIsShow(!isShow)} className='select'>
            <button
                type='button'
                className={`select__choisen ${isShow ? 'select__choisen_active' : 'select__choisen_animate'}`}>
                {choisen}
            </button>
            <ul
                style={{ zIndex: props.zIndex || 5 }}
                className={`select__options ${isShow ? 'select__options_active' : ''}`}>
                {props.optionsArray.map((el) => {
                    return <li className='select__optionEl' key={el.name}>
                        <label className='select__option' >

                            <input
                                className='select__option-input'
                                type="radio"
                                name={props.selectName}
                                value={el.value}
                                defaultChecked={el.value === props.defaultVal}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    handlechange(e, el.name)
                                }} />
                            <p className='select__option-text'>
                                {props.iconIsNeed ? <span className={`select__option-icon back-img_${el.value}`}></span> : ''}
                                {el.name}</p>
                        </label></li>
                })}

            </ul>
        </div>
    )
}