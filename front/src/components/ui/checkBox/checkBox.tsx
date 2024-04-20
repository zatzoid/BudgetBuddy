import './checkBox.css';

interface props {
    text: string
    callBack: (e: React.ChangeEvent<HTMLInputElement>) => void
    isChecked: boolean
    value?: string 
    name?: string

}
export default function CheckBox(props: props) {
    return (
        <label className="checkBox">
            <input
                onChange={(e) => props.callBack(e)}
                checked={props.isChecked}
                value={props.value}
                name={props.name ? props.name : props.text}
                type='checkbox' />
            <span></span>
            <p className='checkbox__text'>{props.text}</p>


        </label>
    )
}