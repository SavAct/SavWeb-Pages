// ---------------------------------------
// Actions send by the browser to the page
// ---------------------------------------

export interface RouteLocation{
    fullPath: string
    path: string
    query: {[k: string]: string | null | Array<string | null>}
    hash: string
}

export interface PageIni extends RouteLocation {
    f: 'ini'
    link: string
    idToken: string
    darkstyle: boolean 
}

export interface VerifyIdResult{
    f: 'verifyIdResult'
    verified: boolean
}

export interface PaymentResult{
    f: 'payResult'
    id: string
    result: boolean
}

export interface GetFileResult{
    f: 'getFileResult'
    id: string
    file: File
}

export interface EosioChainApiResult{
    f: 'eosioChainApiResult'
    id: string
    post: 'get_account' | 'get_table_rows' | 'get_currency_balance',
    result: unknown,
}

export interface BrowserAction{
    SavWeb: PageIni | GetFileResult | VerifyIdResult | EosioChainApiResult
}

// ---------------------------------------
// Actions send by the page to the browser
// ---------------------------------------

export interface GoTo{
    f: 'go'
    to: string          // URL of a file on blockchain
}

export interface GetFile{
    f: 'getFile'
    id: string
    get: string         // Link to a file
    idToken: string
}

export interface SavActPayment{
    time: number | {    // seconds since epoch (from midnight of January 1, 1970). Attention seconds are needed, date.getTime is in milli seconds
        min?: number,
        max?: number
    }
}

export interface Payment{
    f: 'pay'
    id: string
    chain: string       // Chain id or chain short name
    from: string
    to: string
    quantity: string    // Asset like "1.2300 EOS"
    memo: string
    SavAct?: SavActPayment  
    idToken: string
}

export interface EosioChainApi{
    f: 'eosioChainApi'
    id: string
    chain: string               // Chain id or chain short name
    post: 'get_account' | 'get_table_rows' | 'get_currency_balance',
    params: unknown,
    idToken: string
}

export interface Transaction{
    f: 'trx'
    id: string
    chain: string
    data: unknown
    idToken: string
}

export interface VerifiyId{
    f: 'verifyId'
    idToken: string     
    alt?: string            // if idToken is not equal, then goto alt otherwise load the last requested html file   
    recVersion?: number     // recommended version of the browser
}

export interface PageAction{
    SavWeb: Payment | Transaction | GetFile | GoTo | VerifiyId | EosioChainApi
}