const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/DashboardHeader-D9p_JgM-.js","assets/pdf-_01J5l0m.js","assets/react-DxiZ5OBW.js","assets/pdf-Du6EuK7o.css","assets/index-C9wc903-.js","assets/vendor-CTvvdsW_.js","assets/index-Dt2JeuVK.css","assets/AppSidebar-CaVWCxh_.js"])))=>i.map(i=>d[i]);
import{u as x,a as v,b as w,_ as u}from"./index-C9wc903-.js";import{j as s}from"./pdf-_01J5l0m.js";import{a as n}from"./react-DxiZ5OBW.js";import"./vendor-CTvvdsW_.js";const y=({children:d,className:p=""})=>{const{isMobile:e,isStandalone:t,orientation:i,safeAreaInsets:l}=x(),a=`
    ${p}
    ${e?"mobile-layout":"desktop-layout"}
    ${t?"standalone-mode":"browser-mode"}
    ${i==="landscape"?"landscape-mode":"portrait-mode"}
    transition-all duration-300 ease-in-out
  `,o={paddingTop:t&&e?`max(${l.top}px, 1rem)`:void 0,paddingBottom:t&&e?`max(${l.bottom}px, 1rem)`:void 0,minHeight:e?"calc(var(--vh, 1vh) * 100)":"100vh"};return s.jsx("div",{className:a,style:o,children:d})},_=n.lazy(()=>u(()=>import("./DashboardHeader-D9p_JgM-.js"),__vite__mapDeps([0,1,2,3,4,5,6]))),S=n.lazy(()=>u(()=>import("./AppSidebar-CaVWCxh_.js"),__vite__mapDeps([7,1,2,3,4,5,6])));function T({children:d,user:p}){const{isMobile:e,isStandalone:t,safeAreaInsets:i}=x(),{dir:l}=v(),[a,o]=n.useState(!1),[m,f]=n.useState(typeof window<"u"&&window.innerWidth>=768&&window.innerWidth<1024),g=w();n.useEffect(()=>{e&&o(!1)},[g.pathname,e]),n.useEffect(()=>{const r=()=>{f(window.innerWidth>=768&&window.innerWidth<1024)};return window.addEventListener("resize",r),()=>window.removeEventListener("resize",r)},[]);const c=()=>o(r=>!r),b=l==="rtl"?"marginRight":"marginLeft",h={paddingTop:e?t?`${i.top+80}px`:"80px":"112px",paddingBottom:t&&e?`${i.bottom+32}px`:"32px",[b]:e?"0":m?a?"0":"64px":a?"260px":"64px",minHeight:e?"calc(var(--vh, 1vh) * 100)":"100vh"};return s.jsxs(y,{className:"min-h-screen flex flex-col sm:flex-row relative",children:[s.jsxs(n.Suspense,{fallback:null,children:[s.jsx(S,{isOpen:a,onToggle:c,onLinkClick:()=>(e||m)&&o(!1)}),(e||m)&&a&&s.jsx("div",{className:"fixed inset-0 bg-foreground/50 z-10",onClick:()=>o(!1)})]}),s.jsxs("div",{className:"flex-1 flex flex-col transition-all duration-300",children:[s.jsx(n.Suspense,{fallback:null,children:s.jsx(_,{user:p,isOpen:a,onToggleSidebar:c})}),s.jsx("main",{className:`
            flex-1 px-4 sm:px-6 lg:px-8
            bg-bg
            transition-all duration-500
            ${e?"mobile-main":"desktop-main"}
            ${t?"standalone-main":""}
          `,style:h,children:d})]})]})}export{T as default};
