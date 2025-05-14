
export default {
  basePath: 'https://github.com/MhmdTahaSheRif/Frontend_soundmap',
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
