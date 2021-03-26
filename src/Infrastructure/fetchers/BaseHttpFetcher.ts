import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelToken} from 'axios';
import {isNullOrUndefined} from 'util';
import {SessionConsts} from '../../common/consts/SessionConsts';
import SessionUtils from '../../common/utils/SessionUtils';
import {ApiResponseBody} from '../interfaces/ApiResponse.interface';
import ClientConfig from '../../common/config';
import * as https from 'https';
import {RoutesUrl} from '../../common/consts/Routes';
import EnvUtils, {EnvKeys} from '../../common/envVairables/envUtils';

const TOKEN_KEY_ON_HEADERS = 'Authorization';
export class BaseHttpFetcher {
	public axios: AxiosInstance;

	constructor(baseRoute: string, fetcherBaseURL?: string) {
		let baseApiUrl = fetcherBaseURL ? fetcherBaseURL : ClientConfig.apiBaseHost;
		baseApiUrl += `/${baseRoute}`;
		this.axios = axios.create({
			baseURL: baseApiUrl,
			httpsAgent: new https.Agent({
				rejectUnauthorized: false,
			}),
		});
		// Set interceptor on the request
		this.axios.interceptors.request.use(async (config: AxiosRequestConfig) => {
			// Check if there is NOT token on the headers
			// Also checks if this request should have token
			if (isNullOrUndefined(config.headers[TOKEN_KEY_ON_HEADERS]) && this.shouldAddTokenToRequest(config)) {
				// Set token from storage
				const tokenFromStorage = SessionUtils.getItem(SessionConsts.Token);
				if (tokenFromStorage) {
					config.headers[TOKEN_KEY_ON_HEADERS] = `Bearer ${tokenFromStorage}`;
				}
			}

			// Set withCredentials
			// if (EnvUtils.getEnvVariable(EnvKeys.REACT_APP_ENV) === 'prod') {
			// 	config.withCredentials = true;
			// }

			return config;
		});

		// Set interceptor on the response - Always return the "data" from the response
		this.axios.interceptors.response.use((response: AxiosResponse<ApiResponseBody>) => {
			const apiResponse: ApiResponseBody = response.data?.results || response.data;
			return apiResponse as any;
		}, function(error) {
			if ((error?.response?.status === 403) && SessionUtils.getItem(SessionConsts.Token)) {
				SessionUtils.removeItem(SessionConsts.Token);
				SessionUtils.removeItem(SessionConsts.Username);
				SessionUtils.removeItem(SessionConsts.LoginBySealed);
				window.location.href = RoutesUrl.authNew.loginNew;
			} else if ((error?.response?.status === 401 || error?.response?.status === 402) && SessionUtils.getItem(SessionConsts.Token)) {
				throw error;
			} else {
				return Promise.reject(error);
			}
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

	public postFormData(url: string, file: any) {
		const formData = new FormData();
		formData.append('file', file);
		const axiosConfig = this.getBasicAxiosConfig({
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return this.post(url, formData, axiosConfig);
	}

	public uploadFile(url: string, file: any, cancelToken: CancelToken): Promise<any> {
		const formData = new FormData();
		formData.append('file', file);

		const axiosConfig = this.getBasicAxiosConfig({
			cancelToken,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return this.post(url, formData, axiosConfig);
	}

	/**
	 * This method is for future "thinking".
	 * When we'll need to change the configuration, we can do that in this method
	 * @param config configuration object of Axios
	 */
	private getBasicAxiosConfig(config?: AxiosRequestConfig): AxiosRequestConfig {
		return config || {};
	}

	/**
	 * This method decides wether to send the token (from localStorage) in the request
	 * Currently, it's checking:
	 * The url we send the request to
	 * @param config The request object (By Axios)
	 */
	private shouldAddTokenToRequest(config: AxiosRequestConfig) {
		// if (config && config.url) {
		//	Do some manipulations on the URL
		// }

		return true;
	}
}
