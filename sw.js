if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let o={};const d=e=>i(e,t),l={module:{uri:t},exports:o,require:d};s[t]=Promise.all(n.map((e=>l[e]||d(e)))).then((e=>(r(...e),o)))}}define(["./workbox-3e911b1d"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-CHYtS0xh.js",revision:null},{url:"assets/index-DiwrgTda.css",revision:null},{url:"index.html",revision:"3e9d773109d57628a04f45ced019694d"},{url:"registerSW.js",revision:"16054db04f7b0c22ff1f986865b292a9"},{url:"assets/manifest-icon-192.maskable.png",revision:"50dfb756d334176c71b86c8d53aa4069"},{url:"assets/manifest-icon-512.maskable.png",revision:"77914a396d103881de609ad86537000c"},{url:"manifest.webmanifest",revision:"89a40e1a9295c8edbc01329d5adf4342"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
