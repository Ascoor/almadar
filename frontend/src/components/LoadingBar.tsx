import "nprogress/nprogress.css";
import { useEffect } from "react";
import NProgress from "nprogress";

NProgress.configure({ showSpinner: false, trickleSpeed: 120 });

export default function LoadingBar() {
  useEffect(() => { /* style via CSS variables if needed */ }, []);
  return null;
}
