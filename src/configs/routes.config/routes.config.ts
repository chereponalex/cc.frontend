import { lazy } from "react";
import authRoute from "./authRoute";
import type { Routes } from "@/@types/routes";
import { t } from "i18next";
import routePrefix from "@/configs/routes.config/routePrefix";
// import {NAV_ITEM_TYPE_ITEM} from "@/constants/navigation.constant";

export const publicRoutes: Routes = [...authRoute];

export const protectedRoutes = [
  {
    key: "home",
    path: routePrefix.home,
    component: lazy(() => import("@/views/Home")),
    authority: [],
  },
  {
    key: "access_denied",
    path: routePrefix.access_denied,
    component: lazy(() => import("@/views/AccessDenied")),
    authority: [],
  },
  {
    key: "tags",
    path: routePrefix.tag,
    component: lazy(() => import("@/views/Tags")),
    authority: ["api.v1.crm.tag.view"],
  },
  {
    key: "profile",
    path: routePrefix.profile + "",
    component: lazy(() => import("@/views/Profile/Profile")),
    authority: [],
  },
  {
    key: "tags.creatNew",
    path: routePrefix.tag + "/creat-new",
    component: lazy(() => import("@/views/Tags/CreatNewTag")),
    meta: {
      header: t("nav.tag.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.tag.create"],
  },
  {
    key: "tags.creatNew",
    path: routePrefix.tag + "/creat-new/:id",
    component: lazy(() => import("@/views/Tags/CreatNewTag")),
    meta: {
      header: t("nav.tag.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.tag.create"],
  },
  {
    key: "tags.viewing",
    path: routePrefix.tag + "/:id",
    component: lazy(() => import("@/views/Tags/CardTag")),
    authority: ["api.v1.crm.tag.view", "api.v1.crm.tag.update"],
  },
  {
    key: "developers",
    path: routePrefix.developer + "",
    component: lazy(() => import("@/views/Developers")),
    authority: ["api.v1.crm.developer.view"],
  },
  {
    key: "developers.creatNew",
    path: routePrefix.developer + "/creat-new",
    component: lazy(() => import("@/views/Developers/CreatNewDevelopers")),
    meta: {
      header: t("nav.developer.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.developer.create"],
  },
  {
    key: "developers.creatNew",
    path: routePrefix.developer + "/creat-new/:id",
    component: lazy(() => import("@/views/Developers/CreatNewDevelopers")),
    meta: {
      header: t("nav.developer.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.developer.create"],
  },
  {
    key: "developers.viewing",
    path: routePrefix.developer + "/:id",
    component: lazy(() => import("@/views/Developers/CardDevelopers")),
    authority: ["api.v1.crm.developer.view", "api.v1.crm.developer.update"],
  },
  {
    key: "residentialComplexes",
    path: routePrefix.real_estate_building + "",
    component: lazy(() => import("@/views/ResidentialComplexes")),
    authority: [],
  },
  {
    key: "residentialComplexes.creatNew",
    path: routePrefix.real_estate_building + "/creat-new",
    component: lazy(
      () => import("@/views/ResidentialComplexes/CreatNewResidentialComplex"),
    ),
    meta: {
      header: t("nav.real-estate-building.creat-new.text"),
      headerContainer: true,
    },
  },
  {
    key: "residentialComplexes.creatNew",
    path: routePrefix.real_estate_building + "/creat-new/:id",
    component: lazy(
      () => import("@/views/ResidentialComplexes/CreatNewResidentialComplex"),
    ),
    meta: {
      header: t("nav.real-estate-building.creat-new.text"),
      headerContainer: true,
    },
  },
  {
    key: "residentialComplexes.viewing",
    path: routePrefix.real_estate_building + "/:id",
    component: lazy(
      () => import("@/views/ResidentialComplexes/CardResidentialComplex"),
    ),
  },
  {
    key: "paymentMethods",
    path: routePrefix.payment_method + "",
    component: lazy(() => import("@/views/PaymentMethods")),
    authority: ["api.v1.crm.payment_method.view"],
  },
  {
    key: "paymentMethods.creatNew",
    path: routePrefix.payment_method + "/creat-new",
    component: lazy(
      () => import("@/views/PaymentMethods/CreatNewPaymentMethod"),
    ),
    meta: {
      header: t("nav.payment-method.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.payment_method.create"],
  },
  {
    key: "paymentMethods.creatNew",
    path: routePrefix.payment_method + "/creat-new/:id",
    component: lazy(
      () => import("@/views/PaymentMethods/CreatNewPaymentMethod"),
    ),
    meta: {
      header: t("nav.payment-method.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.payment_method.create"],
  },
  {
    key: "paymentMethods.viewing",
    path: routePrefix.payment_method + "/:id",
    component: lazy(() => import("@/views/PaymentMethods/CardPaymentMethod")),
    authority: [
      "api.v1.crm.payment_method.view",
      "api.v1.crm.payment_method.update",
    ],
  },
  {
    key: "stock",
    path: "/stock",
    component: lazy(() => import("@/views/Stock")),
    authority: [],
  },
  {
    key: "offers",
    path: routePrefix.offer + "",
    component: lazy(() => import("@/views/Offers/Offers")),
    authority: ["api.v1.crm.offer.view"],
  },
  {
    key: "offers.creatNew",
    path: routePrefix.offer + "/creat-new",
    component: lazy(() => import("@/views/Offers/CreatNewOffer")),
    meta: {
      header: t("nav.offer.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.offer.create"],
  },
  {
    key: "offers.creatNew",
    path: routePrefix.offer + "/creat-new/:id",
    component: lazy(() => import("@/views/Offers/CreatNewOffer")),
    meta: {
      header: t("nav.offer.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.offer.create"],
  },
  {
    key: "offers.viewing",
    path: routePrefix.offer + "/:id",
    component: lazy(() => import("@/views/Offers/CardOffer")),
    authority: ["api.v1.crm.offer.view", "api.v1.crm.offer.update"],
  },
  {
    key: "venues",
    path: routePrefix.marketplace + "",
    component: lazy(() => import("@/views/Venues")),
    authority: ["api.v1.crm.marketplace.view"],
  },
  {
    key: "venues.creatNew",
    path: routePrefix.marketplace + "/creat-new",
    component: lazy(() => import("@/views/Venues/CreatNewVenue")),
    meta: {
      header: t("nav.marketplace.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.marketplace.create"],
  },
  {
    key: "venues.creatNew",
    path: routePrefix.marketplace + "/creat-new/:id",
    component: lazy(() => import("@/views/Venues/CreatNewVenue")),
    meta: {
      header: t("nav.marketplace.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.marketplace.create"],
  },
  {
    key: "venues.viewing",
    path: routePrefix.marketplace + "/:id",
    component: lazy(() => import("@/views/Venues/CardVenue")),
    authority: ["api.v1.crm.marketplace.view", "api.v1.crm.marketplace.update"],
  },
  {
    key: "workingHours",
    path: routePrefix.work_time + "",
    component: lazy(() => import("@/views/WorkingHours")),
    authority: ["api.v1.crm.work_time.view"],
  },
  {
    key: "workingHours.creatNew",
    path: routePrefix.work_time + "/creat-new",
    component: lazy(() => import("@/views/WorkingHours/CreatNewWorkingHour")),
    meta: {
      header: t("nav.work-time.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.work_time.create"],
  },
  {
    key: "workingHours.creatNew",
    path: routePrefix.work_time + "/creat-new/:id",
    component: lazy(() => import("@/views/WorkingHours/CreatNewWorkingHour")),
    meta: {
      header: t("nav.work-time.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.work_time.create"],
  },
  {
    key: "workingHours.viewing",
    path: routePrefix.work_time + "/:id",
    component: lazy(() => import("@/views/WorkingHours/CardWorkingHour")),
    authority: ["api.v1.crm.work_time.view", "api.v1.crm.work_time.update"],
  },
  {
    key: "question",
    path: routePrefix.question + "",
    component: lazy(() => import("@/views/Questions")),
    authority: ["api.v1.crm.question.view"],
  },
  {
    key: "question.creatNew",
    path: routePrefix.question + "/creat-new",
    component: lazy(() => import("@/views/Questions/CreatNewQuestion")),
    meta: {
      header: t("nav.question.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.question.create"],
  },
  {
    key: "question.creatNew",
    path: routePrefix.question + "/creat-new/:id",
    component: lazy(() => import("@/views/Questions/CreatNewQuestion")),
    meta: {
      header: t("nav.question.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.question.create"],
  },
  {
    key: "question.viewing",
    path: routePrefix.question + "/:id",
    component: lazy(() => import("@/views/Questions/CardQuestion")),
    authority: ["api.v1.crm.question.view", "api.v1.crm.question.update"],
  },
  {
    key: "scripts",
    path: routePrefix.script + "",
    component: lazy(() => import("@/views/Scripts")),
    authority: ["api.v1.crm.script.view"],
  },
  {
    key: "scripts.creatNew",
    path: routePrefix.script + "/creat-new",
    component: lazy(() => import("@/views/Scripts/CreatNewScripts")),
    meta: {
      header: t("nav.script.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.script.create"],
  },
  {
    key: "scripts.creatNew",
    path: routePrefix.script + "/creat-new/:id",
    component: lazy(() => import("@/views/Scripts/CreatNewScripts")),
    meta: {
      header: t("nav.script.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.script.create"],
  },
  {
    key: "scripts.viewing",
    path: routePrefix.script + "/:id",
    component: lazy(() => import("@/views/Scripts/CardScripts")),
    authority: ["api.v1.crm.script.view", "api.v1.crm.script.update"],
  },
  {
    key: "translations",
    path: routePrefix.transfer + "",
    component: lazy(() => import("@/views/Transfers/Transfers")),
    authority: ["api.v1.crm.transfer.view"],
  },
  {
    key: "objects",
    path: routePrefix.real_estate_object + "",
    component: lazy(() => import("@/views/Objects/Objects")),
    authority: ["api.v1.crm.real_estate_object.view"],
  },
  {
    key: "objects.creatNew",
    path: routePrefix.real_estate_object + "/creat-new",
    component: lazy(() => import("@/views/Objects/CreatNewObject")),
    meta: {
      header: t("nav.real-estate-object.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.real_estate_object.create"],
  },
  {
    key: "objects.creatNew",
    path: routePrefix.real_estate_object + "/creat-new/:id",
    component: lazy(() => import("@/views/Objects/CreatNewObject")),
    meta: {
      header: t("nav.real-estate-object.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.real_estate_object.create"],
  },
  {
    key: "objects.viewing",
    path: routePrefix.real_estate_object + "/:id",
    component: lazy(() => import("@/views/Objects/CardObject")),
    authority: [
      "api.v1.crm.real_estate_object.view",
      "api.v1.crm.real_estate_object.update",
    ],
  },
  {
    key: "countries",
    path: routePrefix.country + "",
    component: lazy(() => import("@/views/Countries")),
    authority: ["api.v1.crm.country.view"],
  },
  {
    key: "countries.creatNew",
    path: routePrefix.country + "/creat-new",
    component: lazy(() => import("@/views/Countries/CreatNewCountry")),
    meta: {
      header: t("nav.country.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.country.create"],
  },
  {
    key: "countries.creatNew",
    path: routePrefix.country + "/creat-new/:id",
    component: lazy(() => import("@/views/Countries/CreatNewCountry")),
    meta: {
      header: t("nav.country.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.country.create"],
  },
  {
    key: "countries.viewing",
    path: routePrefix.country + "/:id",
    component: lazy(() => import("@/views/Countries/CardCountry")),
    authority: ["api.v1.crm.city.view", "api.v1.crm.city.update"],
  },
  {
    key: "regions",
    path: routePrefix.region + "",
    component: lazy(() => import("@/views/Regions")),
    authority: ["api.v1.crm.region.view"],
  },
  {
    key: "regions.creatNew",
    path: routePrefix.region + "/creat-new",
    component: lazy(() => import("@/views/Regions/CreatNewRegion")),
    meta: {
      header: t("nav.region.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.region.create"],
  },
  {
    key: "regions.creatNew",
    path: routePrefix.region + "/creat-new/:id",
    component: lazy(() => import("@/views/Regions/CreatNewRegion")),
    meta: {
      header: t("nav.region.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.region.create"],
  },
  {
    key: "regions.viewing",
    path: routePrefix.region + "/:id",
    component: lazy(() => import("@/views/Regions/CardRegion")),
    authority: ["api.v1.crm.region.view", "api.v1.crm.region.update"],
  },
  {
    key: "cities",
    path: routePrefix.city + "",
    component: lazy(() => import("@/views/Cities")),
    authority: ["api.v1.crm.city.view"],
  },
  {
    key: "cities.creatNew",
    path: routePrefix.city + "/creat-new",
    component: lazy(() => import("@/views/Cities/CreatNewCity")),
    meta: {
      header: t("nav.city.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.city.create"],
  },
  {
    key: "cities.creatNew",
    path: routePrefix.city + "/creat-new/:id",
    component: lazy(() => import("@/views/Cities/CreatNewCity")),
    meta: {
      header: t("nav.city.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.city.create"],
  },
  {
    key: "cities.viewing",
    path: routePrefix.city + "/:id",
    component: lazy(() => import("@/views/Cities/CardCity")),
    authority: ["api.v1.crm.city.view", "api.v1.crm.city.update"],
  },
  {
    key: "lineMeter",
    path: routePrefix.metro_line + "",
    component: lazy(() => import("@/views/LineMeter")),
    authority: ["api.v1.crm.metro_line.view"],
  },
  {
    key: "lineMeter.creatNew",
    path: routePrefix.metro_line + "/creat-new",
    component: lazy(() => import("@/views/LineMeter/CreatNewLineMeter")),
    meta: {
      header: t("nav.metro-line.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.metro_line.create"],
  },
  {
    key: "lineMeter.creatNew",
    path: routePrefix.metro_line + "/creat-new/:id",
    component: lazy(() => import("@/views/LineMeter/CreatNewLineMeter")),
    meta: {
      header: t("nav.metro-line.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.metro_line.create"],
  },
  {
    key: "lineMeter.viewing",
    path: routePrefix.metro_line + "/:id",
    component: lazy(() => import("@/views/LineMeter/CardLineMeter")),
    authority: ["api.v1.crm.metro_line.view", "api.v1.crm.metro_line.update"],
  },
  {
    key: "station",
    path: routePrefix.metro_station + "",
    component: lazy(() => import("@/views/Station")),
    authority: ["api.v1.crm.metro_station.view"],
  },
  {
    key: "station.creatNew",
    path: routePrefix.metro_station + "/creat-new",
    component: lazy(() => import("@/views/Station/CreatNewStation")),
    meta: {
      header: t("nav.metro-station.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.metro_station.create"],
  },
  {
    key: "station.creatNew",
    path: routePrefix.metro_station + "/creat-new/:id",
    component: lazy(() => import("@/views/Station/CreatNewStation")),
    meta: {
      header: t("nav.metro-station.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.metro_station.create"],
  },
  {
    key: "station.viewing",
    path: routePrefix.metro_station + "/:id",
    component: lazy(() => import("@/views/Station/CardStation")),
    authority: [
      "api.v1.crm.metro_station.view",
      "api.v1.crm.metro_station.update",
    ],
  },
  {
    key: "users",
    path: routePrefix.employee + "",
    component: lazy(() => import("@/views/Users/Users")),
    authority: ["api.v1.crm.employee.view"],
  },
  {
    key: "users.creatNew",
    path: routePrefix.employee + "/creat-new",
    component: lazy(() => import("@/views/Users/CreatNewUser")),
    meta: {
      header: t("nav.employee.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.employee.create"],
  },
  {
    key: "users.creatNew",
    path: routePrefix.employee + "/creat-new/:id",
    component: lazy(() => import("@/views/Users/CreatNewUser")),
    meta: {
      header: t("nav.employee.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.employee.create"],
  },
  {
    key: "users.viewing",
    path: routePrefix.employee + "/:id",
    component: lazy(() => import("@/views/Users/CardUser")),
    authority: ["api.v1.crm.employee.view", "api.v1.crm.employee.update"],
  },
  {
    key: "blackLists",
    path: routePrefix.black_list + "",
    component: lazy(() => import("@/views/BlackLists")),
    authority: ["api.v1.crm.black_list.view"],
  },
  {
    key: "blackLists.creatNew",
    path: routePrefix.black_list + "/creat-new",
    component: lazy(() => import("@/views/BlackLists/CreatNewBlackLists")),
    meta: {
      header: t("nav.black-list.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.black_list.create"],
  },
  {
    key: "settings",
    path: routePrefix.settings + "",
    component: lazy(() => import("@/views/Settings/Settings")),
    authority: ["api.v1.crm.settings.view"],
  },
  {
    key: "settings.viewing",
    path: routePrefix.settings + "/:id",
    component: lazy(() => import("@/views/Settings/CardSettings")),
    authority: ["api.v1.crm.settings.view", "api.v1.crm.settings.update"],
  },
  {
    key: "settings.creatNew",
    path: routePrefix.settings + "/creat-new",
    component: lazy(() => import("@/views/Settings/CreatNewSettings")),
    meta: {
      header: t("nav.setting.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.settings.create"],
  },
  {
    key: "settings.creatNew",
    path: routePrefix.settings + "/creat-new/:id",
    component: lazy(() => import("@/views/Settings/CreatNewSettings")),
    meta: {
      header: t("nav.setting.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.settings.create"],
  },
  {
    key: "roles",
    path: routePrefix.role + "",
    component: lazy(() => import("@/views/Roles/Roles")),
    authority: ["api.v1.crm.role.view"],
  },
  {
    key: "roles.viewing",
    path: routePrefix.role + "/:id",
    component: lazy(() => import("@/views/Roles/CardRole")),
    authority: ["api.v1.crm.role.view", "api.v1.crm.role.update"],
  },
  {
    key: "roles.creatNew",
    path: routePrefix.role + "/creat-new",
    component: lazy(() => import("@/views/Roles/CreatNewRole")),
    meta: {
      header: t("nav.role.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.role.create"],
  },
  {
    key: "roles.creatNew",
    path: routePrefix.role + "/creat-new/:id",
    component: lazy(() => import("@/views/Roles/CreatNewRole")),
    meta: {
      header: t("nav.role.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.role.create"],
  },
  {
    key: "groups",
    path: routePrefix.groups + "",
    component: lazy(() => import("@/views/Groups/Groups")),
    authority: ["api.v1.crm.groups.view"],
  },
  {
    key: "groups.viewing",
    path: routePrefix.groups + "/:id",
    component: lazy(() => import("@/views/Groups/CardGroup")),
    authority: ["api.v1.crm.groups.view", "api.v1.crm.groups.update"],
  },
  {
    key: "groups.creatNew",
    path: routePrefix.groups + "/creat-new",
    component: lazy(() => import("@/views/Groups/CreatNewGroup")),
    meta: {
      header: t("nav.group.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.groups.create"],
  },
  {
    key: "groups.creatNew",
    path: routePrefix.groups + "/creat-new/:id",
    component: lazy(() => import("@/views/Groups/CreatNewGroup")),
    meta: {
      header: t("nav.group.creat-new.text"),
      headerContainer: true,
    },
    authority: ["api.v1.crm.groups.create"],
  },
  {
    key: "rating",
    path: routePrefix.rating + "",
    component: lazy(() => import("@/views/Rating/Rating")),
    authority: ["api.v1.crm.rating.view"],
  },
  {
    key: "map",
    path: routePrefix.map,
    component: lazy(() => import("@/views/ManagerPage/ManagerPage")),
  },
];
