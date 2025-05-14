
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://github.com/MhmdTahaSheRif/Frontend_soundmap',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/MhmdTahaSheRif/Frontend_soundmap/home",
    "route": "/MhmdTahaSheRif/Frontend_soundmap"
  },
  {
    "renderMode": 2,
    "route": "/MhmdTahaSheRif/Frontend_soundmap/home"
  },
  {
    "renderMode": 2,
    "route": "/MhmdTahaSheRif/Frontend_soundmap/navbar"
  },
  {
    "renderMode": 2,
    "route": "/MhmdTahaSheRif/Frontend_soundmap/login"
  },
  {
    "renderMode": 2,
    "route": "/MhmdTahaSheRif/Frontend_soundmap/register"
  },
  {
    "renderMode": 2,
    "route": "/MhmdTahaSheRif/Frontend_soundmap/aboutus"
  },
  {
    "renderMode": 2,
    "route": "/MhmdTahaSheRif/Frontend_soundmap/content"
  },
  {
    "renderMode": 2,
    "route": "/MhmdTahaSheRif/Frontend_soundmap/myprofile"
  },
  {
    "renderMode": 2,
    "route": "/MhmdTahaSheRif/Frontend_soundmap/mysounds"
  },
  {
    "renderMode": 2,
    "route": "/MhmdTahaSheRif/Frontend_soundmap/blog"
  },
  {
    "renderMode": 2,
    "route": "/MhmdTahaSheRif/Frontend_soundmap/admin"
  },
  {
    "renderMode": 2,
    "route": "/MhmdTahaSheRif/Frontend_soundmap/addsound"
  },
  {
    "renderMode": 2,
    "route": "/MhmdTahaSheRif/Frontend_soundmap/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 7650, hash: 'a5d24e7210a0ff433298382565a857a2cb6739533de0b3c66c044b626b5c5e7c', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 2739, hash: '1edf7cb6681dae55dc8d4b83439d6d2d9367ae778e0dd43e03c960399149ab9a', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'home/index.html': {size: 34997, hash: '14a8852f6dd416ef85f51b81b744ca7f521f8045b0f6c59868b48026b4ca16da', text: () => import('./assets-chunks/home_index_html.mjs').then(m => m.default)},
    'navbar/index.html': {size: 22384, hash: '3ba3c0ef7313d1d202f7a60506a25d6aae6e28141c043c27c113b9ab74fce285', text: () => import('./assets-chunks/navbar_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 19894, hash: '1a9cd4d205dbf190ad0e4dfb1f22b6e828848848c255254406fa74ad780800b2', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'content/index.html': {size: 37840, hash: '73a3ad9dd460d399053d38937e91325b8ca89c03befb89b905d297f2d8aa86d4', text: () => import('./assets-chunks/content_index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 21484, hash: '27bb35d2a8c61cb6f51c0a4d0631259268500254be86ef23aa4413b8aab0c822', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'aboutus/index.html': {size: 25897, hash: 'ddcdb8b7b92d7a3d09f4c38673e86ec023475d0733f548b99ac4ae49b82556ca', text: () => import('./assets-chunks/aboutus_index_html.mjs').then(m => m.default)},
    'myprofile/index.html': {size: 21320, hash: 'a9f6f82fc5e21250022dbede13cdb17cc3bf1c707edb3800231c9ebcbcb0415c', text: () => import('./assets-chunks/myprofile_index_html.mjs').then(m => m.default)},
    'admin/index.html': {size: 24391, hash: 'bb037815ce6097333c7740b4f8ed9ccb56a6a53257e74ca23b87dfa9b8d6acf7', text: () => import('./assets-chunks/admin_index_html.mjs').then(m => m.default)},
    'mysounds/index.html': {size: 20486, hash: 'd810b3c6479e8feb30c81a10869aa690db045aed50c5dd018a7892b6b271ff87', text: () => import('./assets-chunks/mysounds_index_html.mjs').then(m => m.default)},
    'blog/index.html': {size: 24622, hash: 'e44569dd1fe88c63711fe2650d070564db5322fa3b7791a6ac9ed4a6d159ff91', text: () => import('./assets-chunks/blog_index_html.mjs').then(m => m.default)},
    'addsound/index.html': {size: 22288, hash: 'e240e164734037fb7d6d06ca591fe2b695a6ed94df59a9fa49fd48435f11eb28', text: () => import('./assets-chunks/addsound_index_html.mjs').then(m => m.default)},
    'styles-5MWEPGJ2.css': {size: 402933, hash: 'P9qn9H0kA7U', text: () => import('./assets-chunks/styles-5MWEPGJ2_css.mjs').then(m => m.default)}
  },
};
