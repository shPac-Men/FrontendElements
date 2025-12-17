/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface HandlerAddToMixingRequest {
  element_id: number;
  /** @min 0 */
  volume: number;
}

export interface HandlerCartIconResponse {
  draft_order_id?: number;
  items_count?: number;
}

export interface HandlerCreateElementRequest {
  /** @min 0 */
  concentration: number;
  /** @maxLength 100 */
  description?: string;
  /**
   * @minLength 1
   * @maxLength 25
   */
  name: string;
  /**
   * @min 0
   * @max 14
   */
  ph: number;
}

export interface HandlerCreateMixingRequest {
  description?: string;
  title: string;
}

export interface HandlerErrorResponse {
  error?: string;
  message?: string;
  success?: boolean;
}

export interface HandlerLoginRequest {
  login: string;
  password: string;
}

export interface HandlerLoginResponse {
  expires_in?: number;
  token?: string;
  token_type?: string;
  user?: HandlerUserInfo;
}

export interface HandlerRegisterRequest {
  /**
   * @minLength 3
   * @maxLength 25
   */
  login: string;
  /** @minLength 6 */
  password: string;
}

export interface HandlerRegisterResponse {
  message?: string;
  user?: HandlerUserInfo;
}

export interface HandlerRemoveFromMixingRequest {
  element_id: number;
}

export interface HandlerSuccessResponse {
  data?: any;
  message?: string;
  success?: boolean;
}

export interface HandlerUpdateElementRequest {
  /** @min 0 */
  concentration?: number;
  /** @maxLength 100 */
  description?: string;
  /**
   * @minLength 1
   * @maxLength 25
   */
  name?: string;
  /**
   * @min 0
   * @max 14
   */
  ph?: number;
}

export interface HandlerUpdateMixedRequest {
  added_water?: number;
  concentration?: number;
  ph?: number;
  status?: string;
  total_volume?: number;
}

export interface HandlerUpdateUserRequest {
  /**
   * @minLength 3
   * @maxLength 25
   */
  login?: string;
  /** @minLength 6 */
  password?: string;
}

export interface HandlerUpdateUserRoleRequest {
  is_moderator?: boolean;
}

export interface HandlerUserInfo {
  id?: number;
  is_moderator?: boolean;
  login?: string;
  role?: string;
}

export type ServiceCompleteMixedRequest = object;

export interface ServiceDeleteFromMixedRequest {
  elementID?: number;
  hardDelete?: boolean;
}

