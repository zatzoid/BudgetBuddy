import React, { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom'


export default function Header(props) {
    const [showMenu, setShowMenu] = useState(false);
    const [delModalShowed, setDelModalShowed] = useState(false)

    function openMenu() {
        if (showMenu) {
            return setShowMenu(false)
        }
        setShowMenu(true);
    };
    function openModalDeleteUser() {
        if (delModalShowed) {
            return setDelModalShowed(false)
        }
        setDelModalShowed(true);
    }

    return (
        <header className='header' >
            <div className="header__wrapper">
                <div className="header__content">
                    <h1 className={`header__heading ${!props.loggedIn && 'header__heading_unlogged '}`}>
                        BudgetBuddy</h1>
                    {
                        props.loggedIn &&
                        <button className="haeder__navbar-btn" onClick={() => { openMenu() }}>
                            <hr className={`header__navbar-btn-line ${showMenu && 'header__navbar-btn-line_top'}`} />
                            <hr className={`header__navbar-btn-line ${showMenu && 'header__navbar-btn-line_center'}`} />
                            <hr className={`header__navbar-btn-line ${showMenu && 'header__navbar-btn-line_bottom'}`} />
                        </button>
                    }
                </div>
                <div className={`header__navbar-wrapper ${showMenu && 'header__navbar-wrapper_active'}`}>
                    <nav className="header__navbar">
                        <NavLink to='/local-posts' onClick={() => { openMenu() }} className='header__link'>
                            Личные посты</NavLink>
                        <NavLink to='/' onClick={() => { openMenu() }} className='header__link'>
                            Презентация</NavLink>

                    </nav>
                    <button className="header__acc-btn" onClick={() => { props.signOut(); openMenu() }}>Выйти из аккаунта</button>
                    {/*  props.deleteUserMe({ email: props.userData.email }); openMenu()  */}
                    <button className="header__acc-btn" onClick={() => { openModalDeleteUser() }}>Удалить аккаунт</button>
                </div>
            </div>
            <div className={`headerModal ${delModalShowed && 'headerModal_active'}`}>
                <div className="headerModal__content">
                    <p className="headerModal__text">
                        вы удалите из базы: аккаунт, все сделанные им записи, и уведомления на почту которые еще не были отправлены .
                    </p>
                    <div className="headerModal__btn-block">
                        <button className="headerModal__btn headerModal__btn_ok" onClick={() => { props.deleteUserMe({ email: props.userData.email }); openMenu(); openModalDeleteUser() }}>ладно</button>
                        <button className="headerModal__btn headerModal__btn_cancel" onClick={() => openModalDeleteUser()}>я передумал</button>
                    </div>

                </div>

            </div>
        </header >
    );
}

