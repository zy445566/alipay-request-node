const request = require('request');
const fs = require("fs");
const path = require("path");
const crypto = require('crypto');
const adm_zip = require("adm-zip");
const iconv = require("iconv");
const csv = require("csv");
class AlipayRequest
{
    constructor()
    {
        this.init();
    }

    init()
    {
        this._gateWayUrl = '';
        this._rsaPrivateKey = '';
        this._alipayrsaPublicKey = '';
        this.initParam();
    }

    initParam()
    {
        this.param = {};
    }

    set gateWayUrl(gateWayUrl)
    {
        this._gateWayUrl = gateWayUrl;
    }

    get gateWayUrl()
    {
        return this._gateWayUrl;
    }

    set rsaPrivateKey(pemPath)
    {
        this._rsaPrivateKey = this.getPemStr(pemPath);
    }

    get rsaPrivateKey()
    {
        return this._rsaPrivateKey;
    }

    set alipayrsaPublicKey(pemPath)
    {
        this._alipayrsaPublicKey = this.getPemStr(pemPath);
    }

    get alipayrsaPublicKey()
    {
        return this._alipayrsaPublicKey;
    }

    setParam(name,value)
    {
        this.param[name] = value;
    }

    getParam()
    {
        return this.param;
    }

    paramSort()
    {
        let newParam = {};
        let keyList = [];
        for(let index in this.param)
        {
            keyList.push(index);
        }
        keyList = keyList.sort();
        for(let index in keyList)
        {
            newParam[keyList[index]] = this.param[keyList[index]];
        }
        this.param = newParam;
    }

    paramQuery()
    {
        let i = 0;
        let signBefore = '';
        if (this.param.hasOwnProperty('sign'))
        {
            delete this.param['sign'];
        }
        this.paramSort();
        for(let index in this.param)
        {
            if(i==0)
            {
                signBefore+=index+'='+this.param[index];
            } else {
                signBefore+='&'+index+'='+this.param[index];
            }
            i++;
        }
        return signBefore;
    }

    getSign()
    {
        let signBefore = this.paramQuery();
        if (!this.param.hasOwnProperty('sign_type'))
        {
            throw new Error('Param not has property:sign_type');
        }
        switch (this.param['sign_type'])
        {
            case 'RSA':
                var sign = crypto.createSign('RSA-SHA1');
                break;
            case 'RSA2':
                var sign = crypto.createSign('RSA-SHA256');
                break;
        }
        sign.update(signBefore);
        let res  = sign.sign(this._rsaPrivateKey,'base64');
        // console.log(signBefore);
        // console.log(res);
        return res;
    }
    
    
    getPemStr(pemPath)
    {
        let pemStr = fs.readFileSync(pemPath).toString();
        // pemStr = pemStr.replace(/--.*?-----/g, "");
        // pemStr = pemStr.replace(/\s/g, "");
        return pemStr;
    }

    getNowFormatDate(incrTime=0) {
        var date = new Date();
        date.setTime(date.getTime()+incrTime);
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var currentdate = date.getFullYear() + seperator1 + this.timeAddZero(month) + seperator1 + this.timeAddZero(strDate)
                + " " + this.timeAddZero(date.getHours()) + seperator2 + this.timeAddZero(date.getMinutes())
                + seperator2 + this.timeAddZero(date.getSeconds());
        return currentdate;
    }

    timeAddZero(sz)
    {
        if (sz >= 0 && sz <= 9) {
            sz = "0" + sz;
        }
        return sz;
    }

    getYmdFormatDate(incrTime=0) {
        var date = new Date();
        date.setTime(date.getTime()+incrTime);
        var seperator1 = "-";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var currentdate = date.getFullYear() + seperator1 + this.timeAddZero(month) + seperator1 + this.timeAddZero(strDate);
        return currentdate;
    }

    unZip(fileName,entryPath,index=-1,rename='')
    {
        var unzip = new adm_zip(fileName);
        var zipEntries = unzip.getEntries();
        return new Promise((resolve,reject)=>{
            if (index==-1)
            {
                unzip.extractAllTo(entryPath, true);
            } else {
                unzip.extractEntryTo(zipEntries[index].entryName, entryPath, /*maintainEntryPath*/true, /*overwrite*/true);
                if (rename==''){
                    resolve(true);
                } else {
                    fs.rename(path.join(entryPath,zipEntries[index].entryName),path.join(entryPath,rename),(err)=>{
                        if(err)reject(err);
                        resolve(true);
                    }); 
                }
            }
        });
        
    }

    downFile(fileUrl,saveName)
    {
        return new Promise((resolve,reject)=>{
            let ws = request
            .get(fileUrl)
            .on('error', function(err) {
                reject(err)
            })
            .pipe(fs.createWriteStream(saveName));
            ws.on('close', function() {
                resolve(true);
            })
        });
        
        
    }

    convertCode(strBuf,fromCode,toCode)
    {
        
        let iconvc = new iconv.Iconv(fromCode,toCode);
        let strUTFBuf = iconvc.convert(strBuf);
        return  strUTFBuf;
        
    }

    csv2Array(str)
    {
        return new Promise((resolve,reject)=>{
            csv.parse(str, function(err, data){
                if(err)reject(err);
                resolve(data);
            });
        }); 
    }

    getRes()
    {
        return new Promise((resolve,reject)=>{ 
            request.post({url:this._gateWayUrl, form: this.param}, function(err,response,body){
                if(err)reject(err);
                resolve({response:response,body:body});
            })
        });
    }
}

module.exports = AlipayRequest;
