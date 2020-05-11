
```sh
#!/bin/bash

# echo "文件名：$0"
# echo "第一个参数：$1"
# echo "第二个参数：$2"

PROJECT_PATH=$(cd "$(dirname $(dirname $0))";pwd)
# echo ${PROJECT_PATH}

# 备份代码： scp -r root@0.0.0.0:/data/work/med_fe /e/copyWorks/copy_med/$(date --date= +%Y%m%d)

funLog(){
    echo -e "\n\n\n*******************************************\n"
    echo -e "$1"
    echo -e "\n*******************************************\n\n\n"
}

if [ $1 == "dev" ]
then
    # https://www.baidu.com/#/home
    scp -r ${PROJECT_PATH}/dist/* root@0.0.0.0:/data/work/mosaic_fe
    funLog 上传mosaic数据平台测试服!
elif [ $1 == "pro" ]
then
    # https://www.baidu.com/#/home
    scp -r ${PROJECT_PATH}/dist/* root@0.0.0.0:/data/work/mosaic_fe
    funLog 上传mosaic数据平台正式服!
else
    funLog 参数错误!
fi
```

```js
"upload:dev": "bash ./upload/upload.sh dev"
"upload:prod": "bash ./upload/upload.sh prod"
```
