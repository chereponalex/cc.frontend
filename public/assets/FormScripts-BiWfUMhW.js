import{bp as MD,r as jn,a9 as Rr,K as SD,j as kt,u as BD,ap as ND,bV as PD,a5 as OD,c as LD}from"./index-DB17ow0B.js";import{i as zD,j as jr,k as RD,r as jD,l as FD,m as VD,F as HD,a as UD,b as ic}from"./index.esm-B4uKY3iG.js";import{F as qD,a as rc}from"./Alert-ByogqZv3.js";import{I as WD}from"./Input-DH-WCHZ2.js";import"./index-Bcac-H9A.js";import{p as GD,S as ab}from"./Badge-CQXMuIXM.js";import{B as Fr,p as KD,q as $D}from"./Button-CAjmaRgO.js";import"./Upload-C9WU0jIo.js";import{u as YD,g as QD,T as cb,f as eb,C as ZD}from"./Tag-56vMD8vs.js";import"./toast-D1G-7zs5.js";import"./index-BLURZrR2.js";import"./index-DNghyaU3.js";import"./ScrollBar-uf-ZekKR.js";import{j as JD}from"./validationForm-B8HxzcOJ.js";import{T as lb}from"./index-BB8TQc6p.js";import{r as XD}from"./Views-DXqaN0_h.js";import{u as db}from"./useTranslation-BAWqLgco.js";import"./SvgIcon-B3fC32px.js";import"./SegmentItemOption-CZ2PeNE8.js";var ub={exports:{}};/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */class cc{constructor(S){if(this.crashes=[],this.state="initializing",this._now=Date.now,this.crashes=[],this._crashNumberLimit=typeof S.crashNumberLimit=="number"?S.crashNumberLimit:3,this._minimumNonErrorTimePeriod=typeof S.minimumNonErrorTimePeriod=="number"?S.minimumNonErrorTimePeriod:5e3,this._boundErrorHandler=R=>{const H="error"in R?R.error:R.reason;H instanceof Error&&this._handleError(H,R)},this._listeners={},!this._restart)throw new Error("The Watchdog class was split into the abstract `Watchdog` class and the `EditorWatchdog` class. Please, use `EditorWatchdog` if you have used the `Watchdog` class previously.")}destroy(){this._stopErrorHandling(),this._listeners={}}on(S,R){this._listeners[S]||(this._listeners[S]=[]),this._listeners[S].push(R)}off(S,R){this._listeners[S]=this._listeners[S].filter(H=>H!==R)}_fire(S,...R){const H=this._listeners[S]||[];for(const N of H)N.apply(this,[null,...R])}_startErrorHandling(){window.addEventListener("error",this._boundErrorHandler),window.addEventListener("unhandledrejection",this._boundErrorHandler)}_stopErrorHandling(){window.removeEventListener("error",this._boundErrorHandler),window.removeEventListener("unhandledrejection",this._boundErrorHandler)}_handleError(S,R){if(this._shouldReactToError(S)){this.crashes.push({message:S.message,stack:S.stack,filename:R instanceof ErrorEvent?R.filename:void 0,lineno:R instanceof ErrorEvent?R.lineno:void 0,colno:R instanceof ErrorEvent?R.colno:void 0,date:this._now()});const H=this._shouldRestart();this.state="crashed",this._fire("stateChange"),this._fire("error",{error:S,causesRestart:H}),H?this._restart():(this.state="crashedPermanently",this._fire("stateChange"))}}_shouldReactToError(S){return S.is&&S.is("CKEditorError")&&S.context!==void 0&&S.context!==null&&this.state==="ready"&&this._isErrorComingFromThisItem(S)}_shouldRestart(){if(this.crashes.length<=this._crashNumberLimit)return!0;const S=this.crashes[this.crashes.length-1].date,R=this.crashes[this.crashes.length-1-this._crashNumberLimit].date;return(S-R)/this._crashNumberLimit>this._minimumNonErrorTimePeriod}}/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */function ac(q,S=new Set){const R=[q],H=new Set;let N=0;for(;R.length>N;){const nt=R[N++];if(!(H.has(nt)||!tI(nt)||S.has(nt)))if(H.add(nt),Symbol.iterator in nt)try{for(const E of nt)R.push(E)}catch{}else for(const E in nt)E!=="defaultValue"&&R.push(nt[E])}return H}function tI(q){const S=Object.prototype.toString.call(q),R=typeof q;return!(R==="number"||R==="boolean"||R==="string"||R==="symbol"||R==="function"||S==="[object Date]"||S==="[object RegExp]"||S==="[object Module]"||q===void 0||q===null||q._watchdogExcluded||q instanceof EventTarget||q instanceof Event)}/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */function hb(q,S,R=new Set){if(q===S&&eI(q))return!0;const H=ac(q,R),N=ac(S,R);for(const nt of H)if(N.has(nt))return!0;return!1}function eI(q){return typeof q=="object"&&q!==null}var nI=/\s/;function oI(q){for(var S=q.length;S--&&nI.test(q.charAt(S)););return S}var iI=/^\s+/;function rI(q){return q&&q.slice(0,oI(q)+1).replace(iI,"")}var nb=NaN,sI=/^[-+]0x[0-9a-f]+$/i,aI=/^0b[01]+$/i,cI=/^0o[0-7]+$/i,lI=parseInt;function ob(q){if(typeof q=="number")return q;if(zD(q))return nb;if(jr(q)){var S=typeof q.valueOf=="function"?q.valueOf():q;q=jr(S)?S+"":S}if(typeof q!="string")return q===0?q:+q;q=rI(q);var R=aI.test(q);return R||cI.test(q)?lI(q.slice(2),R?2:8):sI.test(q)?nb:+q}var dI=1,uI=4;function hI(q,S){return S=typeof S=="function"?S:void 0,RD(q,dI|uI,S)}var sc=function(){return jD.Date.now()},gI="Expected a function",mI=Math.max,pI=Math.min;function fI(q,S,R){var H,N,nt,E,A,m,x=0,y=!1,_=!1,f=!0;if(typeof q!="function")throw new TypeError(gI);S=ob(S)||0,jr(R)&&(y=!!R.leading,_="maxWait"in R,nt=_?mI(ob(R.maxWait)||0,S):nt,f="trailing"in R?!!R.trailing:f);function b(at){var C=H,$=N;return H=N=void 0,x=at,E=q.apply($,C),E}function D(at){return x=at,A=setTimeout(O,S),y?b(at):E}function M(at){var C=at-m,$=at-x,ct=S-C;return _?pI(ct,nt-$):ct}function T(at){var C=at-m,$=at-x;return m===void 0||C>=S||C<0||_&&$>=nt}function O(){var at=sc();if(T(at))return L(at);A=setTimeout(O,M(at))}function L(at){return A=void 0,f&&H?b(at):(H=N=void 0,E)}function V(){A!==void 0&&clearTimeout(A),x=0,H=m=N=A=void 0}function Z(){return A===void 0?E:L(sc())}function st(){var at=sc(),C=T(at);if(H=arguments,N=this,m=at,C){if(A===void 0)return D(m);if(_)return clearTimeout(A),A=setTimeout(O,S),b(m)}return A===void 0&&(A=setTimeout(O,S)),E}return st.cancel=V,st.flush=Z,st}function ib(q){return FD(q)&&q.nodeType===1&&!VD(q)}var kI="Expected a function";function bI(q,S,R){var H=!0,N=!0;if(typeof q!="function")throw new TypeError(kI);return jr(R)&&(H="leading"in R?!!R.leading:H,N="trailing"in R?!!R.trailing:N),fI(q,S,{leading:H,maxWait:S,trailing:N})}/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */class gb extends cc{constructor(S,R={}){super(R),this._editor=null,this._lifecyclePromise=null,this._initUsingData=!0,this._editables={},this._throttledSave=bI(this._save.bind(this),typeof R.saveInterval=="number"?R.saveInterval:5e3),S&&(this._creator=(H,N)=>S.create(H,N)),this._destructor=H=>H.destroy()}get editor(){return this._editor}get _item(){return this._editor}setCreator(S){this._creator=S}setDestructor(S){this._destructor=S}_restart(){return Promise.resolve().then(()=>(this.state="initializing",this._fire("stateChange"),this._destroy())).catch(S=>{console.error("An error happened during the editor destroying.",S)}).then(()=>{const S={},R=[],H=this._config.rootsAttributes||{},N={};for(const[E,A]of Object.entries(this._data.roots))A.isLoaded?(S[E]="",N[E]=H[E]||{}):R.push(E);const nt={...this._config,extraPlugins:this._config.extraPlugins||[],lazyRoots:R,rootsAttributes:N,_watchdogInitialData:this._data};return delete nt.initialData,nt.extraPlugins.push(wI),this._initUsingData?this.create(S,nt,nt.context):ib(this._elementOrData)?this.create(this._elementOrData,nt,nt.context):this.create(this._editables,nt,nt.context)}).then(()=>{this._fire("restart")})}create(S=this._elementOrData,R=this._config,H){return this._lifecyclePromise=Promise.resolve(this._lifecyclePromise).then(()=>(super._startErrorHandling(),this._elementOrData=S,this._initUsingData=typeof S=="string"||Object.keys(S).length>0&&typeof Object.values(S)[0]=="string",this._config=this._cloneEditorConfiguration(R)||{},this._config.context=H,this._creator(S,this._config))).then(N=>{this._editor=N,N.model.document.on("change:data",this._throttledSave),this._lastDocumentVersion=N.model.document.version,this._data=this._getData(),this._initUsingData||(this._editables=this._getEditables()),this.state="ready",this._fire("stateChange")}).finally(()=>{this._lifecyclePromise=null}),this._lifecyclePromise}destroy(){return this._lifecyclePromise=Promise.resolve(this._lifecyclePromise).then(()=>(this.state="destroyed",this._fire("stateChange"),super.destroy(),this._destroy())).finally(()=>{this._lifecyclePromise=null}),this._lifecyclePromise}_destroy(){return Promise.resolve().then(()=>{this._stopErrorHandling(),this._throttledSave.cancel();const S=this._editor;return this._editor=null,S.model.document.off("change:data",this._throttledSave),this._destructor(S)})}_save(){const S=this._editor.model.document.version;try{this._data=this._getData(),this._initUsingData||(this._editables=this._getEditables()),this._lastDocumentVersion=S}catch(R){console.error(R,"An error happened during restoring editor data. Editor will be restored from the previously saved data.")}}_setExcludedProperties(S){this._excludedProps=S}_getData(){const S=this._editor,R=S.model.document.roots.filter(A=>A.isAttached()&&A.rootName!="$graveyard"),{plugins:H}=S,N=H.has("CommentsRepository")&&H.get("CommentsRepository"),nt=H.has("TrackChanges")&&H.get("TrackChanges"),E={roots:{},markers:{},commentThreads:JSON.stringify([]),suggestions:JSON.stringify([])};R.forEach(A=>{E.roots[A.rootName]={content:JSON.stringify(Array.from(A.getChildren())),attributes:JSON.stringify(Array.from(A.getAttributes())),isLoaded:A._isLoaded}});for(const A of S.model.markers)A._affectsData&&(E.markers[A.name]={rangeJSON:A.getRange().toJSON(),usingOperation:A._managedUsingOperations,affectsData:A._affectsData});return N&&(E.commentThreads=JSON.stringify(N.getCommentThreads({toJSON:!0,skipNotAttached:!0}))),nt&&(E.suggestions=JSON.stringify(nt.getSuggestions({toJSON:!0,skipNotAttached:!0}))),E}_getEditables(){const S={};for(const R of this.editor.model.document.getRootNames()){const H=this.editor.ui.getEditableElement(R);H&&(S[R]=H)}return S}_isErrorComingFromThisItem(S){return hb(this._editor,S.context,this._excludedProps)}_cloneEditorConfiguration(S){return hI(S,(R,H)=>{if(ib(R)||H==="context")return R})}}class wI{constructor(S){this.editor=S,this._data=S.config.get("_watchdogInitialData")}init(){this.editor.data.on("init",S=>{S.stop(),this.editor.model.enqueueChange({isUndoable:!1},R=>{this._restoreCollaborationData(),this._restoreEditorData(R)}),this.editor.data.fire("ready")},{priority:999})}_createNode(S,R){if("name"in R){const H=S.createElement(R.name,R.attributes);if(R.children)for(const N of R.children)H._appendChild(this._createNode(S,N));return H}else return S.createText(R.data,R.attributes)}_restoreEditorData(S){const R=this.editor;Object.entries(this._data.roots).forEach(([H,{content:N,attributes:nt}])=>{const E=JSON.parse(N),A=JSON.parse(nt),m=R.model.document.getRoot(H);for(const[x,y]of A)S.setAttribute(x,y,m);for(const x of E){const y=this._createNode(S,x);S.insert(y,m,"end")}}),Object.entries(this._data.markers).forEach(([H,N])=>{const{document:nt}=R.model,{rangeJSON:{start:E,end:A},...m}=N,x=nt.getRoot(E.root),y=S.createPositionFromPath(x,E.path,E.stickiness),_=S.createPositionFromPath(x,A.path,A.stickiness),f=S.createRange(y,_);S.addMarker(H,{range:f,...m})})}_restoreCollaborationData(){const S=JSON.parse(this._data.commentThreads),R=JSON.parse(this._data.suggestions);S.forEach(H=>{const N=this.editor.config.get("collaboration.channelId"),nt=this.editor.plugins.get("CommentsRepository");nt.hasCommentThread(H.threadId)&&nt.getCommentThread(H.threadId).remove(),nt.addCommentThread({channelId:N,...H})}),R.forEach(H=>{const N=this.editor.plugins.get("TrackChangesEditing");if(N.hasSuggestion(H.id)){const nt=N.getSuggestion(H.id);nt.attributes=H.attributes}else N.addSuggestionData(H)})}}/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */const gi=Symbol("MainQueueId");class AI extends cc{constructor(S,R={}){super(R),this._watchdogs=new Map,this._context=null,this._contextProps=new Set,this._actionQueues=new _I,this._watchdogConfig=R,this._creator=H=>S.create(H),this._destructor=H=>H.destroy(),this._actionQueues.onEmpty(()=>{this.state==="initializing"&&(this.state="ready",this._fire("stateChange"))})}setCreator(S){this._creator=S}setDestructor(S){this._destructor=S}get context(){return this._context}create(S={}){return this._actionQueues.enqueue(gi,()=>(this._contextConfig=S,this._create()))}getItem(S){return this._getWatchdog(S)._item}getItemState(S){return this._getWatchdog(S).state}add(S){const R=rb(S);return Promise.all(R.map(H=>this._actionQueues.enqueue(H.id,()=>{if(this.state==="destroyed")throw new Error("Cannot add items to destroyed watchdog.");if(!this._context)throw new Error("Context was not created yet. You should call the `ContextWatchdog#create()` method first.");let N;if(this._watchdogs.has(H.id))throw new Error(`Item with the given id is already added: '${H.id}'.`);if(H.type==="editor")return N=new gb(null,this._watchdogConfig),N.setCreator(H.creator),N._setExcludedProperties(this._contextProps),H.destructor&&N.setDestructor(H.destructor),this._watchdogs.set(H.id,N),N.on("error",(nt,{error:E,causesRestart:A})=>{this._fire("itemError",{itemId:H.id,error:E}),A&&this._actionQueues.enqueue(H.id,()=>new Promise(m=>{const x=()=>{N.off("restart",x),this._fire("itemRestart",{itemId:H.id}),m()};N.on("restart",x)}))}),N.create(H.sourceElementOrData,H.config,this._context);throw new Error(`Not supported item type: '${H.type}'.`)})))}remove(S){const R=rb(S);return Promise.all(R.map(H=>this._actionQueues.enqueue(H,()=>{const N=this._getWatchdog(H);return this._watchdogs.delete(H),N.destroy()})))}destroy(){return this._actionQueues.enqueue(gi,()=>(this.state="destroyed",this._fire("stateChange"),super.destroy(),this._destroy()))}_restart(){return this._actionQueues.enqueue(gi,()=>(this.state="initializing",this._fire("stateChange"),this._destroy().catch(S=>{console.error("An error happened during destroying the context or items.",S)}).then(()=>this._create()).then(()=>this._fire("restart"))))}_create(){return Promise.resolve().then(()=>(this._startErrorHandling(),this._creator(this._contextConfig))).then(S=>(this._context=S,this._contextProps=ac(this._context),Promise.all(Array.from(this._watchdogs.values()).map(R=>(R._setExcludedProperties(this._contextProps),R.create(void 0,void 0,this._context))))))}_destroy(){return Promise.resolve().then(()=>{this._stopErrorHandling();const S=this._context;return this._context=null,this._contextProps=new Set,Promise.all(Array.from(this._watchdogs.values()).map(R=>R.destroy())).then(()=>this._destructor(S))})}_getWatchdog(S){const R=this._watchdogs.get(S);if(!R)throw new Error(`Item with the given id was not registered: ${S}.`);return R}_isErrorComingFromThisItem(S){for(const R of this._watchdogs.values())if(R._isErrorComingFromThisItem(S))return!1;return hb(this._context,S.context)}}class _I{constructor(){this._onEmptyCallbacks=[],this._queues=new Map,this._activeActions=0}onEmpty(S){this._onEmptyCallbacks.push(S)}enqueue(S,R){const H=S===gi;this._activeActions++,this._queues.get(S)||this._queues.set(S,Promise.resolve());const nt=(H?Promise.all(this._queues.values()):Promise.all([this._queues.get(gi),this._queues.get(S)])).then(R),E=nt.catch(()=>{});return this._queues.set(S,E),nt.finally(()=>{this._activeActions--,this._queues.get(S)===E&&this._activeActions===0&&this._onEmptyCallbacks.forEach(A=>A())})}}function rb(q){return Array.isArray(q)?q:[q]}/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */const CI=Object.freeze(Object.defineProperty({__proto__:null,ContextWatchdog:AI,EditorWatchdog:gb,Watchdog:cc},Symbol.toStringTag,{value:"Module"})),vI=MD(CI);/*!
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */(function(q,S){(function(R,H){q.exports=H(jn,GD,vI)})(self,(R,H,N)=>(()=>{var nt={546:x=>{x.exports=N},949:x=>{x.exports=H},155:x=>{x.exports=R}},E={};function A(x){var y=E[x];if(y!==void 0)return y.exports;var _=E[x]={exports:{}};return nt[x](_,_.exports,A),_.exports}A.n=x=>{var y=x&&x.__esModule?()=>x.default:()=>x;return A.d(y,{a:y}),y},A.d=(x,y)=>{for(var _ in y)A.o(y,_)&&!A.o(x,_)&&Object.defineProperty(x,_,{enumerable:!0,get:y[_]})},A.o=(x,y)=>Object.prototype.hasOwnProperty.call(x,y),A.r=x=>{typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(x,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(x,"__esModule",{value:!0})};var m={};return(()=>{A.r(m),A.d(m,{CKEditor:()=>V,CKEditorContext:()=>T,useMultiRootEditor:()=>Ht});var x=A(155),y=A.n(x),_=A(949),f=A.n(_);const b=new Array(256).fill("").map((J,j)=>("0"+j.toString(16)).slice(-2));var D=A(546);const M=y().createContext("contextWatchdog");class T extends y().Component{constructor(j,W){super(j,W),this.contextWatchdog=null,this.props.isLayoutReady&&this._initializeContextWatchdog(this.props.config)}shouldComponentUpdate(j){return this._shouldComponentUpdate(j)}async _shouldComponentUpdate(j){return j.id!==this.props.id&&(this.contextWatchdog&&await this.contextWatchdog.destroy(),await this._initializeContextWatchdog(j.config)),j.isLayoutReady&&!this.contextWatchdog?(await this._initializeContextWatchdog(j.config),!0):this.props.children!==j.children}render(){return y().createElement(M.Provider,{value:this.contextWatchdog},this.props.children)}componentWillUnmount(){this._destroyContext()}async _initializeContextWatchdog(j){this.contextWatchdog=new D.ContextWatchdog(this.props.context,this.props.watchdogConfig),this.contextWatchdog.on("error",(W,X)=>{this.props.onError(X.error,{phase:"runtime",willContextRestart:X.causesRestart})}),this.contextWatchdog.on("stateChange",()=>{this.contextWatchdog.state==="ready"&&this.props.onReady&&this.props.onReady(this.contextWatchdog.context)}),await this.contextWatchdog.create(j).catch(W=>{this.props.onError(W,{phase:"initialization",willContextRestart:!1})})}async _destroyContext(){this.contextWatchdog&&(await this.contextWatchdog.destroy(),this.contextWatchdog=null)}}T.defaultProps={isLayoutReady:!0,onError:(J,j)=>console.error(J,j)},T.propTypes={id:f().string,isLayoutReady:f().bool,context:f().func,watchdogConfig:f().object,config:f().object,onReady:f().func,onError:f().func};class O{constructor(j,W){this._releaseLock=null,this._value=null,this._afterMountCallbacks=[],this._state={destroyedBeforeInitialization:!1,mountingInProgress:null},this.release=function(X){let Q=null;return(...gt)=>(Q||(Q={current:X(...gt)}),Q.current)}(()=>{const{_releaseLock:X,_state:Q,_element:gt,_lifecycle:_t}=this;Q.mountingInProgress?Q.mountingInProgress.then(()=>_t.unmount({element:gt,mountResult:this.value})).catch(Et=>{console.error("Semaphore unmounting error:",Et)}).then(X.resolve).then(()=>{this._value=null}):(Q.destroyedBeforeInitialization=!0,X.resolve())}),this._element=j,this._lifecycle=W,this._lock()}get value(){return this._value}unsafeSetValue(j){this._value=j,this._afterMountCallbacks.forEach(W=>W(j)),this._afterMountCallbacks=[]}runAfterMount(j){const{_value:W,_afterMountCallbacks:X}=this;W?j(W):X.push(j)}_lock(){const{_semaphores:j}=O,{_state:W,_element:X,_lifecycle:Q}=this,gt=j.get(X)||Promise.resolve(null),_t=function(){const Pt={resolve:null,promise:null};return Pt.promise=new Promise(ie=>{Pt.resolve=ie}),Pt}();this._releaseLock=_t;const Et=gt.then(()=>W.destroyedBeforeInitialization?Promise.resolve(void 0):(W.mountingInProgress=Q.mount().then(Pt=>(Pt&&this.unsafeSetValue(Pt),Pt)),W.mountingInProgress)).then(async Pt=>{Pt&&Q.afterMount&&await Q.afterMount({element:X,mountResult:Pt})}).then(()=>_t.promise).catch(Pt=>{console.error("Semaphore mounting error:",Pt)}).then(()=>{j.get(X)===Et&&j.delete(X)});j.set(X,Et)}}O._semaphores=new Map;const L="Lock from React integration (@ckeditor/ckeditor5-react)";class V extends y().Component{constructor(j){super(j),this.domContainer=y().createRef(),this.editorSemaphore=null;const{CKEDITOR_VERSION:W}=window;if(W){const[X]=W.split(".").map(Number);X<37&&console.warn("The <CKEditor> component requires using CKEditor 5 in version 37 or higher.")}else console.warn('Cannot find the "CKEDITOR_VERSION" in the "window" scope.')}get _semaphoreValue(){const{editorSemaphore:j}=this;return j?j.value:null}get watchdog(){const{_semaphoreValue:j}=this;return j?j.watchdog:null}get editor(){const{_semaphoreValue:j}=this;return j?j.instance:null}shouldComponentUpdate(j){const{props:W,editorSemaphore:X}=this;return j.id!==W.id||j.disableWatchdog!==W.disableWatchdog||(X&&(X.runAfterMount(({instance:Q})=>{this._shouldUpdateEditorData(W,j,Q)&&Q.data.set(j.data)}),"disabled"in j&&X.runAfterMount(({instance:Q})=>{j.disabled?Q.enableReadOnlyMode(L):Q.disableReadOnlyMode(L)})),!1)}componentDidMount(){this._initLifeCycleSemaphore()}componentDidUpdate(){this._initLifeCycleSemaphore()}componentWillUnmount(){this._unlockLifeCycleSemaphore()}_unlockLifeCycleSemaphore(){this.editorSemaphore&&(this.editorSemaphore.release(),this.editorSemaphore=null)}_initLifeCycleSemaphore(){this._unlockLifeCycleSemaphore(),this.editorSemaphore=new O(this.domContainer.current,{mount:async()=>this._initializeEditor(),afterMount:({mountResult:j})=>{const{onReady:W}=this.props;W&&this.domContainer.current!==null&&W(j.instance)},unmount:async({element:j,mountResult:W})=>{const{onAfterDestroy:X}=this.props;try{await this._destroyEditor(W),j.innerHTML=""}finally{X&&X(W.instance)}}})}render(){return y().createElement("div",{ref:this.domContainer})}async _initializeEditor(){if(this.props.disableWatchdog)return{instance:await this._createEditor(this.domContainer.current,this._getConfig()),watchdog:null};const j=this.context instanceof D.ContextWatchdog?new Z(this.context):new V._EditorWatchdog(this.props.editor,this.props.watchdogConfig),W={current:0};return j.setCreator(async(X,Q)=>{const{editorSemaphore:gt}=this,{onAfterDestroy:_t}=this.props;W.current>0&&_t&&gt&&gt.value&&gt.value.instance&&_t(gt.value.instance);const Et=await this._createEditor(X,Q);return W.current>0&&(gt.unsafeSetValue({instance:Et,watchdog:j}),setTimeout(()=>{this.props.onReady&&this.props.onReady(j.editor)})),W.current++,Et}),j.on("error",(X,{error:Q,causesRestart:gt})=>{(this.props.onError||console.error)(Q,{phase:"runtime",willEditorRestart:gt})}),await j.create(this.domContainer.current,this._getConfig()).catch(X=>{(this.props.onError||console.error)(X,{phase:"initialization",willEditorRestart:!1})}),{watchdog:j,instance:j.editor}}_createEditor(j,W){return this.props.editor.create(j,W).then(X=>{"disabled"in this.props&&this.props.disabled&&X.enableReadOnlyMode(L);const Q=X.model.document,gt=X.editing.view.document;return Q.on("change:data",_t=>{this.props.onChange&&this.props.onChange(_t,X)}),gt.on("focus",_t=>{this.props.onFocus&&this.props.onFocus(_t,X)}),gt.on("blur",_t=>{this.props.onBlur&&this.props.onBlur(_t,X)}),X})}async _destroyEditor(j){const{watchdog:W,instance:X}=j;return new Promise((Q,gt)=>{setTimeout(async()=>{try{if(W)return await W.destroy(),Q();if(X)return await X.destroy(),Q();Q()}catch(_t){console.error(_t),gt(_t)}})})}_shouldUpdateEditorData(j,W,X){return j.data!==W.data&&X.data.get()!==W.data}_getConfig(){const j=this.props.config||{};return this.props.data&&j.initialData&&console.warn("Editor data should be provided either using `config.initialData` or `content` property. The config value takes precedence over `content` property and will be used when both are specified."),{...j,initialData:j.initialData||this.props.data||""}}}V.contextType=M,V.propTypes={editor:f().func.isRequired,data:f().string,config:f().object,disableWatchdog:f().bool,watchdogConfig:f().object,onChange:f().func,onReady:f().func,onFocus:f().func,onBlur:f().func,onError:f().func,disabled:f().bool,id:f().any},V._EditorWatchdog=D.EditorWatchdog;class Z{constructor(j){this._contextWatchdog=j,this._id=function(){const W=4294967296*Math.random()>>>0,X=4294967296*Math.random()>>>0,Q=4294967296*Math.random()>>>0,gt=4294967296*Math.random()>>>0;return"e"+b[255&W]+b[W>>8&255]+b[W>>16&255]+b[W>>24&255]+b[255&X]+b[X>>8&255]+b[X>>16&255]+b[X>>24&255]+b[255&Q]+b[Q>>8&255]+b[Q>>16&255]+b[Q>>24&255]+b[255&gt]+b[gt>>8&255]+b[gt>>16&255]+b[gt>>24&255]}()}setCreator(j){this._creator=j}create(j,W){return this._contextWatchdog.add({sourceElementOrData:j,config:W,creator:this._creator,id:this._id,type:"editor"})}on(j,W){this._contextWatchdog.on("itemError",(X,{itemId:Q,error:gt})=>{Q===this._id&&W(null,{error:gt,causesRestart:void 0})})}destroy(){return this._contextWatchdog.state==="ready"?this._contextWatchdog.remove(this._id):Promise.resolve()}get editor(){return this._contextWatchdog.getItem(this._id)}}function st(...J){return j=>{J.forEach(W=>{typeof W=="function"?W(j):W!=null&&(W.current=j)})}}function at(J,j){for(const W of Object.getOwnPropertyNames(j))delete j[W];for(const[W,X]of Object.entries(J))X!==j&&W!=="prototype"&&W!=="__proto__"&&(j[W]=X);return j}const C=J=>{const j=(0,x.useRef)();return j.current=J,(0,x.useCallback)((...W)=>j.current(...W),[])};function $(J,j){return j.length=0,j.push(...J),j}const ct=(J,j,W)=>{((X,Q)=>{const gt=(0,x.useRef)(null);((_t,Et)=>{if(_t===Et)return!0;if(!_t||!Et)return!1;for(let Pt=0;Pt<_t.length;++Pt)if(_t[Pt]!==Et[Pt])return!1;return!0})(gt.current,Q)||(gt.current=[...Q],X())})(()=>{J&&J.runAfterMount(j)},[J,...W])},xt="Lock from React integration (@ckeditor/ckeditor5-react)",zt=(0,x.memo)((0,x.forwardRef)(({id:J,semaphore:j,rootName:W},X)=>{const Q=(0,x.useRef)(null);return(0,x.useEffect)(()=>{let gt,_t;return j.runAfterMount(({instance:Et})=>{Q.current&&(_t=Et,gt=Et.ui.view.createEditable(W,Q.current),Et.ui.addEditable(gt),Et.editing.view.forceRender())}),()=>{gt&&Q.current&&_t&&_t.state!=="destroyed"&&_t.ui.removeEditable(gt)}},[j.revision]),y().createElement("div",{key:j.revision,id:J,ref:st(X,Q)})}));zt.displayName="EditorEditable";const Vt=(0,x.forwardRef)(({editor:J},j)=>{const W=(0,x.useRef)(null);return(0,x.useEffect)(()=>{const X=W.current;if(!J||!X)return;const Q=J.ui.view.toolbar.element;return X&&X.appendChild(Q),()=>{X&&X.removeChild(Q)}},[J&&J.id]),y().createElement("div",{ref:st(W,j)})});Vt.displayName="EditorToolbarWrapper";const Ht=J=>{const j=(0,x.useRef)(J.semaphoreElement||null),W=(()=>{const tt=(0,x.useRef)(null),[Ut,ut]=(0,x.useState)(()=>Date.now()),mt=()=>{ut(Date.now())},dt=(bt=!0)=>{tt.current&&(tt.current.release(),tt.current=null),bt&&ut(Date.now())},rt=bt=>{tt.current&&tt.current.runAfterMount(bt)};return{get current(){return tt.current},revision:Ut,createAttributeRef:bt=>({get current(){return tt.current&&tt.current.value?tt.current.value[bt]:null}}),unsafeSetValue:bt=>{var se;(se=tt.current)===null||se===void 0||se.unsafeSetValue(bt),mt()},release:dt,replace:bt=>{dt(!1),tt.current=bt(),mt(),rt(mt)},runAfterMount:rt}})(),X={watchdog:W.createAttributeRef("watchdog"),instance:W.createAttributeRef("instance")},Q=(0,x.useContext)(M),[gt,_t]=(0,x.useState)(()=>Object.keys(J.data)),[Et,Pt]=(0,x.useState)({...J.data}),[ie,sn]=(0,x.useState)({...J.rootsAttributes}),an=(0,x.useRef)(!0);(0,x.useEffect)(()=>{const tt=j.current;if(tt&&J.isLayoutReady!==!1)return W.replace(()=>new O(tt,{mount:pi,afterMount:({mountResult:Ut})=>{const{onReady:ut}=J;ut&&j.current!==null&&ut(Ut.instance)},unmount:async({element:Ut,mountResult:ut})=>{const{onAfterDestroy:mt}=J;try{await mi(ut),Ut.innerHTML=""}finally{mt&&mt(ut.instance)}}})),()=>{W.release(!1)}},[J.id,J.isLayoutReady]);const It=()=>{const tt=J.config||{};return J.data&&tt.initialData&&console.warn("Editor data should be provided either using `config.initialData` or `data` property. The config value takes precedence over `data` property and will be used when both are specified."),{...tt,rootsAttributes:ie}},Fn=C((tt,Ut)=>{const ut=tt.model.document;if(!J.disableTwoWayDataBinding){const mt={},dt={};ut.differ.getChanges().forEach(rt=>{let bt;if(bt=rt.type=="insert"||rt.type=="remove"?rt.position.root:rt.range.root,!bt.isAttached())return;const{rootName:se}=bt;mt[se]=tt.getData({rootName:se})}),ut.differ.getChangedRoots().forEach(rt=>{if(rt.state)return void(mt[rt.name]!==void 0&&delete mt[rt.name]);const bt=rt.name;dt[bt]=tt.getRootAttributes(bt)}),Object.keys(mt).length&&Pt(rt=>({...rt,...mt})),Object.keys(dt).length&&sn(rt=>({...rt,...dt}))}J.onChange&&J.onChange(Ut,tt)}),Vn=C((tt,Ut,ut)=>{const mt=ut.rootName;J.disableTwoWayDataBinding||(Pt(dt=>({...dt,[mt]:tt.getData({rootName:mt})})),sn(dt=>({...dt,[mt]:tt.getRootAttributes(mt)}))),_t(dt=>{return rt=[...dt,ut.rootName],Array.from(new Set(rt));var rt})}),Hn=C((tt,Ut,ut)=>{const mt=ut.rootName;J.disableTwoWayDataBinding||(Pt(dt=>{const{[mt]:rt,...bt}=dt;return{...bt}}),sn(dt=>{const{[mt]:rt,...bt}=dt;return{...bt}})),_t(dt=>dt.filter(rt=>rt!==mt))}),Ke=C((tt,Ut)=>(at({...J.rootsAttributes},ie),at({...J.data},Et),$(Object.keys(J.data),gt),J.editor.create(tt,Ut).then(ut=>{const mt=ut.getFullData();at({...mt},Et),at({...ut.getRootsAttributes()},ie),$(Object.keys(mt),gt),J.disabled&&ut.enableReadOnlyMode(xt);const dt=ut.model.document,rt=ut.editing.view.document;return dt.on("change:data",bt=>Fn(ut,bt)),ut.on("addRoot",(bt,se)=>Vn(ut,bt,se)),ut.on("detachRoot",(bt,se)=>Hn(ut,bt,se)),rt.on("focus",bt=>{J.onFocus&&J.onFocus(bt,ut)}),rt.on("blur",bt=>{J.onBlur&&J.onBlur(bt,ut)}),ut}))),mi=tt=>{const{watchdog:Ut,instance:ut}=tt;return new Promise((mt,dt)=>{setTimeout(async()=>{try{if(Ut)return await Ut.destroy(),mt();if(ut)return await ut.destroy(),mt();mt()}catch(rt){console.error(rt),dt(rt)}})})},pi=async()=>{if(J.disableWatchdog)return{instance:await Ke(J.data,It()),watchdog:null};const tt=Q instanceof D.ContextWatchdog?new Z(Q):new D.EditorWatchdog(J.editor,J.watchdogConfig),Ut={current:0};return tt.setCreator(async(ut,mt)=>{const{onAfterDestroy:dt}=J;Ut.current>0&&dt&&X.instance.current&&dt(X.instance.current);const rt=await Ke(ut,mt);return Ut.current>0&&(W.unsafeSetValue({instance:rt,watchdog:tt}),setTimeout(()=>{J.onReady&&J.onReady(tt.editor)})),Ut.current++,rt}),tt.on("error",(ut,{error:mt,causesRestart:dt})=>{(J.onError||console.error)(mt,{phase:"runtime",willEditorRestart:dt})}),await tt.create(Et,It()).catch(ut=>{throw(J.onError||console.error)(ut,{phase:"initialization",willEditorRestart:!1}),ut}),{watchdog:tt,instance:tt.editor}},Dt=(0,x.useCallback)(tt=>{W.runAfterMount(()=>{an.current=!0,Pt(tt)})},[Pt]),yo=(0,x.useCallback)(tt=>{W.runAfterMount(()=>{an.current=!0,sn(tt)})},[sn]),Hr=y().createElement(Vt,{ref:j,editor:X.instance.current});ct(W.current,({instance:tt})=>{J.disabled?tt.enableReadOnlyMode(xt):tt.disableReadOnlyMode(xt)},[J.disabled]),ct(W.current,({instance:tt})=>{if(an.current){an.current=!1;const Ut=Object.keys(Et),ut=Object.keys(ie);if(!Ut.every(jt=>ut.includes(jt)))throw console.error("`data` and `attributes` objects must have the same keys (roots)."),new Error("`data` and `attributes` objects must have the same keys (roots).");const mt=tt.getFullData(),dt=tt.getRootsAttributes(),{addedKeys:rt,removedKeys:bt}=((jt,Se)=>{const $e=Object.keys(jt),Un=Object.keys(Se);return{addedKeys:Un.filter(qn=>!$e.includes(qn)),removedKeys:$e.filter(qn=>!Un.includes(qn))}})(mt,Et||{}),se=Ut.some(jt=>mt[jt]!==void 0&&JSON.stringify(mt[jt])!==JSON.stringify(Et[jt])),ae=ut.filter(jt=>JSON.stringify(dt[jt])!==JSON.stringify(ie[jt])),_e=jt=>{jt.forEach(Se=>{tt.addRoot(Se,{data:Et[Se]||"",attributes:(ie==null?void 0:ie[Se])||{},isUndoable:!0})})},fi=jt=>{jt.forEach(Se=>{tt.detachRoot(Se,!0)})},qr=()=>{tt.data.set(Et,{suppressErrorInCollaboration:!0})},Wr=(jt,Se)=>{Se.forEach($e=>{Object.keys(ie[$e]).forEach(Un=>{tt.registerRootAttribute(Un)}),jt.clearAttributes(tt.model.document.getRoot($e)),jt.setAttributes(ie[$e],tt.model.document.getRoot($e))})};setTimeout(()=>{tt.model.change(jt=>{_e(rt),fi(bt),se&&qr(),ae.length&&Wr(jt,ae)})})}},[Et,ie]);const Ur=gt.map(tt=>y().createElement(zt,{key:tt,id:tt,rootName:tt,semaphore:W}));return{editor:X.instance.current,editableElements:Ur,toolbarElement:Hr,data:Et,setData:Dt,attributes:ie,setAttributes:yo}}})(),m})())})(ub);var yI=ub.exports,Vr={exports:{}};Vr.exports;(function(q,S){(function(R){const H=R.en=R.en||{};H.dictionary=Object.assign(H.dictionary||{},{"(may require <kbd>Fn</kbd>)":"(may require <kbd>Fn</kbd>)","%0 of %1":"%0 of %1",Accept:"Accept",Accessibility:"Accessibility","Accessibility help":"Accessibility help","Align cell text to the bottom":"Align cell text to the bottom","Align cell text to the center":"Align cell text to the center","Align cell text to the left":"Align cell text to the left","Align cell text to the middle":"Align cell text to the middle","Align cell text to the right":"Align cell text to the right","Align cell text to the top":"Align cell text to the top","Align table to the left":"Align table to the left","Align table to the right":"Align table to the right",Alignment:"Alignment",Aquamarine:"Aquamarine",Background:"Background","Below, you can find a list of keyboard shortcuts that can be used in the editor.":"Below, you can find a list of keyboard shortcuts that can be used in the editor.",Black:"Black","Block quote":"Block quote",Blue:"Blue",Bold:"Bold","Bold text":"Bold text",Border:"Border","Break text":"Break text","Bulleted List":"Bulleted List","Bulleted list styles toolbar":"Bulleted list styles toolbar",Cancel:"Cancel","Cannot access default workspace.":"Cannot access default workspace.","Cannot determine a category for the uploaded file.":"Cannot determine a category for the uploaded file.","Cannot upload file:":"Cannot upload file:","Caption for image: %0":"Caption for image: %0","Caption for the image":"Caption for the image","Cell properties":"Cell properties","Center table":"Center table","Centered image":"Centered image","Change image text alternative":"Change image text alternative","Choose heading":"Choose heading",Circle:"Circle",Clear:"Clear","Click to edit block":"Click to edit block",Close:"Close","Close contextual balloons, dropdowns, and dialogs":"Close contextual balloons, dropdowns, and dialogs",Code:"Code",Color:"Color","Color picker":"Color picker",Column:"Column","Content editing keystrokes":"Content editing keystrokes","Copy selected content":"Copy selected content","Could not insert image at the current position.":"Could not insert image at the current position.","Could not obtain resized image URL.":"Could not obtain resized image URL.","Create link":"Create link",Custom:"Custom","Custom image size":"Custom image size",Dashed:"Dashed",Decimal:"Decimal","Decimal with leading zero":"Decimal with leading zero","Decrease indent":"Decrease indent","Decrease list item indent":"Decrease list item indent","Delete column":"Delete column","Delete row":"Delete row","Dim grey":"Dim grey",Dimensions:"Dimensions",Disc:"Disc",Dotted:"Dotted",Double:"Double",Downloadable:"Downloadable","Drag to move":"Drag to move","Dropdown toolbar":"Dropdown toolbar","Edit block":"Edit block","Edit image":"Edit image","Edit link":"Edit link","Editor block content toolbar":"Editor block content toolbar","Editor contextual toolbar":"Editor contextual toolbar","Editor dialog":"Editor dialog","Editor editing area: %0":"Editor editing area: %0","Editor menu bar":"Editor menu bar","Editor toolbar":"Editor toolbar","Enter image caption":"Enter image caption","Enter table caption":"Enter table caption","Entering a to-do list":"Entering a to-do list","Error during image upload":"Error during image upload","Execute the currently focused button. Executing buttons that interact with the editor content moves the focus back to the content.":"Execute the currently focused button. Executing buttons that interact with the editor content moves the focus back to the content.","Failed to determine category of edited image.":"Failed to determine category of edited image.","Full size image":"Full size image",Green:"Green",Grey:"Grey",Groove:"Groove","Header column":"Header column","Header row":"Header row",Heading:"Heading","Heading 1":"Heading 1","Heading 2":"Heading 2","Heading 3":"Heading 3","Heading 4":"Heading 4","Heading 5":"Heading 5","Heading 6":"Heading 6",Height:"Height","Help Contents. To close this dialog press ESC.":"Help Contents. To close this dialog press ESC.",HEX:"HEX","Horizontal text alignment toolbar":"Horizontal text alignment toolbar","Image from computer":"Image from computer","Image resize list":"Image resize list","Image toolbar":"Image toolbar","Image upload complete":"Image upload complete","image widget":"image widget","In line":"In line","Increase indent":"Increase indent","Increase list item indent":"Increase list item indent",Insert:"Insert","Insert a hard break (a new paragraph)":"Insert a hard break (a new paragraph)","Insert a new paragraph directly after a widget":"Insert a new paragraph directly after a widget","Insert a new paragraph directly before a widget":"Insert a new paragraph directly before a widget","Insert a new table row (when in the last cell of a table)":"Insert a new table row (when in the last cell of a table)","Insert a soft break (a <code>&lt;br&gt;</code> element)":"Insert a soft break (a <code>&lt;br&gt;</code> element)","Insert column left":"Insert column left","Insert column right":"Insert column right","Insert image":"Insert image","Insert image via URL":"Insert image via URL","Insert image with file manager":"Insert image with file manager","Insert media":"Insert media","Insert paragraph after block":"Insert paragraph after block","Insert paragraph before block":"Insert paragraph before block","Insert row above":"Insert row above","Insert row below":"Insert row below","Insert table":"Insert table","Insert with file manager":"Insert with file manager","Inserting image failed":"Inserting image failed",Inset:"Inset","Invalid start index value.":"Invalid start index value.",Italic:"Italic","Italic text":"Italic text","Justify cell text":"Justify cell text","Keystrokes that can be used in a list":"Keystrokes that can be used in a list","Keystrokes that can be used in a table cell":"Keystrokes that can be used in a table cell","Keystrokes that can be used when a widget is selected (for example: image, table, etc.)":"Keystrokes that can be used when a widget is selected (for example: image, table, etc.)","Leaving a to-do list":"Leaving a to-do list","Left aligned image":"Left aligned image","Light blue":"Light blue","Light green":"Light green","Light grey":"Light grey",Link:"Link","Link image":"Link image","Link URL":"Link URL","Link URL must not be empty.":"Link URL must not be empty.","List properties":"List properties","Lower-latin":"Lower-latin","Lower–roman":"Lower–roman","Media toolbar":"Media toolbar","Media URL":"Media URL","media widget":"media widget",MENU_BAR_MENU_EDIT:"Edit",MENU_BAR_MENU_FILE:"File",MENU_BAR_MENU_FONT:"Font",MENU_BAR_MENU_FORMAT:"Format",MENU_BAR_MENU_HELP:"Help",MENU_BAR_MENU_INSERT:"Insert",MENU_BAR_MENU_TEXT:"Text",MENU_BAR_MENU_TOOLS:"Tools",MENU_BAR_MENU_VIEW:"View","Merge cell down":"Merge cell down","Merge cell left":"Merge cell left","Merge cell right":"Merge cell right","Merge cell up":"Merge cell up","Merge cells":"Merge cells","Move focus between form fields (inputs, buttons, etc.)":"Move focus between form fields (inputs, buttons, etc.)","Move focus in and out of an active dialog window":"Move focus in and out of an active dialog window","Move focus to the menu bar, navigate between menu bars":"Move focus to the menu bar, navigate between menu bars","Move focus to the toolbar, navigate between toolbars":"Move focus to the toolbar, navigate between toolbars","Move out of a link":"Move out of a link","Move out of an inline code style":"Move out of an inline code style","Move the caret to allow typing directly after a widget":"Move the caret to allow typing directly after a widget","Move the caret to allow typing directly before a widget":"Move the caret to allow typing directly before a widget","Move the selection to the next cell":"Move the selection to the next cell","Move the selection to the previous cell":"Move the selection to the previous cell","Navigate through the table":"Navigate through the table","Navigate through the toolbar or menu bar":"Navigate through the toolbar or menu bar",Next:"Next","No results found":"No results found","No searchable items":"No searchable items",None:"None","Numbered List":"Numbered List","Numbered list styles toolbar":"Numbered list styles toolbar","Open file manager":"Open file manager","Open in a new tab":"Open in a new tab","Open link in new tab":"Open link in new tab","Open media in new tab":"Open media in new tab","Open the accessibility help dialog":"Open the accessibility help dialog",Orange:"Orange",Original:"Original",Outset:"Outset",Padding:"Padding",Paragraph:"Paragraph","Paste content":"Paste content","Paste content as plain text":"Paste content as plain text","Paste the media URL in the input.":"Paste the media URL in the input.",'Please enter a valid color (e.g. "ff0000").':'Please enter a valid color (e.g. "ff0000").',"Press %0 for help.":"Press %0 for help.","Press Enter to type after or press Shift + Enter to type before the widget":"Press Enter to type after or press Shift + Enter to type before the widget",Previous:"Previous","Processing the edited image.":"Processing the edited image.",Purple:"Purple",Red:"Red",Redo:"Redo","Remove color":"Remove color","Replace from computer":"Replace from computer","Replace image":"Replace image","Replace image from computer":"Replace image from computer","Replace image with file manager":"Replace image with file manager","Replace with file manager":"Replace with file manager","Resize image":"Resize image","Resize image (in %0)":"Resize image (in %0)","Resize image to %0":"Resize image to %0","Resize image to the original size":"Resize image to the original size","Restore default":"Restore default","Reversed order":"Reversed order","Revert autoformatting action":"Revert autoformatting action","Rich Text Editor":"Rich Text Editor",Ridge:"Ridge","Right aligned image":"Right aligned image",Row:"Row",Save:"Save","Select all":"Select all","Select column":"Select column","Select row":"Select row","Selecting resized image failed":"Selecting resized image failed","Server failed to process the image.":"Server failed to process the image.","Show more items":"Show more items","Side image":"Side image",Solid:"Solid","Split cell horizontally":"Split cell horizontally","Split cell vertically":"Split cell vertically",Square:"Square","Start at":"Start at","Start index must be greater than 0.":"Start index must be greater than 0.",Strikethrough:"Strikethrough","Strikethrough text":"Strikethrough text",Style:"Style",Subscript:"Subscript",Superscript:"Superscript",Table:"Table","Table alignment toolbar":"Table alignment toolbar","Table cell text alignment":"Table cell text alignment","Table properties":"Table properties","Table toolbar":"Table toolbar","Text alternative":"Text alternative",'The color is invalid. Try "#FF0000" or "rgb(255,0,0)" or "red".':'The color is invalid. Try "#FF0000" or "rgb(255,0,0)" or "red".',"The URL must not be empty.":"The URL must not be empty.",'The value is invalid. Try "10px" or "2em" or simply "2".':'The value is invalid. Try "10px" or "2em" or simply "2".',"The value must not be empty.":"The value must not be empty.","The value should be a plain number.":"The value should be a plain number.","These keyboard shortcuts allow for quick access to content editing features.":"These keyboard shortcuts allow for quick access to content editing features.","This link has no URL":"This link has no URL","This media URL is not supported.":"This media URL is not supported.","Tip: Paste the URL into the content to embed faster.":"Tip: Paste the URL into the content to embed faster.","To-do List":"To-do List","Toggle caption off":"Toggle caption off","Toggle caption on":"Toggle caption on","Toggle the circle list style":"Toggle the circle list style","Toggle the decimal list style":"Toggle the decimal list style","Toggle the decimal with leading zero list style":"Toggle the decimal with leading zero list style","Toggle the disc list style":"Toggle the disc list style","Toggle the lower–latin list style":"Toggle the lower–latin list style","Toggle the lower–roman list style":"Toggle the lower–roman list style","Toggle the square list style":"Toggle the square list style","Toggle the upper–latin list style":"Toggle the upper–latin list style","Toggle the upper–roman list style":"Toggle the upper–roman list style",Turquoise:"Turquoise","Type or paste your content here.":"Type or paste your content here.","Type your title":"Type your title",Underline:"Underline","Underline text":"Underline text",Undo:"Undo",Unlink:"Unlink",Update:"Update","Update image URL":"Update image URL","Upload failed":"Upload failed","Upload from computer":"Upload from computer","Upload image from computer":"Upload image from computer","Upload in progress":"Upload in progress","Uploading image":"Uploading image","Upper-latin":"Upper-latin","Upper-roman":"Upper-roman","Use the following keystrokes for more efficient navigation in the CKEditor 5 user interface.":"Use the following keystrokes for more efficient navigation in the CKEditor 5 user interface.","User interface and content navigation keystrokes":"User interface and content navigation keystrokes","Vertical text alignment toolbar":"Vertical text alignment toolbar",White:"White","Widget toolbar":"Widget toolbar",Width:"Width","Wrap text":"Wrap text",Yellow:"Yellow"})})(window.CKEDITOR_TRANSLATIONS||(window.CKEDITOR_TRANSLATIONS={})),function(R,H){q.exports=H()}(self,()=>(()=>{var R={9246:(E,A,m)=>{const x=m(6931),y={};for(const f of Object.keys(x))y[x[f]]=f;const _={rgb:{channels:3,labels:"rgb"},hsl:{channels:3,labels:"hsl"},hsv:{channels:3,labels:"hsv"},hwb:{channels:3,labels:"hwb"},cmyk:{channels:4,labels:"cmyk"},xyz:{channels:3,labels:"xyz"},lab:{channels:3,labels:"lab"},lch:{channels:3,labels:"lch"},hex:{channels:1,labels:["hex"]},keyword:{channels:1,labels:["keyword"]},ansi16:{channels:1,labels:["ansi16"]},ansi256:{channels:1,labels:["ansi256"]},hcg:{channels:3,labels:["h","c","g"]},apple:{channels:3,labels:["r16","g16","b16"]},gray:{channels:1,labels:["gray"]}};E.exports=_;for(const f of Object.keys(_)){if(!("channels"in _[f]))throw new Error("missing channels property: "+f);if(!("labels"in _[f]))throw new Error("missing channel labels property: "+f);if(_[f].labels.length!==_[f].channels)throw new Error("channel and label counts mismatch: "+f);const{channels:b,labels:D}=_[f];delete _[f].channels,delete _[f].labels,Object.defineProperty(_[f],"channels",{value:b}),Object.defineProperty(_[f],"labels",{value:D})}_.rgb.hsl=function(f){const b=f[0]/255,D=f[1]/255,M=f[2]/255,T=Math.min(b,D,M),O=Math.max(b,D,M),L=O-T;let V,Z;O===T?V=0:b===O?V=(D-M)/L:D===O?V=2+(M-b)/L:M===O&&(V=4+(b-D)/L),V=Math.min(60*V,360),V<0&&(V+=360);const st=(T+O)/2;return Z=O===T?0:st<=.5?L/(O+T):L/(2-O-T),[V,100*Z,100*st]},_.rgb.hsv=function(f){let b,D,M,T,O;const L=f[0]/255,V=f[1]/255,Z=f[2]/255,st=Math.max(L,V,Z),at=st-Math.min(L,V,Z),C=function($){return(st-$)/6/at+.5};return at===0?(T=0,O=0):(O=at/st,b=C(L),D=C(V),M=C(Z),L===st?T=M-D:V===st?T=.3333333333333333+b-M:Z===st&&(T=.6666666666666666+D-b),T<0?T+=1:T>1&&(T-=1)),[360*T,100*O,100*st]},_.rgb.hwb=function(f){const b=f[0],D=f[1];let M=f[2];const T=_.rgb.hsl(f)[0],O=1/255*Math.min(b,Math.min(D,M));return M=1-.00392156862745098*Math.max(b,Math.max(D,M)),[T,100*O,100*M]},_.rgb.cmyk=function(f){const b=f[0]/255,D=f[1]/255,M=f[2]/255,T=Math.min(1-b,1-D,1-M);return[100*((1-b-T)/(1-T)||0),100*((1-D-T)/(1-T)||0),100*((1-M-T)/(1-T)||0),100*T]},_.rgb.keyword=function(f){const b=y[f];if(b)return b;let D,M=1/0;for(const L of Object.keys(x)){const V=x[L],Z=(O=V,((T=f)[0]-O[0])**2+(T[1]-O[1])**2+(T[2]-O[2])**2);Z<M&&(M=Z,D=L)}var T,O;return D},_.keyword.rgb=function(f){return x[f]},_.rgb.xyz=function(f){let b=f[0]/255,D=f[1]/255,M=f[2]/255;return b=b>.04045?((b+.055)/1.055)**2.4:b/12.92,D=D>.04045?((D+.055)/1.055)**2.4:D/12.92,M=M>.04045?((M+.055)/1.055)**2.4:M/12.92,[100*(.4124*b+.3576*D+.1805*M),100*(.2126*b+.7152*D+.0722*M),100*(.0193*b+.1192*D+.9505*M)]},_.rgb.lab=function(f){const b=_.rgb.xyz(f);let D=b[0],M=b[1],T=b[2];return D/=95.047,M/=100,T/=108.883,D=D>.008856?D**.3333333333333333:7.787*D+.13793103448275862,M=M>.008856?M**.3333333333333333:7.787*M+.13793103448275862,T=T>.008856?T**.3333333333333333:7.787*T+.13793103448275862,[116*M-16,500*(D-M),200*(M-T)]},_.hsl.rgb=function(f){const b=f[0]/360,D=f[1]/100,M=f[2]/100;let T,O,L;if(D===0)return L=255*M,[L,L,L];T=M<.5?M*(1+D):M+D-M*D;const V=2*M-T,Z=[0,0,0];for(let st=0;st<3;st++)O=b+.3333333333333333*-(st-1),O<0&&O++,O>1&&O--,L=6*O<1?V+6*(T-V)*O:2*O<1?T:3*O<2?V+(T-V)*(.6666666666666666-O)*6:V,Z[st]=255*L;return Z},_.hsl.hsv=function(f){const b=f[0];let D=f[1]/100,M=f[2]/100,T=D;const O=Math.max(M,.01);return M*=2,D*=M<=1?M:2-M,T*=O<=1?O:2-O,[b,100*(M===0?2*T/(O+T):2*D/(M+D)),100*((M+D)/2)]},_.hsv.rgb=function(f){const b=f[0]/60,D=f[1]/100;let M=f[2]/100;const T=Math.floor(b)%6,O=b-Math.floor(b),L=255*M*(1-D),V=255*M*(1-D*O),Z=255*M*(1-D*(1-O));switch(M*=255,T){case 0:return[M,Z,L];case 1:return[V,M,L];case 2:return[L,M,Z];case 3:return[L,V,M];case 4:return[Z,L,M];case 5:return[M,L,V]}},_.hsv.hsl=function(f){const b=f[0],D=f[1]/100,M=f[2]/100,T=Math.max(M,.01);let O,L;L=(2-D)*M;const V=(2-D)*T;return O=D*T,O/=V<=1?V:2-V,O=O||0,L/=2,[b,100*O,100*L]},_.hwb.rgb=function(f){const b=f[0]/360;let D=f[1]/100,M=f[2]/100;const T=D+M;let O;T>1&&(D/=T,M/=T);const L=Math.floor(6*b),V=1-M;O=6*b-L,1&L&&(O=1-O);const Z=D+O*(V-D);let st,at,C;switch(L){default:case 6:case 0:st=V,at=Z,C=D;break;case 1:st=Z,at=V,C=D;break;case 2:st=D,at=V,C=Z;break;case 3:st=D,at=Z,C=V;break;case 4:st=Z,at=D,C=V;break;case 5:st=V,at=D,C=Z}return[255*st,255*at,255*C]},_.cmyk.rgb=function(f){const b=f[0]/100,D=f[1]/100,M=f[2]/100,T=f[3]/100;return[255*(1-Math.min(1,b*(1-T)+T)),255*(1-Math.min(1,D*(1-T)+T)),255*(1-Math.min(1,M*(1-T)+T))]},_.xyz.rgb=function(f){const b=f[0]/100,D=f[1]/100,M=f[2]/100;let T,O,L;return T=3.2406*b+-1.5372*D+-.4986*M,O=-.9689*b+1.8758*D+.0415*M,L=.0557*b+-.204*D+1.057*M,T=T>.0031308?1.055*T**.4166666666666667-.055:12.92*T,O=O>.0031308?1.055*O**.4166666666666667-.055:12.92*O,L=L>.0031308?1.055*L**.4166666666666667-.055:12.92*L,T=Math.min(Math.max(0,T),1),O=Math.min(Math.max(0,O),1),L=Math.min(Math.max(0,L),1),[255*T,255*O,255*L]},_.xyz.lab=function(f){let b=f[0],D=f[1],M=f[2];return b/=95.047,D/=100,M/=108.883,b=b>.008856?b**.3333333333333333:7.787*b+.13793103448275862,D=D>.008856?D**.3333333333333333:7.787*D+.13793103448275862,M=M>.008856?M**.3333333333333333:7.787*M+.13793103448275862,[116*D-16,500*(b-D),200*(D-M)]},_.lab.xyz=function(f){let b,D,M;D=(f[0]+16)/116,b=f[1]/500+D,M=D-f[2]/200;const T=D**3,O=b**3,L=M**3;return D=T>.008856?T:(D-.13793103448275862)/7.787,b=O>.008856?O:(b-.13793103448275862)/7.787,M=L>.008856?L:(M-.13793103448275862)/7.787,b*=95.047,D*=100,M*=108.883,[b,D,M]},_.lab.lch=function(f){const b=f[0],D=f[1],M=f[2];let T;return T=360*Math.atan2(M,D)/2/Math.PI,T<0&&(T+=360),[b,Math.sqrt(D*D+M*M),T]},_.lch.lab=function(f){const b=f[0],D=f[1],M=f[2]/360*2*Math.PI;return[b,D*Math.cos(M),D*Math.sin(M)]},_.rgb.ansi16=function(f,b=null){const[D,M,T]=f;let O=b===null?_.rgb.hsv(f)[2]:b;if(O=Math.round(O/50),O===0)return 30;let L=30+(Math.round(T/255)<<2|Math.round(M/255)<<1|Math.round(D/255));return O===2&&(L+=60),L},_.hsv.ansi16=function(f){return _.rgb.ansi16(_.hsv.rgb(f),f[2])},_.rgb.ansi256=function(f){const b=f[0],D=f[1],M=f[2];return b===D&&D===M?b<8?16:b>248?231:Math.round((b-8)/247*24)+232:16+36*Math.round(b/255*5)+6*Math.round(D/255*5)+Math.round(M/255*5)},_.ansi16.rgb=function(f){let b=f%10;if(b===0||b===7)return f>50&&(b+=3.5),b=b/10.5*255,[b,b,b];const D=.5*(1+~~(f>50));return[(1&b)*D*255,(b>>1&1)*D*255,(b>>2&1)*D*255]},_.ansi256.rgb=function(f){if(f>=232){const D=10*(f-232)+8;return[D,D,D]}let b;return f-=16,[Math.floor(f/36)/5*255,Math.floor((b=f%36)/6)/5*255,b%6/5*255]},_.rgb.hex=function(f){const b=(((255&Math.round(f[0]))<<16)+((255&Math.round(f[1]))<<8)+(255&Math.round(f[2]))).toString(16).toUpperCase();return"000000".substring(b.length)+b},_.hex.rgb=function(f){const b=f.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);if(!b)return[0,0,0];let D=b[0];b[0].length===3&&(D=D.split("").map(T=>T+T).join(""));const M=parseInt(D,16);return[M>>16&255,M>>8&255,255&M]},_.rgb.hcg=function(f){const b=f[0]/255,D=f[1]/255,M=f[2]/255,T=Math.max(Math.max(b,D),M),O=Math.min(Math.min(b,D),M),L=T-O;let V,Z;return V=L<1?O/(1-L):0,Z=L<=0?0:T===b?(D-M)/L%6:T===D?2+(M-b)/L:4+(b-D)/L,Z/=6,Z%=1,[360*Z,100*L,100*V]},_.hsl.hcg=function(f){const b=f[1]/100,D=f[2]/100,M=D<.5?2*b*D:2*b*(1-D);let T=0;return M<1&&(T=(D-.5*M)/(1-M)),[f[0],100*M,100*T]},_.hsv.hcg=function(f){const b=f[1]/100,D=f[2]/100,M=b*D;let T=0;return M<1&&(T=(D-M)/(1-M)),[f[0],100*M,100*T]},_.hcg.rgb=function(f){const b=f[0]/360,D=f[1]/100,M=f[2]/100;if(D===0)return[255*M,255*M,255*M];const T=[0,0,0],O=b%1*6,L=O%1,V=1-L;let Z=0;switch(Math.floor(O)){case 0:T[0]=1,T[1]=L,T[2]=0;break;case 1:T[0]=V,T[1]=1,T[2]=0;break;case 2:T[0]=0,T[1]=1,T[2]=L;break;case 3:T[0]=0,T[1]=V,T[2]=1;break;case 4:T[0]=L,T[1]=0,T[2]=1;break;default:T[0]=1,T[1]=0,T[2]=V}return Z=(1-D)*M,[255*(D*T[0]+Z),255*(D*T[1]+Z),255*(D*T[2]+Z)]},_.hcg.hsv=function(f){const b=f[1]/100,D=b+f[2]/100*(1-b);let M=0;return D>0&&(M=b/D),[f[0],100*M,100*D]},_.hcg.hsl=function(f){const b=f[1]/100,D=f[2]/100*(1-b)+.5*b;let M=0;return D>0&&D<.5?M=b/(2*D):D>=.5&&D<1&&(M=b/(2*(1-D))),[f[0],100*M,100*D]},_.hcg.hwb=function(f){const b=f[1]/100,D=b+f[2]/100*(1-b);return[f[0],100*(D-b),100*(1-D)]},_.hwb.hcg=function(f){const b=f[1]/100,D=1-f[2]/100,M=D-b;let T=0;return M<1&&(T=(D-M)/(1-M)),[f[0],100*M,100*T]},_.apple.rgb=function(f){return[f[0]/65535*255,f[1]/65535*255,f[2]/65535*255]},_.rgb.apple=function(f){return[f[0]/255*65535,f[1]/255*65535,f[2]/255*65535]},_.gray.rgb=function(f){return[f[0]/100*255,f[0]/100*255,f[0]/100*255]},_.gray.hsl=function(f){return[0,0,f[0]]},_.gray.hsv=_.gray.hsl,_.gray.hwb=function(f){return[0,100,f[0]]},_.gray.cmyk=function(f){return[0,0,0,f[0]]},_.gray.lab=function(f){return[f[0],0,0]},_.gray.hex=function(f){const b=255&Math.round(f[0]/100*255),D=((b<<16)+(b<<8)+b).toString(16).toUpperCase();return"000000".substring(D.length)+D},_.rgb.gray=function(f){return[(f[0]+f[1]+f[2])/3/255*100]}},9047:(E,A,m)=>{const x=m(9246),y=m(802),_={};Object.keys(x).forEach(f=>{_[f]={},Object.defineProperty(_[f],"channels",{value:x[f].channels}),Object.defineProperty(_[f],"labels",{value:x[f].labels});const b=y(f);Object.keys(b).forEach(D=>{const M=b[D];_[f][D]=function(T){const O=function(...L){const V=L[0];if(V==null)return V;V.length>1&&(L=V);const Z=T(L);if(typeof Z=="object")for(let st=Z.length,at=0;at<st;at++)Z[at]=Math.round(Z[at]);return Z};return"conversion"in T&&(O.conversion=T.conversion),O}(M),_[f][D].raw=function(T){const O=function(...L){const V=L[0];return V==null?V:(V.length>1&&(L=V),T(L))};return"conversion"in T&&(O.conversion=T.conversion),O}(M)})}),E.exports=_},802:(E,A,m)=>{const x=m(9246);function y(b){const D=function(){const T={},O=Object.keys(x);for(let L=O.length,V=0;V<L;V++)T[O[V]]={distance:-1,parent:null};return T}(),M=[b];for(D[b].distance=0;M.length;){const T=M.pop(),O=Object.keys(x[T]);for(let L=O.length,V=0;V<L;V++){const Z=O[V],st=D[Z];st.distance===-1&&(st.distance=D[T].distance+1,st.parent=T,M.unshift(Z))}}return D}function _(b,D){return function(M){return D(b(M))}}function f(b,D){const M=[D[b].parent,b];let T=x[D[b].parent][b],O=D[b].parent;for(;D[O].parent;)M.unshift(D[O].parent),T=_(x[D[O].parent][O],T),O=D[O].parent;return T.conversion=M,T}E.exports=function(b){const D=y(b),M={},T=Object.keys(D);for(let O=T.length,L=0;L<O;L++){const V=T[L];D[V].parent!==null&&(M[V]=f(V,D))}return M}},6931:E=>{E.exports={aliceblue:[240,248,255],antiquewhite:[250,235,215],aqua:[0,255,255],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],black:[0,0,0],blanchedalmond:[255,235,205],blue:[0,0,255],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],fuchsia:[255,0,255],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],gray:[128,128,128],green:[0,128,0],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],lime:[0,255,0],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],maroon:[128,0,0],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],navy:[0,0,128],oldlace:[253,245,230],olive:[128,128,0],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],purple:[128,0,128],rebeccapurple:[102,51,153],red:[255,0,0],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],silver:[192,192,192],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],teal:[0,128,128],thistle:[216,191,216],tomato:[255,99,71],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],white:[255,255,255],whitesmoke:[245,245,245],yellow:[255,255,0],yellowgreen:[154,205,50]}},4199:(E,A,m)=>{m.d(A,{A:()=>b});var x=m(9372),y=m.n(x),_=m(935),f=m.n(_)()(y());f.push([E.id,".ck-content code{background-color:hsla(0,0%,78%,.3);border-radius:2px;padding:.15em}.ck.ck-editor__editable .ck-code_selected{background-color:hsla(0,0%,78%,.5)}","",{version:3,sources:["webpack://./../ckeditor5-basic-styles/theme/code.css"],names:[],mappings:"AAKA,iBACC,kCAAuC,CAEvC,iBAAkB,CADlB,aAED,CAEA,0CACC,kCACD",sourcesContent:[`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

.ck-content code {
	background-color: hsla(0, 0%, 78%, 0.3);
	padding: .15em;
	border-radius: 2px;
}

.ck.ck-editor__editable .ck-code_selected  {
	background-color: hsla(0, 0%, 78%, 0.5);
}
`],sourceRoot:""}]);const b=f},8708:(E,A,m)=>{m.d(A,{A:()=>b});var x=m(9372),y=m.n(x),_=m(935),f=m.n(_)()(y());f.push([E.id,".ck-content blockquote{border-left:5px solid #ccc;font-style:italic;margin-left:0;margin-right:0;overflow:hidden;padding-left:1.5em;padding-right:1.5em}.ck-content[dir=rtl] blockquote{border-left:0;border-right:5px solid #ccc}","",{version:3,sources:["webpack://./../ckeditor5-block-quote/theme/blockquote.css"],names:[],mappings:"AAKA,uBAWC,0BAAsC,CADtC,iBAAkB,CAFlB,aAAc,CACd,cAAe,CAPf,eAAgB,CAIhB,kBAAmB,CADnB,mBAOD,CAEA,gCACC,aAAc,CACd,2BACD",sourcesContent:[`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

.ck-content blockquote {
	/* See #12 */
	overflow: hidden;

	/* https://github.com/ckeditor/ckeditor5-block-quote/issues/15 */
	padding-right: 1.5em;
	padding-left: 1.5em;

	margin-left: 0;
	margin-right: 0;
	font-style: italic;
	border-left: solid 5px hsl(0, 0%, 80%);
}

.ck-content[dir="rtl"] blockquote {
	border-left: 0;
	border-right: solid 5px hsl(0, 0%, 80%);
}
`],sourceRoot:""}]);const b=f},1866:(E,A,m)=>{m.d(A,{A:()=>b});var x=m(9372),y=m.n(x),_=m(935),f=m.n(_)()(y());f.push([E.id,':root{--ck-image-processing-highlight-color:#f9fafa;--ck-image-processing-background-color:#e3e5e8}.ck.ck-editor__editable .image.image-processing{position:relative}.ck.ck-editor__editable .image.image-processing:before{animation:ck-image-processing-animation 2s linear infinite;background:linear-gradient(90deg,var(--ck-image-processing-background-color),var(--ck-image-processing-highlight-color),var(--ck-image-processing-background-color));background-size:200% 100%;content:"";height:100%;left:0;position:absolute;top:0;width:100%;z-index:1}.ck.ck-editor__editable .image.image-processing img{height:100%}@keyframes ck-image-processing-animation{0%{background-position:200% 0}to{background-position:-200% 0}}',"",{version:3,sources:["webpack://./../ckeditor5-ckbox/theme/ckboximageedit.css"],names:[],mappings:"AAKA,MAEC,6CAAyD,CACzD,8CACD,CAIE,gDACC,iBA2BD,CAzBC,uDAmBC,0DAA2D,CAR3D,oKAKC,CACD,yBAA0B,CAhB1B,UAAW,CAOX,WAAY,CAHZ,MAAO,CAFP,iBAAkB,CAClB,KAAM,CAKN,UAAW,CAHX,SAcD,CAEA,oDACC,WACD,CAKH,yCACC,GACC,0BACD,CACA,GACC,2BACD,CACD",sourcesContent:[`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

:root {
	/* Based on default CKBox theme colors */
	--ck-image-processing-highlight-color: hsl(220, 10%, 98%);
	--ck-image-processing-background-color: hsl(220, 10%, 90%);
}

.ck.ck-editor__editable {
	& .image {
		&.image-processing {
			position: relative;

			&:before {
				content: '';

				position: absolute;
				top: 0;
				left: 0;
				z-index: 1;

				height: 100%;
				width: 100%;

				background: linear-gradient(
					90deg,
					var(--ck-image-processing-background-color),
					var(--ck-image-processing-highlight-color),
					var(--ck-image-processing-background-color)
				);
				background-size: 200% 100%;

				animation: ck-image-processing-animation 2s linear infinite;
			}

			& img {
				height: 100%;
			}
		}
	}
}

@keyframes ck-image-processing-animation {
	0% {
		background-position: 200% 0;
	}
	100% {
		background-position: -200% 0;
	}
}
`],sourceRoot:""}]);const b=f},7793:(E,A,m)=>{m.d(A,{A:()=>b});var x=m(9372),y=m.n(x),_=m(935),f=m.n(_)()(y());f.push([E.id,'.ck.ck-editor__editable .ck.ck-clipboard-drop-target-position{display:inline;pointer-events:none;position:relative}.ck.ck-editor__editable .ck.ck-clipboard-drop-target-position span{position:absolute;width:0}.ck.ck-editor__editable .ck-widget:-webkit-drag>.ck-widget__selection-handle,.ck.ck-editor__editable .ck-widget:-webkit-drag>.ck-widget__type-around{display:none}.ck.ck-clipboard-drop-target-line{pointer-events:none;position:absolute}:root{--ck-clipboard-drop-target-dot-width:12px;--ck-clipboard-drop-target-dot-height:8px;--ck-clipboard-drop-target-color:var(--ck-color-focus-border)}.ck.ck-editor__editable .ck.ck-clipboard-drop-target-position span{background:var(--ck-clipboard-drop-target-color);border:1px solid var(--ck-clipboard-drop-target-color);bottom:calc(var(--ck-clipboard-drop-target-dot-height)*-.5);margin-left:-1px;top:calc(var(--ck-clipboard-drop-target-dot-height)*-.5)}.ck.ck-editor__editable .ck.ck-clipboard-drop-target-position span:after{border-color:var(--ck-clipboard-drop-target-color) transparent transparent transparent;border-style:solid;border-width:calc(var(--ck-clipboard-drop-target-dot-height)) calc(var(--ck-clipboard-drop-target-dot-width)*.5) 0 calc(var(--ck-clipboard-drop-target-dot-width)*.5);content:"";display:block;height:0;left:50%;position:absolute;top:calc(var(--ck-clipboard-drop-target-dot-height)*-.5);transform:translateX(-50%);width:0}.ck.ck-editor__editable .ck-widget.ck-clipboard-drop-target-range{outline:var(--ck-widget-outline-thickness) solid var(--ck-clipboard-drop-target-color)!important}.ck.ck-editor__editable .ck-widget:-webkit-drag{zoom:.6;outline:none!important}.ck.ck-clipboard-drop-target-line{background:var(--ck-clipboard-drop-target-color);border:1px solid var(--ck-clipboard-drop-target-color);height:0;margin-top:-1px}.ck.ck-clipboard-drop-target-line:before{border-style:solid;content:"";height:0;position:absolute;top:calc(var(--ck-clipboard-drop-target-dot-width)*-.5);width:0}[dir=ltr] .ck.ck-clipboard-drop-target-line:before{border-color:transparent transparent transparent var(--ck-clipboard-drop-target-color);border-width:calc(var(--ck-clipboard-drop-target-dot-width)*.5) 0 calc(var(--ck-clipboard-drop-target-dot-width)*.5) var(--ck-clipboard-drop-target-dot-height);left:-1px}[dir=rtl] .ck.ck-clipboard-drop-target-line:before{border-color:transparent var(--ck-clipboard-drop-target-color) transparent transparent;border-width:calc(var(--ck-clipboard-drop-target-dot-width)*.5) var(--ck-clipboard-drop-target-dot-height) calc(var(--ck-clipboard-drop-target-dot-width)*.5) 0;right:-1px}',"",{version:3,sources:["webpack://./../ckeditor5-clipboard/theme/clipboard.css","webpack://./../ckeditor5-theme-lark/theme/ckeditor5-clipboard/clipboard.css"],names:[],mappings:"AASC,8DACC,cAAe,CAEf,mBAAoB,CADpB,iBAOD,CAJC,mEACC,iBAAkB,CAClB,OACD,CAWA,qJACC,YACD,CAIF,kCAEC,mBAAoB,CADpB,iBAED,CC9BA,MACC,yCAA0C,CAC1C,yCAA0C,CAC1C,6DACD,CAOE,mEAIC,gDAAiD,CADjD,sDAAuD,CAFvD,2DAA8D,CAI9D,gBAAiB,CAHjB,wDAqBD,CAfC,yEAWC,sFAAuF,CAEvF,kBAAmB,CADnB,qKAA0K,CAX1K,UAAW,CAIX,aAAc,CAFd,QAAS,CAIT,QAAS,CADT,iBAAkB,CAElB,wDAA2D,CAE3D,0BAA2B,CAR3B,OAYD,CAOF,kEACC,gGACD,CAKA,gDACC,OAAS,CACT,sBACD,CAGD,kCAGC,gDAAiD,CADjD,sDAAuD,CADvD,QAAS,CAGT,eAwBD,CAtBC,yCAMC,kBAAmB,CALnB,UAAW,CAIX,QAAS,CAHT,iBAAkB,CAClB,uDAA0D,CAC1D,OAiBD,CArBA,mDAYE,sFAAuF,CADvF,+JAAoK,CAFpK,SAYF,CArBA,mDAmBE,sFAAuF,CADvF,+JAAmK,CAFnK,UAKF",sourcesContent:[`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

.ck.ck-editor__editable {
	/*
	 * Vertical drop target (in text).
	 */
	& .ck.ck-clipboard-drop-target-position {
		display: inline;
		position: relative;
		pointer-events: none;

		& span {
			position: absolute;
			width: 0;
		}
	}

	/*
	 * Styles of the widget being dragged (its preview).
	 */
	& .ck-widget:-webkit-drag {
		& > .ck-widget__selection-handle {
			display: none;
		}

		& > .ck-widget__type-around {
			display: none;
		}
	}
}

.ck.ck-clipboard-drop-target-line {
	position: absolute;
	pointer-events: none;
}
`,`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

@import "@ckeditor/ckeditor5-ui/theme/mixins/_dir.css";

:root {
	--ck-clipboard-drop-target-dot-width: 12px;
	--ck-clipboard-drop-target-dot-height: 8px;
	--ck-clipboard-drop-target-color: var(--ck-color-focus-border);
}

.ck.ck-editor__editable {
	/*
	 * Vertical drop target (in text).
	 */
	& .ck.ck-clipboard-drop-target-position {
		& span {
			bottom: calc(-.5 * var(--ck-clipboard-drop-target-dot-height));
			top: calc(-.5 * var(--ck-clipboard-drop-target-dot-height));
			border: 1px solid var(--ck-clipboard-drop-target-color);
			background: var(--ck-clipboard-drop-target-color);
			margin-left: -1px;

			/* The triangle above the marker */
			&::after {
				content: '';
				width: 0;
				height: 0;

				display: block;
				position: absolute;
				left: 50%;
				top: calc(-.5 * var(--ck-clipboard-drop-target-dot-height));

				transform: translateX(-50%);
				border-color: var(--ck-clipboard-drop-target-color) transparent transparent transparent;
				border-width: calc(var(--ck-clipboard-drop-target-dot-height)) calc(.5 * var(--ck-clipboard-drop-target-dot-width)) 0 calc(.5 * var(--ck-clipboard-drop-target-dot-width));
				border-style: solid;
			}
		}
	}

	/*
	 * Styles of the widget that it a drop target.
	 */
	& .ck-widget.ck-clipboard-drop-target-range {
		outline: var(--ck-widget-outline-thickness) solid var(--ck-clipboard-drop-target-color) !important;
	}

	/*
	 * Styles of the widget being dragged (its preview).
	 */
	& .ck-widget:-webkit-drag {
		zoom: 0.6;
		outline: none !important;
	}
}

.ck.ck-clipboard-drop-target-line {
	height: 0;
	border: 1px solid var(--ck-clipboard-drop-target-color);
	background: var(--ck-clipboard-drop-target-color);
	margin-top: -1px;

	&::before {
		content: '';
		position: absolute;
		top: calc(-.5 * var(--ck-clipboard-drop-target-dot-width));
		width: 0;
		height: 0;
		border-style: solid;

		@mixin ck-dir ltr {
			left: -1px;

			border-width: calc(.5 * var(--ck-clipboard-drop-target-dot-width)) 0 calc(.5 * var(--ck-clipboard-drop-target-dot-width)) var(--ck-clipboard-drop-target-dot-height);
			border-color: transparent transparent transparent var(--ck-clipboard-drop-target-color);
		}

		@mixin ck-dir rtl {
			right: -1px;

			border-width:calc(.5 * var(--ck-clipboard-drop-target-dot-width)) var(--ck-clipboard-drop-target-dot-height) calc(.5 * var(--ck-clipboard-drop-target-dot-width)) 0;
			border-color: transparent var(--ck-clipboard-drop-target-color) transparent transparent;
		}
	}
}
`],sourceRoot:""}]);const b=f},7388:(E,A,m)=>{m.d(A,{A:()=>b});var x=m(9372),y=m.n(x),_=m(935),f=m.n(_)()(y());f.push([E.id,".ck.ck-editor{position:relative}.ck.ck-editor .ck-editor__top .ck-sticky-panel .ck-toolbar{z-index:var(--ck-z-panel)}.ck.ck-editor__top .ck-sticky-panel .ck-sticky-panel__content{border-radius:0}.ck-rounded-corners .ck.ck-editor__top .ck-sticky-panel .ck-sticky-panel__content,.ck.ck-editor__top .ck-sticky-panel .ck-sticky-panel__content.ck-rounded-corners{border-radius:var(--ck-border-radius);border-bottom-left-radius:0;border-bottom-right-radius:0}.ck.ck-editor__top .ck-sticky-panel .ck-sticky-panel__content{border:solid var(--ck-color-base-border);border-width:1px 1px 0}.ck.ck-editor__top .ck-sticky-panel .ck-sticky-panel__content.ck-sticky-panel__content_sticky{border-bottom-width:1px}.ck.ck-editor__top .ck-sticky-panel .ck-sticky-panel__content .ck-menu-bar,.ck.ck-editor__top .ck-sticky-panel .ck-sticky-panel__content .ck-toolbar{border:0}.ck.ck-editor__main>.ck-editor__editable{background:var(--ck-color-base-background);border-radius:0}.ck-rounded-corners .ck.ck-editor__main>.ck-editor__editable,.ck.ck-editor__main>.ck-editor__editable.ck-rounded-corners{border-radius:var(--ck-border-radius);border-top-left-radius:0;border-top-right-radius:0}.ck.ck-editor__main>.ck-editor__editable:not(.ck-focused){border-color:var(--ck-color-base-border)}","",{version:3,sources:["webpack://./../ckeditor5-editor-classic/theme/classiceditor.css","webpack://./../ckeditor5-theme-lark/theme/ckeditor5-editor-classic/classiceditor.css","webpack://./../ckeditor5-theme-lark/theme/mixins/_rounded.css"],names:[],mappings:"AAKA,cAIC,iBAMD,CAJC,2DAEC,yBACD,CCLC,8DCED,eDeC,CAjBA,mKCMA,qCAAsC,CDJpC,2BAA4B,CAC5B,4BAcF,CAjBA,8DAOC,wCAAsB,CAAtB,sBAUD,CARC,8FACC,uBACD,CAEA,qJAEC,QACD,CAMH,yCAEC,0CAA2C,CCtB3C,eDgCD,CAZA,yHChBE,qCAAsC,CDqBtC,wBAAyB,CACzB,yBAMF,CAHC,0DACC,wCACD",sourcesContent:[`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

.ck.ck-editor {
	/* All the elements within \`.ck-editor\` are positioned relatively to it.
	 If any element needs to be positioned with respect to the <body>, etc.,
	 it must land outside of the \`.ck-editor\` in DOM. */
	position: relative;

	& .ck-editor__top .ck-sticky-panel .ck-toolbar {
		/* https://github.com/ckeditor/ckeditor5-editor-classic/issues/62 */
		z-index: var(--ck-z-panel);
	}
}
`,`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

@import "../mixins/_rounded.css";

.ck.ck-editor__top {
	& .ck-sticky-panel {
		& .ck-sticky-panel__content {
			@mixin ck-rounded-corners {
				border-bottom-left-radius: 0;
				border-bottom-right-radius: 0;
			}

			border: 1px solid var(--ck-color-base-border);
			border-bottom-width: 0;

			&.ck-sticky-panel__content_sticky {
				border-bottom-width: 1px;
			}

			& .ck-menu-bar,
			& .ck-toolbar {
				border: 0;
			}
		}
	}
}

/* Note: Use ck-editor__main to make sure these styles don't apply to other editor types */
.ck.ck-editor__main > .ck-editor__editable {
	/* https://github.com/ckeditor/ckeditor5-theme-lark/issues/113 */
	background: var(--ck-color-base-background);

	@mixin ck-rounded-corners {
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}

	&:not(.ck-focused) {
		border-color: var(--ck-color-base-border);
	}
}
`,`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * Implements rounded corner interface for .ck-rounded-corners class.
 *
 * @see $ck-border-radius
 */
@define-mixin ck-rounded-corners {
	border-radius: 0;

	@nest .ck-rounded-corners &,
	&.ck-rounded-corners {
		border-radius: var(--ck-border-radius);
		@mixin-content;
	}
}
`],sourceRoot:""}]);const b=f},4098:(E,A,m)=>{m.d(A,{A:()=>b});var x=m(9372),y=m.n(x),_=m(935),f=m.n(_)()(y());f.push([E.id,".ck .ck-placeholder,.ck.ck-placeholder{position:relative}.ck .ck-placeholder:before,.ck.ck-placeholder:before{content:attr(data-placeholder);left:0;pointer-events:none;position:absolute;right:0}.ck.ck-read-only .ck-placeholder:before{display:none}.ck.ck-reset_all .ck-placeholder{position:relative}@media (forced-colors:active){.ck .ck-placeholder,.ck.ck-placeholder{forced-color-adjust:preserve-parent-color}}.ck .ck-placeholder:before,.ck.ck-placeholder:before{cursor:text}@media (forced-colors:none){.ck .ck-placeholder:before,.ck.ck-placeholder:before{color:var(--ck-color-engine-placeholder-text)}}@media (forced-colors:active){.ck .ck-placeholder:before,.ck.ck-placeholder:before{font-style:italic;margin-left:1px}}","",{version:3,sources:["webpack://./../ckeditor5-engine/theme/placeholder.css","webpack://./../ckeditor5-ui/theme/mixins/_mediacolors.css","webpack://./../ckeditor5-theme-lark/theme/ckeditor5-engine/placeholder.css"],names:[],mappings:"AAMA,uCAEC,iBAWD,CATC,qDAIC,8BAA+B,CAF/B,MAAO,CAKP,mBAAoB,CANpB,iBAAkB,CAElB,OAKD,CAKA,wCACC,YACD,CAQD,iCACC,iBACD,CC7BC,8BACC,uCCOA,yCDLA,CACD,CCOA,qDACC,WAmBD,CDvBA,4BACC,qDCMC,6CDJD,CACD,CAZA,8BACC,qDCsBC,iBAAkB,CAMlB,eD1BD,CACD",sourcesContent:[`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* See ckeditor/ckeditor5#936. */
.ck.ck-placeholder,
.ck .ck-placeholder {
	position: relative;

	&::before {
		position: absolute;
		left: 0;
		right: 0;
		content: attr(data-placeholder);

		/* See ckeditor/ckeditor5#469. */
		pointer-events: none;
	}
}

/* See ckeditor/ckeditor5#1987. */
.ck.ck-read-only .ck-placeholder {
	&::before {
		display: none;
	}
}

/*
 * Rules for the \`ck-placeholder\` are loaded before the rules for \`ck-reset_all\` in the base CKEditor 5 DLL build.
 * This fix overwrites the incorrectly set \`position: static\` from \`ck-reset_all\`.
 * See https://github.com/ckeditor/ckeditor5/issues/11418.
 */
.ck.ck-reset_all .ck-placeholder {
	position: relative;
}
`,`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

@define-mixin ck-media-forced-colors {
	@media (forced-colors: active) {
		& {
			@mixin-content;
		}
	}
}

@define-mixin ck-media-default-colors {
	@media (forced-colors: none) {
		& {
			@mixin-content;
		}
	}
}
`,`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

@import "@ckeditor/ckeditor5-ui/theme/mixins/_mediacolors.css";

/* See ckeditor/ckeditor5#936. */
.ck.ck-placeholder, .ck .ck-placeholder {
	@mixin ck-media-forced-colors {
		/*
		 * This is needed for Edge on Windows to use the right color for the placeholder content (::before).
		 * See https://github.com/ckeditor/ckeditor5/issues/14907.
		 */
		forced-color-adjust: preserve-parent-color;
	}

	&::before {
		cursor: text;

		@mixin ck-media-default-colors {
			color: var(--ck-color-engine-placeholder-text);
		}

		@mixin ck-media-forced-colors {
			/*
			 * In the high contrast mode there is no telling between regular and placeholder text. Using
			 * italic text to address that issue. See https://github.com/ckeditor/ckeditor5/issues/14907.
			 */
			font-style: italic;

			/*
			 * Without this margin, the caret will not show up and blink when the user puts the selection
			 * in the placeholder (Edge on Windows). See https://github.com/ckeditor/ckeditor5/issues/14907.
			 */
			margin-left: 1px;
		}
	}
}
`],sourceRoot:""}]);const b=f},8264:(E,A,m)=>{m.d(A,{A:()=>b});var x=m(9372),y=m.n(x),_=m(935),f=m.n(_)()(y());f.push([E.id,".ck.ck-editor__editable span[data-ck-unsafe-element]{display:none}","",{version:3,sources:["webpack://./../ckeditor5-engine/theme/renderer.css"],names:[],mappings:"AAMA,qDACC,YACD",sourcesContent:[`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* Elements marked by the Renderer as hidden should be invisible in the editor. */
.ck.ck-editor__editable span[data-ck-unsafe-element] {
	display: none;
}
`],sourceRoot:""}]);const b=f},6269:(E,A,m)=>{m.d(A,{A:()=>b});var x=m(9372),y=m.n(x),_=m(935),f=m.n(_)()(y());f.push([E.id,".ck.ck-heading_heading1{font-size:20px}.ck.ck-heading_heading2{font-size:17px}.ck.ck-heading_heading3{font-size:14px}.ck[class*=ck-heading_heading]{font-weight:700}.ck.ck-dropdown.ck-heading-dropdown .ck-dropdown__button .ck-button__label{width:8em}.ck.ck-dropdown.ck-heading-dropdown .ck-dropdown__panel .ck-list__item{min-width:18em}","",{version:3,sources:["webpack://./../ckeditor5-heading/theme/heading.css","webpack://./../ckeditor5-theme-lark/theme/ckeditor5-heading/heading.css"],names:[],mappings:"AAKA,wBACC,cACD,CAEA,wBACC,cACD,CAEA,wBACC,cACD,CAEA,+BACC,eACD,CCZC,2EACC,SACD,CAEA,uEACC,cACD",sourcesContent:[`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

.ck.ck-heading_heading1 {
	font-size: 20px;
}

.ck.ck-heading_heading2 {
	font-size: 17px;
}

.ck.ck-heading_heading3 {
	font-size: 14px;
}

.ck[class*="ck-heading_heading"] {
	font-weight: bold;
}
`,`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* Resize dropdown's button label. */
.ck.ck-dropdown.ck-heading-dropdown {
	& .ck-dropdown__button .ck-button__label {
		width: 8em;
	}

	& .ck-dropdown__panel .ck-list__item {
		min-width: 18em;
	}
}
`],sourceRoot:""}]);const b=f},265:(E,A,m)=>{m.d(A,{A:()=>b});var x=m(9372),y=m.n(x),_=m(935),f=m.n(_)()(y());f.push([E.id,".ck-content .image{clear:both;display:table;margin:.9em auto;min-width:50px;text-align:center}.ck-content .image img{display:block;height:auto;margin:0 auto;max-width:100%;min-width:100%}.ck-content .image-inline{align-items:flex-start;display:inline-flex;max-width:100%}.ck-content .image-inline picture{display:flex}.ck-content .image-inline img,.ck-content .image-inline picture{flex-grow:1;flex-shrink:1;max-width:100%}.ck.ck-editor__editable .image>figcaption.ck-placeholder:before{overflow:hidden;padding-left:inherit;padding-right:inherit;text-overflow:ellipsis;white-space:nowrap}.ck.ck-editor__editable .image{z-index:1}.ck.ck-editor__editable .image.ck-widget_selected{z-index:2}.ck.ck-editor__editable .image-inline{z-index:1}.ck.ck-editor__editable .image-inline.ck-widget_selected{z-index:2}.ck.ck-editor__editable .image-inline.ck-widget_selected ::selection{display:none}.ck.ck-editor__editable .image-inline img{height:auto}.ck.ck-editor__editable td .image-inline img,.ck.ck-editor__editable th .image-inline img{max-width:none}","",{version:3,sources:["webpack://./../ckeditor5-image/theme/image.css"],names:[],mappings:"AAMC,mBAEC,UAAW,CADX,aAAc,CAOd,gBAAkB,CAGlB,cAAe,CARf,iBA2BD,CAjBC,uBAEC,aAAc,CAad,WAAY,CAVZ,aAAc,CAGd,cAAe,CAGf,cAKD,CAGD,0BAYC,sBAAuB,CANvB,mBAAoB,CAGpB,cAoBD,CAdC,kCACC,YACD,CAGA,gEAGC,WAAY,CACZ,aAAc,CAGd,cACD,CAUD,gEASC,eAAgB,CARhB,oBAAqB,CACrB,qBAAsB,CAQtB,sBAAuB,CAFvB,kBAGD,CAKA,+BACC,SASD,CAHC,kDACC,SACD,CAMD,sCACC,SAkBD,CAZC,yDACC,SAUD,CAHC,qEACC,YACD,CAMF,0CACC,WACD,CAMC,0FACC,cACD",sourcesContent:[`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

.ck-content {
	& .image {
		display: table;
		clear: both;
		text-align: center;

		/* Make sure there is some space between the content and the image. Center image by default. */
		/* The first value should be equal to --ck-spacing-large variable if used in the editor context
	 	to avoid the content jumping (See https://github.com/ckeditor/ckeditor5/issues/9825). */
		margin: 0.9em auto;

		/* Make sure the caption will be displayed properly (See: https://github.com/ckeditor/ckeditor5/issues/1870). */
		min-width: 50px;

		& img {
			/* Prevent unnecessary margins caused by line-height (see #44). */
			display: block;

			/* Center the image if its width is smaller than the content's width. */
			margin: 0 auto;

			/* Make sure the image never exceeds the size of the parent container (ckeditor/ckeditor5-ui#67). */
			max-width: 100%;

			/* Make sure the image is never smaller than the parent container (See: https://github.com/ckeditor/ckeditor5/issues/9300). */
			min-width: 100%;

			/* Keep proportions of the block image if the height is set and the image is wider than the editor width.
			See https://github.com/ckeditor/ckeditor5/issues/14542. */
			height: auto;
		}
	}

	& .image-inline {
		/*
		 * Normally, the .image-inline would have "display: inline-block" and "img { width: 100% }" (to follow the wrapper while resizing).
		 * Unfortunately, together with "srcset", it gets automatically stretched up to the width of the editing root.
		 * This strange behavior does not happen with inline-flex.
		 */
		display: inline-flex;

		/* While being resized, don't allow the image to exceed the width of the editing root. */
		max-width: 100%;

		/* This is required by Safari to resize images in a sensible way. Without this, the browser breaks the ratio. */
		align-items: flex-start;

		/* When the picture is present it must act as a flex container to let the img resize properly */
		& picture {
			display: flex;
		}

		/* When the picture is present, it must act like a resizable img. */
		& picture,
		& img {
			/* This is necessary for the img to span the entire .image-inline wrapper and to resize properly. */
			flex-grow: 1;
			flex-shrink: 1;

			/* Prevents overflowing the editing root boundaries when an inline image is very wide. */
			max-width: 100%;
		}
	}
}

.ck.ck-editor__editable {
	/*
	 * Inhertit the content styles padding of the <figcaption> in case the integration overrides \`text-align: center\`
	 * of \`.image\` (e.g. to the left/right). This ensures the placeholder stays at the padding just like the native
	 * caret does, and not at the edge of <figcaption>.
	 */
	& .image > figcaption.ck-placeholder::before {
		padding-left: inherit;
		padding-right: inherit;

		/*
		 * Make sure the image caption placeholder doesn't overflow the placeholder area.
		 * See https://github.com/ckeditor/ckeditor5/issues/9162.
		 */
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/*
	 * See https://github.com/ckeditor/ckeditor5/issues/15115.
	 */
	& .image {
		z-index: 1;

		/*
		 * Make sure the selected image always stays on top of its siblings.
		 * See https://github.com/ckeditor/ckeditor5/issues/9108.
		 */
		&.ck-widget_selected {
			z-index: 2;
		}
	}

	/*
	 * See https://github.com/ckeditor/ckeditor5/issues/15115.
	 */
	& .image-inline {
		z-index: 1;

		/*
		 * Make sure the selected inline image always stays on top of its siblings.
		 * See https://github.com/ckeditor/ckeditor5/issues/9108.
		 */
		&.ck-widget_selected {
			z-index: 2;

			/*
			 * Make sure the native browser selection style is not displayed.
			 * Inline image widgets have their own styles for the selected state and
			 * leaving this up to the browser is asking for a visual collision.
			 */
			& ::selection {
				display: none;
			}
		}
	}

	/* Keep proportions of the inline image if the height is set and the image is wider than the editor width.
	See https://github.com/ckeditor/ckeditor5/issues/14542. */
	& .image-inline img {
		height: auto;
	}

	/* The inline image nested in the table should have its original size if not resized.
	See https://github.com/ckeditor/ckeditor5/issues/9117. */
	& td,
	& th {
		& .image-inline img {
			max-width: none;
		}
	}
}
`],sourceRoot:""}]);const b=f},5247:(E,A,m)=>{m.d(A,{A:()=>b});var x=m(9372),y=m.n(x),_=m(935),f=m.n(_)()(y());f.push([E.id,":root{--ck-color-image-caption-background:#f7f7f7;--ck-color-image-caption-text:#333;--ck-color-image-caption-highlighted-background:#fd0}.ck-content .image>figcaption{background-color:var(--ck-color-image-caption-background);caption-side:bottom;color:var(--ck-color-image-caption-text);display:table-caption;font-size:.75em;outline-offset:-1px;padding:.6em;word-break:break-word}@media (forced-colors:active){.ck-content .image>figcaption{background-color:unset;color:unset}}@media (forced-colors:none){.ck.ck-editor__editable .image>figcaption.image__caption_highlighted{animation:ck-image-caption-highlight .6s ease-out}}@media (prefers-reduced-motion:reduce){.ck.ck-editor__editable .image>figcaption.image__caption_highlighted{animation:none}}@keyframes ck-image-caption-highlight{0%{background-color:var(--ck-color-image-caption-highlighted-background)}to{background-color:var(--ck-color-image-caption-background)}}","",{version:3,sources:["webpack://./../ckeditor5-image/theme/imagecaption.css","webpack://./../ckeditor5-ui/theme/mixins/_mediacolors.css"],names:[],mappings:"AAOA,MACC,2CAAoD,CACpD,kCAA8C,CAC9C,oDACD,CAGA,8BAKC,yDAA0D,CAH1D,mBAAoB,CAEpB,wCAAyC,CAHzC,qBAAsB,CAMtB,eAAgB,CAChB,mBAAoB,CAFpB,YAAa,CAHb,qBAYD,CAJC,8BAXD,8BAYE,sBAAuB,CACvB,WAEF,CADC,CCdA,4BACC,qEDmBA,iDCjBA,CACD,CDmBA,uCALD,qEAME,cAEF,CADC,CAGD,sCACC,GACC,qEACD,CAEA,GACC,yDACD,CACD",sourcesContent:[`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

@import "@ckeditor/ckeditor5-ui/theme/mixins/_mediacolors.css";

:root {
	--ck-color-image-caption-background: hsl(0, 0%, 97%);
	--ck-color-image-caption-text: hsl(0, 0%, 20%);
	--ck-color-image-caption-highlighted-background: hsl(52deg 100% 50%);
}

/* Content styles */
.ck-content .image > figcaption {
	display: table-caption;
	caption-side: bottom;
	word-break: break-word;
	color: var(--ck-color-image-caption-text);
	background-color: var(--ck-color-image-caption-background);
	padding: .6em;
	font-size: .75em;
	outline-offset: -1px;

	/* Improve placeholder rendering in high-constrast mode (https://github.com/ckeditor/ckeditor5/issues/14907). */
	@media (forced-colors: active) {
		background-color: unset;
		color: unset;
	}
}

/* Editing styles */
.ck.ck-editor__editable .image > figcaption.image__caption_highlighted {
	@mixin ck-media-default-colors {
		animation: ck-image-caption-highlight .6s ease-out;
	}

	@media (prefers-reduced-motion: reduce) {
		animation: none;
	}
}

@keyframes ck-image-caption-highlight {
	0% {
		background-color: var(--ck-color-image-caption-highlighted-background);
	}

	100% {
		background-color: var(--ck-color-image-caption-background);
	}
}
`,`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

@define-mixin ck-media-forced-colors {
	@media (forced-colors: active) {
		& {
			@mixin-content;
		}
	}
}

@define-mixin ck-media-default-colors {
	@media (forced-colors: none) {
		& {
			@mixin-content;
		}
	}
}
`],sourceRoot:""}]);const b=f},4642:(E,A,m)=>{m.d(A,{A:()=>b});var x=m(9372),y=m.n(x),_=m(935),f=m.n(_)()(y());f.push([E.id,".ck.ck-image-custom-resize-form{align-items:flex-start;display:flex;flex-direction:row;flex-wrap:nowrap}.ck.ck-image-custom-resize-form .ck-labeled-field-view{display:inline-block}.ck.ck-image-custom-resize-form .ck-label{display:none}@media screen and (max-width:600px){.ck.ck-image-custom-resize-form{flex-wrap:wrap}.ck.ck-image-custom-resize-form .ck-labeled-field-view{flex-basis:100%}.ck.ck-image-custom-resize-form .ck-button{flex-basis:50%}}","",{version:3,sources:["webpack://./../ckeditor5-image/theme/imagecustomresizeform.css","webpack://./../ckeditor5-ui/theme/mixins/_rwd.css"],names:[],mappings:"AAOA,gCAIC,sBAAuB,CAHvB,YAAa,CACb,kBAAmB,CACnB,gBAsBD,CAnBC,uDACC,oBACD,CAEA,0CACC,YACD,CCbA,oCDCD,gCAeE,cAUF,CARE,uDACC,eACD,CAEA,2CACC,cACD,CCtBD",sourcesContent:[`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

@import "@ckeditor/ckeditor5-ui/theme/mixins/_rwd.css";

.ck.ck-image-custom-resize-form {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: flex-start;

	& .ck-labeled-field-view {
		display: inline-block;
	}

	& .ck-label {
		display: none;
	}

	@mixin ck-media-phone {
		flex-wrap: wrap;

		& .ck-labeled-field-view {
			flex-basis: 100%;
		}

		& .ck-button {
			flex-basis: 50%;
		}
	}
}
`,`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

@define-mixin ck-media-phone {
	@media screen and (max-width: 600px) {
		@mixin-content;
	}
}
`],sourceRoot:""}]);const b=f},3350:(E,A,m)=>{m.d(A,{A:()=>b});var x=m(9372),y=m.n(x),_=m(935),f=m.n(_)()(y());f.push([E.id,".ck.ck-image-insert-url .ck-image-insert-url__action-row{display:grid;grid-template-columns:repeat(2,1fr)}:root{--ck-image-insert-insert-by-url-width:250px}.ck.ck-image-insert-url{--ck-input-width:100%}.ck.ck-image-insert-url .ck-image-insert-url__action-row{grid-column-gap:var(--ck-spacing-large);margin-top:var(--ck-spacing-large)}.ck.ck-image-insert-url .ck-image-insert-url__action-row .ck-button-cancel,.ck.ck-image-insert-url .ck-image-insert-url__action-row .ck-button-save{justify-content:center;min-width:auto}.ck.ck-image-insert-url .ck-image-insert-url__action-row .ck-button .ck-button__label{color:var(--ck-color-text)}.ck.ck-image-insert-form>.ck.ck-button{display:block;padding:var(--ck-list-button-padding);width:100%}[dir=ltr] .ck.ck-image-insert-form>.ck.ck-button{text-align:left}[dir=rtl] .ck.ck-image-insert-form>.ck.ck-button{text-align:right}.ck.ck-image-insert-form>.ck.ck-collapsible:not(:first-child){border-top:1px solid var(--ck-color-base-border)}.ck.ck-image-insert-form>.ck.ck-collapsible:not(:last-child){border-bottom:1px solid var(--ck-color-base-border)}.ck.ck-image-insert-form>.ck.ck-collapsible,.ck.ck-image-insert-form>.ck.ck-image-insert-url{min-width:var(--ck-image-insert-insert-by-url-width)}.ck.ck-image-insert-form>.ck.ck-image-insert-url{padding:var(--ck-spacing-large)}.ck.ck-image-insert-form:focus{outline:none}","",{version:3,sources:["webpack://./../ckeditor5-image/theme/imageinsert.css","webpack://./../ckeditor5-theme-lark/theme/ckeditor5-image/imageinsert.css"],names:[],mappings:"AAMC,yDACC,YAAa,CACb,mCACD,CCFD,MACC,2CACD,CAEA,wBACC,qBAgBD,CAdC,yDACC,uCAAwC,CACxC,kCAWD,CATC,oJAEC,sBAAuB,CACvB,cACD,CAEA,sFACC,0BACD,CAKD,uCACC,aAAc,CAEd,qCAAsC,CADtC,UAUD,CAZA,iDAME,eAMF,CAZA,iDAUE,gBAEF,CAGC,8DACC,gDACD,CAEA,6DACC,mDACD,CAMD,6FAJC,oDAOD,CAHA,iDAEC,+BACD,CAEA,+BACC,YACD",sourcesContent:[`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

.ck.ck-image-insert-url {
	& .ck-image-insert-url__action-row {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
	}
}
`,`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

@import "@ckeditor/ckeditor5-ui/theme/mixins/_dir.css";

:root {
	--ck-image-insert-insert-by-url-width: 250px;
}

.ck.ck-image-insert-url {
	--ck-input-width: 100%;

	& .ck-image-insert-url__action-row {
		grid-column-gap: var(--ck-spacing-large);
		margin-top: var(--ck-spacing-large);

		& .ck-button-save,
		& .ck-button-cancel {
			justify-content: center;
			min-width: auto;
		}

		& .ck-button .ck-button__label {
			color: var(--ck-color-text);
		}
	}
}

.ck.ck-image-insert-form {
	& > .ck.ck-button {
		display: block;
		width: 100%;
		padding: var(--ck-list-button-padding);

		@mixin ck-dir ltr {
			text-align: left;
		}

		@mixin ck-dir rtl {
			text-align: right;
		}
	}

	& > .ck.ck-collapsible {
		&:not(:first-child) {
			border-top: 1px solid var(--ck-color-base-border);
		}

		&:not(:last-child) {
			border-bottom: 1px solid var(--ck-color-base-border);
		}

		min-width: var(--ck-image-insert-insert-by-url-width);
	}

	/* This is the case when there are no other integrations configured than insert by URL */
	& > .ck.ck-image-insert-url {
		min-width: var(--ck-image-insert-insert-by-url-width);
		padding: var(--ck-spacing-large);
	}

	&:focus {
		outline: none;
	}
}
`],sourceRoot:""}]);const b=f},7378:(E,A,m)=>{m.d(A,{A:()=>b});var x=m(9372),y=m.n(x),_=m(935),f=m.n(_)()(y());f.push([E.id,".ck.ck-editor__editable img.image_placeholder{background-size:100% 100%}","",{version:3,sources:["webpack://./../ckeditor5-image/theme/imageplaceholder.css"],names:[],mappings:"AAMC,8CACC,yBACD",sourcesContent:[`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

.ck.ck-editor__editable {
	& img.image_placeholder {
		background-size: 100% 100%;
	}
}
`],sourceRoot:""}]);const b=f},3469:(E,A,m)=>{m.d(A,{A:()=>b});var x=m(9372),y=m.n(x),_=m(935),f=m.n(_)()(y());f.push([E.id,".ck-content img.image_resized{height:auto}.ck-content .image.image_resized{box-sizing:border-box;display:block;max-width:100%}.ck-content .image.image_resized img{width:100%}.ck-content .image.image_resized>figcaption{display:block}.ck.ck-editor__editable td .image-inline.image_resized img,.ck.ck-editor__editable th .image-inline.image_resized img{max-width:100%}[dir=ltr] .ck.ck-button.ck-button_with-text.ck-resize-image-button .ck-button__icon{margin-right:var(--ck-spacing-standard)}[dir=rtl] .ck.ck-button.ck-button_with-text.ck-resize-image-button .ck-button__icon{margin-left:var(--ck-spacing-standard)}.ck.ck-dropdown .ck-button.ck-resize-image-button .ck-button__label{width:4em}","",{version:3,sources:["webpack://./../ckeditor5-image/theme/imageresize.css"],names:[],mappings:"AAMA,8BACC,WACD,CAEA,iCAQC,qBAAsB,CADtB,aAAc,CANd,cAkBD,CATC,qCAEC,UACD,CAEA,4CAEC,aACD,CAQC,sHACC,cACD,CAIF,oFACC,uCACD,CAEA,oFACC,sCACD,CAEA,oEACC,SACD",sourcesContent:[`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* Preserve aspect ratio of the resized image after introducing image height attribute. */
.ck-content img.image_resized {
	height: auto;
}

.ck-content .image.image_resized {
	max-width: 100%;
	/*
	The \`<figure>\` element for resized images must not use \`display:table\` as browsers do not support \`max-width\` for it well.
	See https://stackoverflow.com/questions/4019604/chrome-safari-ignoring-max-width-in-table/14420691#14420691 for more.
	Fortunately, since we control the width, there is no risk that the image will look bad.
	*/
	display: block;
	box-sizing: border-box;

	& img {
		/* For resized images it is the \`<figure>\` element that determines the image width. */
		width: 100%;
	}

	& > figcaption {
		/* The \`<figure>\` element uses \`display:block\`, so \`<figcaption>\` also has to. */
		display: block;
	}
}

.ck.ck-editor__editable {
	/* The resized inline image nested in the table should respect its parent size.
	See https://github.com/ckeditor/ckeditor5/issues/9117. */
	& td,
	& th {
		& .image-inline.image_resized img {
			max-width: 100%;
		}
	}
}

[dir="ltr"] .ck.ck-button.ck-button_with-text.ck-resize-image-button .ck-button__icon {
	margin-right: var(--ck-spacing-standard);
}

[dir="rtl"] .ck.ck-button.ck-button_with-text.ck-resize-image-button .ck-button__icon {
	margin-left: var(--ck-spacing-standard);
}

.ck.ck-dropdown .ck-button.ck-resize-image-button .ck-button__label {
	width: 4em;
}
`],sourceRoot:""}]);const b=f},6386:(E,A,m)=>{m.d(A,{A:()=>b});var x=m(9372),y=m.n(x),_=m(935),f=m.n(_)()(y());f.push([E.id,":root{--ck-image-style-spacing:1.5em;--ck-inline-image-style-spacing:calc(var(--ck-image-style-spacing)/2)}.ck-content .image-style-block-align-left,.ck-content .image-style-block-align-right{max-width:calc(100% - var(--ck-image-style-spacing))}.ck-content .image-style-align-left,.ck-content .image-style-align-right{clear:none}.ck-content .image-style-side{float:right;margin-left:var(--ck-image-style-spacing);max-width:50%}.ck-content .image-style-align-left{float:left;margin-right:var(--ck-image-style-spacing)}.ck-content .image-style-align-center{margin-left:auto;margin-right:auto}.ck-content .image-style-align-right{float:right;margin-left:var(--ck-image-style-spacing)}.ck-content .image-style-block-align-right{margin-left:auto;margin-right:0}.ck-content .image-style-block-align-left{margin-left:0;margin-right:auto}.ck-content p+.image-style-align-left,.ck-content p+.image-style-align-right,.ck-content p+.image-style-side{margin-top:0}.ck-content .image-inline.image-style-align-left,.ck-content .image-inline.image-style-align-right{margin-bottom:var(--ck-inline-image-style-spacing);margin-top:var(--ck-inline-image-style-spacing)}.ck-content .image-inline.image-style-align-left{margin-right:var(--ck-inline-image-style-spacing)}.ck-content .image-inline.image-style-align-right{margin-left:var(--ck-inline-image-style-spacing)}.ck.ck-splitbutton.ck-splitbutton_flatten.ck-splitbutton_open>.ck-splitbutton__action:not(.ck-disabled),.ck.ck-splitbutton.ck-splitbutton_flatten.ck-splitbutton_open>.ck-splitbutton__arrow:not(.ck-disabled),.ck.ck-splitbutton.ck-splitbutton_flatten.ck-splitbutton_open>.ck-splitbutton__arrow:not(.ck-disabled):not(:hover),.ck.ck-splitbutton.ck-splitbutton_flatten:hover>.ck-splitbutton__action:not(.ck-disabled),.ck.ck-splitbutton.ck-splitbutton_flatten:hover>.ck-splitbutton__arrow:not(.ck-disabled),.ck.ck-splitbutton.ck-splitbutton_flatten:hover>.ck-splitbutton__arrow:not(.ck-disabled):not(:hover){background-color:var(--ck-color-button-on-background)}.ck.ck-splitbutton.ck-splitbutton_flatten.ck-splitbutton_open>.ck-splitbutton__action:not(.ck-disabled):after,.ck.ck-splitbutton.ck-splitbutton_flatten.ck-splitbutton_open>.ck-splitbutton__arrow:not(.ck-disabled):after,.ck.ck-splitbutton.ck-splitbutton_flatten.ck-splitbutton_open>.ck-splitbutton__arrow:not(.ck-disabled):not(:hover):after,.ck.ck-splitbutton.ck-splitbutton_flatten:hover>.ck-splitbutton__action:not(.ck-disabled):after,.ck.ck-splitbutton.ck-splitbutton_flatten:hover>.ck-splitbutton__arrow:not(.ck-disabled):after,.ck.ck-splitbutton.ck-splitbutton_flatten:hover>.ck-splitbutton__arrow:not(.ck-disabled):not(:hover):after{display:none}.ck.ck-splitbutton.ck-splitbutton_flatten.ck-splitbutton_open:hover>.ck-splitbutton__action:not(.ck-disabled),.ck.ck-splitbutton.ck-splitbutton_flatten.ck-splitbutton_open:hover>.ck-splitbutton__arrow:not(.ck-disabled),.ck.ck-splitbutton.ck-splitbutton_flatten.ck-splitbutton_open:hover>.ck-splitbutton__arrow:not(.ck-disabled):not(:hover){background-color:var(--ck-color-button-on-hover-background)}","",{version:3,sources:["webpack://./../ckeditor5-image/theme/imagestyle.css"],names:[],mappings:"AAKA,MACC,8BAA+B,CAC/B,qEACD,CAMC,qFAEC,oDACD,CAIA,yEAEC,UACD,CAEA,8BACC,WAAY,CACZ,yCAA0C,CAC1C,aACD,CAEA,oCACC,UAAW,CACX,0CACD,CAEA,sCACC,gBAAiB,CACjB,iBACD,CAEA,qCACC,WAAY,CACZ,yCACD,CAEA,2CAEC,gBAAiB,CADjB,cAED,CAEA,0CACC,aAAc,CACd,iBACD,CAGA,6GAGC,YACD,CAGC,mGAGC,kDAAmD,CADnD,+CAED,CAEA,iDACC,iDACD,CAEA,kDACC,gDACD,CAUC,0lBAGC,qDAKD,CAHC,8nBACC,YACD,CAKD,oVAGC,2DACD",sourcesContent:[`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

:root {
	--ck-image-style-spacing: 1.5em;
	--ck-inline-image-style-spacing: calc(var(--ck-image-style-spacing) / 2);
}

.ck-content {
	/* Provides a minimal side margin for the left and right aligned images, so that the user has a visual feedback
	confirming successful application of the style if image width exceeds the editor's size.
	See https://github.com/ckeditor/ckeditor5/issues/9342 */
	& .image-style-block-align-left,
	& .image-style-block-align-right {
		max-width: calc(100% - var(--ck-image-style-spacing));
	}

	/* Allows displaying multiple floating images in the same line.
	See https://github.com/ckeditor/ckeditor5/issues/9183#issuecomment-804988132 */
	& .image-style-align-left,
	& .image-style-align-right {
		clear: none;
	}

	& .image-style-side {
		float: right;
		margin-left: var(--ck-image-style-spacing);
		max-width: 50%;
	}

	& .image-style-align-left {
		float: left;
		margin-right: var(--ck-image-style-spacing);
	}

	& .image-style-align-center {
		margin-left: auto;
		margin-right: auto;
	}

	& .image-style-align-right {
		float: right;
		margin-left: var(--ck-image-style-spacing);
	}

	& .image-style-block-align-right {
		margin-right: 0;
		margin-left: auto;
	}

	& .image-style-block-align-left {
		margin-left: 0;
		margin-right: auto;
	}

	/* Simulates margin collapsing with the preceding paragraph, which does not work for the floating elements. */
	& p + .image-style-align-left,
	& p + .image-style-align-right,
	& p + .image-style-side {
		margin-top: 0;
	}

	& .image-inline {
		&.image-style-align-left,
		&.image-style-align-right {
			margin-top: var(--ck-inline-image-style-spacing);
			margin-bottom: var(--ck-inline-image-style-spacing);
		}

		&.image-style-align-left {
			margin-right: var(--ck-inline-image-style-spacing);
		}

		&.image-style-align-right {
			margin-left: var(--ck-inline-image-style-spacing);
		}
	}
}

.ck.ck-splitbutton {
	/* The button should display as a regular drop-down if the action button
	is forced to fire the same action as the arrow button. */
	&.ck-splitbutton_flatten {
		&:hover,
		&.ck-splitbutton_open {
			& > .ck-splitbutton__action:not(.ck-disabled),
			& > .ck-splitbutton__arrow:not(.ck-disabled),
			& > .ck-splitbutton__arrow:not(.ck-disabled):not(:hover) {
				background-color: var(--ck-color-button-on-background);

				&::after {
					display: none;
				}
			}
		}

		&.ck-splitbutton_open:hover {
			& > .ck-splitbutton__action:not(.ck-disabled),
			& > .ck-splitbutton__arrow:not(.ck-disabled),
			& > .ck-splitbutton__arrow:not(.ck-disabled):not(:hover) {
				background-color: var(--ck-color-button-on-hover-background);
			}
		}
	}
}
`],sourceRoot:""}]);const b=f},7693:(E,A,m)=>{m.d(A,{A:()=>b});var x=m(9372),y=m.n(x),_=m(935),f=m.n(_)()(y());f.push([E.id,'.ck-image-upload-complete-icon{border-radius:50%;display:block;position:absolute;right:min(var(--ck-spacing-medium),6%);top:min(var(--ck-spacing-medium),6%);z-index:1}.ck-image-upload-complete-icon:after{content:"";position:absolute}:root{--ck-color-image-upload-icon:#fff;--ck-color-image-upload-icon-background:#008a00;--ck-image-upload-icon-size:20;--ck-image-upload-icon-width:2px;--ck-image-upload-icon-is-visible:clamp(0px,100% - 50px,1px)}.ck-image-upload-complete-icon{animation-delay:0ms,3s;animation-duration:.5s,.5s;animation-fill-mode:forwards,forwards;animation-name:ck-upload-complete-icon-show,ck-upload-complete-icon-hide;background:var(--ck-color-image-upload-icon-background);font-size:calc(1px*var(--ck-image-upload-icon-size));height:calc(var(--ck-image-upload-icon-is-visible)*var(--ck-image-upload-icon-size));opacity:0;overflow:hidden;width:calc(var(--ck-image-upload-icon-is-visible)*var(--ck-image-upload-icon-size))}.ck-image-upload-complete-icon:after{animation-delay:.5s;animation-duration:.5s;animation-fill-mode:forwards;animation-name:ck-upload-complete-icon-check;border-right:var(--ck-image-upload-icon-width) solid var(--ck-color-image-upload-icon);border-top:var(--ck-image-upload-icon-width) solid var(--ck-color-image-upload-icon);box-sizing:border-box;height:0;left:25%;opacity:0;top:50%;transform:scaleX(-1) rotate(135deg);transform-origin:left top;width:0}@media (prefers-reduced-motion:reduce){.ck-image-upload-complete-icon{animation-duration:0ms}.ck-image-upload-complete-icon:after{animation:none;height:.45em;opacity:1;width:.3em}}@keyframes ck-upload-complete-icon-show{0%{opacity:0}to{opacity:1}}@keyframes ck-upload-complete-icon-hide{0%{opacity:1}to{opacity:0}}@keyframes ck-upload-complete-icon-check{0%{height:0;opacity:1;width:0}33%{height:0;width:.3em}to{height:.45em;opacity:1;width:.3em}}',"",{version:3,sources:["webpack://./../ckeditor5-image/theme/imageuploadicon.css","webpack://./../ckeditor5-theme-lark/theme/ckeditor5-image/imageuploadicon.css"],names:[],mappings:"AAKA,+BAUC,iBAAkB,CATlB,aAAc,CACd,iBAAkB,CAOlB,sCAAwC,CADxC,oCAAsC,CAGtC,SAMD,CAJC,qCACC,UAAW,CACX,iBACD,CChBD,MACC,iCAA8C,CAC9C,+CAA4D,CAG5D,8BAA+B,CAC/B,gCAAiC,CACjC,4DACD,CAEA,+BAWC,sBAA4B,CAN5B,0BAAgC,CADhC,qCAAuC,CADvC,wEAA0E,CAD1E,uDAAwD,CAMxD,oDAAuD,CAWvD,oFAAuF,CAlBvF,SAAU,CAgBV,eAAgB,CAChB,mFAqCD,CAjCC,qCAgBC,mBAAsB,CADtB,sBAAyB,CAEzB,4BAA6B,CAH7B,4CAA6C,CAF7C,sFAAuF,CADvF,oFAAqF,CASrF,qBAAsB,CAdtB,QAAS,CAJT,QAAS,CAGT,SAAU,CADV,OAAQ,CAKR,mCAAoC,CACpC,yBAA0B,CAH1B,OAcD,CAEA,uCA7CD,+BA8CE,sBASF,CAPE,qCACC,cAAe,CAGf,YAAc,CAFd,SAAU,CACV,UAED,CACD,CAGD,wCACC,GACC,SACD,CAEA,GACC,SACD,CACD,CAEA,wCACC,GACC,SACD,CAEA,GACC,SACD,CACD,CAEA,yCACC,GAGC,QAAS,CAFT,SAAU,CACV,OAED,CACA,IAEC,QAAS,CADT,UAED,CACA,GAGC,YAAc,CAFd,SAAU,CACV,UAED,CACD",sourcesContent:[`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

.ck-image-upload-complete-icon {
	display: block;
	position: absolute;

	/*
	 * Smaller images should have the icon closer to the border.
	 * Match the icon position with the linked image indicator brought by the link image feature.
	 */
	top: min(var(--ck-spacing-medium), 6%);
	right: min(var(--ck-spacing-medium), 6%);
	border-radius: 50%;
	z-index: 1;

	&::after {
		content: "";
		position: absolute;
	}
}
`,`/*
 * Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

:root {
	--ck-color-image-upload-icon: hsl(0, 0%, 100%);
	--ck-color-image-upload-icon-background: hsl(120, 100%, 27%);

	/* Match the icon size with the linked image indicator brought by the link image feature. */
	--ck-image-upload-icon-size: 20;
	--ck-image-upload-icon-width: 2px;
	--ck-image-upload-icon-is-visible: clamp(0px, 100% - 50px, 1px);
}

.ck-image-upload-complete-icon {
	opacity: 0;
	background: var(--ck-color-image-upload-icon-background);
	animation-name: ck-upload-complete-icon-show, ck-upload-complete-icon-hide;
	animation-fill-mode: forwards, forwards;
	animation-duration: 500ms, 500ms;

	/* To make animation scalable. */
	font-size: calc(1px * var(--ck-image-upload-icon-size));

	/* Hide completed upload icon after 3 seconds. */
	animation-delay: 0ms, 3000ms;

	/*
	 * Use CSS math to simulate container queries.
	 * https://css-tricks.com/the-raven-technique-one-step-closer-to-container-queries/#what-about-showing-and-hiding-things
	 */
	overflow: hidden;
	width: calc(var(--ck-image-upload-icon-is-visible) * var(--ck-image-upload-icon-size));
	height: calc(var(--ck-image-upload-icon-is-visible) * var(--ck-image-upload-icon-size));

	/* This is check icon element made from border-width mixed with animations. */
	&::after {
		/* Because of border transformation we need to "hard code" left position. */
		left: 25%;

		top: 50%;
		opacity: 0;
		height: 0;
		width: 0;

		transform: scaleX(-1) rotate(135deg);
		transform-origin: left top;
		border-top: var(--ck-image-upload-icon-width) solid var(--ck-color-image-upload-icon);
		border-right: var(--ck-image-upload-icon-width) solid var(--ck-color-image-upload-icon);

		animation-name: ck-upload-complete-icon-check;
		animation-duration: 500ms;
		animation-delay: 500ms;
		animation-fill-mode: forwards;

		/* #1095. While reset is not providing proper box-sizing for pseudoelements, we need to handle it. */
		box-sizing: border-box;
	}

	@media (prefers-reduced-motion: reduce) {
		animation-duration: 0ms;

		&::after {
			