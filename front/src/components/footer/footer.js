import React from 'react';

export default function Footer() {
    return (
        <footer className='footer'>
            <p className='footer__text'>made by
            <a className='footer__link footer__link_gh'
                href='https://github.com/zatzoid'
                target='blank'> zatzoid</a>
            </p>
            <p className='footer__text'>
                <a className='footer__link' rel="noreferrer" target='_blank' href='https://zatzoid-projects.ru'>Остальные работы</a>
            </p>
        </footer>
    )

}