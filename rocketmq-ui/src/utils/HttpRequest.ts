import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';


export interface BizRequestConfig extends AxiosRequestConfig {
  headers?: Record<string, string>;

  /**
   * 是否返回原始响应对象。默认会返回接口中的 `data` 字段值，
   * 如果设置为 `true`，则会返回一个包含 `data`、`code`、`msg` 3 个字段的对象
   *
   * @default false
   */
  getResponse?: boolean;

  /**
   * 是否需要登录，如果设置为 `true`，会在请求头中带上 `token`
   *
   * @default true
   */
  requireAuth?: boolean;

  /**
   * 请求成功时的业务状态码
   *
   * @default 0
   */
  successCode?: number;

  /**
   * 请求成功后是否显示 toast 提示，
   * 设置为 `true` 时显示接口中返回的 `msg` 字段，也可以传递一个字符串自定义提示内容
   *
   * @default false
   */
  successMessage?: boolean | string;

  /**
   * 当 `code` 不为 `successCode` 时 `request` 会抛出一个异常，并且会做统一的错误提示，设置 `skipErrorHandler: true` 会跳过默认的错误处理
   *
   * @default false
   */
  skipErrorHandler?: boolean;

  /**
   * 是否使用 mock 数据
   *
   * @default false
   */
  mock?: boolean;
}


export interface BizResponse<T> {
  /**
   * 业务状态码
   */
  status: number;

  /**
   * 响应数据
   */
  data: T;

  /**
   * 响应消息
   */
  msg: string;
}



// 请求超时时间
axios.defaults.timeout = 60 * 1000;
axios.defaults.validateStatus = () => true;

/**
 * 请求工具
 */
async function HttpRequest(config: BizRequestConfig) {

  config.headers = config.headers ?? {};

  console.log(">>>config",config);
  if (config.method?.toUpperCase() === 'POST') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    config.data = config.params;
    config.params = null;
  }

    // @ts-ignore
    const response = await axios.request(config);
    // @ts-ignore
    const {  data } = response;
    return data;

}

export default HttpRequest;
