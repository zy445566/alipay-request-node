# alipay-request
## alipay-api-sdk for <a href="https://doc.open.alipay.com/doc2/apiList?docType=4">alipay'doc(click here)</a>

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
//这个只能在发送请求之前写
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

