(() => {
 'use strict';
 const main=document.querySelector('main');if(main&&!main.id)main.id='main-content';
 const skip=document.createElement('a');skip.className='skip-link';skip.href='#'+(main?.id||'main-content');skip.textContent='Skip to content';document.body.prepend(skip);
 const header=document.querySelector('header');
 if(header){header.querySelector('a[href="login.html"]')?.remove();const existing=header.querySelector('nav');if(existing)existing.remove();
 const nav=document.createElement('nav');nav.className='public-nav';nav.setAttribute('aria-label','Agency navigation');
 for(const [label,href] of [['Services','index.html#services'],['Getting started','getting-started.html'],['Pricing','pricing.html'],['Client portal','portal.html']]){
 const a=document.createElement('a');a.textContent=label;a.href=href;if(location.pathname.endsWith('/'+href))a.setAttribute('aria-current','page');nav.append(a);}
 (header.querySelector('.head')||header).append(nav);}
})();