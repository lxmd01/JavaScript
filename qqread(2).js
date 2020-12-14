

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
   for (let i = 0; i < 15; i++) {
    (function (i) {
      setTimeout(
        function () {
          if (i == 0) {
            qqreadinfo(); // 用户名
            qqreadwktime(); // 周时长查询
            qqreadconfig(); // 时长查询
          } else if (i == 1) qqreadtask();
		  else if (
            i == 2) qqreadtrack();
          // 任务列表
          else if (
            i == 3 &&
            config.data &&
            config.data.pageParams.todayReadSeconds / 3600 <= maxtime
          )
            qqreadtime();
          // 上传时长
          else if (i == 4 && task.data && task.data.taskList[1].doneFlag == 0)
            qqreadssr1();
          // 阅读金币1
          else if (i == 5 && task.data && task.data.taskList[2].doneFlag == 0) {
            qqreadsign(); // 金币签到
            qqreadtake(); // 阅豆签到
          } else if (i == 6 && task.data && task.data.treasureBox.doneFlag == 0)
            qqreadbox();
          // 宝箱
          else if (i == 7 && task.data && task.data.taskList[0].doneFlag == 0)
            qqreaddayread();
          // 阅读任务
          else if (i == 8 && task.data && task.data.taskList[1].doneFlag == 0)
            qqreadssr2();
          // 阅读金币2
          else if (i == 9) qqreadpick();
          // 领周时长奖励
          else if (i == 10 && task.data && task.data.taskList[3].doneFlag == 0)
            qqreadvideo();
          // 视频任务
          else if (i == 11 && task.data && task.data.taskList[2].doneFlag == 0)
            qqreadsign2();
          // 签到翻倍
          else if (
            i == 12 &&
            task.data &&
            task.data.treasureBox.videoDoneFlag == 0
          )
            qqreadbox2();
          // 宝箱翻倍
          else if (i == 13 && task.data && task.data.taskList[1].doneFlag == 0)
            qqreadssr3();
          // 阅读金币3
          else if (i == 14 && num< cookiesArr.length - 1) {
            showmsg();//通知
	   num += 1;
            all();
          } else if (i == 14 && num == cookiesArr.length - 1) {
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




// 任务列表
function qqreadtask() {
  return new Promise((resolve, reject) => {
    const toqqreadtaskurl = {
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/page?fromGuid=",
      headers: JSON.parse(qqreadtimeheaderVal),

      timeout: 60000,
    };
    $.get(toqqreadtaskurl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 任务列表: ${data}`);
      task = JSON.parse(data);
      kz +=
        `【现金余额】:${(task.data.user.amount / 10000).toFixed(2)}元\n` +
        `【已开宝箱】:${task.data.treasureBox.count}个\n`;

      tz +=
        `【现金余额】:${(task.data.user.amount / 10000).toFixed(2)}元\n` +
        `【第${task.data.invite.issue}期】:时间${task.data.invite.dayRange}\n` +
        ` 已邀请${task.data.invite.inviteCount}人，再邀请${task.data.invite.nextInviteConfig.count}人获得${task.data.invite.nextInviteConfig.amount}金币\n` +
        `【${task.data.taskList[0].title}】:${task.data.taskList[0].amount}金币,${task.data.taskList[0].actionText}\n` +
        `【${task.data.taskList[1].title}】:${task.data.taskList[1].amount}金币,${task.data.taskList[1].actionText}\n` +
        `【${task.data.taskList[2].title}】:${task.data.taskList[2].amount}金币,${task.data.taskList[2].actionText}\n` +
        `【${task.data.taskList[3].title}】:${task.data.taskList[3].amount}金币,${task.data.taskList[3].actionText}\n` +
        `【宝箱任务${task.data.treasureBox.count + 1}】:${
          task.data.treasureBox.tipText
        }\n` +
        `【${task.data.fans.title}】:${task.data.fans.fansCount}个好友,${task.data.fans.todayAmount}金币\n`;

      resolve();
    });
  });
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

// 阅豆签到
function qqreadtake() {
  return new Promise((resolve, reject) => {
    const toqqreadtakeurl = {
      url: "https://mqqapi.reader.qq.com/mqq/sign_in/user",
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.post(toqqreadtakeurl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 阅豆签到: ${data}`);
      take = JSON.parse(data);

      if (take.data.takeTicket > 0) {
        tz += `【阅豆签到】:获得${take.data.takeTicket}豆\n`;
      }

      resolve();
    });
  });
}

// 阅读时长任务
function qqreadconfig() {
  return new Promise((resolve, reject) => {
    const toqqreadconfigurl = {
      url:
        "https://mqqapi.reader.qq.com/mqq/page/config?router=%2Fpages%2Fbook-read%2Findex&options=",
      headers: JSON.parse(qqreadtimeheaderVal),
    };
    $.get(toqqreadconfigurl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 阅读时长查询: ${data}`);
      config = JSON.parse(data);
      if (config.code == 0)
        tz += `【时长查询】:今日阅读${(
          config.data.pageParams.todayReadSeconds / 60
        ).toFixed(0)}分钟\n`;

      resolve();
    });
  });
}

// 阅读时长
function qqreadtime() {
  return new Promise((resolve, reject) => {
    const toqqreadtimeurl = {
      url: qqreadtimeurlVal.replace(/readTime=/g, `readTime=${TIME}`),
      headers: JSON.parse(qqreadtimeheaderVal),
    };
    $.get(toqqreadtimeurl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 阅读时长: ${data}`);
      time = JSON.parse(data);
      if (time.code == 0) tz += `【阅读时长】:上传${TIME / 6}分钟\n`;

      resolve();
    });
  });
}

// 阅读金币1
function qqreadssr1() {
  return new Promise((resolve, reject) => {
    const toqqreadssr1url = {
      url: `https://mqqapi.reader.qq.com/mqq/red_packet/user/read_time?seconds=30`,
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    if (config.data && config.data.pageParams.todayReadSeconds / 60 >= 1) {
      $.get(toqqreadssr1url, (error, response, data) => {
        if (logs) $.log(`${jsname}, 金币奖励1: ${data}`);
        ssr1 = JSON.parse(data);
        if (ssr1.data.amount > 0)
          tz += `【阅读金币1】获得${ssr1.data.amount}金币\n`;

        resolve();
      });
    }
  });
}

// 阅读金币2
function qqreadssr2() {
  return new Promise((resolve, reject) => {
    const toqqreadssr2url = {
      url: `https://mqqapi.reader.qq.com/mqq/red_packet/user/read_time?seconds=300`,
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    if (config.data && config.data.pageParams.todayReadSeconds / 60 >= 5) {
      $.get(toqqreadssr2url, (error, response, data) => {
        if (logs) $.log(`${jsname}, 金币奖励2: ${data}`);
        ssr2 = JSON.parse(data);
        if (ssr2.data.amount > 0)
          tz += `【阅读金币2】获得${ssr2.data.amount}金币\n`;

        resolve();
      });
    }
  });
}

// 阅读金币3
function qqreadssr3() {
  return new Promise((resolve, reject) => {
    const toqqreadssr3url = {
      url: `https://mqqapi.reader.qq.com/mqq/red_packet/user/read_time?seconds=1800`,
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    if (config.data && config.data.pageParams.todayReadSeconds / 60 >= 30) {
      $.get(toqqreadssr3url, (error, response, data) => {
        if (logs) $.log(`${jsname}, 金币奖励3: ${data}`);
        ssr3 = JSON.parse(data);
        if (ssr3.data.amount > 0)
          tz += `【阅读金币3】获得${ssr3.data.amount}金币\n`;

        resolve();
      });
    }
  });
}

// 金币签到
function qqreadsign() {
  return new Promise((resolve, reject) => {
    const toqqreadsignurl = {
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/clock_in/page",
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreadsignurl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 金币签到: ${data}`);
      sign = JSON.parse(data);
      if (sign.data.videoDoneFlag) {
        tz += `【金币签到】:获得${sign.data.todayAmount}金币\n`;
      }
      resolve();
    });
  });
}

// 金币签到翻倍
function qqreadsign2() {
  return new Promise((resolve, reject) => {
    const toqqreadsign2url = {
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/clock_in_video",

      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreadsign2url, (error, response, data) => {
      if (logs) $.log(`${jsname}, 金币签到翻倍: ${data}`);
      sign2 = JSON.parse(data);
      if (sign2.code == 0) {
        tz += `【签到翻倍】:获得${sign2.data.amount}金币\n`;
      }

      resolve();
    });
  });
}

// 每日阅读
function qqreaddayread() {
  return new Promise((resolve, reject) => {
    const toqqreaddayreadurl = {
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/read_book",

      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreaddayreadurl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 每日阅读: ${data}`);
      dayread = JSON.parse(data);
      if (dayread.code == 0) {
        tz += `【每日阅读】:获得${dayread.data.amount}金币\n`;
      }

      resolve();
    });
  });
}

// 视频奖励
function qqreadvideo() {
  return new Promise((resolve, reject) => {
    const toqqreadvideourl = {
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/watch_video",
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreadvideourl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 视频奖励: ${data}`);
      video = JSON.parse(data);
      if (video.code == 0) {
        tz += `【视频奖励】:获得${video.data.amount}金币\n`;
      }

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

// 本周阅读时长
function qqreadwktime() {
  return new Promise((resolve, reject) => {
    const toqqreadwktimeurl = {
      url: `https://mqqapi.reader.qq.com/mqq/v1/bookShelfInit`,
      headers: JSON.parse(qqreadtimeheaderVal),
    };
    $.get(toqqreadwktimeurl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 阅读时长: ${data}`);
      wktime = JSON.parse(data);
      if (wktime.code == 0)
        tz += `【本周阅读时长】:${wktime.data.readTime}分钟\n`;

      resolve();
    });
  });
}

// 本周阅读时长奖励任务
function qqreadpick() {
  return new Promise((resolve, reject) => {
    const toqqreadpickurl = {
      url: `https://mqqapi.reader.qq.com/mqq/pickPackageInit`,
      headers: JSON.parse(qqreadtimeheaderVal),
    };
    if (wktime.data.readTime >= wktimess && wktime.data.readTime <= 1250) {
      $.get(toqqreadpickurl, (error, response, data) => {
        if (logs) $.log(`${jsname},周阅读时长奖励任务: ${data}`);
        pick = JSON.parse(data);
        if (pick.data[7].isPick == true) tz += "【周时长奖励】:已全部领取\n";

        for (let i = 0; i < pick.data.length; i++) {
          setTimeout(() => {
            const pickid = pick.data[i].readTime;
            const Packageid = [
              "10",
              "10",
              "20",
              "30",
              "50",
              "80",
              "100",
              "120",
            ];
            const toqqreadPackageurl = {
              url: `https://mqqapi.reader.qq.com/mqq/pickPackage?readTime=${pickid}`,
              headers: JSON.parse(qqreadtimeheaderVal),
              timeout: 60000,
            };
            $.get(toqqreadPackageurl, (error, response, data) => {
              if (logs) $.log(`${jsname}, 领周阅读时长: ${data}`);
              Package = JSON.parse(data);
              if (Package.code == 0)
                tz += `【周时长奖励${i + 1}】:领取${Packageid[i]}阅豆\n`;
            });
          }, i * 100);
        }
      });
      resolve();
    }
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
