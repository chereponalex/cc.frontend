import Logo from "@/components/template/Logo";
import { useAppSelector } from "@/store";
import useStorage from "@/utils/hooks/useStorage";

const HeaderLogo = () => {
  // const mode = useAppSelector((state) => state.theme.mode);
  const mode = useStorage().getItem("mode");

  return <Logo mode={mode} className="hidden md:block" />;
};

export default HeaderLogo;
