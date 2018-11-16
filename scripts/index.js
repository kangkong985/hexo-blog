'use strict';

const Minio = require('minio');

var hexo = hexo || {};
var fs = fs || require('fs');
var yaml = yaml || require('js-yaml');
var minio_client  = minio_client || 
    new Minio.Client(yaml.safeLoad(fs.readFileSync(__dirname + "/minio_key.yml", 'utf8')));

hexo.extend.tag.register('minio', async (args, content) => {
    var 
        bucket = 'default',
        resource_name = '';
    if (args.length == 1) {
        resource_name = args[0];
    } else {
        resource_name = args[1];
        bucket = args[0];
    }
    var file_url = await minio_client.presignedGetObject(bucket, resource_name);
    return `<a target="_blank" href="${file_url}">${content}</a>`;
}, {async: true, ends:true});
