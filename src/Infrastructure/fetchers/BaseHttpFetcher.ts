import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import ClientConfig from '../../common/config';


export class BaseHttpFetcher {
    public axios: AxiosInstance;

    constructor(baseRoute: string, fetcherBaseURL?: string) {
        let baseApiUrl = fetcherBaseURL ? fetcherBaseURL : ClientConfig.apiBaseHost;
        baseApiUrl += `/${baseRoute}`;
        this.axios = axios.create({
            baseURL: baseApiUrl,
        });
    }

    public get<V>(url: string, headers?: any, params?: any): Promise<any> {
        return this.axios.get(url, this.getBasicAxiosConfig({params, headers}));
    }

    public post<V>(url: string, body?: any, headers?: any, params?: any): Promise<any> {
        return this.axios.post(url, body, this.getBasicAxiosConfig({params, headers}));
    }

    public put(url: string, body?: any, headers?: any): Promise<any> {
        return this.axios.put(url, body, this.getBasicAxiosConfig({headers}));
    }

    public del(url: string, headers?: any): Promise<any> {
        return this.axios.delete(url, this.getBasicAxiosConfig({headers}));
    }

    private getBasicAxiosConfig(config?: AxiosRequestConfig): AxiosRequestConfig {
        return config || {};
    }


}
