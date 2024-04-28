import { useNavigate } from "react-router-dom"

export default function NotFoundPage() {
    const navigate = useNavigate()
    return (
        <div className="NFPage">
            <p className="NFPage__text">Такой страницы нет</p>
            <button className="NFPage__btn" onClick={() => { navigate('/') }}>вернуться назад</button>
        </div>
    )
}