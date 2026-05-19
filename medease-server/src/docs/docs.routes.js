import { Router } from 'express';
import { apiReference } from '@scalar/express-api-reference';
import openApiSpec from './openapi.js';

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

export default router;
