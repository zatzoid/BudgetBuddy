import responses from "../docs/responses.js"


export default {
    '/local-posts': {
        get: {
            summary: 'получение постов юзера',
            description: 'Возвращает посты юзера',
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
        },
        post: {
            summary: 'Создание поста юзера',
            description: 'Запись в бд поста юзера, изначально пость создается с пустыми значениями cashData.lose и cashData.profit',
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
                                choisenMonth: {
                                    type: 'string',
                                    example: '11'
                                },
                                choisenYear: {
                                    type: 'string',
                                    example: '2024'
                                }
                            },
                            required: ['choisenMonth', 'choisenYear']
                        }
                    }
                },
                required: true
            },

            responses: {
                '200': responses.resWithContent['200'],
                '404': responses.resNoContent['404'],

            }
        }

    },
    '/local-posts/{postId}': {
        put: {
            summary: 'Добавление статьи  расходов/доходов в пост',
            description: 'Добавление в массив cashData[profit || lose] основного поста нового объекта.',
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
                },
                {
                    in: 'path',
                    name: 'postId',
                    required: true,
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: '60d21b4667d0d8992e610c85'
                    }
                }
            ],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                cashData: {
                                    type: 'object',
                                    properties: {
                                        profit: {
                                            type: 'object',
                                            properties: {
                                                _id: {
                                                    type: 'string',
                                                    format: 'uuid',
                                                    example: '60d21b4667d0d8992e610c85' // Пример ObjectId
                                                },
                                                data: {
                                                    type: 'object',
                                                    additionalProperties: true, // Динамические свойства
                                                    example: {} // Пример данных
                                                },
                                                reminde: {
                                                    type: 'object',
                                                    properties: {
                                                        status: {
                                                            type: 'string',
                                                            example: 'pending'
                                                        },
                                                        data: {
                                                            type: 'object',
                                                            additionalProperties: true, // Динамические свойства
                                                            example: {} // Пример данных
                                                        }
                                                    }
                                                },
                                                postId: {
                                                    type: 'string',
                                                    format: 'uuid',
                                                    example: '60d21b4667d0d8992e610c85' // Пример ObjectId
                                                },
                                                category: {
                                                    type: 'string',
                                                    example: 'другое'
                                                },
                                                statusComplited: {
                                                    type: 'boolean',
                                                    example: false
                                                },
                                                createdAt: {
                                                    type: 'string',
                                                    format: 'date-time',
                                                    example: '2023-08-01T12:00:00Z' // Пример даты
                                                }

                                            }
                                        }
                                    }
                                }
                            },
                            required: ['cashData']
                        }
                    }
                },
                required: true
            },

            responses: {
                '200': responses.resWithContent['200'],
                '404': responses.resNoContent['404'],
            }
        },
        delete: {
            summary: 'Удаление статьи  расходов/доходов в посте',
            description: 'Удаление из массива cashData[profit || lose] основного поста нового объекта.',
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
                },
                {
                    in: 'path',
                    name: 'postId',
                    required: true,
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: '60d21b4667d0d8992e610c85'
                    }
                }
            ],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                cashData: {
                                    type: 'object',
                                    properties: {
                                        profit: {
                                            type: 'object',
                                            properties: {
                                                _id: {
                                                    type: 'string',
                                                    format: 'uuid',
                                                    example: '60d21b4667d0d8992e610c85' // Пример ObjectId
                                                },
                                                data: {
                                                    type: 'object',
                                                    additionalProperties: true, // Динамические свойства
                                                    example: {} // Пример данных
                                                },
                                                reminde: {
                                                    type: 'object',
                                                    properties: {
                                                        status: {
                                                            type: 'string',
                                                            example: 'pending'
                                                        },
                                                        data: {
                                                            type: 'object',
                                                            additionalProperties: true, // Динамические свойства
                                                            example: {} // Пример данных
                                                        }
                                                    }
                                                },
                                                postId: {
                                                    type: 'string',
                                                    format: 'uuid',
                                                    example: '60d21b4667d0d8992e610c85' // Пример ObjectId
                                                },
                                                category: {
                                                    type: 'string',
                                                    example: 'другое'
                                                },
                                                statusComplited: {
                                                    type: 'boolean',
                                                    example: false
                                                },
                                                createdAt: {
                                                    type: 'string',
                                                    format: 'date-time',
                                                    example: '2023-08-01T12:00:00Z' // Пример даты
                                                }

                                            }
                                        }
                                    }
                                }
                            },
                            required: ['cashData']
                        }
                    }
                },
                required: true
            },

            responses: {
                '200': responses.resWithContent['200'],
                '404': responses.resNoContent['404'],
            }
        },
        patch: {
            summary: 'Обновление объекта статьи расходов/доходов в пост',
            description: 'Обновление объекта в массиве cashData[profit || lose] основного поста.',
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
                },
                {
                    in: 'path',
                    name: 'postId',
                    required: true,
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: '60d21b4667d0d8992e610c85'
                    }
                }
            ],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                cashData: {
                                    type: 'object',
                                    properties: {
                                        profit: {
                                            type: 'object',
                                            properties: {
                                                _id: {
                                                    type: 'string',
                                                    format: 'uuid',
                                                    example: '60d21b4667d0d8992e610c85' // Пример ObjectId
                                                },
                                                data: {
                                                    type: 'object',
                                                    additionalProperties: true, // Динамические свойства
                                                    example: {} // Пример данных
                                                },
                                                reminde: {
                                                    type: 'object',
                                                    properties: {
                                                        status: {
                                                            type: 'string',
                                                            example: 'pending'
                                                        },
                                                        data: {
                                                            type: 'object',
                                                            additionalProperties: true, // Динамические свойства
                                                            example: {} // Пример данных
                                                        }
                                                    }
                                                },
                                                postId: {
                                                    type: 'string',
                                                    format: 'uuid',
                                                    example: '60d21b4667d0d8992e610c85' // Пример ObjectId
                                                },
                                                category: {
                                                    type: 'string',
                                                    example: 'другое'
                                                },
                                                statusComplited: {
                                                    type: 'boolean',
                                                    example: false
                                                },
                                                createdAt: {
                                                    type: 'string',
                                                    format: 'date-time',
                                                    example: '2023-08-01T12:00:00Z' // Пример даты
                                                }

                                            }
                                        }
                                    }
                                }
                            },
                            required: ['cashData']
                        }
                    }
                },
                required: true
            },

            responses: {
                '200': responses.resWithContent['200'],
                '404': responses.resNoContent['404'],
            }
        }
    },
    '/local-posts/remind': {
        post: {
            summary: 'Создание напоминалки',
            description: 'Запись в бд с напоминалками на основе значения нужной cashData[profit || lose] и ифнформацией об эмейле, дате отправки и сообщении. И последующая отправка в нужный день',
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
                                date: {
                                    type: 'string',
                                    example: '01.01.2025'
                                },
                                message: {
                                    type: 'string',
                                    example: 'Не забудь оплатить'

                                },
                                emailTo: {
                                    type: 'string',
                                    example: 'myEmail@mail.com'

                                },
                                cashData: {
                                    type: 'object',
                                    properties: {
                                        profit: {
                                            type: 'object',
                                            properties: {
                                                _id: {
                                                    type: 'string',
                                                    format: 'uuid',
                                                    example: '60d21b4667d0d8992e610c85' // Пример ObjectId
                                                },
                                                data: {
                                                    type: 'object',
                                                    additionalProperties: true, // Динамические свойства
                                                    example: {} // Пример данных
                                                },
                                                reminde: {
                                                    type: 'object',
                                                    properties: {
                                                        status: {
                                                            type: 'string',
                                                            example: 'pending'
                                                        },
                                                        data: {
                                                            type: 'object',
                                                            additionalProperties: true, // Динамические свойства
                                                            example: {} // Пример данных
                                                        }
                                                    }
                                                },
                                                postId: {
                                                    type: 'string',
                                                    format: 'uuid',
                                                    example: '60d21b4667d0d8992e610c85' // Пример ObjectId
                                                },
                                                category: {
                                                    type: 'string',
                                                    example: 'другое'
                                                },
                                                statusComplited: {
                                                    type: 'boolean',
                                                    example: false
                                                },
                                                createdAt: {
                                                    type: 'string',
                                                    format: 'date-time',
                                                    example: '2023-08-01T12:00:00Z' // Пример даты
                                                }

                                            }
                                        }
                                    }
                                }
                            },
                            required: ['cashData', 'date', 'message', 'emailTo']
                        }
                    }
                },
                required: true
            },

            responses: {
                '200': responses.resNoContent['200'],
            }
        }
    }


}