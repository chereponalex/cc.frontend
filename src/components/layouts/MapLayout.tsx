import Header from "@/components/template/Header";
import SidePanel from "@/components/template/SidePanel";
import UserDropdown from "@/components/template/UserDropdown";
import SideNavToggle from "@/components/template/SideNavToggle";
import MobileNav from "@/components/template/MobileNav";
import SideNav from "@/components/template/SideNav";
import View from "@/views";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

const HeaderActionsStart = () => {
  return (
    <>
      <MobileNav />
      <SideNavToggle />
    </>
  );
};

const HeaderActionsEnd = () => {
  return (
    <>
      <SidePanel />
      <UserDropdown hoverable={false} />
    </>
  );
};

const MapLayout = () => {
  return (
    <div className="app-layout-modern flex flex-auto flex-col">
      <div className="flex flex-auto min-w-0">
        <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
          <View />
        </div>
      </div>
    </div>
  );
};

export default MapLayout;
