import TableRatingDaily from "@/components/shared/TableRatingDaily";
import TableRatingWeekly from "@/components/shared/TableRatingWeekly";
import { Tabs } from "@/components/ui";
import TabContent from "@/components/ui/Tabs/TabContent";
import TabList from "@/components/ui/Tabs/TabList";
import TabNav from "@/components/ui/Tabs/TabNav";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

export const TabUrl = {
  DAILY_RATING: "daily",
  WEEKLY_RATING: "weekly",
};

const Rating = () => {
  const { t } = useTranslation();
  const [queryParams, setQueryParams] = useSearchParams();

  const [currentTab, setCurrentTab] = useState<string>(
    queryParams.get("tab") || TabUrl.DAILY_RATING,
  );

  const handleTabChange = (val: string) => {
    setCurrentTab(val);
    queryParams.set("tab", val);
    setQueryParams(queryParams);
  };

  useEffect(
    () => {
      const tab = queryParams.get("tab");

      if (!tab || !Object.values(TabUrl).includes(tab)) {
        queryParams.set("tab", TabUrl.DAILY_RATING);
        setQueryParams(queryParams);
        setCurrentTab(TabUrl.DAILY_RATING);
      } else if (tab && Object.values(TabUrl).includes(tab)) {
        setCurrentTab(tab);
      }
    },
    [
      /* queryParams */
    ],
  );

  return (
    <Tabs value={currentTab} onChange={handleTabChange}>
      <TabList className="flex justify-center">
        <TabNav value={TabUrl.DAILY_RATING}>
          {t("tabsText.daily_rating")}
        </TabNav>
        <TabNav value={TabUrl.WEEKLY_RATING}>
          {t("tabsText.weekly_rating")}
        </TabNav>
      </TabList>
      <div className="mt-3">
        <TabContent value={TabUrl.DAILY_RATING}>
          <TableRatingDaily />
        </TabContent>
        <TabContent value={TabUrl.WEEKLY_RATING}>
          <TableRatingWeekly />
        </TabContent>
      </div>
    </Tabs>
  );
};

export default Rating;
