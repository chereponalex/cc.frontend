import { createApi } from "@reduxjs/toolkit/query/react";
import BaseService from "./BaseService";
import appConfig from "@/configs/app.config";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import {
  Employee,
  Response,
  Role,
  Request,
  PaymentMethod,
  BuildingObject,
  Offer,
  RealEstateBuilding,
  Sale,
  City,
  Developer,
  Marketplace,
  WorkTime,
  MetroLine,
  Transfer,
  MetroStation,
  Setting,
  Script,
  Tag,
  Country,
  Region,
  BlackList,
  Report,
  SelectInfoCountry,
  SelectInfo,
} from "@/@types";
import {
  FormEssence,
  FormEssenceLineMeter,
  FormEssenceMetroStation,
  FormEssenceSetting,
} from "@/@types/form";
import {
  RtkRequest,
  RequestFilterType,
  UpdateLineMeterResponse,
  UpdateMetroStationResponse,
} from "@/@types/requestRtk";
import {
  BaseQueryError,
  BaseQueryMeta,
} from "@reduxjs/toolkit/dist/query/baseQueryTypes";

const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
    },
    unknown,
    unknown
  > =>
  async (request) => {
    try {
      return BaseService(request);
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

const RtkQueryService = createApi({
  reducerPath: "rtkApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "Employees",
    "Roles",
    "PaymentMethods",
    "BuildingObjects",
    "Scripts",
    "Marketplaces",
    "Offers",
    "RealEstateObjects",
    "RealEstateBuildings",
    "Developers",
    "Cities",
    "WorkTimes",
    "Transfers",
    "Report",
    "MetroLines",
    "MetroStations",
    "Settings",
    "Sales",
    "Tags",
    "Countries",
    "Regions",
    "BlackLists",
    "Groups",
    "Statuses",
    "RouterList",
    "Questions",
    "Rating",
    "Map",
    "UIS",
  ],
  keepUnusedDataFor: 30,
  endpoints: (build) => ({
    // Employees
    getEmployees: build.query<Response<Employee[]>, RtkRequest>({
      query: (params) => ({
        url: "/crm/employee",
        method: params.method,
        params: params.method == "GET" ? params.body : undefined,
        data: params.method == "PUT" ? params.body : undefined,
      }),
      providesTags: ["Employees"],
      keepUnusedDataFor: 0,
    }),
    getEmployeesActionInfo: build.query<Response<any>, Request>({
      query: (params) => ({
        url: "crm/employee/get/action-info",
        method: "GET",
        params: params,
      }),
      providesTags: ["Employees"],
      keepUnusedDataFor: 0,
    }),
    getEmployeesById: build.query<Response<Employee>, string>({
      query: (id) => ({
        url: `/crm/employee/${id}`,
        method: "GET",
      }),
      providesTags: ["Employees"],
      keepUnusedDataFor: 0,
    }),
    creatNewEmployees: build.mutation<string, FormEssence<Employee>>({
      query: (body) => ({
        url: `/crm/employee`,
        method: "POST",
        data: body,
      }),

      invalidatesTags: ["Employees"],
    }),
    updateEmployeeId: build.mutation<any, Partial<Employee>>({
      query: ({ id, ...body }) => ({
        url: `/crm/employee/${id}`,
        method: "PATCH",
        data: { ...body },
      }),
      invalidatesTags: ["Employees"],
    }),
    recoveryEmployeeById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/employee/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Employees"],
    }),
    recoveryEmployeeMass: build.mutation<string, string>({
      query: (body) => ({
        url: `/crm/employee/group`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Employees"],
    }),
    softDeleteEmployeeById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/employee/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Employees"],
    }),
    softDeleteEmployeeMass: build.mutation<string, string>({
      query: (body) => {
        return {
          url: `/crm/employee/group/soft`,
          method: "DELETE",
          data: body,
        };
      },
      invalidatesTags: ["Employees"],
    }),
    hardDeleteEmployeeById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/employee/hard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Employees"],
    }),

    //Region

    // Cities
    getCities: build.query<Response<City[]>, RtkRequest>({
      query: (params) => ({
        url: "/api/city",
        method: params.method,
        params: params.method == "GET" ? params.body : undefined,
        data: params.method == "PUT" ? params.body : undefined,
      }),
      providesTags: ["Cities"],
      keepUnusedDataFor: 0,
    }),
    selectInfoCities: build.query<Response<any>, Request>({
      query: () => ({
        url: "/api/select-info/cities",
        method: "GET",
      }),
      providesTags: ["Cities"],
      keepUnusedDataFor: 0,
    }),

    getCityById: build.query<Response<City>, string>({
      query: (id) => ({
        url: `/crm/city/${id}`,
        method: "GET",
      }),
      providesTags: ["Cities"],
      keepUnusedDataFor: 0,
    }),
    creatNewCity: build.mutation<string, FormEssence<City>>({
      query: (body) => ({
        url: `/api/city/create`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Cities"],
    }),
    updateCityById: build.mutation<string, Partial<City>>({
      query: ({ id, ...body }) => ({
        url: `/api/city/edit/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["Cities"],
    }),

    recoveryCityById: build.mutation<string, string>({
      query: (id) => ({
        url: `/api/city/recovery/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Cities"],
    }),
    recoveryCityMass: build.mutation<string, string>({
      query: (body) => ({
        url: `/crm/city/group`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Cities"],
    }),
    softDeleteCityMass: build.mutation<string, string>({
      query: (body) => {
        return {
          url: `/crm/city/group/soft`,
          method: "DELETE",
          data: body,
        };
      },
      invalidatesTags: ["Cities"],
    }),
    softDeleteCityById: build.mutation<string, string>({
      query: (id) => ({
        url: `/api/city/delete/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cities"],
    }),
    hardDeleteCityById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/city/hard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cities"],
    }),

    // Countries
    getCountries: build.query<Response<Country[]>, RtkRequest>({
      query: (params) => ({
        url: "/api/country",
        method: params.method,
        params: params.method == "GET" ? params.body : undefined,
        data: params.method == "PUT" ? params.body : undefined,
      }),
      providesTags: ["Countries"],
      keepUnusedDataFor: 0,
    }),
    getCountryById: build.query<Response<Country>, string>({
      query: (id) => ({
        url: `/crm/country/${id}`,
        method: "GET",
      }),
      providesTags: ["Countries"],
      keepUnusedDataFor: 0,
    }),
    creatNewCountry: build.mutation<string, FormEssence<Country>>({
      query: (body) => ({
        url: `/api/country/create`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Countries"],
    }),
    updateCountryById: build.mutation<string, Partial<Country>>({
      query: ({ id, ...body }) => ({
        url: `/api/country/edit/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["Countries"],
    }),
    recoveryCountryById: build.mutation<string, string>({
      query: (id) => ({
        url: `/api/country/recovery/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Countries"],
    }),
    recoveryCountryMass: build.mutation<string, string>({
      query: (body) => ({
        url: `/crm/country/group`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Countries"],
    }),
    softDeleteCountryMass: build.mutation<string, string>({
      query: (body) => {
        return {
          url: `/crm/country/group/soft`,
          method: "DELETE",
          data: body,
        };
      },
      invalidatesTags: ["Countries"],
    }),
    softDeleteCountryById: build.mutation<string, string>({
      query: (id) => ({
        url: `/api/country/delete/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Countries"],
    }),
    hardDeleteCountryById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/country/hard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Countries"],
    }),

    selectInfoCountries: build.query<Response<SelectInfoCountry>, Request>({
      query: () => ({
        url: "/api/select-info/country-region-city",
        method: "GET",
      }),
      providesTags: ["Countries"],
      keepUnusedDataFor: 0,
    }),

    // Regions
    getRegions: build.query<Response<Region[]>, RtkRequest>({
      query: (params) => ({
        url: "/api/region",
        method: params.method,
        params: params.method == "GET" ? params.body : undefined,
        data: params.method == "PUT" ? params.body : undefined,
      }),
      providesTags: ["Regions"],
      keepUnusedDataFor: 0,
    }),
    getRegionById: build.query<Response<Region>, string>({
      query: (id) => ({
        url: `/crm/region/${id}`,
        method: "GET",
      }),
      providesTags: ["Regions"],
      keepUnusedDataFor: 0,
    }),
    creatNewRegion: build.mutation<string, FormEssence<Region>>({
      query: (body) => ({
        url: `/api/region/create`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Regions"],
    }),
    updateRegionById: build.mutation<string, Partial<Region>>({
      query: ({ id, ...body }) => ({
        url: `/api/region/edit/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["Regions"],
    }),
    recoveryRegionById: build.mutation<string, string>({
      query: (id) => ({
        url: `/api/region/recovery/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Regions"],
    }),
    softDeleteRegionById: build.mutation<string, string>({
      query: (id) => ({
        url: `/api/region/delete/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Regions"],
    }),
    hardDeleteRegionById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/region/hard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Regions"],
    }),
    softDeleteRegionMass: build.mutation<string, string>({
      query: (body) => ({
        url: "/crm/region/group/soft",
        method: "DELETE",
        data: body,
      }),
      invalidatesTags: ["Regions"],
    }),
    recoveryRegionMass: build.mutation<string, string>({
      query: (body) => ({
        url: `/crm/region/group`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Regions"],
    }),

    //WorkTime
    getWorkTimes: build.query<Response<WorkTime[]>, RtkRequest>({
      query: (params) => ({
        url: "/crm/work_time",
        method: params.method,
        params: params.method === "GET" ? params.body : undefined,
        data: params.method === "PUT" ? params.body : undefined,
      }),
      providesTags: ["WorkTimes"],
      keepUnusedDataFor: 0,
    }),
    getWorkTimeActionInfo: build.query<Response<any>, string>({
      query: () => ({
        url: `/crm/work_time/get/action-info`,
        method: "GET",
      }),
      providesTags: ["WorkTimes"],
      keepUnusedDataFor: 0,
    }),
    getWorkTimeById: build.query<Response<WorkTime>, string>({
      query: (id) => ({
        url: `/crm/work_time/${id}`,
        method: "GET",
      }),
      providesTags: ["WorkTimes"],
      keepUnusedDataFor: 0,
    }),
    creatNewWorkTime: build.mutation<string, FormEssence<WorkTime>>({
      query: (body) => ({
        url: `/crm/work_time`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["WorkTimes"],
    }),
    // Partial<WorkTime>
    updateWorkTimeById: build.mutation<string, Record<string, any>>({
      query: ({ id, ...body }) => ({
        url: `/crm/work_time/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["WorkTimes"],
    }),
    recoveryWorkTimeById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/work_time/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["WorkTimes"],
    }),
    softDeleteWorkTimeById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/work_time/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["WorkTimes"],
    }),
    softDeleteWorkTimeMass: build.mutation<string, string>({
      query: (body) => ({
        url: "/crm/work_time/group/soft",
        method: "DELETE",
        data: body,
      }),
      invalidatesTags: ["WorkTimes"],
    }),
    recoveryWorkTimeMass: build.mutation<string, string>({
      query: (body) => ({
        url: `/crm/work_time/group`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["WorkTimes"],
    }),
    hardDeleteWorkTimeById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/work_time/hard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["WorkTimes"],
    }),

    // MetroLines
    getMetroLines: build.query<Response<MetroLine[]>, RtkRequest>({
      query: (params) => ({
        url: "/crm/metro/line",
        method: params.method,
        params: params.method == "GET" ? params.body : undefined,
        data: params.method == "PUT" ? params.body : undefined,
      }),
      providesTags: ["MetroLines"],
      keepUnusedDataFor: 0,
    }),
    getMetroLineActionInfo: build.query<Response<any>, string>({
      query: () => ({
        url: `/crm/metro/line/get/action-info`,
        method: "GET",
      }),
      providesTags: ["MetroLines"],
      keepUnusedDataFor: 0,
    }),
    getMetroLineById: build.query<Response<MetroLine>, string>({
      query: (id) => ({
        url: `/crm/metro/line/${id}`,
        method: "GET",
      }),
      providesTags: ["MetroLines"],
      keepUnusedDataFor: 0,
    }),
    creatNewMetroLine: build.mutation<string, FormEssenceLineMeter>({
      query: (body) => ({
        url: `/crm/metro/line`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["MetroLines"],
    }),
    updateMetroLineById: build.mutation<string, UpdateLineMeterResponse>({
      query: ({ id, ...body }) => ({
        url: `/crm/metro/line/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["MetroLines"],
    }),
    recoveryMetroLineById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/metro/line/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["MetroLines"],
    }),
    softDeleteMetroLineById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/metro/line/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MetroLines"],
    }),
    softDeleteMetroLineMass: build.mutation<string, string>({
      query: (body) => ({
        url: "/crm/metro/line/group/soft",
        method: "DELETE",
        data: body,
      }),
      invalidatesTags: ["MetroLines"],
    }),
    recoveryMetroLineMass: build.mutation<string, string>({
      query: (body) => ({
        url: `/crm/metro/line/group`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["MetroLines"],
    }),
    hardDeleteMetroLineById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/metro/line/hard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MetroLines"],
    }),

    // MetroStations
    getMetroStations: build.query<Response<MetroStation[]>, RtkRequest>({
      query: (params) => ({
        url: "/crm/metro/station",
        method: params.method,
        params: params.method == "GET" ? params.body : undefined,
        data: params.method == "PUT" ? params.body : undefined,
      }),
      providesTags: ["MetroStations"],
      keepUnusedDataFor: 0,
    }),
    getMetroStationsActionInfo: build.query<Response<MetroStation>, Request>({
      query: () => ({
        url: "/crm/metro/station/get/action-info",
        method: "GET",
      }),
      providesTags: ["MetroStations"],
      keepUnusedDataFor: 0,
    }),
    getMetroStationById: build.query<Response<MetroStation>, string>({
      query: (id) => ({
        url: `/crm/metro/station/${id}`,
        method: "GET",
      }),
      providesTags: ["MetroStations"],
      keepUnusedDataFor: 0,
    }),
    creatNewMetroStation: build.mutation<string, FormEssenceMetroStation>({
      query: (body) => ({
        url: `/crm/metro/station`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["MetroStations"],
    }),
    updateMetroStationById: build.mutation<string, UpdateMetroStationResponse>({
      query: ({ id, ...body }) => ({
        url: `/crm/metro/station/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["MetroStations"],
    }),
    recoveryMetroStationById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/metro/station/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["MetroStations"],
    }),
    softDeleteMetroStationById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/metro/station/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MetroStations"],
    }),
    hardDeleteMetroStationById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/metro/station/hard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MetroStations"],
    }),
    softDeleteMetroStationMass: build.mutation<string, string>({
      query: (body) => ({
        url: "/crm/metro/station/group/soft",
        method: "DELETE",
        data: body,
      }),
      invalidatesTags: ["MetroStations"],
    }),
    recoveryMetroStationMass: build.mutation<string, string>({
      query: (body) => ({
        url: `/crm/metro/station/group`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["MetroStations"],
    }),

    // Settings
    getSettings: build.query<Response<Setting[]>, RtkRequest>({
      query: (params) => ({
        url: "/crm/settings",
        method: params.method,
        params: params.method == "GET" ? params.body : undefined,
        data: params.method == "PUT" ? params.body : undefined,
      }),
      providesTags: ["Settings"],
      keepUnusedDataFor: 0,
    }),
    creatNewSetting: build.mutation<string, FormEssenceSetting>({
      query: (body) => ({
        url: `/crm/settings`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Settings"],
    }),
    getSettingById: build.query<Response<Setting>, string>({
      query: (id) => ({
        url: `/crm/settings/${id}`,
        method: "GET",
      }),
      providesTags: ["Settings"],
      keepUnusedDataFor: 0,
    }),
    updateSettingById: build.mutation<string, Setting>({
      query: ({ id, ...body }) => ({
        url: `/crm/settings/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["Settings"],
    }),
    recoverySettingById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/settings/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Settings"],
    }),
    softDeleteSettingById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/settings/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Settings"],
    }),
    softDeleteSettingMass: build.mutation<string, string>({
      query: (body) => ({
        url: "/crm/settings/group/soft",
        method: "DELETE",
        data: body,
      }),
      invalidatesTags: ["Settings"],
    }),
    recoverySettingMass: build.mutation<string, string>({
      query: (body) => ({
        url: `/crm/settings/group`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Settings"],
    }),

    hardDeleteSettingById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/settings/hard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Settings"],
    }),

    // Groups
    getGroups: build.query<Response<any[]>, RtkRequest>({
      query: (params) => ({
        url: "/crm/employees_group",
        method: params.method,
        params: params.method == "GET" ? params.body : undefined,
        data: params.method == "PUT" ? params.body : undefined,
      }),
      providesTags: ["Groups"],
      keepUnusedDataFor: 0,
    }),
    getGroupActionInfo: build.query<Response<any>, string>({
      query: () => ({
        url: `/crm/employees_group/get/action-info`,
        method: "GET",
      }),
      providesTags: ["Groups"],
      keepUnusedDataFor: 0,
    }),
    creatNewGroup: build.mutation<string, any>({
      query: (body) => ({
        url: `/crm/employees_group`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Groups"],
    }),
    getGroupById: build.query<Response<Setting>, string>({
      query: (id) => ({
        url: `/crm/employees_group/${id}`,
        method: "GET",
      }),
      providesTags: ["Groups"],
      keepUnusedDataFor: 0,
    }),
    updateGroupById: build.mutation<string, any>({
      query: ({ id, ...body }) => ({
        url: `/crm/employees_group/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["Groups"],
    }),
    recoveryGroupById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/employees_group/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Groups"],
    }),
    softDeleteGroupById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/employees_group/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Groups"],
    }),

    softDeleteGroupMass: build.mutation<string, string>({
      query: (body) => ({
        url: "/crm/employees_group/group/soft",
        method: "DELETE",
        data: body,
      }),
      invalidatesTags: ["Groups"],
    }),
    recoveryGroupMass: build.mutation<string, string>({
      query: (body) => ({
        url: `/crm/employees_group/group`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Groups"],
    }),

    hardDeleteGroupById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/employees_group/hard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Groups"],
    }),

    // Statuses
    getStatuses: build.query<Response<any[]>, Request>({
      query: (params) => ({
        url: "/crm/employee_status",
        method: "GET",
        params: params,
      }),
      providesTags: ["Statuses"],
      keepUnusedDataFor: 0,
    }),

    //Roles
    getRoles: build.query<Response<Role[]>, RtkRequest>({
      query: (params) => ({
        url: "/crm/role",
        method: params.method,
        params: params.method == "GET" ? params.body : undefined,
        data: params.method == "PUT" ? params.body : undefined,
      }),
      providesTags: ["Roles"],
      keepUnusedDataFor: 0,
    }),
    creatNewRole: build.mutation<string, FormEssence<Role>>({
      query: (body) => ({
        url: `/crm/role`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Roles"],
    }),
    getRoleById: build.query<Response<Role>, string>({
      query: (id) => ({
        url: `/crm/role/${id}`,
        method: "GET",
      }),
      providesTags: ["Roles"],
      keepUnusedDataFor: 0,
    }),
    updateRoleById: build.mutation<string, Partial<Role>>({
      query: ({ id, ...body }) => ({
        url: `/crm/role/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["Roles"],
    }),
    recoveryRoleById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/role/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Roles"],
    }),
    softDeleteRoleById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/role/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Roles"],
    }),
    softDeleteRoleMass: build.mutation<string, string>({
      query: (body) => ({
        url: "/crm/role/group/soft",
        method: "DELETE",
        data: body,
      }),
      invalidatesTags: ["Roles"],
    }),
    recoveryRoleMass: build.mutation<string, string>({
      query: (body) => ({
        url: `/crm/role/group`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Roles"],
    }),
    hardDeleteRoleById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/role/hard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Roles"],
    }),

    //Payment Method
    getPaymentMethods: build.query<Response<PaymentMethod[]>, RtkRequest>({
      query: (params) => {
        return {
          url: "/api/payment_method",
          method: params.method,
          params: params.method === "GET" ? params.body : undefined,
          data: params.method === "PUT" ? params.body : undefined,
        };
      },
      providesTags: ["PaymentMethods"],
      keepUnusedDataFor: 0,
    }),
    getPaymentMethodById: build.query<Response<PaymentMethod>, string>({
      query: (id) => ({
        url: `/crm/payment_method/${id}`,
        method: "GET",
      }),
      providesTags: ["PaymentMethods"],
      keepUnusedDataFor: 0,
    }),
    creatNewPaymentMethod: build.mutation<string, FormEssence<PaymentMethod>>({
      query: (body) => ({
        url: `/api/payment_method/create`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["PaymentMethods"],
    }),
    updatePaymentMethodById: build.mutation<string, Partial<PaymentMethod>>({
      query: ({ id, ...body }) => ({
        url: `/api/payment_method/edit/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["PaymentMethods"],
    }),
    recoveryPaymentMethodById: build.mutation<string, string>({
      query: (id) => ({
        url: `/api/payment_method/recovery/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["PaymentMethods"],
    }),
    softDeletePaymentMethodById: build.mutation<string, string>({
      query: (id) => ({
        url: `/api/payment_method/delete/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PaymentMethods"],
    }),
    hardDeletePaymentMethodById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/payment_method/hard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PaymentMethods"],
    }),
    softDeletePaymentMethodMass: build.mutation<string, string>({
      query: (body) => ({
        url: "/crm/payment_method/group/soft",
        method: "DELETE",
        data: body,
      }),
      invalidatesTags: ["PaymentMethods"],
    }),
    recoveryPaymentMethodMass: build.mutation<string, string>({
      query: (body) => ({
        url: `/crm/payment_method/group`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["PaymentMethods"],
    }),

    //Object
    getBuildingObjects: build.query<Response<BuildingObject[]>, Request>({
      query: (params) => ({
        url: "/crm/building_object",
        method: "GET",
        params: params,
      }),
      providesTags: ["BuildingObjects"],
      keepUnusedDataFor: 0,
    }),

    // Transfers
    getTransfers: build.query<Response<Transfer[]>, RtkRequest>({
      query: (params) => ({
        url: "/crm/transfer",
        method: params.method,
        params: params.method === "GET" ? params.body : undefined,
        data: params.method === "PUT" ? params.body : undefined,
      }),
      providesTags: ["Transfers"],
    }),
    createTransfer: build.mutation<Response<Transfer[]>, Request>({
      query: (body) => {
        return {
          url: `/crm/transfer`,
          method: "POST",
          data: body,
        };
      },
      invalidatesTags: ["Transfers"],
    }),
    updateTransfer: build.mutation<Response<Transfer[]>, Request>({
      query: (body) => {
        return {
          url: `/crm/transfer/${body.id}`,
          method: "PATCH",
          data: body,
        };
      },
      invalidatesTags: ["Transfers"],
    }),
    recoveryTransferById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/transfer/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Transfers"],
    }),
    softDeleteTransferById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/transfer/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transfers"],
    }),
    softDeleteTransferMass: build.mutation<string, string>({
      query: (body) => ({
        url: "/crm/transfer/group/soft",
        method: "DELETE",
        data: body,
      }),
      invalidatesTags: ["Transfers"],
    }),
    recoveryTransferMass: build.mutation<string, string>({
      query: (body) => ({
        url: `/crm/transfer/group`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Transfers"],
    }),

    hardDeleteTransferById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/transfer/hard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transfers"],
    }),

    //Report
    createReport: build.mutation<Response<Report>, Request>({
      query: (body) => {
        return {
          url: `/crm/report`,
          method: "PUT",
          // params: params,
          data: body,
        };
      },
      invalidatesTags: ["Report"],
    }),

    //Script
    getScripts: build.query<Response<Script[]>, RtkRequest>({
      query: (params) => ({
        url: "/api/script",
        method: params.method,
        params: params.method === "GET" ? params.body : undefined,
        data: params.method === "PUT" ? params.body : undefined,
      }),
      providesTags: ["Scripts"],
      keepUnusedDataFor: 0,
    }),
    getScriptActionInfo: build.query<Response<Script[]>, Request>({
      query: (params) => ({
        url: "/crm/script/get/action-info",
        method: "GET",
        params: params,
      }),
      providesTags: ["Scripts"],
      keepUnusedDataFor: 0,
    }),
    getScriptById: build.query<Response<Script>, string>({
      query: (id) => ({
        url: `/crm/script/${id}`,
        method: "GET",
      }),
      providesTags: ["Scripts"],
      keepUnusedDataFor: 0,
    }),
    creatNewScript: build.mutation<string, FormEssence<Script>>({
      query: (body) => ({
        url: `/api/script/create`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Scripts"],
    }),
    updateScriptById: build.mutation<string, Partial<Script>>({
      query: ({ id, ...body }) => ({
        url: `/api/script/edit/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["Scripts"],
    }),
    recoveryScriptById: build.mutation<string, string>({
      query: (id) => ({
        url: `/api/script/recovery/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Scripts"],
    }),
    softDeleteScriptById: build.mutation<string, string>({
      query: (id) => ({
        url: `/api/script/delete/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Scripts"],
    }),
    softDeleteScriptMass: build.mutation<string, string>({
      query: (body) => ({
        url: "/crm/script/group/soft",
        method: "DELETE",
        data: body,
      }),
      invalidatesTags: ["Scripts"],
    }),
    recoveryScriptMass: build.mutation<string, string>({
      query: (body) => ({
        url: `/crm/script/group`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Scripts"],
    }),
    hardDeleteScriptById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/script/hard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Scripts"],
    }),
    selectInfoScript: build.query<Response<SelectInfo[]>, Request>({
      query: () => ({
        url: "/api/select-info/scripts",
        method: "GET",
      }),
      providesTags: ["Scripts"],
      keepUnusedDataFor: 0,
    }),

    //Marketplace
    getMarketplaces: build.query<Response<Marketplace[]>, RtkRequest>({
      query: (params) => ({
        url: "/api/marketplace",
        method: params.method,
        params: params.method == "GET" ? params.body : undefined,
        data: params.method == "PUT" ? params.body : undefined,
      }),
      providesTags: ["Marketplaces"],
      keepUnusedDataFor: 0,
    }),
    getMarketplaceById: build.query<Response<Marketplace>, string>({
      query: (id) => ({
        url: `/crm/marketplace/${id}`,
        method: "GET",
      }),
      providesTags: ["Marketplaces"],
      keepUnusedDataFor: 0,
    }),
    creatNewMarketplace: build.mutation<string, FormEssence<Marketplace>>({
      query: (body) => ({
        url: `/api/marketplace/create`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Marketplaces"],
    }),
    updateMarketplaceById: build.mutation<string, Partial<Marketplace>>({
      query: ({ id, ...body }) => ({
        url: `/api/marketplace/edit/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["Marketplaces"],
    }),
    recoveryMarketplaceById: build.mutation<string, string>({
      query: (id) => ({
        url: `/api/marketplace/recovery/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Marketplaces"],
    }),
    softDeleteMarketplaceById: build.mutation<string, string>({
      query: (id) => ({
        url: `/api/marketplace/delete/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Marketplaces"],
    }),

    hardDeleteMarketplaceById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/marketplace/hard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Marketplaces"],
    }),

    softDeleteMarketplaceMass: build.mutation<string, string>({
      query: (body) => ({
        url: "/crm/marketplace/group/soft",
        method: "DELETE",
        data: body,
      }),
      invalidatesTags: ["Marketplaces"],
    }),
    recoveryMarketplaceMass: build.mutation<string, string>({
      query: (body) => ({
        url: `/crm/marketplace/group`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Marketplaces"],
    }),
    selectInfoMarketplaces: build.query<Response<SelectInfo[]>, Request>({
      query: () => ({
        url: "/api/select-info/marketplaces",
        method: "GET",
      }),
      providesTags: ["Marketplaces"],
      keepUnusedDataFor: 0,
    }),

    //Offers
    getOffers: build.query<Response<Offer[]>, RtkRequest>({
      query: (params) => ({
        url: "/api/offer",
        method: params.method,
        params: params.method == "GET" ? params.body : undefined,
        data: params.method == "PUT" ? params.body : undefined,
      }),
      providesTags: ["Offers"],
      keepUnusedDataFor: 0,
    }),
    getOfferActionInfo: build.query<Response<any>, Request>({
      query: (params) => ({
        url: "/crm/offer/get/action-info",
        method: "GET",
        params: params,
      }),
      providesTags: ["Offers"],
      keepUnusedDataFor: 0,
    }),
    getOfferById: build.query<Response<Offer>, string>({
      query: (id) => ({
        url: `/crm/offer/${id}`,
        method: "GET",
      }),
      providesTags: ["Offers"],
      keepUnusedDataFor: 0,
    }),
    creatNewOffer: build.mutation<Response<Offer>, FormEssence<Offer>>({
      query: (body) => ({
        url: `/crm/offer`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Offers"],
    }),
    updateOfferById: build.mutation<Response<Offer>, Partial<Offer>>({
      query: ({ id, ...body }) => {
        return {
          url: `/crm/offer/${id}`,
          method: "PATCH",
          data: body,
        };
      },
      invalidatesTags: ["Offers"],
    }),
    recoveryOfferById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/offer/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Offers"],
    }),
    softDeleteOfferById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/offer/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Offers"],
    }),
    softDeleteOfferMass: build.mutation<string, string>({
      query: (body) => ({
        url: "/crm/offer/group/soft",
        method: "DELETE",
        data: body,
      }),
      invalidatesTags: ["Offers"],
    }),
    recoveryOfferMass: build.mutation<string, string>({
      query: (body) => ({
        url: `/crm/offer/group`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Offers"],
    }),
    hardDeleteOfferById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/offer/hard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Offers"],
    }),

    //Questions
    getQuestions: build.query<Response<any[]>, RtkRequest>({
      query: (params) => ({
        url: "/api/question",
        method: params.method,
        params: params.method == "GET" ? params.body : undefined,
        data: params.method == "PUT" ? params.body : undefined,
      }),
      providesTags: ["Questions"],
      keepUnusedDataFor: 0,
    }),
    creatNewQuestion: build.mutation<string, FormEssence<any>>({
      query: (body) => ({
        url: `/api/question/create`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Questions"],
    }),
    getQuestionById: build.query<Response<any>, string>({
      query: (id) => ({
        url: `/crm/question/${id}`,
        method: "GET",
      }),
      providesTags: ["Questions"],
      keepUnusedDataFor: 0,
    }),
    updateQuestionById: build.mutation<string, Partial<any>>({
      query: ({ id, ...body }) => ({
        url: `/api/question/edit/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["Questions"],
    }),
    recoveryQuestionById: build.mutation<string, string>({
      query: (id) => ({
        url: `/api/question/recovery/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Questions"],
    }),
    softDeleteQuestionById: build.mutation<string, string>({
      query: (id) => ({
        url: `/api/question/delete/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Questions"],
    }),
    softDeleteQuestionMass: build.mutation<string, string>({
      query: (body) => ({
        url: `/crm/question/group/soft`,
        method: "DELETE",
        data: body,
      }),
      invalidatesTags: ["Questions"],
    }),
    recoveryQuestionMass: build.mutation<string, string>({
      query: (body) => ({
        url: `/crm/question/group`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Questions"],
    }),

    hardDeleteQuestionById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/question/hard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Questions"],
    }),

    //Rating
    getRating: build.query<Response<any[]>, RtkRequest>({
      query: (params) => ({
        url: "/crm/rating",
        method: params.method,
        params: params.method === "GET" ? params.body : undefined,
        data: params.method === "PUT" ? params.body : undefined,
      }),
      providesTags: ["Rating"],
      keepUnusedDataFor: 0,
    }),
    getRatingWeekly: build.query<Response<any[]>, RtkRequest>({
      query: (params) => {
        return {
          url: "/crm/rating/weekly",
          method: params.method,
          params: params.method === "GET" ? params.body : undefined,
          data: params.method === "PUT" ? params.body : undefined,
        };
      },
      providesTags: ["Rating"],
      keepUnusedDataFor: 0,
    }),
    getCountWeekly: build.query<Response<{ count: number }>, any>({
      query: (employee_id) => {
        return {
          url: `/crm/rating/weekly/${employee_id}`,
          method: "GET",
        };
      },
      providesTags: ["Rating"],
      keepUnusedDataFor: 0,
    }),

    //RealEstateObjects
    getRealEstateObjects: build.query<Response<BuildingObject[]>, RtkRequest>({
      query: (params) => ({
        url: "/crm/real_estate_object",
        method: params.method,
        params: params.method == "GET" ? params.body : undefined,
        data: params.method == "PUT" ? params.body : undefined,
      }),
      providesTags: ["RealEstateObjects"],
      keepUnusedDataFor: 0,
    }),

    getRealEstateObjectsActionInfo: build.query<
      Response<BuildingObject[]>,
      Request
    >({
      query: () => ({
        url: "/crm/real_estate_object/get/action-info",
        method: "GET",
      }),
      providesTags: ["RealEstateObjects"],
      keepUnusedDataFor: 0,
    }),

    getRealEstateObjectById: build.query<Response<BuildingObject>, string>({
      query: (id) => ({
        url: `/crm/real_estate_object/${id}`,
        method: "GET",
      }),
      providesTags: ["RealEstateObjects"],
      keepUnusedDataFor: 0,
    }),

    creatNewRealEstateObject: build.mutation<string, FormEssence<any>>({
      query: (body) => ({
        url: `/crm/real_estate_object`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["RealEstateObjects"],
    }),

    updateRealEstateObjectById: build.mutation<
      Response<BuildingObject>,
      Partial<any>
    >({
      query: ({ id, ...body }) => ({
        url: `/crm/real_estate_object/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["RealEstateObjects"],
    }),

    recoveryRealEstateObjectById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/real_estate_object/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["RealEstateObjects"],
    }),

    softDeleteRealEstateObjectMass: build.mutation<string, string>({
      query: (body) => ({
        url: `/crm/real_estate_object/group/soft`,
        method: "DELETE",
        data: body,
      }),
      invalidatesTags: ["RealEstateObjects"],
    }),
    recoveryRealEstateObjectMass: build.mutation<string, string>({
      query: (body) => ({
        url: `/crm/real_estate_object/group`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["RealEstateObjects"],
    }),

    softDeleteRealEstateObjectById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/real_estate_object/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RealEstateObjects"],
    }),
    hardDeleteRealEstateObjectById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/real_estate_object/hard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RealEstateObjects"],
    }),

    //RealEstateBuilding
    getRealEstateBuildings: build.query<
      Response<RealEstateBuilding[]>,
      RtkRequest
    >({
      query: (params) => {
        return {
          url: "/api/real_estate_building",
          method: params.method,
          params: params.method == "GET" ? params.body : undefined,
          data: params.method == "PUT" ? params.body : undefined,
        };
      },
      providesTags: ["RealEstateBuildings"],
      keepUnusedDataFor: 0,
    }),
    getRealEstateBuildingsActionInfo: build.query<
      Response<RealEstateBuilding>,
      Request
    >({
      query: () => ({
        url: "/crm/real_estate_building/get/action-info",
        method: "GET",
      }),
      providesTags: ["RealEstateBuildings"],
      keepUnusedDataFor: 0,
    }),
    getRealEstateBuildingById: build.query<
      Response<RealEstateBuilding>,
      string
    >({
      query: ({ id, params }: any) => {
        return {
          url: `/crm/real_estate_building/${id}`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["RealEstateBuildings"],
      keepUnusedDataFor: 0,
    }),
    creatNewRealEstateBuilding: build.mutation<
      string,
      FormEssence<RealEstateBuilding>
    >({
      query: (body) => ({
        url: `/api/real_estate_building/create`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["RealEstateBuildings"],
    }),
    updateRealEstateBuildingById: build.mutation<
      string,
      Partial<RealEstateBuilding>
    >({
      query: ({ id, ...body }) => ({
        url: `/api/real_estate_building/edit/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["RealEstateBuildings"],
    }),
    R_E_BuildingBindMetroStations: build.mutation<
      string,
      Partial<RealEstateBuilding>
    >({
      query: (body) => ({
        url: `/crm/real_estate_metro_station`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["RealEstateBuildings"],
    }),
    R_E_BuildingUnBindMetroStations: build.mutation<
      string,
      Partial<RealEstateBuilding>
    >({
      query: (id) => ({
        url: `/crm/real_estate_metro_station/hard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RealEstateBuildings"],
    }),
    R_E_BuildingBindMetroStationsUpdate: build.mutation<
      string,
      Partial<RealEstateBuilding>
    >({
      query: ({ id, ...body }) => {
        return {
          url: `/crm/real_estate_metro_station/${id}`,
          method: "PATCH",
          data: body,
        };
      },
      invalidatesTags: ["RealEstateBuildings"],
    }),
    R_E_BuildingBindPaymentMethods: build.mutation<
      string,
      Partial<RealEstateBuilding>
    >({
      query: (body) => ({
        url: `/crm/real_estate_payment_method`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["RealEstateBuildings"],
    }),
    R_E_BuildingUnBindPaymentMethods: build.mutation<
      string,
      Partial<RealEstateBuilding>
    >({
      query: (id) => ({
        url: `/crm/real_estate_payment_method/hard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RealEstateBuildings"],
    }),
    R_E_BuildingBindTags: build.mutation<string, Partial<RealEstateBuilding>>({
      query: (body) => ({
        url: `/crm/real_estate_tag`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["RealEstateBuildings"],
    }),
    R_E_BuildingUnBindTags: build.mutation<string, Partial<RealEstateBuilding>>(
      {
        query: (id) => ({
          url: `/crm/real_estate_tag/hard/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["RealEstateBuildings"],
      },
    ),
    recoveryRealEstateBuildingById: build.mutation<string, string>({
      query: (id) => ({
        url: `/api/real_estate_building/recovery/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["RealEstateBuildings"],
    }),
    softDeleteRealEstateBuildingById: build.mutation<string, string>({
      query: (id) => ({
        url: `/api/real_estate_building/delete/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RealEstateBuildings"],
    }),
    softDeleteRealEstateBuildingMass: build.mutation<string, string>({
      query: (body) => ({
        url: `/crm/real_estate_building/group/soft`,
        method: "DELETE",
        data: body,
      }),
      invalidatesTags: ["RealEstateBuildings"],
    }),
    recoveryRealEstateBuildingMass: build.mutation<string, string>({
      query: (body) => ({
        url: `/crm/real_estate_building/group`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["RealEstateBuildings"],
    }),
    hardDeleteRealEstateBuildingById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/real_estate_building/hard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RealEstateBuildings"],
    }),

    //Developers
    getDevelopers: build.query<Response<Developer[]>, RtkRequest>({
      query: (params) => ({
        url: "/api/developer",
        method: params.method,
        params: params.method === "GET" ? params.body : undefined,
        data: params.method === "PUT" ? params.body : undefined,
      }),
      providesTags: ["Developers"],
      keepUnusedDataFor: 0,
    }),
    getDeveloperById: build.query<Response<Developer>, string>({
      query: (id) => ({
        url: `/crm/developer/${id}`,
        method: "GET",
      }),
      providesTags: ["Developers"],
      keepUnusedDataFor: 0,
    }),
    creatNewDeveloper: build.mutation<string, FormEssence<Developer>>({
      query: (body) => ({
        url: `/api/developer/create`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Developers"],
    }),
    updateDeveloperById: build.mutation<string, Partial<Developer>>({
      query: ({ id, ...body }) => ({
        url: `/api/developer/edit/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["Developers"],
    }),
    recoveryDeveloperById: build.mutation<string, string>({
      query: (id) => ({
        url: `/api/developer/recovery/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Developers"],
    }),
    softDeleteDeveloperMass: build.mutation<string, string>({
      query: (body) => ({
        url: `/crm/developer/group/soft`,
        method: "DELETE",
        data: body,
      }),
      invalidatesTags: ["Developers"],
    }),
    recoveryDeveloperMass: build.mutation<string, string>({
      query: (body) => ({
        url: `/crm/developer/group`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Developers"],
    }),
    softDeleteDeveloperById: build.mutation<string, string>({
      query: (id) => ({
        url: `/api/developer/delete/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Developers"],
    }),
    hardDeleteDeveloperById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/developer/hard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Developers"],
    }),

    selectInfoDevelopers: build.query<Response<SelectInfo[]>, Request>({
      query: () => ({
        url: "/api/select-info/developers",
        method: "GET",
      }),
      providesTags: ["Countries"],
      keepUnusedDataFor: 0,
    }),

    // Sale
    getSales: build.query<Response<Sale[]>, Request>({
      query: (params) => ({
        url: "/crm/sale",
        method: "GET",
        params: params,
      }),
      providesTags: ["Sales"],
      keepUnusedDataFor: 0,
    }),
    recoverySaleById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/sale/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Sales"],
    }),
    softDeleteSaleById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/sale/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sales"],
    }),
    hardDeleteSaleById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/sale/hard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sales"],
    }),

    //Tags
    getTags: build.query<Response<PaymentMethod[]>, RtkRequest>({
      query: (params) => ({
        url: "/api/tag",
        method: params.method,
        params: params.method === "GET" ? params.body : undefined,
        data: params.method === "PUT" ? params.body : undefined,
      }),
      providesTags: ["Tags"],
      keepUnusedDataFor: 0,
    }),
    getTagById: build.query<Response<Tag>, string>({
      query: (id) => ({
        url: `/crm/tag/${id}`,
        method: "GET",
      }),
      providesTags: ["Tags"],
      keepUnusedDataFor: 0,
    }),
    creatNewTag: build.mutation<string, FormEssence<Tag>>({
      query: (body) => ({
        url: `/api/tag/create`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Tags"],
    }),
    updateTagById: build.mutation<string, Partial<Tag>>({
      query: ({ id, ...body }) => ({
        url: `/api/tag/edit/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["Tags"],
    }),
    recoveryTagById: build.mutation<string, string>({
      query: (id) => ({
        url: `/api/tag/recovery/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Tags"],
    }),
    softDeleteTagById: build.mutation<string, string>({
      query: (id) => ({
        url: `/api/tag/delete/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tags"],
    }),
    recoveryTagMass: build.mutation<string, string>({
      query: (body) => ({
        url: `/crm/tag/group`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Tags"],
    }),
    softDeleteTagMass: build.mutation<string, string>({
      query: (body) => {
        return {
          url: `/crm/tag/group/soft`,
          method: "DELETE",
          data: body,
        };
      },
      invalidatesTags: ["Tags"],
    }),
    hardDeleteTagById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/tag/hard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tags"],
    }),

    // BlackList
    getBlackLists: build.query<Response<BlackList[]>, RtkRequest>({
      query: (params) => ({
        url: "/crm/black_list",
        method: params.method,
        params: params.method == "GET" ? params.body : undefined,
        data: params.method == "PUT" ? params.body : undefined,
      }),
      providesTags: ["BlackLists"],
      keepUnusedDataFor: 0,
    }),
    getBlackListById: build.query<Response<BlackList>, string>({
      query: (id) => ({
        url: `/crm/black_list/${id}`,
        method: "GET",
      }),
      providesTags: ["BlackLists"],
      keepUnusedDataFor: 0,
    }),
    creatNewBlackList: build.mutation<string, FormEssence<BlackList>>({
      query: (body) => ({
        url: `/crm/black_list`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["BlackLists"],
    }),
    updateBlackListById: build.mutation<string, Partial<BlackList>>({
      query: ({ id, ...body }) => ({
        url: `/crm/black_list/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["BlackLists"],
    }),
    recoveryBlackListById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/black_list/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["BlackLists"],
    }),
    recoveryBlackListMass: build.mutation<string, string>({
      query: (body) => ({
        url: `/crm/black_list/group`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["BlackLists"],
    }),
    softDeleteBlackListById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/black_list/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BlackLists"],
    }),
    softDeleteBlackListMass: build.mutation<string, string>({
      query: (body) => {
        return {
          url: `/crm/black_list/group/soft`,
          method: "DELETE",
          data: body,
        };
      },
      invalidatesTags: ["BlackLists"],
    }),
    hardDeleteBlackListById: build.mutation<string, string>({
      query: (id) => ({
        url: `/crm/black_list/hard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BlackLists"],
    }),

    //Router list
    getRouterList: build.query<Response<any>, Request>({
      query: (params) => ({
        url: "/routes/list",
        method: "GET",
        params: params,
      }),
      providesTags: ["RouterList"],
      keepUnusedDataFor: 0,
    }),

    // Map
    getMapObjects: build.query<Response<any>, Request>({
      query: (params) => {
        return {
          url: "/map/objects",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["Map"],
      keepUnusedDataFor: 0,
    }),
    getMapFilters: build.query<Response<any>, Request>({
      query: ({ id, is_active = "" }) => {
        return {
          url:
            is_active != ""
              ? `/map/filters/${id}?is_active=${is_active}&city=${id}`
              : `/map/filters/${id}?city=${id}`,
          method: "GET",
          // params: params,
        };
      },
      providesTags: ["Map"],
      keepUnusedDataFor: 0,
    }),
    getMapObjectById: build.query<Response<MapPoint>, any>({
      query: ({ id, params }) => {
        return {
          url: `/map/object/${id}`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["Map"],
      keepUnusedDataFor: 0,
    }),
    // createTransfer: build.mutation<string, FormEssence<MapPoint>>({
    //   query: (body) => {
    //     console.log(body, "body");
    //     return {
    //       url: `/map/transfer`,
    //       method: "POST",
    //       data: body,
    //     };
    //   },
    //   invalidatesTags: ["Map"],
    // }),

    // UIS
    uisHoldCall: build.mutation<string, FormEssence<UIS>>({
      query: (body) => {
        return {
          url: `/crm/call-api/hold`,
          method: "POST",
          data: body,
        };
      },
      invalidatesTags: ["UIS"],
    }),
    uisUnHoldCall: build.mutation<string, FormEssence<UIS>>({
      query: (body) => {
        return {
          url: `/crm/call-api/un-hold`,
          method: "POST",
          data: body,
        };
      },
      invalidatesTags: ["UIS"],
    }),
    uisStartCall: build.mutation<string, FormEssence<UIS>>({
      query: (body) => {
        return {
          url: `/crm/call-api/call-start`,
          method: "POST",
          data: body,
        };
      },
      invalidatesTags: ["UIS"],
    }),
    uisCallTransfer: build.mutation<string, FormEssence<UIS>>({
      query: (body) => {
        return {
          url: `/crm/call-api/call-transfer`,
          method: "POST",
          data: body,
        };
      },
      invalidatesTags: ["UIS"],
    }),
    uisEndCall: build.mutation<string, FormEssence<UIS>>({
      query: (body) => {
        return {
          url: `/crm/call-api/call-end`,
          method: "POST",
          data: body,
        };
      },
      invalidatesTags: ["UIS"],
    }),
  }),
});

export const {
  //RouterList
  useGetRouterListQuery,
  // Employees
  useGetEmployeesQuery,
  useGetEmployeesActionInfoQuery,
  useLazyGetEmployeesQuery,
  useCreatNewEmployeesMutation,
  useGetEmployeesByIdQuery,
  useUpdateEmployeeIdMutation,
  useSoftDeleteEmployeeByIdMutation,
  useSoftDeleteEmployeeMassMutation,
  useHardDeleteEmployeeByIdMutation,
  useRecoveryEmployeeByIdMutation,
  useRecoveryEmployeeMassMutation,

  // Roles
  useLazyGetRolesQuery,
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useUpdateRoleByIdMutation,
  useCreatNewRoleMutation,
  useSoftDeleteRoleByIdMutation,
  useHardDeleteRoleByIdMutation,
  useRecoveryRoleByIdMutation,
  useSoftDeleteRoleMassMutation,
  useRecoveryRoleMassMutation,

  // PaymentMethods
  useLazyGetPaymentMethodsQuery,
  useGetPaymentMethodsQuery,
  useGetPaymentMethodByIdQuery,
  useCreatNewPaymentMethodMutation,
  useUpdatePaymentMethodByIdMutation,
  useRecoveryPaymentMethodByIdMutation,
  useSoftDeletePaymentMethodByIdMutation,
  useHardDeletePaymentMethodByIdMutation,
  useSoftDeletePaymentMethodMassMutation,
  useRecoveryPaymentMethodMassMutation,

  // Cities
  useLazyGetCitiesQuery,
  useGetCitiesQuery,
  useSelectInfoCitiesQuery,
  useGetCityByIdQuery,
  useCreatNewCityMutation,
  useUpdateCityByIdMutation,
  useSoftDeleteCityByIdMutation,
  useSoftDeleteCityMassMutation,
  useHardDeleteCityByIdMutation,
  useRecoveryCityByIdMutation,
  useRecoveryCityMassMutation,

  // Countries
  useLazyGetCountriesQuery,
  useGetCountriesQuery,
  useSelectInfoCountriesQuery,
  useCreatNewCountryMutation,
  useGetCountryByIdQuery,
  useUpdateCountryByIdMutation,
  useSoftDeleteCountryByIdMutation,
  useHardDeleteCountryByIdMutation,
  useRecoveryCountryByIdMutation,
  useSoftDeleteCountryMassMutation,
  useRecoveryCountryMassMutation,

  // Regions
  useLazyGetRegionsQuery,
  useGetRegionsQuery,
  useCreatNewRegionMutation,
  useGetRegionByIdQuery,
  useUpdateRegionByIdMutation,
  useSoftDeleteRegionByIdMutation,
  useHardDeleteRegionByIdMutation,
  useRecoveryRegionByIdMutation,
  useSoftDeleteRegionMassMutation,
  useRecoveryRegionMassMutation,

  // WorkTimes
  useLazyGetWorkTimesQuery,
  useGetWorkTimeByIdQuery,
  useGetWorkTimeActionInfoQuery,
  useCreatNewWorkTimeMutation,
  useUpdateWorkTimeByIdMutation,
  useSoftDeleteWorkTimeByIdMutation,
  useHardDeleteWorkTimeByIdMutation,
  useRecoveryWorkTimeByIdMutation,
  useSoftDeleteWorkTimeMassMutation,
  useRecoveryWorkTimeMassMutation,

  // Transfers
  useLazyGetTransfersQuery,
  useCreateTransferMutation,
  useUpdateTransferMutation,
  useSoftDeleteTransferByIdMutation,
  useHardDeleteTransferByIdMutation,
  useRecoveryTransferByIdMutation,
  useSoftDeleteTransferMassMutation,
  useRecoveryTransferMassMutation,

  //Report
  useCreateReportMutation,

  // MetroLines
  useLazyGetMetroLinesQuery,
  useGetMetroLinesQuery,
  useGetMetroLineActionInfoQuery,
  useGetMetroLineByIdQuery,
  useCreatNewMetroLineMutation,
  useUpdateMetroLineByIdMutation,
  useHardDeleteMetroLineByIdMutation,
  useSoftDeleteMetroLineByIdMutation,
  useRecoveryMetroLineByIdMutation,
  useSoftDeleteMetroLineMassMutation,
  useRecoveryMetroLineMassMutation,

  // MetroStations
  useLazyGetMetroStationsQuery,
  useGetMetroStationsActionInfoQuery,
  useGetMetroStationByIdQuery,
  useCreatNewMetroStationMutation,
  useUpdateMetroStationByIdMutation,
  useSoftDeleteMetroStationByIdMutation,
  useHardDeleteMetroStationByIdMutation,
  useRecoveryMetroStationByIdMutation,
  useSoftDeleteMetroStationMassMutation,
  useRecoveryMetroStationMassMutation,

  // Settings
  useLazyGetSettingsQuery,
  useCreatNewSettingMutation,
  useGetSettingByIdQuery,
  useUpdateSettingByIdMutation,
  useSoftDeleteSettingByIdMutation,
  useHardDeleteSettingByIdMutation,
  useRecoverySettingByIdMutation,
  useSoftDeleteSettingMassMutation,
  useRecoverySettingMassMutation,

  // Groups
  useLazyGetGroupsQuery,
  useGetGroupActionInfoQuery,
  useCreatNewGroupMutation,
  useGetGroupByIdQuery,
  useUpdateGroupByIdMutation,
  useSoftDeleteGroupByIdMutation,
  useHardDeleteGroupByIdMutation,
  useRecoveryGroupByIdMutation,
  useSoftDeleteGroupMassMutation,
  useRecoveryGroupMassMutation,

  // Statuses
  useGetStatusesQuery,
  // Sales
  useLazyGetSalesQuery,
  useRecoverySaleByIdMutation,
  useSoftDeleteSaleByIdMutation,
  useHardDeleteSaleByIdMutation,

  // GetBuildingObjects
  useLazyGetBuildingObjectsQuery,

  // Developers
  useGetDevelopersQuery,
  useLazyGetDevelopersQuery,
  useGetDeveloperByIdQuery,
  useSelectInfoDevelopersQuery,
  useCreatNewDeveloperMutation,
  useUpdateDeveloperByIdMutation,
  useSoftDeleteDeveloperByIdMutation,
  useHardDeleteDeveloperByIdMutation,
  useRecoveryDeveloperByIdMutation,
  useRecoveryDeveloperMassMutation,
  useSoftDeleteDeveloperMassMutation,

  // Marketplaces
  useLazyGetMarketplacesQuery,
  useGetMarketplaceByIdQuery,
  useSelectInfoMarketplacesQuery,
  useCreatNewMarketplaceMutation,
  useUpdateMarketplaceByIdMutation,
  useRecoveryMarketplaceByIdMutation,
  useSoftDeleteMarketplaceByIdMutation,
  useHardDeleteMarketplaceByIdMutation,
  useSoftDeleteMarketplaceMassMutation,
  useRecoveryMarketplaceMassMutation,

  // Offers
  useLazyGetOffersQuery,
  useGetOfferActionInfoQuery,
  useGetOffersQuery,
  useGetOfferByIdQuery,
  useCreatNewOfferMutation,
  useUpdateOfferByIdMutation,
  useSoftDeleteOfferByIdMutation,
  useHardDeleteOfferByIdMutation,
  useRecoveryOfferByIdMutation,
  useRecoveryOfferMassMutation,
  useSoftDeleteOfferMassMutation,

  //Questions
  useLazyGetQuestionsQuery,
  useGetQuestionByIdQuery,
  useUpdateQuestionByIdMutation,
  useCreatNewQuestionMutation,
  useSoftDeleteQuestionByIdMutation,
  useHardDeleteQuestionByIdMutation,
  useRecoveryQuestionByIdMutation,
  useSoftDeleteQuestionMassMutation,
  useRecoveryQuestionMassMutation,

  //Rating
  useGetRatingQuery,
  useLazyGetRatingQuery,
  useLazyGetRatingWeeklyQuery,
  useLazyGetCountWeeklyQuery,
  // RealEstateObjects
  useLazyGetRealEstateObjectsQuery,
  useGetRealEstateObjectByIdQuery,
  useGetRealEstateObjectsActionInfoQuery,
  useCreatNewRealEstateObjectMutation,
  useUpdateRealEstateObjectByIdMutation,
  useRecoveryRealEstateObjectByIdMutation,
  useSoftDeleteRealEstateObjectByIdMutation,
  useHardDeleteRealEstateObjectByIdMutation,
  useSoftDeleteRealEstateObjectMassMutation,
  useRecoveryRealEstateObjectMassMutation,

  // RealEstateBuildings
  // useBindToRealEstateBuildingMutation,
  useGetRealEstateBuildingsActionInfoQuery,
  useR_E_BuildingBindPaymentMethodsMutation,
  useR_E_BuildingUnBindPaymentMethodsMutation,
  useR_E_BuildingBindMetroStationsMutation,
  useR_E_BuildingUnBindMetroStationsMutation,
  useR_E_BuildingBindMetroStationsUpdateMutation,
  useR_E_BuildingBindTagsMutation,
  useR_E_BuildingUnBindTagsMutation,
  useLazyGetRealEstateBuildingsQuery,
  useGetRealEstateBuildingByIdQuery,
  useLazyGetRealEstateBuildingByIdQuery,
  useCreatNewRealEstateBuildingMutation,
  useUpdateRealEstateBuildingByIdMutation,
  useRecoveryRealEstateBuildingByIdMutation,
  useSoftDeleteRealEstateBuildingByIdMutation,
  useHardDeleteRealEstateBuildingByIdMutation,
  useSoftDeleteRealEstateBuildingMassMutation,
  useRecoveryRealEstateBuildingMassMutation,

  // Tags
  useLazyGetTagsQuery,
  useGetTagByIdQuery,
  useCreatNewTagMutation,
  useUpdateTagByIdMutation,
  useRecoveryTagByIdMutation,
  useSoftDeleteTagByIdMutation,
  useHardDeleteTagByIdMutation,
  useRecoveryTagMassMutation,
  useSoftDeleteTagMassMutation,

  // Scripts,
  useLazyGetScriptsQuery,
  useGetScriptActionInfoQuery,
  useGetScriptByIdQuery,
  useSelectInfoScriptQuery,
  useCreatNewScriptMutation,
  useUpdateScriptByIdMutation,
  useSoftDeleteScriptByIdMutation,
  useHardDeleteScriptByIdMutation,
  useRecoveryScriptByIdMutation,
  useSoftDeleteScriptMassMutation,
  useRecoveryScriptMassMutation,

  // BlackList
  useLazyGetBlackListsQuery,
  useGetBlackListByIdQuery,
  useCreatNewBlackListMutation,
  useUpdateBlackListByIdMutation,
  useSoftDeleteBlackListByIdMutation,
  useSoftDeleteBlackListMassMutation,
  useHardDeleteBlackListByIdMutation,
  useRecoveryBlackListByIdMutation,
  useRecoveryBlackListMassMutation,

  // Map
  useGetMapObjectsQuery,
  useLazyGetMapObjectsQuery,
  useLazyGetMapFiltersQuery,
  useGetMapObjectByIdQuery,
  useLazyGetMapObjectByIdQuery,
  // useCreateTransferMutation,

  //UIS
  useUisHoldCallMutation,
  useUisUnHoldCallMutation,
  useUisStartCallMutation,
  useUisEndCallMutation,
  useUisCallTransferMutation,
} = RtkQueryService;
export default RtkQueryService;
