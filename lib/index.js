'use strict';

const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

module.exports = {

    init({ accessKeyId, secretAccessKey, region, params, baseUrl, defaultPath }) {

        const s3_client = new S3Client({accessKeyId, secretAccessKey, region});

        const prepare_key = (key, file) => {

            if (!key) key = '';
            else if (!key.endsWith('/')) key += '/';

            let path = file.path || defaultPath;
            if (!path) path = '';
            else if (!path.endsWith('/')) path += '/';

            return `${key}${path}${file.hash}${file.ext}`;
        }

        const put_file = (file, customParams = {}) => {

            file.ext = file.ext?.split('?')[0];
            const Key = prepare_key(params.Key, file);
            const Body = file.stream || Buffer.from(file.buffer, 'binary');
            const put_params = { ...params, Key, Body, ContentType: file.mime};
            Object.assign(put_params, customParams);

            file.url = `${baseUrl}/${put_params.Key}`;

            return s3_client.send(new PutObjectCommand(put_params));
        };
        

        const delete_file = (file, customParams = {}) => {

            file.ext = file.ext?.split('?')[0];
            const Key = prepare_key(params.Key, file);
            const del_params = { Bucket: params.Bucket, Key };
            //console.log(del_params);
            return s3_client.send(new DeleteObjectCommand(del_params));
        };

        return {
            uploadStream(file, customParams = {}) {
                return put_file(file, customParams);
            },
            upload(file, customParams = {}) {
                return put_file(file, customParams);
            },
            delete(file, customParams = {}) {
                return delete_file(file, customParams); 
            }
        }
    }
};
