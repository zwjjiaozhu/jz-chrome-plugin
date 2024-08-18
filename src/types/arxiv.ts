import {AxiosRequestConfig, AxiosResponse} from "axios";


export interface httpReqParams {
    type: string;
    msg?: string;
    data: AxiosRequestConfig
}

export interface httpRespParams {
    type: string;
    msg?: string;
    data?: AxiosResponse;
}

export type arxivTransReqParams = {
    type: string;
    msg: string;
    data: arxivTransReqItemParams[]
}

export interface arxivTransReqItemParams {
    text: string,
    from: string,
    to: string,
    rootId: string,  // 节点的所在块（p、h1、等 ）的id
    nodeId: string,
}

export interface arxivTransRespParams {
    type: string;
    msg?: string;
    data?: arxivTransDataItem[]
}

export interface arxivTransDataItem {
    text: string,
    rootId: string,  // 节点的所在块（p、h1、等 ）的id
    nodeId: string,
}