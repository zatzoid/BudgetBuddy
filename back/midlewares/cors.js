const allowedCors = [
    'https://localhost:3000',
    'http://localhost:3000',
    'http://localhost:3010',
    'http://192.168.0.15:3010',
    'http://zatzoid-projects.ru',
    'https://zatzoid-projects.ru',
    'https://bb.zatzoid-projects.ru',
    'http://bb.zatzoid-projects.ru'
  ];
  
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  export default (req, res, next) => {
    const { method } = req;
    const { origin } = req.headers;
    const requestHeaders = req.headers['access-control-request-headers'];
    res.header('Access-Control-Allow-Credentials', true);
    if (allowedCors.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    if (method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
      res.header('Access-Control-Allow-Headers', requestHeaders);
      return res.end();
    }
    return next();
  };