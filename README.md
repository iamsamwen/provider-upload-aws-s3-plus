# @iamsamwen/provider-upload-aws-s3-plus

AWS S3 provider for strapi upload with support for prefix, defaultPath and baseUrl with customized domain name features.

use @aws-sdk/client-s3

replace MY.DOMAIN.NAME with your domain name

## Installation

```bash
# using yarn
yarn add @iamsamwen/provider-upload-aws-s3-plus

# using npm
npm install @iamsamwen/provider-upload-aws-s3-plus --save
```

## Configurations

### Provider Configuration

add upload section of following to ./config/plugins.js

```js
module.exports = ({ env }) => ({
  // ...
  upload: {
    config: {
      provider: '@iamsamwen/provider-upload-aws-s3-plus',
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env('AWS_ACCESS_SECRET'),
        region: env('AWS_REGION'),
        params: {
            Bucket: env('AWS_BUCKET'),
            Key: env('AWS_KEY'),  // prefix 
        },
        baseUrl: env('AWS_BASE_URL'),
        defaultPath: 'AWS_DEFAULT_PATH', // default path if no file path provided
      },
    },
  },
  // ...
});

```

for example, if you have .env setup as:
```
...
AWS_BUCKET=MY.DOMAIN.NAME
AWS_BASE_URL=https://MY.DOMAIN.NAME
AWS_KEY=products
AWS_DEFAULT_PATH=00-files
...
```

if no path is set when file is uploaded, the url looks like https://MY.DOMAIN.NAME/products/00-files/image_63ec2fe493.png

if path is set to t-shirts, and name for the file is color-blue, the url looks like https://MY.DOMAIN.NAME/products/t-shirts/color-blue_63ec2fe493.png

### Security Middleware Configuration

To allow strapi load the assets files, use {...} block of following to replace name: 'strapi::security' in ./config/middlewares.js.

```js
module.exports = [
  // ...
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'MY.DOMAIN.NAME'],
          'media-src': ["'self'", 'data:', 'blob:', 'MY.DOMAIN.NAME'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  // ...
];
```

## Required AWS Policy Actions

These are the minimum amount of permissions needed for this provider to work.

```json
"Action": [
  "s3:PutObject",
  "s3:GetObject",
  "s3:ListBucket",
  "s3:DeleteObject",
  "s3:PutObjectAcl"
],
```
