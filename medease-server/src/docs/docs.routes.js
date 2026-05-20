const { Router } = require('express');
const { apiReference } = require('@scalar/express-api-reference');
const openApiSpec = require('./openapi');

const router = Router();

router.use(
  '/api-docs',
  apiReference({
    spec: {
      content: openApiSpec,
    },
    theme: 'purple',
    layout: 'modern',
    defaultHttpClient: {
      targetKey: 'javascript',
      clientKey: 'fetch',
    },
    hideModels: false,
    showSidebar: true,
  })
);

module.exports = router;
