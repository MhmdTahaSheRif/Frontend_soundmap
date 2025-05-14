
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://MhmdTahaSheRif.github.io/Frontend_soundmap/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/Frontend_soundmap/home",
    "route": "/Frontend_soundmap"
  },
  {
    "renderMode": 2,
    "route": "/Frontend_soundmap/home"
  },
  {
    "renderMode": 2,
    "route": "/Frontend_soundmap/navbar"
  },
  {
    "renderMode": 2,
    "route": "/Frontend_soundmap/login"
  },
  {
    "renderMode": 2,
    "route": "/Frontend_soundmap/register"
  },
  {
    "renderMode": 2,
    "route": "/Frontend_soundmap/aboutus"
  },
  {
    "renderMode": 2,
    "route": "/Frontend_soundmap/content"
  },
  {
    "renderMode": 2,
    "route": "/Frontend_soundmap/myprofile"
  },
  {
    "renderMode": 2,
    "route": "/Frontend_soundmap/mysounds"
  },
  {
    "renderMode": 2,
    "route": "/Frontend_soundmap/blog"
  },
  {
    "renderMode": 2,
    "route": "/Frontend_soundmap/admin"
  },
  {
    "renderMode": 2,
    "route": "/Frontend_soundmap/addsound"
  },
  {
    "renderMode": 2,
    "route": "/Frontend_soundmap/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 7650, hash: '1e35ae80fbc8bead79db0aca0f5c62686927e2dae1cf13233b659e1f7640c697', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 2739, hash: '70a9b6b6603df6c816df9f0fab658e4483509720115622f082d9edd252f8d446', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'home/index.html': {size: 34992, hash: 'fcbfcd6140f103e4bcc7673b33573107f41169d936b9b7db1af59b0d0ff33bd6', text: () => import('./assets-chunks/home_index_html.mjs').then(m => m.default)},
    'navbar/index.html': {size: 22374, hash: '3553b46dbafb6fba562900639bfd09b173400567a10053dd825a2bedc113bc63', text: () => import('./assets-chunks/navbar_index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 21479, hash: '9fc1c2ad90772fd08b21f8a7065340caf7866fbc2c8a41a8f524e39d73cf63a4', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 19889, hash: '320dea3183ac688fdf1856a4d3e43ca3e0dc56b4788e854a5ef86ab184437999', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'aboutus/index.html': {size: 25892, hash: '7aba4a2326c645b6ff088171dd6b2c56ecf0364296aa57a85938f0e8d3cd1043', text: () => import('./assets-chunks/aboutus_index_html.mjs').then(m => m.default)},
    'content/index.html': {size: 37835, hash: '6272e810dd23caf681507e5dd7287e63ef33fa439f52258b574a256ab315024a', text: () => import('./assets-chunks/content_index_html.mjs').then(m => m.default)},
    'admin/index.html': {size: 24386, hash: '166bc7771697a0f17d8fc0484dcedd1fcb32cb819b8391bc3dcb7637c209123b', text: () => import('./assets-chunks/admin_index_html.mjs').then(m => m.default)},
    'myprofile/index.html': {size: 21315, hash: 'b161ef43a5a3a35188b66e51bb6612158b5f4783244c87ea21587ae5835ca421', text: () => import('./assets-chunks/myprofile_index_html.mjs').then(m => m.default)},
    'mysounds/index.html': {size: 20481, hash: '15048b1364efb557b654e40c78700a26691563bcce257646fe12a4ce0a1d1e37', text: () => import('./assets-chunks/mysounds_index_html.mjs').then(m => m.default)},
    'addsound/index.html': {size: 22283, hash: 'c8c17d7ab54f2546dbcac3af007557067cac8f825cabc40ca26ca2c7a66c9e12', text: () => import('./assets-chunks/addsound_index_html.mjs').then(m => m.default)},
    'blog/index.html': {size: 24617, hash: '409c5dd645948576ab7cf7cad7bfd2a39370060eee611893926dfc74ecedb2fb', text: () => import('./assets-chunks/blog_index_html.mjs').then(m => m.default)},
    'styles-5MWEPGJ2.css': {size: 402933, hash: 'P9qn9H0kA7U', text: () => import('./assets-chunks/styles-5MWEPGJ2_css.mjs').then(m => m.default)}
  },
};
