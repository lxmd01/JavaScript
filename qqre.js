

/*ziye
本人github地址     https://github.com/ziye12/JavaScript 
转载请备注个名字，谢谢
11.25 增加 阅读时长上传，阅读金币，阅读随机金币
11.25 修复翻倍宝箱不同时领取的问题.增加阅读金币判定
11.25 修复阅读时长问题，阅读金币问题，请重新获取时长cookiek
11.26 随机金币只有一次，故去除，调整修复阅读金币问题，增加时长上传限制
11.26 增加领取周时长奖励
11.26 增加结束命令
11.27 调整通知为，成功开启宝箱再通知
11.28 修复错误
11.29 更新 支持action.默认每天21点到21点20通知
12.2 修复打卡问题
12.3 缩短运行时间，由于企鹅读书版本更新.请手动进去看一次书
12.3 调整推送时间为12点和24点左右

*/

const jsname='企鹅读书'
const $ = Env(jsname)

console.log(`============ 脚本执行-北京时间(UTC+8)：${new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleString()}  =============\n`)
const notify = $.isNode() ? require('./sendNotify') : '';
var tz='';
var kz='';
const logs = 0;   //0为关闭日志，1为开启
const notifyInterval=2
//0为关闭通知，1为所有通知，2为宝箱领取成功通知，3为宝箱每15次通知一次

const dd=1//单次任务延迟,默认1秒

const TIME=30//单次时长上传限制，默认5分钟

const maxtime=20//每日上传时长限制，默认12小时

const wktimess=1200//周奖励领取标准，默认1200分钟

const qqreadurlVal = "https://mqqapi.reader.qq.com/mqq/user/init";
let qqreadheaderVal, qqreadtimeurlVal, qqreadtimeheaderVal,cookiesArr = [];
let task = '', config, ssr2 = '', wktime;
let headers = [], timeurls = [], timeheaders = [];
  // catch value from Action Secret.
  if ($.isNode()) {
    

if (process.env.QQREAD_HEADER && process.env.QQREAD_HEADER.indexOf('#') > -1) {
  headers = process.env.QQREAD_HEADER.split('#');
 } else {
    headers = process.env.QQREAD_HEADER.split();
    };
  if (process.env.QQREAD_TIMEURL && process.env.QQREAD_TIMEURL.indexOf('\n') > -1) {
   timeurls = process.env.QQREAD_TIMEURL.split('\n');
  } else {
    timeurls = process.env.QQREAD_TIMEURL.split();
   };
  if (process.env.QQREAD_TIMEHEADER && process.env.QQREAD_TIMEHEADER.indexOf('#') > -1) {
   timeheaders = process.env.QQREAD_TIMEHEADER.split('#');
 } else {
   timeheaders = process.env.QQREAD_TIMEHEADER.split();
    };
}  
for (let index = 0; index < headers.length; index++) {
  const json_temp = {qqreadheaderVal:"", qqreadtimeurlVal:"", qqreadtimeheaderVal:""};
  json_temp.qqreadheaderVal = headers[index];
 json_temp.qqreadtimeurlVal = timeurls[index];
  json_temp.qqreadtimeheaderVal = timeheaders[index];
  cookiesArr.push(json_temp);
}

let num = 0;
all();

function all() {
 qqreadheaderVal = cookiesArr[num].qqreadheaderVal;
qqreadtimeurlVal = cookiesArr[num].qqreadtimeurlVal;
 qqreadtimeheaderVal = cookiesArr[num].qqreadtimeheaderVal;
$.num = num+ 1;
console.log(`-------------------------\n\n开始企鹅阅读第${$.num}个账号阅读`) 
   for (let i = 0; i < 5; i++) {
    (function (i) {
      setTimeout(
        function () {
          if (i == 0) {
            qqreadinfo(); // 用户名
	  //qqreadtask();
		  
         
          } else if (i == 1) 
		 qqreadtrack();
          // 任务列表
   
       
 
          } else if (i == 2 && task.data.treasureBox.doneFlag == 0)
            qqreadbox();
          // 宝箱
          else if (
            i == 3 &&
            task.data.treasureBox.videoDoneFlag == 0
          )
            qqreadbox2();
          // 宝箱翻倍
          else if (i == 4 && num< cookiesArr.length - 1) {
            showmsg();//通知
	   num += 1;
            all();
          } else if (i == 4 && num == cookiesArr.length - 1) {
            showmsg(); // 通知
	    console.log(`-------------------------\n\n企鹅阅读共完成${$.num}个账号阅读，阅读请求全部结束`)
        console.log(`============ 脚本执行完毕时间-北京时间(UTC+8)：${new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleString()}  =============\n`)  
            $.done();
          }
        },

        (i + 1) * dd * 1000
      );
    })(i);
  }
}







