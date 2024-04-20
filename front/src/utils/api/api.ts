import { ApiError, ApiFatalError } from "../errors";



export class Api {
    
    constructor() {
       
    }
    _checkError(res: Response) {

        if (res.status >= 500) {
            return Promise.reject(new ApiFatalError('Ошибка в работе сервера.'));
        }
        return res.json()
            .then(data => {
                if (res.ok) {
                    return data
                } else {

                    return Promise.reject(new ApiError(`${data.message || 'не обработанная ошибочка'}`, res.status));
                }
            });
    }

    //хэндлер ошибки при фетч запросе
    _errorHandler(err: Error | ApiError) {

        //ошибка при отправке запроса (не работает сервер)
        //err instanceof Response
        if (err instanceof TypeError) {
            return Promise.reject(new ApiFatalError('Сервер не работает.'));
        } else {
            console.log('errHandler::', err);
            return Promise.reject(new ApiError(`${err.message}`, (err as ApiError).statusCode || 418));
        }

    }
}