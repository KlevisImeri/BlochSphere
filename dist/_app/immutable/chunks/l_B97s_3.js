import{n as a,g as y,T as k,r as z,U as h,f as A,e as p,V as B}from"./BdIUWPZI.js";function w(e,n,t){if(e==null)return n(void 0),t&&t(void 0),a;const r=y(()=>e.subscribe(n,t));return r.unsubscribe?()=>r.unsubscribe():r}const f=[];function D(e,n){return{subscribe:E(e,n).subscribe}}function E(e,n=a){let t=null;const r=new Set;function c(u){if(k(e,u)&&(e=u,t)){const o=!f.length;for(const s of r)s[1](),f.push(s,e);if(o){for(let s=0;s<f.length;s+=2)f[s][0](f[s+1]);f.length=0}}}function l(u){c(u(e))}function b(u,o=a){const s=[u,o];return r.add(s),r.size===1&&(t=n(c,l)||a),u(e),()=>{r.delete(s),r.size===0&&t&&(t(),t=null)}}return{set:c,update:l,subscribe:b}}function U(e,n,t){const r=!Array.isArray(e),c=r?[e]:e;if(!c.every(Boolean))throw new Error("derived() expects stores as input, got a falsy value");const l=n.length<2;return D(t,(b,u)=>{let o=!1;const s=[];let d=0,_=a;const m=()=>{if(d)return;_();const i=n(r?s[0]:s,b,u);l?b(i):_=typeof i=="function"?i:a},q=c.map((i,g)=>w(i,x=>{s[g]=x,d&=~(1<<g),o&&m()},()=>{d|=1<<g}));return o=!0,m(),function(){z(q),_(),o=!1}})}function V(e){let n;return w(e,t=>n=t)(),n}function M(e){p===null&&h(),B&&p.l!==null?S(p).m.push(e):A(()=>{const n=y(e);if(typeof n=="function")return n})}function j(e){p===null&&h(),M(()=>()=>y(e))}function S(e){var n=e.l;return n.u??(n.u={a:[],b:[],m:[]})}export{j as a,U as d,V as g,M as o,D as r,w as s,E as w};
