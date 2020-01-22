let baseUrl = '';
let staticPath = '';
const publicPath = process.env.PUBLIC_PATH || '';

switch (process.env.BUILD_ENV) {
  case 'development':
    baseUrl = 'http://localhost:3000/';
    staticPath = '/static';
    break;
  case 'test':
    baseUrl = '';
    staticPath = '/dist/static';
    break;
  case 'pre-production':
    baseUrl = '';
    staticPath = '/dist/static';
    break;
  case 'production':
    baseUrl = '';
    staticPath = '/dist/static';
    break;
}

export {
  baseUrl,
  staticPath,
  publicPath
};
