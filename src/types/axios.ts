import {AxiosResponse} from "axios";

export interface respDataHttp {
    type: string;
    msg: string;
    data: AxiosResponse;
}