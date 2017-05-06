# alipay-request
## alipay-api-sdk for https://doc.open.alipay.com/doc2/apiList?docType=4

----------
#use
```sh
>cd your-project
>npm install alipay-request --save
```
----------------------
#easy Example
```node
const fs = require("fs");
const path = require("path");
const AlipayRequest = require('alipay-request');

//-----------------Iint AlipayRequest----------------------
let alipayRequest =  new AlipayRequest();
alipayRequest.gateWayUrl = 'https://openapi.alipay.com/gateway.do';
alipayRequest.rsaPrivateKey=path.join(__dirname,'key','rsa_private_key.pem');
alipayRequest.alipayrsaPublicKey=path.join(__dirname,'key','alipay_public_key.pem');
alipayRequest.initParam();//every request must initParam
//------------------SET sendParam-------------------
alipayRequest.setParam('app_id','2016080308888888');
alipayRequest.setParam('biz_content',JSON.stringify({bill_type:'trade',bill_date:alipayRequest.getYmdFormatDate(-24*3600*1000)}));//get data,yesterday
alipayRequest.setParam('charset','utf-8');
alipayRequest.setParam('format','json');
alipayRequest.setParam('method','alipay.data.dataservice.bill.downloadurl.query');
alipayRequest.setParam('sign_type','RSA');
alipayRequest.setParam('version','1.0');
alipayRequest.setParam('timestamp',alipayRequest.getNowFormatDate());
alipayRequest.setParam('sign',alipayRequest.getSign());
//------------------Get result-------------------
alipayRequest.getRes()
.then((res)=>{
    let backRes = JSON.parse(res.body);
    console.log(backRes);
})
.catch((err)=>{
    console.log(err);
});
```

-----------------------
#detail Example
```node
const fs = require("fs");
const path = require("path");
const AlipayRequest = require('alipay-request');

//-----------------Iint AlipayRequest----------------------
let alipayRequest =  new AlipayRequest();
alipayRequest.gateWayUrl = 'https://openapi.alipay.com/gateway.do';
alipayRequest.rsaPrivateKey=path.join(__dirname,'key','rsa_private_key.pem');
alipayRequest.alipayrsaPublicKey=path.join(__dirname,'key','alipay_public_key.pem');
alipayRequest.initParam();//every request must initParam
//------------------SET sendParam-------------------
alipayRequest.setParam('app_id','2016080308888888');
alipayRequest.setParam('biz_content',JSON.stringify({bill_type:'trade',bill_date:alipayRequest.getYmdFormatDate(-24*3600*1000)}));//get data,yesterday
alipayRequest.setParam('charset','utf-8');
alipayRequest.setParam('format','json');
alipayRequest.setParam('method','alipay.data.dataservice.bill.downloadurl.query');
alipayRequest.setParam('sign_type','RSA');
alipayRequest.setParam('version','1.0');
alipayRequest.setParam('timestamp',alipayRequest.getNowFormatDate());
alipayRequest.setParam('sign',alipayRequest.getSign());
//------------------Get result-------------------
alipayRequest.getRes()
.then((res)=>{
    let backRes = JSON.parse(res.body);
    return alipayRequest.downFile(backRes.alipay_data_dataservice_bill_downloadurl_query_response.bill_download_url,'csv.zip');
})
.then((res)=>{
    return alipayRequest.unZip('csv.zip','./csv',1,'data.csv');
})
.then((res)=>{
    let strGbkBuf = fs.readFileSync('./csv/data.csv');
    let strUTF = alipayRequest.convertCode(strGbkBuf,'GBK','UTF8').toString();
    strUTF = strUTF.replace(/#.*?[\n\r\f$]+/g,'');
    return alipayRequest.csv2Array(strUTF);
})
.then((res)=>{
    console.log(res);
})
.catch((err)=>{
    console.log(err);
});
```

