/*
* 去除上传文件的IP地址和端口号
* file当前的文件
* inside需要替换的关键字 当前默认是'/'
* inside在url中第几次出现 index默认=2 第三个出现的
* */
export const DeleteIpPort=(file,inside='/',number=2)=>{
    let newFile={};
    let getUrl=(url)=>{
        let idx=url.indexOf('/');
        for(let i=0;i<2;i++){
            idx=url.indexOf('/',idx+1)
        }
        return url.slice(idx,url.length);
    };
    newFile.a_file=getUrl(file.response.a_file);
    newFile.download_url=getUrl(file.response.download_url);
    newFile.name=file.name;
    newFile.misc=file.response.misc;
    newFile.mime_type=file.type;
    return newFile;
};