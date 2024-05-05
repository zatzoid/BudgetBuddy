import React, { useState } from "react";
import { NavLink, useLocation } from 'react-router-dom'
import { User } from "../../utils/types";
import { CurrentContext } from "../Context";
import CheckBox from "../ui/checkBox/checkBox";
import Select from "../ui/select/Select";

interface props {
    loggedIn: boolean
    signOut: () => void
    deleteUserMe: (email: string) => void
    updateAppSettings: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Header(props: props) {
    console.log('rerender HEADER 👨‍🎓');
    const { userData, appSettings } = React.useContext(CurrentContext);
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [delModalShowed, setDelModalShowed] = useState<boolean>(false)
    const location = useLocation();
    const sortingSelect = [
        { name: 'сначала новые', value: '-- date' },
        { name: 'по категориям', value: '-- category' },
        { name: 'по выполнению', value: '-- statusComplited' },
        { name: 'от меньшей суммы', value: 'fromSmall sum' },
        { name: 'от большей суммы', value: '-- sum' },

    ]




    return (
        <header className='header' >
            <div className="header__wrapper">
                <div className="header__content">
                    <h1 className={`header__heading ${!props.loggedIn && 'header__heading_unlogged '}`}>
                        BudgetBuddy</h1>
                    {
                        props.loggedIn &&
                        <button className="haeder__navbar-btn" onClick={() => { setShowMenu(!showMenu) }}>
                            <hr className={`header__navbar-btn-line ${showMenu && 'header__navbar-btn-line_top'}`} />
                            <hr className={`header__navbar-btn-line ${showMenu && 'header__navbar-btn-line_center'}`} />
                            <hr className={`header__navbar-btn-line ${showMenu && 'header__navbar-btn-line_bottom'}`} />
                        </button>
                    }
                </div>
                <div className={`header__navbar-wrapper ${showMenu && 'header__navbar-wrapper_active'}`}>
                    <nav className="header__navbar">
                        <p className="header__navbar-text">внутренняя навигация</p>
                        <div className="header__navbar-link">

                            <NavLink to='/local-posts' onClick={() => { setShowMenu(!showMenu) }} className='header__navbar-link-el'>
                                Посты </NavLink>
                            <span className={`header__navbar-link-arrow ${location.pathname === '/local-posts' && 'header__navbar-link-arrow_active'}`}>
                                &larr; ты тут</span>
                        </div>
                        <div className="header__navbar-link">

                            <NavLink to='/' onClick={() => { setShowMenu(!showMenu) }} className='header__navbar-link-el'>
                                Презентация</NavLink>
                            <span className={`header__navbar-link-arrow ${location.pathname === '/' && 'header__navbar-link-arrow_active'}`}>
                                &larr; ты тут</span>
                        </div>

                    </nav>
                    <div className="header__navbar">
                        <p className="header__navbar-text">Задать настройки приложения:</p>
                        <ul className="header__navbar-settings">

                            <li className="header__navbar-settings-el">
                                <CheckBox text="Оставить статистику всегда открытой" isChecked={appSettings.statsMustOpen} callBack={props.updateAppSettings} name="statsMustOpen" />
                            </li>
                            <li className="header__navbar-settings-el">
                                <CheckBox text="Показывать статус запросов полностью" isChecked={appSettings.noticeMustOpen} callBack={props.updateAppSettings} name="noticeMustOpen" />
                            </li>

                            <li className="header__navbar-settings-el">
                                <p className="header__navbar-text">Настройка доходов:</p>
                                <CheckBox text="Всегда скрывать вычеркнутые" isChecked={appSettings.profitHideComplited} callBack={props.updateAppSettings} name="profitHideComplited" />
                                <Select

                                    zIndex={6}
                                    optionsArray={sortingSelect}
                                    selectName="profitSorting"
                                    defaultVal={appSettings.profitSorting}
                                    callBack={props.updateAppSettings} />
                            </li>
                            <li className="header__navbar-settings-el">
                                <p className="header__navbar-text">Настройка расходов:</p>
                                <CheckBox text="Всегда скрывать вычеркнутые" isChecked={appSettings.loseHideComplited} callBack={props.updateAppSettings} name="loseHideComplited" />
                                <Select

                                    optionsArray={sortingSelect}
                                    selectName="loseSorting"
                                    defaultVal={appSettings.loseSorting}
                                    callBack={props.updateAppSettings} />
                            </li>
                            <li className="header__navbar-settings-el">
                                <p className="header__navbar-text">Режим работы приложения:</p>
                                <CheckBox text="Онлайн" isChecked={appSettings.startAppMode === 'online'} callBack={props.updateAppSettings} name="startAppMode" value="online" />
                                <CheckBox text="Оффлайн" isChecked={appSettings.startAppMode === 'offline'} callBack={props.updateAppSettings} name="startAppMode" value="offline" />
                            </li>


                        </ul>
                    </div>
                    <button className="header__acc-btn" onClick={() => { props.signOut(); setShowMenu(!showMenu) }}>Выйти из аккаунта</button>
                    <button className="header__acc-btn" onClick={() => { setDelModalShowed(!delModalShowed) }}>Удалить аккаунт</button>
                </div>
            </div>
            <div className={`headerModal ${delModalShowed && 'headerModal_active'}`}>
                <div className="headerModal__content">
                    <p className="headerModal__text">
                        вы удалите из базы: аккаунт, все сделанные им записи, и уведомления на почту которые еще не были отправлены .
                    </p>
                    <div className="headerModal__btn-block">
                        <button className="headerModal__btn headerModal__btn_ok" onClick={() => { props.deleteUserMe((userData as User).email); setShowMenu(!showMenu); setDelModalShowed(!delModalShowed) }}>ладно</button>
                        <button className="headerModal__btn headerModal__btn_cancel" onClick={() => setDelModalShowed(!delModalShowed)}>я передумал</button>
                    </div>

                </div>

            </div>
        </header >
    );
}

