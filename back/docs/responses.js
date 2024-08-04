
const metaData = {
    metaData: {
        type: 'object',
        properties: {
            message: {
                type: 'string',
                example: 'сопутствующее сообщение'
            },
            statusCode: {
                type: 'integer',
                format: 'int64',
                example: '111'
            }
        }

    }
}
const localPost = {
    type: 'object',
    properties: {
        owner: {
            type: 'string',
            format: 'uuid',
            example: '60d21b4667d0d8992e610c85' // Пример ObjectId
        },
        posted: {
            type: 'boolean',
            example: false
        },
        cashData: {
            type: 'object',
            properties: {
                profit: {
                    type: 'array',
                    items: {
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
                },
                lose: {
                    type: 'array',
                    items: {
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
        createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2023-08-01T12:00:00Z' // Пример даты
        },
        choisenMonth: {
            type: 'integer',
            example: 8 // Пример месяца
        },
        choisenYear: {
            type: 'integer',
            example: 2023 // Пример года
        }
    },
    required: ['owner', 'posted', 'cashData', 'choisenMonth', 'choisenYear']
}


export default {
    resNoContent: {
        '200': {
            description: 'Успешный ответ',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: metaData
                    }
                }
            }
        },
        '400': {
            description: 'ошибка валидации возвращаемая через мидлвэер',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: metaData
                    }
                }
            }
        },
        '404': {
            description: 'что то не найдено в бд',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: metaData
                    }
                }
            }
        },
        '409': {
            description: 'почта уже зарегана в базе',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: metaData
                    }
                }
            }
        }
    },
    resWithContent: {
        '200': {
            description: 'Успешный ответ с контенетом',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: { ...metaData, content: localPost }
                    }
                }
            }
        }
    },
    resUserContent: {
        '200': {
            description: 'Успешный ответ с контенетом',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            ...metaData,
                            content: {
                                type: 'object',
                                properties: {
                                    email: {
                                        type: 'string',
                                        example: 'newemail@mail.com'
                                    },
                                    name:{
                                        type:'string',
                                        example:'new user name 321'
                                    }
                                },
                            }
                        }
                    }
                }
            }
        }
    }

}