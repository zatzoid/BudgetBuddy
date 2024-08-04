import responses from "../docs/responses.js"


export default {
    '/sign-up': {
        post: { // (Необязательно) Определяет HTTP GET запрос
            summary: 'Регистрация', // (Необязательно) Краткое описание запроса
            description: 'Регистрация юзера в бд и запись на клиенте куки Bearer с его айди из бд для авторизации', // (Необязательно) Подробное описание запроса
            requestBody: { // (Необязательно) Тело запроса
                content: { // Содержимое тела запроса
                    'application/json': {
                        schema: { // Схема тела запроса
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string',
                                    example: 'John Doe'
                                },
                                email: {
                                    type: 'string',
                                    example: 'email@mail.com'
                                },
                                password: {
                                    type: 'string',
                                    example: 'qwerasdzxcv123'
                                }
                            },
                            required: ['name', 'email', 'password']
                        }
                    }
                },
                required: true
            },
            responses: {
                '200': responses.resNoContent['200'],
                '404': responses.resNoContent['404'],
                '409': responses.resNoContent['409']
            }

        }
    },
    '/sign-in': {
        post: {
            summary: 'Логин',
            description: 'Логин юзера, так же получает в ответ куки c айди для авторизации',
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {

                                email: {
                                    type: 'string',
                                    example: 'email@mail.com'
                                },
                                password: {
                                    type: 'string',
                                    example: 'qwerasdzxcv123'
                                }
                            },
                            required: ['email', 'password']
                        }
                    }
                },
                required: true
            },
            responses: {
                '200': responses.resNoContent['200'],
                '404': responses.resNoContent['404'],
                '400': responses.resNoContent['400']
            }

        }
    },
    '/sign-out': {
        post: {
            summary: 'Логаут',
            description: 'логаут, удаляет куки авторизации с клиента',
            parameters: [
                {
                    name: 'Bearer ',
                    in: 'cookie',
                    required: true,
                    schema: {
                        type: 'string',
                        example: '60d21b4667d0d8992e610c85'
                    },
                    description: 'куки авторизации'
                }
            ],

            responses: {
                '200': responses.resNoContent['200']
            }

        }
    },

    '/user-me': {
        get: {
            summary: 'гетер юзер даты',
            description: 'гетит дату юзера ',
            parameters: [
                {
                    name: 'Bearer ',
                    in: 'cookie',
                    required: true,
                    schema: {
                        type: 'string',
                        example: '60d21b4667d0d8992e610c85'
                    },
                    description: 'куки авторизации'
                }
            ],

            responses: {
                '200': responses.resUserContent['200'],
                '404': responses.resNoContent['404'],
            }

        },
        patch: {
            summary: 'обновление name & email',
            description: 'обновление name и email ',
            parameters: [
                {
                    name: 'Bearer ',
                    in: 'cookie',
                    required: true,
                    schema: {
                        type: 'string',
                        example: '60d21b4667d0d8992e610c85'
                    },
                    description: 'куки авторизации'
                }
            ],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {

                                email: {
                                    type: 'string',
                                    example: 'email@mail.com'
                                },
                                name: {
                                    type: 'string',
                                    example: 'userName 123'
                                }
                            },
                            required: ['email', 'name']
                        }
                    }
                },
                required: true
            },

            responses: {
                '200': responses.resUserContent['200'],
                '409': responses.resNoContent['409']
            }

        },
        delete: {
            summary: 'удаление аккаунта',
            description: 'Удаление аккаунта и его постов из бд',
            parameters: [
                {
                    name: 'Bearer ',
                    in: 'cookie',
                    required: true,
                    schema: {
                        type: 'string',
                        example: '60d21b4667d0d8992e610c85'
                    },
                    description: 'куки авторизации'
                }
            ],


            responses: {
                '200': responses.resNoContent['200'],
                '404': responses.resNoContent['404'],
            }

        }
    },

}
