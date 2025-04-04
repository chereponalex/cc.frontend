import {
  // NAV_ITEM_TYPE_TITLE,
  NAV_ITEM_TYPE_ITEM,
  NAV_ITEM_TYPE_COLLAPSE,
} from "@/constants/navigation.constant";
import type { NavigationTree } from "@/@types/navigation";
import routePrefix from "@/configs/routes.config/routePrefix";

const navigationConfig: NavigationTree[] = [
  // {
  //   key: "home",
  //   path: routePrefix.home,
  //   title: "Home",
  //   translateKey: "nav.home.text",
  //   icon: "home",
  //   type: NAV_ITEM_TYPE_ITEM,
  //   permissionKey: "home",
  //   matchingKey: "Главная страница",
  //   authority: [],
  //   subMenu: [],
  // },
  {
    key: "developersAndResidentialComplexes",
    path: "",
    title: "Developers and Residential Complexes",
    translateKey: "nav.developers-and-residential-complexes.text",
    icon: "cityCollapseMenu",
    permissionKey: "developersAndResidentialComplexes",
    matchingKey: "Застройщики",
    type: NAV_ITEM_TYPE_COLLAPSE,
    authority: [
      // "api.v1.crm.developer.view",
      // "api.v1.crm.real_estate_building.view",
      // "api.v1.crm.payment_method.view",
      // "api.v1.crm.tag.view",
    ],
    subMenu: [
      {
        key: "developers",
        path: routePrefix.developer,
        title: "Developers",
        translateKey: "nav.developer.text",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        permissionKey: "developer",
        matchingKey: "Застройщики",
        authority: [
          /* "api.v1.crm.developer.view" */
        ],
        subMenu: [],
      },
      {
        key: "residentialComplexes",
        path: routePrefix.real_estate_building,
        title: "Residential Complexes",
        translateKey: "nav.real-estate-building.text",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        permissionKey: "real_estate_building",
        matchingKey: "Жилые комплексы",
        authority: [
          /* "api.v1.crm.real_estate_building.view" */
        ],
        subMenu: [],
      },
      {
        key: "paymentMethods",
        path: routePrefix.payment_method,
        title: "Payment Methods",
        translateKey: "nav.payment-method.text",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        permissionKey: "payment_method",
        matchingKey: "Методы платежей",
        authority: [
          /* "api.v1.crm.payment_method.view" */
        ],
        subMenu: [],
      },
      {
        key: "tags",
        path: routePrefix.tag,
        title: "Tags",
        translateKey: "nav.tag.text",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        permissionKey: "tag",
        matchingKey: "Теги",
        authority: [
          /* "api.v1.crm.tag.view" */
        ],
        subMenu: [],
      },
    ],
  },
  {
    key: "offers",
    path: "",
    title: "Offers",
    translateKey: "nav.offer.text",
    icon: "sellCollapseMenu",
    type: NAV_ITEM_TYPE_COLLAPSE,
    permissionKey: "offers",
    matchingKey: "Оферы",
    authority: [
      // "api.v1.crm.offer.view",
      // "api.v1.crm.marketplace.view",
      // "api.v1.crm.work_time.view",
      // "api.v1.crm.question.view",
      // "api.v1.crm.script.view",
    ],
    subMenu: [
      {
        key: "offers",
        path: routePrefix.offer,
        title: "Offers",
        translateKey: "nav.offer.text",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        permissionKey: "offer",
        matchingKey: "Оферы",
        authority: [
          /* "api.v1.crm.offer.view" */
        ],
        subMenu: [],
      },
      {
        key: "venues",
        path: routePrefix.marketplace,
        title: "Venues",
        translateKey: "nav.marketplace.text",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        permissionKey: "marketplace",
        matchingKey: "Площадки",
        authority: [
          /* "api.v1.crm.marketplace.view" */
        ],
        subMenu: [],
      },
      {
        key: "workingHours",
        path: routePrefix.work_time,
        title: "Working Hours",
        translateKey: "nav.work-time.text",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        permissionKey: "work_time",
        matchingKey: "Рабочее время оферов",
        authority: [
          /* "api.v1.crm.work_time.view" */
        ],
        subMenu: [],
      },
      {
        key: "questions",
        path: routePrefix.question,
        title: "Questions",
        translateKey: "nav.question.text",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        permissionKey: "question",
        matchingKey: "Вопросы",
        authority: [
          /* "api.v1.crm.question.view" */
        ],
        subMenu: [],
      },
      {
        key: "scripts",
        path: routePrefix.script,
        title: "Scripts",
        translateKey: "nav.script.text",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        permissionKey: "script",
        matchingKey: "Скрипты",
        authority: [
          /* "api.v1.crm.script.view" */
        ],
        subMenu: [],
      },
    ],
  },
  // {
  //   key: "map",
  //   path: "",
  //   title: "Map",
  //   translateKey: "nav.map.text",
  //   icon: "sellCollapseMenu",
  //   type: NAV_ITEM_TYPE_COLLAPSE,
  //   permissionKey: "map",
  //   matchingKey: "Карта",
  //   authority: [/* "api.v1.crm.map.view" */],
  //   subMenu: [
  //     {
  //       key: "map",
  //       path: routePrefix.map,
  //       title: "Map",
  //       translateKey: "nav.map.text",
  //       icon: "",
  //       type: NAV_ITEM_TYPE_ITEM,
  //       permissionKey: "map",
  //       matchingKey: "Карта",
  //       authority: [/* "api.v1.crm.map.view" */],
  //       subMenu: [],
  //     },
  //   ],
  // },
  {
    key: "transfers",
    path: "",
    title: "Transfers",
    translateKey: "nav.transfer.text",
    icon: "transferCollapseMenu",
    type: NAV_ITEM_TYPE_COLLAPSE,
    permissionKey: "transfer",
    matchingKey: "Переводы",
    authority: [
      /* "api.v1.crm.transfer.view", "api.v1.crm.rating.view" */
    ],
    subMenu: [
      {
        key: "transfer-list",
        path: routePrefix.transfer,
        title: "Transfers",
        translateKey: "nav.transfer-list.text",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        permissionKey: "transfer",
        matchingKey: "Переводы",
        authority: [
          /* "api.v1.crm.transfer.view" */
        ],
        subMenu: [],
      },
      {
        key: "rating",
        path: routePrefix.rating,
        title: "Rating",
        translateKey: "nav.rating.text",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        permissionKey: "rating",
        matchingKey: "Рейтинг",
        authority: [
          /* "api.v1.crm.rating.view" */
        ],
        subMenu: [],
      },
    ],
  },
  {
    key: "objects",
    path: "",
    title: "Objects",
    translateKey: "nav.objects.text",
    icon: "domainCollapseMenu",
    type: NAV_ITEM_TYPE_COLLAPSE,
    permissionKey: "objects",
    matchingKey: "Объекты недвижимости",
    authority: [
      /* "api.v1.crm.real_estate_object.view" */
    ],
    subMenu: [
      {
        key: "objects",
        path: routePrefix.real_estate_object,
        title: "Objects",
        translateKey: "nav.real-estate-object.text",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        permissionKey: "real_estate_object",
        matchingKey: "Объекты недвижимости",
        authority: [
          /* "api.v1.crm.real_estate_object.view" */
        ],
        subMenu: [],
      },
    ],
  },
  {
    key: "citiesAndMetro",
    path: "",
    title: "CitiesAndMetro",
    translateKey: "nav.cities-and-metro.text",
    icon: "subwayCollapseMenu",
    type: NAV_ITEM_TYPE_COLLAPSE,
    permissionKey: "cities_and_metro",
    matchingKey: "Города и метро",
    authority: [
      // "api.v1.crm.country.view",
      // "api.v1.crm.region.view",
      // "api.v1.crm.city.view",
      // "api.v1.crm.metro_line.view",
      // "api.v1.crm.metro_station.view",
    ],
    subMenu: [
      {
        key: "countries",
        path: routePrefix.country,
        title: "Countries",
        translateKey: "nav.country.text",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        permissionKey: "country",
        matchingKey: "Страны",
        authority: [
          /* "api.v1.crm.country.view" */
        ],
        subMenu: [],
      },
      {
        key: "regions",
        path: routePrefix.region,
        title: "Regions",
        translateKey: "nav.region.text",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        permissionKey: "region",
        matchingKey: "Области",
        authority: [
          /* "api.v1.crm.region.view" */
        ],
        subMenu: [],
      },
      {
        key: "cities",
        path: routePrefix.city,
        title: "Сities",
        translateKey: "nav.city.text",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        permissionKey: "city",
        matchingKey: "Города",
        authority: [
          /* "api.v1.crm.city.view" */
        ],
        subMenu: [],
      },
      {
        key: "lineMeter",
        path: routePrefix.metro_line,
        title: "LineMeter",
        translateKey: "nav.metro-line.text",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        permissionKey: "metro_line",
        matchingKey: "Линии метро",
        authority: [
          /* "api.v1.crm.metro_line.view" */
        ],
        subMenu: [],
      },
      {
        key: "station",
        path: routePrefix.metro_station,
        title: "Station",
        translateKey: "nav.metro-station.text",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        permissionKey: "metro_station",
        matchingKey: "Станции метро",
        authority: [
          /* "api.v1.crm.metro_station.view" */
        ],
        subMenu: [],
      },
    ],
  },
  {
    key: "system",
    path: "",
    title: "System",
    translateKey: "nav.system.text",
    icon: "settingsCollapseMenu",
    type: NAV_ITEM_TYPE_COLLAPSE,
    permissionKey: "system",
    matchingKey: "Система",
    authority: [
      // "api.v1.crm.employee.view",
      // "api.v1.crm.black_list.view",
      // "api.v1.crm.role.view",
      // "api.v1.crm.groups.view",
      // "api.v1.crm.settings.view",
    ],
    subMenu: [
      {
        key: "users",
        path: routePrefix.employee,
        title: "Users",
        translateKey: "nav.employee.text",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        permissionKey: "employee",
        matchingKey: "Сотрудники",
        authority: [
          /* "api.v1.crm.employee.view" */
        ],
        subMenu: [],
      },
      {
        key: "blackLists",
        path: routePrefix.black_list,
        title: "BlackList",
        translateKey: "nav.black-list.text",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        permissionKey: "black_list",
        matchingKey: "Черный список",
        authority: [
          /* "api.v1.crm.black_list.view" */
        ],
        subMenu: [],
      },
      {
        key: "roles",
        path: routePrefix.role,
        title: "Roles",
        translateKey: "nav.role.text",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        permissionKey: "role",
        matchingKey: "Роли пользователей",
        authority: [
          /* "api.v1.crm.role.view" */
        ],
        subMenu: [],
      },
      {
        key: "groups",
        path: routePrefix.groups,
        title: "Groups",
        translateKey: "nav.group.text",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        //TODO ломается таблица если поменять permissionKey
        //employees_group
        permissionKey: "groups",
        matchingKey: "Группы пользователей",
        authority: [
          /* "api.v1.crm.groups.view" */
        ],
        subMenu: [],
      },
      {
        key: "settings",
        path: routePrefix.settings,
        title: "Settings",
        translateKey: "nav.setting.text",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        permissionKey: "settings",
        matchingKey: "Настройки",
        authority: [
          /* "api.v1.crm.settings.view" */
        ],
        subMenu: [],
      },
    ],
  },
];

export default navigationConfig;
