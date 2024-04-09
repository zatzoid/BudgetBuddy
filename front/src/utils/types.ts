export interface User {
    avatar: string
    name: string
    email: string
}
export interface UserSign {
    name: string | null
    email: string
    password: string
}

export interface Input {
    [key: string]: string;
}

export interface MetaData {
    statusCode: number
    message: string
}
export interface ApiRes{
    metaData: MetaData
    content: LocalPost | LocalPost[]
}
export interface LocalPost {
    owner: string
    posted: boolean
    _id: string
    postId: string
    cashData: {
        profit: CashData[],
        lose: CashData[]
    },
    createdAt: Date,
    choisenMonth: number,
    choisenYear: number
}
export interface CashDataFromClient {
    cashData: {
        [key: string]: {
            category: string,
            data: CashDataData
        }
    },
    postId: string
}
export interface CashData {
    _id: string
    data: CashDataData
    reminde: {
        status: string | null
        data: { dateToSend: string, message: string }
    },
    postId: string
    category: string
    statusComplited: boolean
    createdAt: Date



}

// kindeName: {cashData: ....}
// для патч запросов
export interface CashDataPatch {
    cashData: { [key: string]: CashData }

}

export interface CashDataData {
    [key: string]: number
}


export interface EmailModalParams {
    mainData: CashData,
    date: string,
    message: string,
    emailTo: string
}