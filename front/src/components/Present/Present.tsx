import { useState } from "react";
import useTouchSlider from "../../utils/customHooks/useTouchSlider";
import { NavLink } from 'react-router-dom'


interface props {
    loggedIn: boolean
}

export default function Present(props: props) {
    const [translateValue, setTranslateValue] = useState(0);
    const { handleTouchStartY, handleTouchMove, handleTouchEnd, sliderStyleY } = useTouchSlider({ callback: scrollPresent, step: translateValue })

    function scrollPresent(val: number) {
        if (translateValue + val < 2) {
            setTranslateValue(translateValue + val)
        }
        else {
            setTranslateValue(0)
        }
    }

    return (
        <div className="present">
            <div className="present-wrapper"
                style={sliderStyleY}
                onTouchStart={handleTouchStartY}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleTouchStartY}
                onMouseMove={handleTouchMove}
                onMouseUp={handleTouchEnd}>

                <section className="present__el present__el_one">
                    <div className="preset__redirect-container">
                        {!props.loggedIn ? <>
                            <NavLink to={'/sign-up'} className="present__redirect-btn">Регистрация</NavLink>
                            <NavLink to={'/sign-in'} className="present__redirect-btn">Вход</NavLink>
                        </> :
                            <NavLink to={'/local-posts'} className="present__redirect-btn">Посты</NavLink>}
                    </div>
                    <div className="presetn__description">
                        <h2 className="presetn__description-heading">BudgetBuddy</h2>
                        <p className="presetn__description-text">Это не комерческий, учебный проект, который создавался <a
                            className="presetn__description-link" href='https://github.com/zatzoid'
                            target='blank'>мной</a> для оттачивания навыков в реакте и экспрессе</p>
                        <p className="presetn__description-text">Функциональная цель проекта - это запись и мониторинг своих финансовых операций (прямо как в банковских приложениях),
                            и отправки тайминговых "напоминалок" на почту о какой либо операции </p>
                        <p className="presetn__description-text">В проекте присутсвует регистрация по почте, почта используеться только для отправки "напоминалок" в выбранную юзером дату,
                            почта для регистрации обязательна, но подтверждать ее не потребуется,
                            допустима запись любого адреса в формате email, на этот адрес будут приходить "напоминалки"</p>
                        <p className="presetn__description-text">Так же в проекте используются внутренние "куки" для авторизации, функции удаления аккаунта и логаут удаляют их. </p>
                        <p className="presetn__description-text">Удаление аккаунта. В проекте есть функция для удаления аккаунта и всех следов его прибывания,
                            она удалит как сам аккаунт так и записи созданные через этот аккаунт (в том числе и "напоминалки").</p>

                    </div>

                    <button className="present__el-btn" onClick={() => { scrollPresent(1) }} />
                </section>
                <section className="present__el present__el_two">
                    <div className="presetn__description">
                        <h2 className="presetn__description-heading">Гайд</h2>
                        <h3 className="present__description-Phead">Создание</h3>
                        <p className="presetn__description-text">По нажатию кнопки "Добавить запись" создает документ в бд с выбранным месяцом и припысывается вашему юзеру.</p>
                        <p className="presetn__description-text">Добавить доход/расход - добавляет запись(объект) в массив основного документа </p>
                        <h3 className="present__description-Phead">Действия с записями</h3>
                        <p className="presetn__description-text">После создания записи в выбранном месяце, его можно: удалить, создать уведомление на почту указанную при регистрации и "вычеркнуть"(отметить как выполнено)</p>
                        <p className="presetn__description-text">Отправка на почту - создается объект в бд с информацией и датой отправки, дата отправки должна быть не раньше завтрашнего дня.
                            Каждый день в 1:00 по мск выполняется функция по поиску в бд данных на отправку с текущей датой, после чего найденные на отправку данные формируются и отправляются</p>
                        <p className="presetn__description-text">Письма отправляются с mail.ru, и на других доменах получателя скорее всего попадут в спам</p>
                        <h3 className="present__description-Phead">Статистика</h3>
                        <p className="presetn__description-text">Доступна после добавляения хотя бы одной статьи доходов/расходов</p>
                        <p className="presetn__description-text">Данные берет из текущего и предедущего документа вашего юзера, вседанные подсчитываются на стороне клиента</p>



                    </div>

                    <button className="present__el-btn present__el-btn_top"
                        onClick={() => { scrollPresent(-1) }} />
                    {/*  <button className="present__el-btn" onClick={() => { scrollPresent(1) }} /> */}

                </section>
                {/*  <section className="present__el present__el_three">
                    3
                    <button className="present__el-btn present__el-btn_top"
                        onClick={() => { scrollPresent(-1) }} />

                </section> */}
            </div>
        </div>
    )
}