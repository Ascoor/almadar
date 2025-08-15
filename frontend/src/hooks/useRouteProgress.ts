import { useEffect } from "react";
import NProgress from "nprogress";
import { useNavigation } from "react-router-dom";

export function useRouteProgress() {
  const nav = useNavigation();
  useEffect(() => {
    if (nav.state === "loading") NProgress.start();
    else NProgress.done();
  }, [nav.state]);
}