// 更新
function qqreadtrack() {
  return new Promise((resolve, reject) => {
    const toqqreadtrackurl = {
      url: "https://mqqapi.reader.qq.com/log/v4/mqq/track",

      headers: JSON.parse(qqreadtimeheaderVal),
	  body: qqreadheaderVal,      
      timeout: 60000,
    };
    $.post(toqqreadtrackurl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 更新: ${data}`);
      track = JSON.parse(data);
	 tz += `【数据更新】:更新${track.msg}\n`;
      resolve();
    });
  });
}




// 用户名
function qqreadinfo() {
  return new Promise((resolve, reject) => {
    const toqqreadinfourl = {
      url: "https://mqqapi.reader.qq.com/mqq/user/init",

      headers: JSON.parse(qqreadtimeheaderVal),

      timeout: 60000,
    };
    $.get(toqqreadinfourl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 用户名: ${data}`);
      info = JSON.parse(data);
      kz += `\n========== 【${info.data.user.nickName}】 ==========\n`;
      tz += `\n========== 【${info.data.user.nickName}】 ==========\n`;

      resolve();
    });
  });
}




// 宝箱奖励
function qqreadbox() {
  return new Promise((resolve, reject) => {
    const toqqreadboxurl = {
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/treasure_box",
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreadboxurl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 宝箱奖励: ${data}`);
      box = JSON.parse(data);
      if (box.data.count >= 0) {
        tz += `【宝箱奖励${box.data.count}】:获得${box.data.amount}金币\n`;
      }

      resolve();
    });
  });
}

// 宝箱奖励翻倍
function qqreadbox2() {
  return new Promise((resolve, reject) => {
    const toqqreadbox2url = {
      url:
        "https://mqqapi.reader.qq.com/mqq/red_packet/user/treasure_box_video",

      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreadbox2url, (error, response, data) => {
      if (logs) $.log(`${jsname}, 宝箱奖励翻倍: ${data}`);
      box2 = JSON.parse(data);
      if (box2.code == 0) {
        tz += `【宝箱翻倍】:获得${box2.data.amount}金币\n`;
      }

      resolve();
    });
  });
}






function showmsg() {	
console.log(tz)
let d = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
let gold=Number(task.data.user.amount)
if (notifyInterval==1&&gold >= 50000 && d.getHours()>=9 && d.getHours()<=20&&task.data.treasureBox.doneFlag==0){
	notify.sendNotify(jsname,tz,'');//显示所有通知
	console.log('显示所有通知')
}
else if (notifyInterval==2&&gold >= 100000&&d.getHours()>=9&&d.getHours()<=20&&task.data.treasureBox.doneFlag==15){
	notify.sendNotify(jsname,kz,'')//宝箱每15次通知一次
	console.log('宝箱每15次通知一次')
}
//else if (notifyInterval==3&&gold >= 50000&&d.getHours()>=9&&d.getHours()<=20&&task.data.treasureBox.doneFlag==0&&task.data.treasureBox.count==0||task.data.treasureBox.count==15||task.data.treasureBox.count==30||task.data.treasureBox.count==45||task.data.treasureBox.count==60){

	//notify.sendNotify(jsname,tz,'');//宝箱每15次通知一次
	//console.log('宝箱每15次通知一次')
//}
else if (d.getHours()==19&&d.getMinutes()>=45&&d.getMinutes()<=55){
	notify.sendNotify(jsname,kz,'')//每天19点45分通知一次	
	
}
kz=''	
tz=''
}

    



// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
