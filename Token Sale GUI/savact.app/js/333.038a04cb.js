"use strict";(globalThis["webpackChunksavactapp"]=globalThis["webpackChunksavactapp"]||[]).push([[333],{40605:(e,t,a)=>{a.r(t),a.d(t,{default:()=>Pe});var i=a(59835),l=a(86970);const n=e=>((0,i.dD)("data-v-a762339a"),e=e(),(0,i.Cn)(),e),o={class:"row justify-between items-center"},s={key:0},r={key:0},c={class:"row q-mt-md"},u={class:"q-pr-sm col-auto f-td-width"},d={class:"row q-mt-sm"},v={class:"q-pr-sm col-auto f-td-width"},m={class:"row q-mt-md justify-left"},g=n((()=>(0,i._)("div",{class:"f-td-width"},"Chain:",-1))),p={class:"col-grow"},f={class:"row q-mt-sm"},y={key:0,class:"f-td-width"},w={class:"text-bold"},b={key:0},h={key:0},k={class:"text-italic"},x={key:0,class:"row"},_={key:0,class:"f-td-width"},S={key:0,class:"row q-mt-sm"},T={class:"f-td-width"},z={key:1,class:"row q-mt-sm"},C=n((()=>(0,i._)("div",{class:"q-pr-sm col-auto f-td-width"},"Memo:",-1))),q={key:2,class:"row q-mt-sm"},U={class:"q-pr-sm col-auto f-td-width"},P={class:"col-grow",visible:!0},j={class:"no-wrap"},I={class:"row"},V={class:"full-width"},D={class:"row justify-between q-col-gutter-sm items-center"},F={key:0,class:"q-mt-md"},N={class:"text-bold"},W={key:1,class:"q-mt-md"},A={key:0},O={class:"text-no-wrap"},Z={key:0},$=n((()=>(0,i._)("span",null,":  ",-1))),M={key:1},R={key:2,class:"column"},H={key:3,class:"column"};function B(e,t,a,n,B,Q){const K=(0,i.up)("q-tooltip"),E=(0,i.up)("q-chip"),G=(0,i.up)("q-scroll-area"),J=(0,i.up)("remaining-time"),L=(0,i.up)("q-spinner-gears"),X=(0,i.up)("q-inner-loading"),Y=(0,i.up)("q-card-section"),ee=(0,i.up)("q-card"),te=(0,i.up)("q-btn"),ae=(0,i.up)("date-time-input"),ie=(0,i.up)("key-or-name-input"),le=(0,i.up)("manual-signer"),ne=(0,i.up)("transfer-data-view"),oe=(0,i.up)("q-page");return(0,i.wg)(),(0,i.j4)(oe,{class:"column q-px-md q-pt-sm",style:{height:"100%"}},{default:(0,i.w5)((()=>[(0,i.Wm)(ee,{class:"card"},{default:(0,i.w5)((()=>[(0,i.Wm)(Y,null,{default:(0,i.w5)((()=>{var a,n,D,F,N;return[(0,i._)("div",o,[e.statusText?((0,i.wg)(),(0,i.j4)(E,{key:0,"text-color":"black",size:"md",color:e.statusColor,icon:0==e.type?"shopping_cart":"poll",clickable:!!e.vote,onClick:e.typeClick},{default:(0,i.w5)((()=>[(0,i.Uk)((0,l.zw)(0==e.type?"Payment":"Vote")+" ",1),0!=e.type?((0,i.wg)(),(0,i.j4)(K,{key:0},{default:(0,i.w5)((()=>[(0,i.Uk)((0,l.zw)(e.t("showVote")),1)])),_:1})):(0,i.kq)("",!0)])),_:1},8,["color","icon","clickable","onClick"])):((0,i.wg)(),(0,i.j4)(E,{key:1,"text-color":"black",size:"md",color:"white"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,l.zw)("Unkown"))])),_:1})),(0,i.Wm)(E,{class:"bg-grey q-pa-sm"},{default:(0,i.w5)((()=>[e.statusText?((0,i.wg)(),(0,i.iD)("span",s,(0,l.zw)(e.statusText)+" - ",1)):(0,i.kq)("",!0),(0,i.Uk)(" Id: "+(0,l.zw)(e.id)+" ",1),(0,i.Wm)(K,null,{default:(0,i.w5)((()=>{var t;return[(0,i.Uk)((0,l.zw)(e.t("localStorageDetails"))+": "+(0,l.zw)(e.t("usedNrIs"))+" "+(0,l.zw)(e.localNr)+" ",1),e.localReg?((0,i.wg)(),(0,i.iD)("span",r,(0,l.zw)(e.t("andFoundDateIs"))+" "+(0,l.zw)(null===(t=e.localReg)||void 0===t?void 0:t.toString()),1)):(0,i.kq)("",!0)]})),_:1})])),_:1})]),(0,i._)("div",c,[(0,i._)("div",u,(0,l.zw)(e.t("recipient"))+":",1),(0,i.Wm)(G,{class:"col-grow text-bold",visible:!0,style:{height:"35px"}},{default:(0,i.w5)((()=>[(0,i.Uk)((0,l.zw)(e.to),1)])),_:1})]),(0,i._)("div",d,[(0,i._)("div",v,(0,l.zw)(e.t("sender"))+":",1),(0,i.Wm)(G,{class:"col-grow text-bold",visible:!0,style:{height:"35px"}},{default:(0,i.w5)((()=>[(0,i.Uk)((0,l.zw)(e.from),1)])),_:1})]),(0,i._)("div",null,[(0,i._)("div",m,[g,(0,i._)("div",p,[(0,i._)("div",null,(0,l.zw)(null===(a=e.chainParams)||void 0===a?void 0:a.name),1),(0,i.Wm)(G,{class:"full-width",visible:!0,style:{height:"35px"}},{default:(0,i.w5)((()=>{var t;return[(0,i.Uk)((0,l.zw)(null===(t=e.chainParams)||void 0===t?void 0:t.chainId),1)]})),_:1})])])]),(0,i._)("div",null,[(0,i._)("div",f,[e.fund.length>0?((0,i.wg)(),(0,i.iD)("div",y,(0,l.zw)(e.t("amount"))+":",1)):(0,i.kq)("",!0),(0,i._)("div",null,[(0,i._)("span",w,(0,l.zw)(e.orifund),1),(0,i.Uk)(),e.fund!=e.orifund?((0,i.wg)(),(0,i.iD)("span",b,[(0,i.Uk)("("+(0,l.zw)(e.fund),1),e.ramBy==(null===(n=e.chainParams)||void 0===n?void 0:n.savpayContract)?((0,i.wg)(),(0,i.iD)("span",h," + RAM")):(0,i.kq)("",!0),(0,i.Uk)(")")])):(0,i.kq)("",!0),(0,i.Uk)(),(0,i._)("span",k,(0,l.zw)(e.contract),1)])]),e.ramBy!=(null===(D=e.chainParams)||void 0===D?void 0:D.savpayContract)?((0,i.wg)(),(0,i.iD)("div",x,[e.ramBy.length>0?((0,i.wg)(),(0,i.iD)("div",_,"Ram by:")):(0,i.kq)("",!0),(0,i._)("div",null,(0,l.zw)(e.ramBy),1)])):(0,i.kq)("",!0)]),e.time>1?((0,i.wg)(),(0,i.iD)("div",S,[(0,i._)("div",T,(0,l.zw)(e.vote?e.t("voteTime"):e.t("timelimit"))+":",1),(0,i._)("div",null,[(0,i._)("div",null,(0,l.zw)(null===(F=e.timeDate)||void 0===F?void 0:F.toString()),1),e.removed?(0,i.kq)("",!0):((0,i.wg)(),(0,i.j4)(J,{key:0,modelValue:e.timeDate,onTimeover:t[0]||(t[0]=t=>e.update())},null,8,["modelValue"]))])])):(0,i.kq)("",!0),e.memo.length>0?((0,i.wg)(),(0,i.iD)("div",z,[C,(0,i.Wm)(G,{class:"col-grow",visible:!0,style:{height:"35px"}},{default:(0,i.w5)((()=>[(0,i.Uk)((0,l.zw)(e.memo),1)])),_:1})])):(0,i.kq)("",!0),e.vote?((0,i.wg)(),(0,i.iD)("div",q,[(0,i._)("div",U,(0,l.zw)(e.t("vote"))+":",1),(0,i._)("div",P,[(0,i._)("div",j,[(0,i.Uk)((0,l.zw)(e.t("selection"))+" ",1),(0,i._)("span",{style:(0,l.j5)(`color: ${e.VoteColor[e.vote.choice.selected]}`)},(0,l.zw)(e.vote.choice.selected+1),5),(0,i.Uk)(" "+(0,l.zw)(e.t("of"))+" "+(0,l.zw)(e.vote.total)+" [ Id "+(0,l.zw)(e.vote.id)+" "+(0,l.zw)(void 0===e.vote.index?"":" / Public "+e.vote.index)+" ] ",1)]),(0,i._)("div",I,[e.vote.choice.msg.length>0?((0,i.wg)(),(0,i.j4)(G,{key:0,class:"col-grow text-italic",visible:!0,style:{height:"35px"}},{default:(0,i.w5)((()=>[(0,i.Uk)('"'+(0,l.zw)(e.vote.choice.msg)+'"',1)])),_:1})):(0,i.kq)("",!0)]),(0,i._)("div",null,[(0,i._)("div",V,(0,l.zw)(e.t("voteEndTime"))+":",1),(0,i._)("div",null,(0,l.zw)(null===(N=e.voteEnd)||void 0===N?void 0:N.toString()),1),(0,i.Wm)(J,{modelValue:e.voteEnd},null,8,["modelValue"])])])])):(0,i.kq)("",!0),(0,i.Wm)(X,{showing:e.loading},{default:(0,i.w5)((()=>[(0,i.Wm)(L,{size:"50px",color:"primary"})])),_:1},8,["showing"])]})),_:1})])),_:1}),!e.removed&&e.statusText?((0,i.wg)(),(0,i.j4)(ee,{key:0,class:"q-my-sm card"},{default:(0,i.w5)((()=>[(0,i.Wm)(Y,null,{default:(0,i.w5)((()=>[(0,i._)("div",D,[(0,i._)("div",null,[(0,i.Wm)(te,{disable:"Active"!=e.statusText,icon:"task_alt",label:e.t("finalize"),class:"finalize-btn",onClick:t[1]||(t[1]=t=>e.tab="finalize"),color:"finalize"==e.tab?"blue":"","text-color":e.textColorStyle},null,8,["disable","label","color","text-color"])]),(0,i._)("div",null,[(0,i.Wm)(te,{disable:"Active"!=e.statusText,icon:"whatshot",label:e.t("burn"),class:"inval-btn",onClick:t[2]||(t[2]=t=>e.tab="burn"),color:"burn"==e.tab?"red":"","text-color":e.textColorStyle},null,8,["disable","label","color","text-color"])]),(0,i._)("div",null,[(0,i.Wm)(te,{disable:"Rejected"==e.statusText,icon:"reply_all",label:e.t("reject"),class:"reject-btn",onClick:t[3]||(t[3]=t=>e.tab="reject"),color:"reject"==e.tab?"orange":"","text-color":e.textColorStyle},null,8,["disable","label","color","text-color"])]),(0,i._)("div",null,[(0,i.Wm)(te,{disable:"Active"!=e.statusText,icon:"more_time",label:e.t("extend"),class:"extend-btn",onClick:t[4]||(t[4]=t=>e.tab="extend"),color:"extend"==e.tab?"green":"","text-color":e.textColorStyle},null,8,["disable","label","color","text-color"])]),(0,i._)("div",null,[(0,i.Wm)(te,{disable:"Active"==e.statusText,icon:"download",label:e.t("payoff"),class:"payoff-btn",onClick:t[5]||(t[5]=t=>{e.tab="payoff",e.payoffRecipient=e.getPayOffRecipientName}),color:"payoff"==e.tab?"grey":"","text-color":e.textColorStyle},null,8,["disable","label","color","text-color"])]),(0,i._)("div",null,[(0,i.Wm)(te,{icon:"find_replace",class:"q-mx-sm",loading:e.loading,outline:"",onClick:t[6]||(t[6]=t=>e.update()),disable:e.loading,round:""},{default:(0,i.w5)((()=>[(0,i.Wm)(K,null,{default:(0,i.w5)((()=>[(0,i.Uk)((0,l.zw)(e.t("update")),1)])),_:1})])),_:1},8,["loading","disable"])])]),e.infoActionText?((0,i.wg)(),(0,i.iD)("div",F,[(0,i._)("span",N,(0,l.zw)(e.t("description"))+": ",1),(0,i._)("span",null,(0,l.zw)(e.infoActionText),1)])):(0,i.kq)("",!0)])),_:1})])),_:1})):((0,i.wg)(),(0,i.iD)("div",W,(0,l.zw)(e.t("altertTrx")),1)),""!=e.tab?((0,i.wg)(),(0,i.j4)(ee,{key:2,class:"card"},{default:(0,i.w5)((()=>[(0,i.Wm)(Y,null,{default:(0,i.w5)((()=>{var a,n;return["extend"==e.tab?((0,i.wg)(),(0,i.iD)("div",A,[(0,i._)("div",null,[(0,i._)("span",O,(0,l.zw)(e.t("timelimit")),1),void 0!==e.extendTime?((0,i.wg)(),(0,i.iD)("span",Z,[$,(0,i.Wm)(J,{modelValue:e.extendTime,"onUpdate:modelValue":t[7]||(t[7]=t=>e.extendTime=t),timeOverMsg:e.t("timeIsOver")},null,8,["modelValue","timeOverMsg"])])):(0,i.kq)("",!0)]),(0,i.Wm)(ae,{class:"q-mb-sm",modelValue:e.extendTime,"onUpdate:modelValue":t[8]||(t[8]=t=>e.extendTime=t)},null,8,["modelValue"])])):"payoff"==e.tab?((0,i.wg)(),(0,i.iD)("div",M,[(0,i.Wm)(ie,{disable:e.getPayOffRecipientName.length>0,onlyName:"",modelValue:e.payoffRecipient,"onUpdate:modelValue":t[9]||(t[9]=t=>e.payoffRecipient=t),outlined:"",label:e.t("payoffAccount"),walletOption:"",class:"q-mb-md",connect:e.connect},null,8,["disable","modelValue","label","connect"])])):(0,i.kq)("",!0),("finalize"==e.tab||"burn"==e.tab)&&!e.fromIsName||("reject"==e.tab||"extend"==e.tab)&&!e.toIsName||"payoff"==e.tab&&0==e.getPayOffRecipientName.length?((0,i.wg)(),(0,i.iD)("div",R,[(0,i.Wm)(le,{massage:e.messageToSign,onSignature:t[10]||(t[10]=t=>e.signedMessage=t),onSigtime:t[11]||(t[11]=t=>e.lastSigTime=Math.round(t/1e3)),onSignclick:e.signClick},null,8,["massage","onSignclick"]),(null===(a=e.chainParams)||void 0===a?void 0:a.savpayContract)&&e.signedMessage?((0,i.wg)(),(0,i.j4)(ne,{key:0,quantity:e.exchangeQuantityView,tokenContract:null===(n=e.chainParams.systemToken)||void 0===n?void 0:n.contract,recipient:e.chainParams.savpayContract,memo:e.memoMsg,memoActive:""},null,8,["quantity","tokenContract","recipient","memo"])):(0,i.kq)("",!0),(0,i.Wm)(te,{disable:"string"!=typeof e.signedMessage||0==e.signedMessage.length,class:"q-mt-sm",label:"Send","icon-right":"send",onClick:e.send,color:e.tabColor},null,8,["disable","onClick","color"])])):((0,i.wg)(),(0,i.iD)("div",H,[(0,i.Wm)(te,{label:e.t("send"),"icon-right":"send",onClick:e.send,color:e.tabColor},null,8,["label","onClick","color"])]))]})),_:1})])),_:1})):(0,i.kq)("",!0)])),_:1})}var Q=a(65211),K=a(53103),E=a(6827),G=a(19302),J=a(5980),L=a(94345),X=a(7580),Y=a(10818),ee=a(62659),te=a(60499),ae=a(27712),ie=a(28339),le=a(73398),ne=a(46033),oe=a(22759),se=a(14889),re=a(14028),ce=a(3390),ue=a(33008),de=a(72354),ve=a(47983),me=a(86350),ge=a(17779),pe=function(e,t,a,i){function l(e){return e instanceof a?e:new a((function(t){t(e)}))}return new(a||(a=Promise))((function(a,n){function o(e){try{r(i.next(e))}catch(t){n(t)}}function s(e){try{r(i["throw"](e))}catch(t){n(t)}}function r(e){e.done?a(e.value):l(e.value).then(o,s)}r((i=i.apply(e,t||[])).next())}))};const fe=(0,i.aZ)({name:"page-trx-action",components:{ManualSigner:le["default"],DateTimeInput:ne["default"],RemainingTime:oe["default"],KeyOrNameInput:se["default"],TransferDataView:re["default"]},setup(){var e,t;const a=(0,G.Z)(),l=(0,ee.r)(),n=(0,ie.yj)(),o=(0,ie.tv)(),s=(0,ae.QT)({useScope:"global"}).t.bind(this),r=(0,te.iH)(""),c=(0,te.iH)(0),u=(0,i.Fl)((()=>{if(!ye.value)return"";const e=(0,X.base58Time)(we.value),t=(0,X.base58Time)(h);switch(r.value){case"finalize":return`FIN@${g}#${t}=${e}~${ye.value}`;case"burn":return`INV@${g}#${t}=${e}~${ye.value}`;case"reject":return`REJ@${g}#${t}=${e}~${ye.value}`;case"extend":if(!c.value||c.value<Date.now()/1e3)return"";const a=(0,X.base58Time)(c.value);return`EXT@${g}#${t}!${a}=${e}~${ye.value}`;case"payoff":return"string"==typeof fe.value||(0,L.isNameValid)(fe.value)?`OFF@${g}#${t}=${e}~${ye.value}+${fe.value}`:"";default:return""}})),d=(0,ce.b)(),v=n.query;ge.log("Transaction query",v);let m=v.user;m&&m.length>13&&(m=K.PublicKey.fromString(m).toString());let g=v.to?v.to:m,p=v.from?v.from:m;const f=p==m,y=g==m,w=(0,J.GetConnectByChainId)(v.chain,l.allConnects);w||(E.Z.create({type:"negative",message:s("noChainDefined"),position:"top"}),o.replace({name:"404"}));const b=(0,i.Fl)((()=>null===w||void 0===w?void 0:w.chainParams)),h=Number(v.id);let k=(0,te.iH)();g==m?k.value=null===(e=l.user[m])||void 0===e?void 0:e.inHistory.find((e=>{var t,a;return e.id==h&&(e.chain==(null===(t=b.value)||void 0===t?void 0:t.chainId)||e.chain==(null===(a=b.value)||void 0===a?void 0:a.shortName))})):p==m&&(k.value=null===(t=l.user[m])||void 0===t?void 0:t.outHistory.find((e=>{var t,a;return e.id==h&&e.recipient==g&&(e.chain==(null===(t=b.value)||void 0===t?void 0:t.chainId)||e.chain==(null===(a=b.value)||void 0===a?void 0:a.shortName))})));const x=(0,te.iH)(!1),_=(0,i.Fl)((()=>k.value?k.value.fund:"")),S=(0,i.Fl)((()=>k.value?k.value.orifund:"")),T=(0,i.Fl)((()=>k.value?k.value.contract:"")),z=(0,i.Fl)((()=>k.value?(0,me.StringToUtf8String)(k.value.memo):"")),C=(0,i.Fl)((()=>k.value?k.value.vote:"")),q=(0,i.Fl)((()=>C.value?new Date(1e3*C.value.end):void 0)),U=(0,i.Fl)((()=>k.value?k.value.ramBy:"")),P=(0,i.Fl)((()=>k.value?k.value.time:-2)),j=(0,i.Fl)((()=>P.value?new Date(1e3*P.value):void 0)),I=(0,i.Fl)((()=>k.value?k.value.type:-1)),V=(0,i.Fl)((()=>!!k.value&&k.value.removed)),D=(0,i.Fl)((()=>k.value&&k.value.nr?String(k.value.nr):"")),F=(0,i.Fl)((()=>k.value&&k.value.firstReg?new Date(k.value.firstReg):void 0));let N,W;if((0,L.isNameValid)(p))N=(0,X.nameToFromHex)(p);else if(Q.b.isValidPublic(p)){const e=K.PublicKey.fromString(p);N=(0,X.hexWithTypeOfPubKey)(e),p=e.toString()}else E.Z.create({type:"negative",message:p.length<13?s("invalidAcc"):s("invalidPub"),position:"top"}),o.replace({name:"404"});if((0,L.isNameValid)(g))W=g;else if(Q.b.isValidPublic(g)){const e=K.PublicKey.fromString(g);W=(0,X.splitPubKeyToScopeAndTableVec)(e),g=e.toString()}else E.Z.create({type:"negative",message:g.length<13?s("invalidAcc"):s("invalidPub"),position:"top"}),o.replace({name:"404"});function A(){return pe(this,void 0,void 0,(function*(){r.value="";try{ge.log("current connect",w),x.value=!0;const e=Date.now(),t="string"==typeof W?me.SavActPayTableType.pay2name:me.SavActPayTableType.pay2key,a={code:null===w||void 0===w?void 0:w.chainParams.savpayContract,table:t==me.SavActPayTableType.pay2name?"pay2name":"pay2key",scope:"string"==typeof W?W:String(W.scope),lower_bound:String(h),upper_bound:String(h),json:!1},i=yield null===w||void 0===w?void 0:w.get_table_rows(a),n=()=>{if(!b.value)return ge.log("Undefined chain parameters"),!1;if("rows"in i){if(i.rows.length>0){if("string"!=typeof i.rows[0]&&i.rows[0].length>0)return E.Z.create({type:"negative",message:s("entrynotexist"),caption:s("isdatacorrect"),position:"top"}),!1;const a=(0,me.rawSavActPaymentToObject)(i.rows[0],t);if(void 0===a||void 0!==a.to&&"string"!==typeof W&&W.tableVec!=a.to)return E.Z.create({type:"negative",message:s("entrynotexist"),caption:s("isdatacorrect"),position:"top"}),!1;if(N!=a.from)return E.Z.create({type:"negative",message:s("wrongsender"),position:"top"}),!1;const n=a.fund.symbol;if(void 0==n)return E.Z.create({type:"negative",message:s("errReadSymbol"),position:"top"}),!1;if(!m){const t={sender:p,recipient:g,id:Number(a.id),fund:(0,L.AssetToString)(a.fund),orifund:(0,L.AssetToString)({amount:a.orisent,symbol:n}),memo:a.memo,ramBy:a.ramBy,type:a.type,time:a.time,contract:a.contract,lastUpdate:e,removed:!1,chain:b.value.shortName?b.value.shortName:b.value.chainId};k.value=t}if(m==g){const t={sender:p,recipient:m,id:Number(a.id),fund:(0,L.AssetToString)(a.fund),orifund:(0,L.AssetToString)({amount:a.orisent,symbol:n}),memo:a.memo,ramBy:a.ramBy,type:a.type,time:a.time,contract:a.contract,lastUpdate:e,removed:!1,chain:b.value.shortName?b.value.shortName:b.value.chainId};l.updateHistoryInTrx(m,t),k.value=t}if(m==p){const t={sender:m,recipient:g,id:Number(a.id),fund:(0,L.AssetToString)(a.fund),orifund:(0,L.AssetToString)({amount:a.orisent,symbol:n}),memo:a.memo,ramBy:a.ramBy,type:a.type,time:a.time,contract:a.contract,lastUpdate:e,removed:!1,chain:b.value.shortName?b.value.shortName:b.value.chainId};l.updateHistoryOutTrx(m,t),k.value=t}}else k.value&&(k.value.removed=!0,m==g&&l.updateHistoryInTrx(m,k.value),m==p&&l.updateHistoryOutTrx(m,k.value));return!0}return E.Z.create({type:"negative",message:s("entrynotexist"),caption:s("isdatacorrect"),position:"top"}),!1};n()}catch(e){ge.log("Error on requesting data",e)}finally{x.value=!1}}))}const O=(0,i.Fl)((()=>(0,Y.colorStatus)(P.value))),Z=(0,i.Fl)((()=>(0,Y.textStatus)(P.value,V.value)));function $(e,t,a){return pe(this,void 0,void 0,(function*(){if(!w||"string"!=typeof w.chainParams.savpayContract)return;if(l.setSelectedConnect(w),!l.walletUser){E.Z.create({message:s("errSelectWallet"),position:"top"});const e={chainId:w.chainParams.chainId,show:!0};return void l.setWalletDialog(e)}const i=[{actor:t,permission:l.walletUser.permission?l.walletUser.permission:"active"}],n={actions:[{account:w.chainParams.savpayContract,name:e,authorization:i,data:a}]},o=E.Z.create({type:"ongoing",message:s("signTrx"),position:"top"}),r={isError:!1,notify:o},c=yield J.Connect.trySigning(r,l.walletUser,n,{broadcast:!1});return!!(0,de.trxSigningErrorHandling)(r,c,s)&&(!!(yield(0,de.broadcastTrx)(r,w,c,s))&&(setTimeout(A,5e3),!0))}))}function M(){m==g&&l.updateHistoryInTrx(m,k.value),m==p&&l.updateHistoryOutTrx(m,k.value)}function R(){a.dialog({title:s("finalize"),message:s("finalize_dialog"),options:{type:"checkbox",model:[],isValid:e=>e.includes("opt1"),items:[{label:s("action_check"),value:"opt1"}]},cancel:s("cancel"),ok:s("confirm"),persistent:!0}).onOk((e=>pe(this,void 0,void 0,(function*(){var t,a;let i;ge.log("Send finalize",e),i=oe.value?yield $("finalize",oe.value?p:String(null===(t=l.walletUser)||void 0===t?void 0:t.name),{to:g,id:h}):yield $("finalizesig",String(null===(a=l.walletUser)||void 0===a?void 0:a.name),{to:g,id:h,sigtime:we.value,sig:ye.value}),i&&k.value&&(k.value.time=1,M())}))))}function H(){a.dialog({title:s("burn"),message:s("burn_dialog"),options:{type:"checkbox",model:[],isValid:e=>e.includes("opt1"),items:[{label:s("action_check"),value:"opt1"}]},cancel:s("cancel"),ok:s("confirm"),persistent:!0}).onOk((e=>pe(this,void 0,void 0,(function*(){var t,a;let i;ge.log("Send burn",e),i=oe.value?yield $("invalidate",oe.value?p:String(null===(t=l.walletUser)||void 0===t?void 0:t.name),{to:g,id:h}):yield $("invalisig",String(null===(a=l.walletUser)||void 0===a?void 0:a.name),{to:g,id:h,sigtime:we.value,sig:ye.value}),i&&k.value&&(k.value.time=-1,M())}))))}function B(){a.dialog({title:s("reject"),message:s("reject_dialog"),options:{type:"checkbox",model:[],isValid:e=>e.includes("opt1"),items:[{label:s("action_check"),value:"opt1"}]},cancel:s("cancel"),ok:s("confirm"),persistent:!0}).onOk((e=>pe(this,void 0,void 0,(function*(){var t,a;let i;ge.log("Send reject",e),i=se.value?yield $("reject",se.value?g:String(null===(t=l.walletUser)||void 0===t?void 0:t.name),{to:g,id:h}):yield $("rejectsig",String(null===(a=l.walletUser)||void 0===a?void 0:a.name),{to:g,id:h,sigtime:we.value,sig:ye.value}),i&&k.value&&(k.value.time=0,M())}))))}function le(){a.dialog({title:s("extend"),message:s("extend_dialog"),options:{type:"checkbox",model:[],isValid:e=>e.includes("opt1"),items:[{label:s("action_check"),value:"opt1"}]},cancel:s("cancel"),ok:s("confirm"),persistent:!0}).onOk((e=>pe(this,void 0,void 0,(function*(){var t,a;if(ge.log("Send extend",e),!re.value)return;const i=Math.round(re.value.getTime()/1e3);let n;n=se.value?yield $("extend",se.value?g:String(null===(t=l.walletUser)||void 0===t?void 0:t.name),{to:g,id:h,time:i}):yield $("extendsig",String(null===(a=l.walletUser)||void 0===a?void 0:a.name),{to:g,id:h,time:i,sigtime:we.value,sig:ye.value}),n&&k.value&&(k.value.time=i,M())}))))}function ne(){a.dialog({title:s("payoff"),message:s("payoff_dialog"),options:{type:"checkbox",model:[],isValid:e=>e.includes("opt1"),items:[{label:s("action_check"),value:"opt1"}]},cancel:s("cancel"),ok:s("confirm"),persistent:!0}).onOk((e=>pe(this,void 0,void 0,(function*(){var t,a;ge.log("Send payoff",e),ze.value.length>0?yield $("payoff",String(null===(t=l.walletUser)||void 0===t?void 0:t.name),{to:g,id:h}):yield $("payoffsig",String(null===(a=l.walletUser)||void 0===a?void 0:a.name),{to:g,id:h,recipient:fe.value,sigtime:we.value,sig:ye.value})}))))}const oe=(0,i.Fl)((()=>p.length<=13)),se=(0,i.Fl)((()=>g.length<=13)),re=(0,te.iH)(),fe=(0,te.iH)(""),ye=(0,te.iH)(""),we=(0,te.iH)(-1),be=(0,te.iH)({});function he(){switch(r.value){case"finalize":R();break;case"burn":H();break;case"reject":B();break;case"extend":le();break;case"payoff":ne();break;default:return}}const ke=(0,i.Fl)((()=>{switch(r.value){case"finalize":return s("finalize_dialog_short");case"burn":return s("burn_dialog_short");case"reject":return s("reject_dialog");case"extend":return s("extend_dialog");case"payoff":return s("payoff_dialog");default:return""}})),xe=(0,i.Fl)((()=>d.brightStyle?"black":"white"));function _e(){return pe(this,void 0,void 0,(function*(){be.value=yield(()=>pe(this,void 0,void 0,(function*(){if(!b.value||void 0==b.value.savpayContract)return{};const e=Date.now(),t=String(Math.round(e/1e3));switch(r.value){case"finalize":return{msg:(0,ue.finalizeMsg)(b.value.chainId,b.value.savpayContract,g,String(h),t),time:e};case"burn":return{msg:(0,ue.invalidateMsg)(b.value.chainId,b.value.savpayContract,g,String(h),t),time:e};case"reject":let a;if(oe.value)a=p;else{const e=K.PublicKey.fromString(p);a=(0,X.hexWithTypeOfPubKey)(e)}return{msg:(0,ue.rejectMsg)(b.value.chainId,b.value.savpayContract,a,String(h),t),time:e};case"extend":if(!re.value)return{};const i=K.PublicKey.fromString(g),l=(0,X.hexWithTypeOfPubKey)(i);return c.value=Math.round(re.value.getTime()/1e3),{msg:(0,ue.extendMsg)(b.value.chainId,b.value.savpayContract,String(c.value),l,String(h),t),time:e};case"payoff":return"string"!=typeof fe.value?(E.Z.create({type:"negative",message:s("enterName"),position:"top"}),{}):{msg:(0,ue.payOffMsg)(b.value.chainId,b.value.savpayContract,g,fe.value,String(h),t),time:e};default:return{}}})))()}))}const Se=(0,i.Fl)((()=>{var e;return(null===(e=b.value)||void 0===e?void 0:e.systemToken)?(0,L.AssetToString)({amount:BigInt(1),symbol:{name:b.value.systemToken.symbol,precision:b.value.systemToken.precision}}):""})),Te=(0,i.Fl)((()=>{switch(Z.value){case"Active":return;case"Finalized":return g;case"Rejected":return p;default:return}})),ze=(0,i.Fl)((()=>Te.value&&Te.value.length<=13?Te.value:"")),Ce=(0,i.Fl)((()=>{switch(r.value){case"burn":return"red";case"finalize":return"blue";case"reject":return"orange";case"extend":return"green";case"payoff":return"grey";default:return""}}));function qe(){C.value&&o.push({name:"vote-result",query:{to:g,id:v.id,chain:v.chain}})}return A(),{t:s,textColorStyle:xe,update:A,loading:x,id:h,to:g,from:p,fund:_,orifund:S,contract:T,time:P,timeDate:j,memo:z,vote:C,ramBy:U,type:I,removed:V,localNr:D,localReg:F,userIsSender:f,userIsRecipient:y,chainParams:b,statusColor:O,statusText:Z,finalize:R,burn:H,reject:B,payoff:ne,tab:r,fromIsName:oe,toIsName:se,signedMessage:ye,send:he,infoActionText:ke,payoffRecipient:fe,extendTime:re,connect:w,messageToSign:be,lastSigTime:we,signClick:_e,memoMsg:u,exchangeQuantityView:Se,getPayOffRecipientName:ze,tabColor:Ce,typeClick:qe,VoteColor:ve.VoteColor,voteEnd:q}}});var ye=a(11639),we=a(69885),be=a(44458),he=a(63190),ke=a(57691),xe=a(46858),_e=a(66663),Se=a(60854),Te=a(9120),ze=a(68879),Ce=a(69984),qe=a.n(Ce);const Ue=(0,ye.Z)(fe,[["render",B],["__scopeId","data-v-a762339a"]]),Pe=Ue;qe()(fe,"components",{QPage:we.Z,QCard:be.Z,QCardSection:he.Z,QChip:ke.Z,QTooltip:xe.Z,QScrollArea:_e.Z,QInnerLoading:Se.Z,QSpinnerGears:Te.Z,QBtn:ze.Z})}}]);