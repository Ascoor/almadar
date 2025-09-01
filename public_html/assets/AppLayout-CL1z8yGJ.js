const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Header-D88acA0X.js","assets/pdf-D5yLTPdL.js","assets/react-UnWXGYuj.js","assets/pdf-Du6EuK7o.css","assets/index-BrCJu-Nk.js","assets/vendor-CTvvdsW_.js","assets/index-DedVPPdE.css","assets/AppSidebar-FZwQnL_6.js"])))=>i.map(i=>d[i]);
import{u as x,a as b,b as w,_ as u}from"./index-BrCJu-Nk.js";import{j as s,r as t}from"./pdf-D5yLTPdL.js";import"./react-UnWXGYuj.js";import"./vendor-CTvvdsW_.js";const j=({children:d,className:p=""})=>{const{isMobile:e,isStandalone:n,orientation:o,safeAreaInsets:l}=x(),a=`
    ${p}
    ${e?"mobile-layout":"desktop-layout"}
    ${n?"standalone-mode":"browser-mode"}
    ${o==="landscape"?"landscape-mode":"portrait-mode"}
    transition-all duration-300 ease-in-out
  `,i={paddingTop:n&&e?`max(${l.top}px, 1rem)`:void 0,paddingBottom:n&&e?`max(${l.bottom}px, 1rem)`:void 0,minHeight:e?"calc(var(--vh, 1vh) * 100)":"100vh"};return s.jsx("div",{className:a,style:i,children:d})},y=t.lazy(()=>u(()=>import("./Header-D88acA0X.js"),__vite__mapDeps([0,1,2,3,4,5,6]))),_=t.lazy(()=>u(()=>import("./AppSidebar-FZwQnL_6.js"),__vite__mapDeps([7,1,2,3,4,5,6])));function T({children:d,user:p}){const{isMobile:e,isStandalone:n,safeAreaInsets:o}=x(),{dir:l}=b(),[a,i]=t.useState(!1),[c,f]=t.useState(typeof window<"u"&&window.innerWidth>=768&&window.innerWidth<1024),g=w();t.useEffect(()=>{e&&i(!1)},[g.pathname,e]),t.useEffect(()=>{const r=()=>{f(window.innerWidth>=768&&window.innerWidth<1024)};return window.addEventListener("resize",r),()=>window.removeEventListener("resize",r)},[]);const m=()=>i(r=>!r),h=l==="rtl"?"marginRight":"marginLeft",v={paddingTop:e?n?`${o.top+80}px`:"80px":"112px",paddingBottom:n&&e?`${o.bottom+32}px`:"32px",[h]:e?"0":c?a?"0":"64px":a?"260px":"64px",minHeight:e?"calc(var(--vh, 1vh) * 100)":"100vh"};return s.jsxs(j,{className:"min-h-screen flex flex-col sm:flex-row relative",children:[s.jsxs(t.Suspense,{fallback:s.jsx("div",{className:"text-center p-4",children:"جاري تحميل القائمة الجانبية..."}),children:[s.jsx(_,{isOpen:a,onToggle:m,onLinkClick:()=>(e||c)&&i(!1)}),(e||c)&&a&&s.jsx("div",{className:"fixed inset-0 bg-foreground/50 z-10",onClick:()=>i(!1)})]}),s.jsxs("div",{className:"flex-1 flex flex-col transition-all duration-300",children:[s.jsx(t.Suspense,{fallback:s.jsx("div",{className:"text-center p-4",children:"جاري تحميل الرأس..."}),children:s.jsx(y,{user:p,isOpen:a,onToggleSidebar:m})}),s.jsx("main",{className:`
            flex-1 px-4 sm:px-6 lg:px-8
            bg-background
            transition-all duration-500
            ${e?"mobile-main":"desktop-main"}
            ${n?"standalone-main":""}
          `,style:v,children:d})]})]})}export{T as default};
