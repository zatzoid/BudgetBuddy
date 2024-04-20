import { Kinde } from "../../../utils/types";
import CheckBox from "../../ui/checkBox/checkBox";
import Select from "../../ui/select/Select";

interface props {
    defaultVal: string
    kinde: Kinde
    hidenComplitedPosts: { lose: string, profit: string }
    hideComplited: (event: React.ChangeEvent<HTMLInputElement>) => void
    sortMassive: (data: { kinde: Kinde, value: string }) => void
}

export default function Sorting(props: props) {


    const sortingSelect = [
        { name: 'сначала новые', value: '-- date' },
        { name: 'по категориям', value: '-- category' },
        { name: 'по выполнению', value: '-- statusComplited' },
        { name: 'от меньшей суммы', value: 'fromSmall sum' },
        { name: 'от большей суммы', value: '-- sum' },

    ]

    function sortMassiveWrapper(e: React.ChangeEvent<HTMLInputElement>) {
        props.sortMassive({ kinde: props.kinde, value: e.currentTarget.value })

    }






    return (
        <div className="sorting">
            <div className="sorting__el">
                <CheckBox
                    text={'скрыть вычеркнутые'}
                    callBack={props.hideComplited}
                    isChecked={props.hidenComplitedPosts[props.kinde] === 'none'}
                    value={props.kinde}
                />
            </div>
            <div className="sorting__el">
                <p className="sorting__el-text">отсортировано по:</p>
                <Select
                    defaultVal={props.defaultVal}
                    selectName={props.kinde}
                    optionsArray={sortingSelect}
                    callBack={sortMassiveWrapper} />
            </div>

        </div>
    )
}