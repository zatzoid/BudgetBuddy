import React, { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom'


export default function Header(props) {
    const [showMenu, setShowMenu] = useState(false);

    function openMenu() {
        if (showMenu) {
            return setShowMenu(false)
        }
        setShowMenu(true);
    };

    return (
        <header className='header' >
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
                    <NavLink to='/local-posts' className='header__link'>
                        Личные посты</NavLink>
                    <NavLink to='/public-posts' className='header__link'>
                        Общие посты</NavLink>

                </nav>
                <button className="header__acc-btn" onClick={() => { props.signOut() }}>Выйти из аккаунта</button>
                <button className="header__acc-btn">Удалить аккаунт</button>
            </div>

        </header >
    );
}