export interface ServiceDeleteMixedRequest {
  hardDelete?: boolean;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "http://localhost:8082/api/v1",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title API Chemistry
 * @version 1.0
 * @license AS IS (NO WARRANTY)
 * @baseUrl http://localhost:8082/api/v1
 * @contact API Support <bitop@spatecon.ru> (https://vk.com/bmstu_schedule)
 *
 * DoIA
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  admin = {
    /**
     * @description Get list of all mixing orders in system (Admin only)
     *
     * @tags admin
     * @name MixedList
     * @summary Get all mixing orders
     * @request GET:/admin/mixed
     * @secure
     */
    mixedList: (
      query?: {
        /** Filter by status (draft, pending, completed) */
        status?: string;
        /** Filter by creator login */
        creator?: string;
        /** Limit results (default: 50) */
        limit?: number;
        /** Offset results (default: 0) */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<HandlerSuccessResponse, HandlerErrorResponse>({
        path: `/admin/mixed`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new mixing order from user's cart (Admin only)
     *
     * @tags mixing
     * @name MixedCreate
     * @summary Create mixing order from cart
     * @request POST:/admin/mixed
     * @secure
     */
    mixedCreate: (
      request: HandlerCreateMixingRequest,
      params: RequestParams = {},
    ) =>
      this.request<HandlerSuccessResponse, HandlerErrorResponse>({
        path: `/admin/mixed`,
        method: "POST",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get detailed info about any mixing order (Admin only)
     *
     * @tags admin
     * @name MixedDetail
     * @summary Get mixing order by ID
     * @request GET:/admin/mixed/{id}
     * @secure
     */
    mixedDetail: (id: number, params: RequestParams = {}) =>
      this.request<HandlerSuccessResponse, HandlerErrorResponse>({
        path: `/admin/mixed/${id}`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update mixing order parameters (Admin only)
     *
     * @tags admin
     * @name MixedUpdate
     * @summary Update mixing order
     * @request PUT:/admin/mixed/{id}
     * @secure
     */
    mixedUpdate: (
      id: number,
      request: HandlerUpdateMixedRequest,
      params: RequestParams = {},
    ) =>
      this.request<HandlerSuccessResponse, HandlerErrorResponse>({
        path: `/admin/mixed/${id}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Soft or hard delete mixing order (Admin only)
     *
     * @tags admin
     * @name MixedDelete
     * @summary Delete mixing order
     * @request DELETE:/admin/mixed/{id}
     * @secure
     */
    mixedDelete: (
      id: number,
      request: ServiceDeleteMixedRequest,
      params: RequestParams = {},
    ) =>
      this.request<HandlerSuccessResponse, HandlerErrorResponse>({
        path: `/admin/mixed/${id}`,
        method: "DELETE",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Mark mixing order as completed (Admin only)
     *
     * @tags admin
     * @name MixedCompleteUpdate
     * @summary Complete mixing order
     * @request PUT:/admin/mixed/{id}/complete
     * @secure
     */
    mixedCompleteUpdate: (
      id: number,
      request: ServiceCompleteMixedRequest,
      params: RequestParams = {},
    ) =>
      this.request<HandlerSuccessResponse, HandlerErrorResponse>({
        path: `/admin/mixed/${id}/complete`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Remove a chemical element from mixing order (Admin only)
     *
     * @tags admin
     * @name MixedItemsDelete
     * @summary Delete element from order
     * @request DELETE:/admin/mixed/{id}/items
     * @secure
     */
    mixedItemsDelete: (
      id: number,
      request: ServiceDeleteFromMixedRequest,
      params: RequestParams = {},
    ) =>
      this.request<HandlerSuccessResponse, HandlerErrorResponse>({
        path: `/admin/mixed/${id}/items`,
        method: "DELETE",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get list of all users in system (Admin only)
     *
     * @tags admin
     * @name UsersList
     * @summary Get all users
     * @request GET:/admin/users
     * @secure
     */
    usersList: (params: RequestParams = {}) =>
      this.request<HandlerSuccessResponse, HandlerErrorResponse>({
        path: `/admin/users`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get user profile information by user ID (Admin only)
     *
     * @tags admin
     * @name UsersDetail
     * @summary Get user by ID
     * @request GET:/admin/users/{id}
     * @secure
     */
    usersDetail: (id: number, params: RequestParams = {}) =>
      this.request<HandlerSuccessResponse, HandlerErrorResponse>({
        path: `/admin/users/${id}`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Grant or revoke moderator role for a user (Admin only)
     *
     * @tags admin
     * @name UsersRoleUpdate
     * @summary Update user role
     * @request PUT:/admin/users/{id}/role
     * @secure
     */
    usersRoleUpdate: (
      id: number,
      request: HandlerUpdateUserRoleRequest,
      params: RequestParams = {},
    ) =>
      this.request<HandlerSuccessResponse, HandlerErrorResponse>({
        path: `/admin/users/${id}/role`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  auth = {
    /**
     * @description Authenticate user with credentials and receive JWT token + session cookie JWT token is saved in Redis for revocation support
     *
     * @tags auth
     * @name LoginCreate
     * @summary User login
     * @request POST:/auth/login
     */
    loginCreate: (request: HandlerLoginRequest, params: RequestParams = {}) =>
      this.request<HandlerLoginResponse, HandlerErrorResponse>({
        path: `/auth/login`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Logout user and revoke JWT token (both from Redis and session) After logout, the token is no longer valid even if signature is correct
     *
     * @tags auth
     * @name LogoutCreate
     * @summary User logout
     * @request POST:/auth/logout
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<HandlerSuccessResponse, HandlerErrorResponse>({
        path: `/auth/logout`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get profile information of the authenticated user
     *
     * @tags users
     * @name ProfileList
     * @summary Get current user profile
     * @request GET:/auth/profile
     * @secure
     */
    profileList: (params: RequestParams = {}) =>
      this.request<HandlerSuccessResponse, HandlerErrorResponse>({
        path: `/auth/profile`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update login and/or password of current user
     *
     * @tags users
     * @name ProfileUpdate
     * @summary Update user profile
     * @request PUT:/auth/profile
     * @secure
     */
    profileUpdate: (
      request: HandlerUpdateUserRequest,
      params: RequestParams = {},
    ) =>
      this.request<HandlerSuccessResponse, HandlerErrorResponse>({
        path: `/auth/profile`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new user account with login and password
     *
     * @tags auth
     * @name RegisterCreate
     * @summary User registration
     * @request POST:/auth/register
     */
    registerCreate: (
      request: HandlerRegisterRequest,
      params: RequestParams = {},
    ) =>
      this.request<HandlerRegisterResponse, HandlerErrorResponse>({
        path: `/auth/register`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  elements = {
    /**
     * @description Get list of all elements with optional search by name
     *
     * @tags elements
     * @name ElementsList
     * @summary Get all elements
     * @request GET:/elements
     */
    elementsList: (
      query?: {
        /** Search query by element name */
        query?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, HandlerErrorResponse>({
        path: `/elements`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new chemical element (Admin only)
     *
     * @tags elements
     * @name ElementsCreate
     * @summary Create new element
     * @request POST:/elements
     * @secure
     */
    elementsCreate: (
      request: HandlerCreateElementRequest,
      params: RequestParams = {},
    ) =>
      this.request<HandlerSuccessResponse, HandlerErrorResponse>({
        path: `/elements`,
        method: "POST",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve a specific element by its ID
     *
     * @tags elements
     * @name ElementsDetail
     * @summary Get element by ID
     * @request GET:/elements/{id}
     */
    elementsDetail: (id: number, params: RequestParams = {}) =>
      this.request<HandlerSuccessResponse, HandlerErrorResponse>({
        path: `/elements/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update an existing chemical element (Admin only)
     *
     * @tags elements
     * @name ElementsUpdate
     * @summary Update element
     * @request PUT:/elements/{id}
     * @secure
     */
    elementsUpdate: (
      id: number,
      request: HandlerUpdateElementRequest,
      params: RequestParams = {},
    ) =>
      this.request<HandlerSuccessResponse, HandlerErrorResponse>({
        path: `/elements/${id}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a chemical element (Admin only)
     *
     * @tags elements
     * @name ElementsDelete
     * @summary Delete element
     * @request DELETE:/elements/{id}
     * @secure
     */
    elementsDelete: (id: number, params: RequestParams = {}) =>
      this.request<HandlerSuccessResponse, HandlerErrorResponse>({
        path: `/elements/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Upload an image for a chemical element (Admin only)
     *
     * @tags elements
     * @name ImageCreate
     * @summary Upload element image
     * @request POST:/elements/{id}/image
     * @secure
     */
    imageCreate: (
      id: number,
      data: {
        /** Image file (JPEG, PNG, GIF, WebP). Max 5MB */
        image: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<HandlerSuccessResponse, HandlerErrorResponse>({
        path: `/elements/${id}/image`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  mixed = {
    /**
     * @description Get list of all mixing orders created by current user
     *
     * @tags mixed
     * @name MixedList
     * @summary Get user's mixing orders
     * @request GET:/mixed
     * @secure
     */
    mixedList: (
      query?: {
        /** Filter by status (draft, pending, completed) */
        status?: string;
        /** Limit results (default: 50) */
        limit?: number;
        /** Offset results (default: 0) */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<HandlerSuccessResponse, HandlerErrorResponse>({
        path: `/mixed`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get detailed info about user's specific mixing order
     *
     * @tags mixed
     * @name MixedDetail
     * @summary Get user's mixing order by ID
     * @request GET:/mixed/{id}
     * @secure
     */
    mixedDetail: (id: number, params: RequestParams = {}) =>
      this.request<HandlerSuccessResponse, HandlerErrorResponse>({
        path: `/mixed/${id}`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  mixing = {
    /**
     * @description Get current user's mixing cart with all added elements
     *
     * @tags mixing
     * @name MixingList
     * @summary Get user's mixing cart
     * @request GET:/mixing
     * @secure
     */
    mixingList: (params: RequestParams = {}) =>
      this.request<HandlerSuccessResponse, HandlerErrorResponse>({
        path: `/mixing`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get cart item count for display in UI (public endpoint, works for guests too)
     *
     * @tags mixing
     * @name CartIconList
     * @summary Get cart icon info
     * @request GET:/mixing/cart-icon
     */
    cartIconList: (params: RequestParams = {}) =>
      this.request<HandlerCartIconResponse, any>({
        path: `/mixing/cart-icon`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Add a chemical element to user's mixing cart with specified volume
     *
     * @tags mixing
     * @name ItemsCreate
     * @summary Add element to mixing cart
     * @request POST:/mixing/items
     * @secure
     */
    itemsCreate: (
      request: HandlerAddToMixingRequest,
      params: RequestParams = {},
    ) =>
      this.request<HandlerSuccessResponse, HandlerErrorResponse>({
        path: `/mixing/items`,
        method: "POST",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Remove a chemical element from user's mixing cart
     *
     * @tags mixing
     * @name RemoveCreate
     * @summary Remove element from mixing cart
     * @request POST:/mixing/remove
     * @secure
     */
    removeCreate: (
      request: HandlerRemoveFromMixingRequest,
      params: RequestParams = {},
    ) =>
      this.request<HandlerSuccessResponse, HandlerErrorResponse>({
        path: `/mixing/remove`,
        method: "POST",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
