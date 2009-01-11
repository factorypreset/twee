function $(A){if(typeof A=="string"){return document.getElementById(A)}else{return A}}function clone(A){var B={};for(property in A){B[property]=A[property]}return B}function insertElement(A,D,F,C,E){var B=document.createElement(D);if(F){B.id=F}if(C){B.className=C}if(E){insertText(B,E)}if(A){A.appendChild(B)}return B}function insertText(A,B){return A.appendChild(document.createTextNode(B))}function removeChildren(A){while(A.hasChildNodes()){A.removeChild(A.firstChild)}}function setPageElement(C,B,A){if(place=$(C)){removeChildren(place);if(tale.has(B)){new Wikifier(place,tale.get(B).text)}else{new Wikifier(place,A)}}}function addStyle(B){if(document.createStyleSheet){document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeEnd","&nbsp;<style>"+B+"</style>")}else{var A=document.createElement("style");A.type="text/css";A.appendChild(document.createTextNode(B));document.getElementsByTagName("head")[0].appendChild(A)}}function throwError(A,B){new Wikifier(A,"'' @@ "+B+" @@ ''")}Math.easeInOut=function(A){return(1-((Math.cos(A*Math.PI)+1)/2))};String.prototype.readMacroParams=function(){var C=new RegExp("(?:\\s*)(?:(?:\"([^\"]*)\")|(?:'([^']*)')|(?:\\[\\[([^\\]]*)\\]\\])|([^\"'\\s]\\S*))","mg");var B=[];do{var A=C.exec(this);if(A){if(A[1]){B.push(A[1])}else{if(A[2]){B.push(A[2])}else{if(A[3]){B.push(A[3])}else{if(A[4]){B.push(A[4])}}}}}}while(A);return B};String.prototype.readBracketedList=function(){var B="\\[\\[([^\\]]+)\\]\\]";var A="[^\\s$]+";var E="(?:"+B+")|("+A+")";var D=new RegExp(E,"mg");var F=[];do{var C=D.exec(this);if(C){if(C[1]){F.push(C[1])}else{if(C[2]){F.push(C[2])}}}}while(C);return(F)};String.prototype.trim=function(){var A=new RegExp("^\\s*(.*?)\\s*$","mg");return(this.replace(A,"$1"))};Array.prototype.indexOf||(Array.prototype.indexOf=function(B,D){D=(D==null)?0:D;var A=this.length;for(var C=D;C<A;C++){if(this[C]==B){return C}}return -1});function fade(F,C){var H;var E=F.cloneNode(true);var G=(C.fade=="in")?1:-1;F.parentNode.replaceChild(E,F);if(C.fade=="in"){H=0;E.style.visibility="visible"}else{H=1}B(E,H);var A=window.setInterval(D,25);function D(){H+=0.05*G;B(E,Math.easeInOut(H));if(((G==1)&&(H>=1))||((G==-1)&&(H<=0))){F.style.visibility=(C.fade=="in")?"visible":"hidden";E.parentNode.replaceChild(F,E);delete E;window.clearInterval(A);if(C.onComplete){C.onComplete()}}}function B(J,I){var K=Math.floor(I*100);J.style.zoom=1;J.style.filter="alpha(opacity="+K+")";J.style.opacity=I}}function scrollWindowTo(E){var D=window.scrollY?window.scrollY:document.body.scrollTop;var G=J(E);var C=Math.abs(D-G);var B=0;var I=(D>G)?-1:1;var F=window.setInterval(H,25);function H(){B+=0.1;window.scrollTo(0,D+I*(C*Math.easeInOut(B)));if(B>=1){window.clearInterval(F)}}function J(N){var O=A(N);var P=O+N.offsetHeight;var K=window.scrollY?window.scrollY:document.body.scrollTop;var L=window.innerHeight?window.innerHeight:document.body.clientHeight;var M=K+L;if(O<K){return O}else{if(P>M){if(N.offsetHeight<L){return(O-(L-N.offsetHeight)+20)}else{return O}}else{return O}}}function A(K){var L=0;while(K.offsetParent){L+=K.offsetTop;K=K.offsetParent}return L}}function History(){this.history=[{passage:null,variables:{},hash:null}]}History.prototype.init=function(){var A=this;if(!this.restore()){this.display("Start",null)}this.hash=window.location.hash;this.interval=window.setInterval(function(){A.watchHash.apply(A)},250)};History.prototype.display=function(D,B,A){var C=tale.get(D);this.history.unshift({passage:C,variables:clone(this.history[0].variables)});this.history[0].hash=this.save();var E=C.render();if(A!="offscreen"){removeChildren($("passages"));$("passages").appendChild(E);if(A!="quietly"){fade(E,{fade:"in"})}}if((A=="quietly")||(A=="offscreen")){E.style.visibility="visible"}if(A!="offscreen"){document.title=tale.title;this.hash=this.save();if(C.title!="Start"){document.title+=": "+C.title;window.location.hash=this.hash}window.scroll(0,0)}return E};History.prototype.restart=function(){window.location.hash=""};History.prototype.save=function(C){var A="";for(var B=this.history.length-1;B>=0;B--){if((this.history[B].passage)&&(this.history[B].passage.id)){A+=this.history[B].passage.id.toString(36)+"."}}return"#"+A.substr(0,A.length-1)};History.prototype.restore=function(){try{if((window.location.hash=="")||(window.location.hash=="#")){return false}var A=window.location.hash.replace("#","").split(".");var C=[];for(var B=0;B<A.length;B++){var F=parseInt(A[B],36);if(!tale.has(F)){return false}var E=(B==A.length-1)?"":"offscreen";C.unshift(this.display(F,null,E))}return true}catch(D){return false}};History.prototype.watchHash=function(){if(window.location.hash!=this.hash){if((window.location.hash!="")&&(window.location.hash!="#")){this.history=[{passage:null,variables:{}}];removeChildren($("passages"));$("passages").style.visibility="hidden";if(!this.restore()){alert("The passage you had previously visited could not be found.")}$("passages").style.visibility="visible"}else{window.location.reload()}this.hash=window.location.hash}};var version={major:2,minor:0,revision:0,date:new Date("July 30, 2007"),extensions:{}};var tale,state;var macros={};function main(){tale=new Tale();document.title=tale.title;setPageElement("storyTitle","StoryTitle","Untitled Story");if(tale.has("StoryAuthor")){$("titleSeparator").innerHTML="<br />";setPageElement("storyAuthor","StoryAuthor","")}if(tale.has("StoryMenu")){$("storyMenu").style.display="block";setPageElement("storyMenu","StoryMenu","")}for(macro in macros){if(typeof macro.init=="function"){macro.init()}}var styles=tale.lookup("tags","stylesheet");for(var i=0;i<styles.length;i++){addStyle(styles[i].text)}var scripts=tale.lookup("tags","script");for(var i=0;i<scripts.length;i++){try{eval(scripts[i].text)}catch(e){alert("There is a technical problem with this story ("+scripts[i].title+": "+e.message+"). You may be able to continue reading, but all parts of the story may not work properly.")}}state=new History();state.init()}Interface={init:function(){main();$("snapback").onclick=Interface.showSnapback;$("restart").onclick=Interface.restart;$("share").onclick=Interface.showShare},restart:function(){if(confirm("Are you sure you want to restart this story?")){state.restart()}},showShare:function(A){Interface.hideAllMenus();Interface.showMenu(A,$("shareMenu"))},showSnapback:function(A){Interface.hideAllMenus();Interface.buildSnapback();Interface.showMenu(A,$("snapbackMenu"))},buildSnapback:function(){var C=false;removeChildren($("snapbackMenu"));for(var A=state.history.length-1;A>=0;A--){if(state.history[A].passage&&state.history[A].passage.tags.indexOf("bookmark")!=-1){var B=document.createElement("div");B.hash=state.history[A].hash;B.onclick=function(){window.location.hash=this.hash};B.innerHTML=state.history[A].passage.excerpt();$("snapbackMenu").appendChild(B);C=true}}if(!C){var B=document.createElement("div");B.innerHTML="<i>No passages available</i>";$("snapbackMenu").appendChild(B)}},hideAllMenus:function(){$("shareMenu").style.display="none";$("snapbackMenu").style.display="none"},showMenu:function(B,A){if(!B){B=window.event}var C={x:0,y:0};if(B.pageX||B.pageY){C.x=B.pageX;C.y=B.pageY}else{if(B.clientX||B.clientY){C.x=B.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;C.y=B.clientY+document.body.scrollTop+document.documentElement.scrollTop}}A.style.top=C.y+"px";A.style.left=C.x+"px";A.style.display="block";document.onclick=Interface.hideAllMenus;B.cancelBubble=true;if(B.stopPropagation){B.stopPropagation()}}};window.onload=Interface.init;version.extensions.backMacro={major:1,minor:0,revision:0};macros.back={handler:function(A,B,E){var D="";if(E[0]){for(var C=0;C<state.history.length;C++){if(state.history[C].passage.title==E[0]){D=state.history[C].hash;break}}if(D==""){throwError(A,"can't find passage \""+E[0]+'" in history');return }}else{D=state.history[1].hash}el=document.createElement("a");el.className="back";el.href=D;el.innerHTML="<b>&laquo;</b> Back";A.appendChild(el)}};version.extensions.displayMacro={major:1,minor:0,revision:0};macros.display={handler:function(A,B,C){new Wikifier(A,tale.get(C[0]).text)}};version.extensions.actionsMacro={major:1,minor:1,revision:0};macros.actions={clicked:new Object(),handler:function(A,F,G){var E=insertElement(A,"ul");for(var B=0;B<G.length;B++){if(macros.actions.clicked[G[B]]){continue}var D=insertElement(E,"li");var C=Wikifier.createInternalLink(D,G[B]);insertText(C,G[B]);C.onclick=function(){macros.actions.clicked[this.id]=true;state.display(this.id,C)}}}};version.extensions.printMacro={major:1,minor:1,revision:0};macros.print={handler:function(place,macroName,params,parser){try{var output=eval(parser.fullArgs());if(output){new Wikifier(place,output.toString())}}catch(e){throwError(place,"bad expression: "+e.message)}}};version.extensions.setMacro={major:1,minor:1,revision:0};macros.set={handler:function(A,B,C,D){macros.set.run(D.fullArgs())},run:function(expression){try{return eval(Wikifier.parse(expression))}catch(e){throwError(place,"bad expression: "+e.message)}}};version.extensions.ifMacros={major:1,minor:0,revision:0};macros["if"]={handler:function(place,macroName,params,parser){var condition=parser.fullArgs();var srcOffset=parser.source.indexOf(">>",parser.matchStart)+2;var src=parser.source.slice(srcOffset);var endPos=-1;var trueClause="";var falseClause="";for(var i=0,nesting=1,currentClause=true;i<src.length;i++){if(src.substr(i,9)=="<<endif>>"){nesting--;if(nesting==0){endPos=srcOffset+i+9;break}}if((src.substr(i,8)=="<<else>>")&&(nesting==1)){currentClause="false";i+=8}if(src.substr(i,5)=="<<if "){nesting++}if(currentClause==true){trueClause+=src.charAt(i)}else{falseClause+=src.charAt(i)}}try{if(eval(condition)){new Wikifier(place,trueClause.trim())}else{new Wikifier(place,falseClause.trim())}if(endPos!=-1){parser.nextMatch=endPos}else{throwError(place,"can't find matching endif")}}catch(e){throwError(place,"bad condition: "+e.message)}}};macros["else"]=macros.endif={handler:function(){}};version.extensions.rememberMacro={major:1,minor:0,revision:0};macros.remember={handler:function(place,macroName,params,parser){var statement=parser.fullArgs();var expire=new Date();var variable,value;macros.set.run(statement);variable=statement.match(new RegExp(Wikifier.parse("$")+"(\\w+)","i"))[1];value=eval(Wikifier.parse("$"+variable));switch(typeof value){case"string":value='"'+value.replace(/"/g,'\\"')+'"';break;case"number":case"boolean":break;default:throwError(place,"can't remember $"+variable+" ("+(typeof value)+")");return }expire.setYear(expire.getFullYear()+1);document.cookie=macros.remember.prefix+variable+"="+value+"; expires="+expire.toGMTString()},init:function(){if(tale.has("StoryTitle")){macros.remember.prefix=tale.get("StoryTitle").text+"_"}else{macros.remember.prefix="__jonah_"}var cookies=document.cookie.split(";");for(var i=0;i<cookies.length;i++){var bits=cookies[i].split("=");if(bits[0].trim().indexOf(this.prefix)==0){var statement=cookies[i].replace(this.prefix,"$");eval(Wikifier.parse(statement))}}}};version.extensions.SilentlyMacro={major:1,minor:0,revision:0};macros.silently={handler:function(G,E,F,B){var H=insertElement(null,"div");var J=B.source.indexOf(">>",B.matchStart)+2;var A=B.source.slice(J);var D=-1;var C="";for(var I=0;I<A.length;I++){if(A.substr(I,15)=="<<endsilently>>"){D=J+I+15}else{C+=A.charAt(I)}}if(D!=-1){new Wikifier(H,C);B.nextMatch=D}else{throwError(G,"can't find matching endsilently")}delete H}};macros.endsilently={handler:function(){}};function Passage(C,B,A){this.title=C;if(B){this.id=A;this.initialText=this.text=Passage.unescapeLineBreaks(B.firstChild?B.firstChild.nodeValue:"");this.tags=B.getAttribute("tags");if(typeof this.tags=="string"){this.tags=this.tags.readBracketedList()}else{this.tags=[]}}else{this.initialText=this.text="@@This passage does not exist.@@";this.tags=[]}}Passage.prototype.render=function(){var B=insertElement(null,"div","passage"+this.title,"passage");B.style.visibility="hidden";insertElement(B,"div","","header");var A=insertElement(B,"div","","content");new Wikifier(A,this.text);insertElement(B,"div","","footer");return B};Passage.prototype.reset=function(){this.text=this.initialText};Passage.prototype.excerpt=function(){var B=this.text.replace(/<<.*?>>/g,"");B=B.replace(/!.*?\n/g,"");B=B.replace(/[\[\]\/]/g,"");var A=B.match(/(.*?\s.*?\s.*?\s.*?\s.*?\s.*?\s.*?)\s/);return A[1]+"..."};Passage.unescapeLineBreaks=function(A){if(A&&A!=""){return A.replace(/\\n/mg,"\n").replace(/\\/mg,"\\").replace(/\r/mg,"")}else{return""}};function Tale(){this.passages={};if(document.normalize){document.normalize()}var A=$("storeArea").childNodes;for(var B=0;B<A.length;B++){var C=A[B];if(C.getAttribute&&(tiddlerTitle=C.getAttribute("tiddler"))){this.passages[tiddlerTitle]=new Passage(tiddlerTitle,C,B)}}this.title="Sugarcane";if(this.passages.StoryTitle){this.title=this.passages.StoryTitle.text}}Tale.prototype.has=function(A){if(typeof A=="string"){return(this.passages[A]!=null)}else{for(i in this.passages){if(this.passages[i].id==A){return true}}return false}};Tale.prototype.get=function(A){if(typeof A=="string"){return this.passages[A]||new Passage(A)}else{for(i in this.passages){if(this.passages[i].id==A){return this.passages[i]}}}};Tale.prototype.lookup=function(H,G,A){var D=[];for(var C in this.passages){var F=this.passages[C];var E=false;for(var B=0;B<F[H].length;B++){if(F[H][B]==G){D.push(F)}}}if(!A){A="title"}D.sort(function(J,I){if(J[A]==I[A]){return(0)}else{return(J[A]<I[A])?-1:+1}});return D};Tale.prototype.reset=function(){for(i in this.passages){this.passages[i].reset()}};function Wikifier(A,B){this.source=B;this.output=A;this.nextMatch=0;this.assembleFormatterMatches(Wikifier.formatters);this.subWikify(this.output)}Wikifier.prototype.assembleFormatterMatches=function(A){this.formatters=[];var B=[];for(var C=0;C<A.length;C++){B.push("("+A[C].match+")");this.formatters.push(A[C])}this.formatterRegExp=new RegExp(B.join("|"),"mg")};Wikifier.prototype.subWikify=function(C,B){var A=this.output;this.output=C;var F=B?new RegExp("("+B+")","mg"):null;do{this.formatterRegExp.lastIndex=this.nextMatch;if(F){F.lastIndex=this.nextMatch}var G=this.formatterRegExp.exec(this.source);var E=F?F.exec(this.source):null;if(E&&(!G||E.index<=G.index)){if(E.index>this.nextMatch){this.outputText(this.output,this.nextMatch,E.index)}this.matchStart=E.index;this.matchLength=E[1].length;this.matchText=E[1];this.nextMatch=E.index+E[1].length;this.output=A;return }else{if(G){if(G.index>this.nextMatch){this.outputText(this.output,this.nextMatch,G.index)}this.matchStart=G.index;this.matchLength=G[0].length;this.matchText=G[0];this.nextMatch=this.formatterRegExp.lastIndex;var H=-1;for(var D=1;D<G.length;D++){if(G[D]){matchingFormatter=D-1}}if(matchingFormatter!=-1){this.formatters[matchingFormatter].handler(this)}}}}while(E||G);if(this.nextMatch<this.source.length){this.outputText(this.output,this.nextMatch,this.source.length);this.nextMatch=this.source.length}this.output=A};Wikifier.prototype.outputText=function(A,C,B){insertText(A,this.source.substring(C,B))};Wikifier.prototype.fullArgs=function(){var B=this.source.indexOf(" ",this.matchStart);var A=this.source.indexOf(">>",this.matchStart);return Wikifier.parse(this.source.slice(B,A))};Wikifier.parse=function(B){var A=B.replace(/\$/g,"state.history[0].variables.");A=A.replace(/\beq\b/gi," == ");A=A.replace(/\bneq\b/gi," != ");A=A.replace(/\bgt\b/gi," > ");A=A.replace(/\beq\b/gi," == ");A=A.replace(/\bneq\b/gi," != ");A=A.replace(/\bgt\b/gi," > ");A=A.replace(/\bgte\b/gi," >= ");A=A.replace(/\blt\b/gi," < ");A=A.replace(/\blte\b/gi," <= ");A=A.replace(/\band\b/gi," && ");A=A.replace(/\bor\b/gi," || ");A=A.replace(/\bnot\b/gi," ! ");return A};Wikifier.formatHelpers={charFormatHelper:function(A){var B=insertElement(A.output,this.element);A.subWikify(B,this.terminator)},inlineCssHelper:function(F){var H=[];var A="(?:("+Wikifier.textPrimitives.anyLetter+"+)\\(([^\\)\\|\\n]+)(?:\\):))|(?:("+Wikifier.textPrimitives.anyLetter+"+):([^;\\|\\n]+);)";var B=new RegExp(A,"mg");var C=false;do{B.lastIndex=F.nextMatch;var D=B.exec(F.source);var E=D&&D.index==F.nextMatch;if(E){var I,G;C=true;if(D[1]){I=D[1].unDash();G=D[2]}else{I=D[3].unDash();G=D[4]}switch(I){case"bgcolor":I="backgroundColor";break}H.push({style:I,value:G});F.nextMatch=D.index+D[0].length}}while(E);return H},monospacedByLineHelper:function(A){var B=new RegExp(this.lookahead,"mg");B.lastIndex=A.matchStart;var C=B.exec(A.source);if(C&&C.index==A.matchStart){var E=C[1];if(navigator.userAgent.indexOf("msie")!=-1&&navigator.userAgent.indexOf("opera")==-1){E=E.replace(/\n/g,"\r")}var D=insertElement(A.output,"pre",null,null,E);A.nextMatch=C.index+C[0].length}}};Wikifier.formatters=[{name:"table",match:"^\\|(?:[^\\n]*)\\|(?:[fhc]?)$",lookahead:"^\\|([^\\n]*)\\|([fhc]?)$",rowTerminator:"\\|(?:[fhc]?)$\\n?",cellPattern:"(?:\\|([^\\n\\|]*)\\|)|(\\|[fhc]?$\\n?)",cellTerminator:"(?:\\x20*)\\|",rowTypes:{c:"caption",h:"thead","":"tbody",f:"tfoot"},handler:function(H){var J=insertElement(H.output,"table");H.nextMatch=H.matchStart;var C=new RegExp(this.lookahead,"mg");var D=null,A;var K,E;var I=[];var G=0;do{C.lastIndex=H.nextMatch;var F=C.exec(H.source);var B=F&&F.index==H.nextMatch;if(B){A=F[2];if(A!=D){K=insertElement(J,this.rowTypes[A])}D=A;if(D=="c"){if(G==0){K.setAttribute("align","top")}else{K.setAttribute("align","bottom")}H.nextMatch=H.nextMatch+1;H.subWikify(K,this.rowTerminator)}else{E=insertElement(K,"tr");this.rowHandler(H,E,I)}G++}}while(B)},rowHandler:function(G,D,K){var A=0;var I=1;var C=new RegExp(this.cellPattern,"mg");do{C.lastIndex=G.nextMatch;var E=C.exec(G.source);matched=E&&E.index==G.nextMatch;if(matched){if(E[1]=="~"){var J=K[A];if(J){J.rowCount++;J.element.setAttribute("rowSpan",J.rowCount);J.element.setAttribute("rowspan",J.rowCount);J.element.valign="center"}G.nextMatch=E.index+E[0].length-1}else{if(E[1]==">"){I++;G.nextMatch=E.index+E[0].length-1}else{if(E[2]){G.nextMatch=E.index+E[0].length;break}else{var B=false,F=false;G.nextMatch++;var M=Wikifier.formatHelpers.inlineCssHelper(G);while(G.source.substr(G.nextMatch,1)==" "){B=true;G.nextMatch++}var H;if(G.source.substr(G.nextMatch,1)=="!"){H=insertElement(D,"th");G.nextMatch++}else{H=insertElement(D,"td")}K[A]={rowCount:1,element:H};lastColCount=1;lastColElement=H;if(I>1){H.setAttribute("colSpan",I);H.setAttribute("colspan",I);I=1}for(var L=0;L<M.length;L++){H.style[M[L].style]=M[L].value}G.subWikify(H,this.cellTerminator);if(G.matchText.substr(G.matchText.length-2,1)==" "){F=true}if(B&&F){H.align="center"}else{if(B){H.align="right"}else{if(F){H.align="left"}}}G.nextMatch=G.nextMatch-1}}}A++}}while(matched)}},{name:"rule",match:"^----$\\n?",handler:function(A){insertElement(A.output,"hr")}},{name:"emdash",match:"--",handler:function(A){var B=insertElement(A.output,"span");B.innerHTML="&mdash;"}},{name:"heading",match:"^!{1,5}",terminator:"\\n",handler:function(A){var B=insertElement(A.output,"h"+A.matchLength);A.subWikify(B,this.terminator)}},{name:"monospacedByLine",match:"^\\{\\{\\{\\n",lookahead:"^\\{\\{\\{\\n((?:^[^\\n]*\\n)+?)(^\\}\\}\\}$\\n?)",handler:Wikifier.formatHelpers.monospacedByLineHelper},{name:"monospacedByLineForPlugin",match:"^//\\{\\{\\{\\n",lookahead:"^//\\{\\{\\{\\n\\n*((?:^[^\\n]*\\n)+?)(\\n*^//\\}\\}\\}$\\n?)",handler:Wikifier.formatHelpers.monospacedByLineHelper},{name:"wikifyCommentForPlugin",match:"^/\\*\\*\\*\\n",terminator:"^\\*\\*\\*/\\n",handler:function(A){A.subWikify(A.output,this.terminator)}},{name:"quoteByBlock",match:"^<<<\\n",terminator:"^<<<\\n",handler:function(A){var B=insertElement(A.output,"blockquote");A.subWikify(B,this.terminator)}},{name:"quoteByLine",match:"^>+",terminator:"\\n",element:"blockquote",handler:function(C){var E=new RegExp(this.match,"mg");var D=[C.output];var H=0;var B=C.matchLength;var G;do{if(B>H){for(G=H;G<B;G++){D.push(insertElement(D[D.length-1],this.element))}}else{if(B<H){for(G=H;G>B;G--){D.pop()}}}H=B;C.subWikify(D[D.length-1],this.terminator);insertElement(D[D.length-1],"br");E.lastIndex=C.nextMatch;var F=E.exec(C.source);var A=F&&F.index==C.nextMatch;if(A){B=F[0].length;C.nextMatch+=F[0].length}}while(A)}},{name:"list",match:"^(?:(?:\\*+)|(?:#+))",lookahead:"^(?:(\\*+)|(#+))",terminator:"\\n",outerElement:"ul",itemElement:"li",handler:function(I){var B=new RegExp(this.lookahead,"mg");I.nextMatch=I.matchStart;var E=[I.output];var J=null,C;var G=0,D;var K;do{B.lastIndex=I.nextMatch;var F=B.exec(I.source);var A=F&&F.index==I.nextMatch;if(A){if(F[1]){C="ul"}if(F[2]){C="ol"}D=F[0].length;I.nextMatch+=F[0].length;if(D>G){for(K=G;K<D;K++){E.push(insertElement(E[E.length-1],C))}}else{if(D<G){for(K=G;K>D;K--){E.pop()}}else{if(D==G&&C!=J){E.pop();E.push(insertElement(E[E.length-1],C))}}}G=D;J=C;var H=insertElement(E[E.length-1],"li");I.subWikify(H,this.terminator)}}while(A)}},{name:"prettyLink",match:"\\[\\[",lookahead:"\\[\\[([^\\|\\]]*?)(?:(\\]\\])|(\\|(.*?)\\]\\]))",terminator:"\\|",handler:function(A){var B=new RegExp(this.lookahead,"mg");B.lastIndex=A.matchStart;var C=B.exec(A.source);if(C&&C.index==A.matchStart&&C[2]){var D=Wikifier.createInternalLink(A.output,C[1]);A.outputText(D,A.nextMatch,A.nextMatch+C[1].length);A.nextMatch+=C[1].length+2}else{if(C&&C.index==A.matchStart&&C[3]){var E;if(tale.has(C[4])){E=Wikifier.createInternalLink(A.output,C[4])}else{E=Wikifier.createExternalLink(A.output,C[4])}A.outputText(E,A.nextMatch,A.nextMatch+C[1].length);A.nextMatch=C.index+C[0].length}}}},{name:"urlLink",match:"(?:http|https|mailto|ftp):[^\\s'\"]+(?:/|\\b)",handler:function(A){var B=Wikifier.createExternalLink(A.output,A.matchText);A.outputText(B,A.matchStart,A.nextMatch)}},{name:"image",match:"\\[(?:[<]{0,1})(?:[>]{0,1})[Ii][Mm][Gg]\\[",lookahead:"\\[([<]{0,1})([>]{0,1})[Ii][Mm][Gg]\\[(?:([^\\|\\]]+)\\|)?([^\\[\\]\\|]+)\\](?:\\[([^\\]]*)\\]?)?(\\])",handler:function(A){var C=new RegExp(this.lookahead,"mg");C.lastIndex=A.matchStart;var D=C.exec(A.source);if(D&&D.index==A.matchStart){var E=A.output;if(D[5]){if(tale.has(D[5])){E=Wikifier.createInternalLink(A.output,D[5])}else{E=Wikifier.createExternalLink(A.output,D[5])}}var B=insertElement(E,"img");if(D[1]){B.align="left"}else{if(D[2]){B.align="right"}}if(D[3]){B.title=D[3]}B.src=D[4];A.nextMatch=D.index+D[0].length}}},{name:"macro",match:"<<",lookahead:"<<([^>\\s]+)(?:\\s*)([^>]*)>>",handler:function(A){var B=new RegExp(this.lookahead,"mg");B.lastIndex=A.matchStart;var C=B.exec(A.source);if(C&&C.index==A.matchStart&&C[1]){var F=C[2].readMacroParams();A.nextMatch=C.index+C[0].length;try{var D=macros[C[1]];if(D&&D.handler){D.handler(A.output,C[1],F,A)}else{insertElement(A.output,"span",null,"marked","macro not found: "+C[1])}}catch(E){throwError(A.output,"Error executing macro "+C[1]+": "+E.toString())}}}},{name:"html",match:"<[Hh][Tt][Mm][Ll]>",lookahead:"<[Hh][Tt][Mm][Ll]>((?:.|\\n)*?)</[Hh][Tt][Mm][Ll]>",handler:function(A){var B=new RegExp(this.lookahead,"mg");B.lastIndex=A.matchStart;var C=B.exec(A.source);if(C&&C.index==A.matchStart){var D=insertElement(A.output,"span");D.innerHTML=C[1];A.nextMatch=C.index+C[0].length}}},{name:"commentByBlock",match:"/%",lookahead:"/%((?:.|\\n)*?)%/",handler:function(A){var B=new RegExp(this.lookahead,"mg");B.lastIndex=A.matchStart;var C=B.exec(A.source);if(C&&C.index==A.matchStart){A.nextMatch=C.index+C[0].length}}},{name:"boldByChar",match:"''",terminator:"''",element:"strong",handler:Wikifier.formatHelpers.charFormatHelper},{name:"strikeByChar",match:"==",terminator:"==",element:"strike",handler:Wikifier.formatHelpers.charFormatHelper},{name:"underlineByChar",match:"__",terminator:"__",element:"u",handler:Wikifier.formatHelpers.charFormatHelper},{name:"italicByChar",match:"//",terminator:"//",element:"em",handler:Wikifier.formatHelpers.charFormatHelper},{name:"subscriptByChar",match:"~~",terminator:"~~",element:"sub",handler:Wikifier.formatHelpers.charFormatHelper},{name:"superscriptByChar",match:"\\^\\^",terminator:"\\^\\^",element:"sup",handler:Wikifier.formatHelpers.charFormatHelper},{name:"monospacedByChar",match:"\\{\\{\\{",lookahead:"\\{\\{\\{((?:.|\\n)*?)\\}\\}\\}",handler:function(A){var B=new RegExp(this.lookahead,"mg");B.lastIndex=A.matchStart;var C=B.exec(A.source);if(C&&C.index==A.matchStart){var D=insertElement(A.output,"code",null,null,C[1]);A.nextMatch=C.index+C[0].length}}},{name:"styleByChar",match:"@@",terminator:"@@",lookahead:"(?:([^\\(@]+)\\(([^\\)]+)(?:\\):))|(?:([^:@]+):([^;]+);)",handler:function(A){var D=insertElement(A.output,"span",null,null,null);var C=Wikifier.formatHelpers.inlineCssHelper(A);if(C.length==0){D.className="marked"}else{for(var B=0;B<C.length;B++){D.style[C[B].style]=C[B].value}}A.subWikify(D,this.terminator)}},{name:"lineBreak",match:"\\n",handler:function(A){insertElement(A.output,"br")}}];Wikifier.textPrimitives={anyDigit:"[0-9]",anyNumberChar:"[0-9\\.E]",urlPattern:"(?:http|https|mailto|ftp):[^\\s'\"]+(?:/|\\b)"};Wikifier.createInternalLink=function(A,C){var B=insertElement(A,"a",C);B.href="javascript:void(0)";if(tale.has(C)){B.className="internalLink"}else{B.className="brokenLink"}B.onclick=function(){state.display(C,B)};if(A){A.appendChild(B)}return B};Wikifier.createExternalLink=function(A,B){var C=insertElement(A,"a");C.href=B;C.className="externalLink";C.target="_blank";if(A){A.appendChild(C)}return C};if(!((new RegExp("[\u0150\u0170]","g")).test("\u0150"))){Wikifier.textPrimitives.upperLetter="[A-Z\u00c0-\u00de]";Wikifier.textPrimitives.lowerLetter="[a-z\u00df-\u00ff_0-9\\-]";Wikifier.textPrimitives.anyLetter="[A-Za-z\u00c0-\u00de\u00df-\u00ff_0-9\\-]"}else{Wikifier.textPrimitives.upperLetter="[A-Z\u00c0-\u00de\u0150\u0170]";Wikifier.textPrimitives.lowerLetter="[a-z\u00df-\u00ff_0-9\\-\u0151\u0171]";Wikifier.textPrimitives.anyLetter="[A-Za-z\u00c0-\u00de\u00df-\u00ff_0-9\\-\u0150\u0170\u0151\u0171]"};//
// Section: General-purpose functions
//

//
// Function: $
// Returns the DOM element with the id passed.
//
// Parameters:
// id - the id to look up
//
// Returns:
// A DOM element, or null if none with the id exist.
//

function $ (id)
{
	if (typeof id == 'string')
		return document.getElementById(id);
	else
		return id;	
}

//
// Function: clone
// Performs a shallow copy of an object.
//
// Parameters:
// original - the object to copy
//
// Returns:
// The copied object.
//

function clone (original)
{
	var clone = {};

	for (property in original)
		clone[property] = original[property];
	
	return clone;
};

//
// Function: insertElement
// A shortcut function for creating a DOM element. All parameters are
// optional.
//
// Parameters:
// place - the parent element
// type - the type of element to create -- e.g. 'div' or 'span'
// id - the id to give the element
// className - the CSS class to give the element
// text - text to place inside the element. This is *not* interpreted
//				as HTML.
//
// Returns:
// The newly created element.
//

function insertElement (place, type, id, className, text)
{
	var el = document.createElement(type);
	
	if (id)
		el.id = id;

	if (className)
		el.className = className;
	
	if (text)
		insertText(el, text);
		
	if (place)
		place.appendChild(el);
		
	return el;
};

//
// Function: insertText
// Places text in a DOM element.
//
// Parameters:
// place - the element to add text to
// text - text to insert
//
// Returns:
// The newly created DOM text node.
//

function insertText (place, text)
{
	return place.appendChild(document.createTextNode(text));
};

//
// Function: removeChildren
// Removes all child elements from a DOM element.
//
// Parameters:
// el - the element to strip
//
// Returns:
// nothing
//

function removeChildren (el)
{
	while (el.hasChildNodes())
		el.removeChild(el.firstChild);
};

//
// Function: setPageElement
// Wikifies a passage into a DOM element.
//
// Parameters:
// id - the id of the element
// title - the title of the passage
// defaultText - text to use if the passage doesn't exist
//
// Returns:
// a DOM element, or null if none with the id exist.
//
// See also:
// <Wikifier>
//

function setPageElement (id, title, defaultText)
{	
	if (place = $(id))
	{
		removeChildren(place);
		
		if (tale.has(title))
			new Wikifier(place, tale.get(title).text);
		else
			new Wikifier(place, defaultText);
	};
};

//
// Function: addStyle
// Adds CSS styles to the document.
//
// Parameters:
// source - the CSS styles to add
//
// Returns:
// nothing
//

function addStyle (source)
{
	if (document.createStyleSheet) 
	{
		document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeEnd', '&nbsp;<style>' + source + '</style>');
	}
	else
	{
		var el = document.createElement("style");
		el.type = "text/css";
		el.appendChild(document.createTextNode(source));
		document.getElementsByTagName("head")[0].appendChild(el);
	}
};

//
// Function: throwError
// Displays an error message on the page.
//
// Parameters:
// place - the place to show the error message
// message - the message to display
//
// Returns:
// nothing
//

function throwError (place, message)
{
	new Wikifier(place, "'' @@ " + message + " @@ ''");
};

//
// Function: Math.easeInOut
// Eases a decimal number from 0 to 1.
//
// Parameters:
// i - the number to ease. Must be between 0 and 1.
//
// Returns:
// The eased value.
//

Math.easeInOut = function (i)
{
	return(1-((Math.cos(i * Math.PI)+1)/2));	
};

//
// Function: String.readMacroParams
// Parses a list of macro parameters.
//
// Parameters:
// none
//
// Returns:
// An array of parameters.
//

String.prototype.readMacroParams = function()
{
	var regexpMacroParam = new RegExp("(?:\\s*)(?:(?:\"([^\"]*)\")|(?:'([^']*)')|(?:\\[\\[([^\\]]*)\\]\\])|([^\"'\\s]\\S*))","mg");
	var params = [];
	do {
		var match = regexpMacroParam.exec(this);
		if(match)
			{
			if(match[1]) // Double quoted
				params.push(match[1]);
			else if(match[2]) // Single quoted
				params.push(match[2]);
			else if(match[3]) // Double-square-bracket quoted
				params.push(match[3]);
			else if(match[4]) // Unquoted
				params.push(match[4]);
			}
	} while(match);
	return params;
}

//
// Function: String.readBracketedList
// Parses a list of bracketed links -- e.g. *[[my link]]*.
//
// Parameters:
// none
//
// Returns:
// an array of link titles.
//

String.prototype.readBracketedList = function()
{
	var bracketedPattern = "\\[\\[([^\\]]+)\\]\\]";
	var unbracketedPattern = "[^\\s$]+";
	var pattern = "(?:" + bracketedPattern + ")|(" + unbracketedPattern + ")";
	var re = new RegExp(pattern,"mg");
	var tiddlerNames = [];
	do {
		var match = re.exec(this);
		if(match)
			{
			if(match[1]) // Bracketed
				tiddlerNames.push(match[1]);
			else if(match[2]) // Unbracketed
				tiddlerNames.push(match[2]);
			}
	} while(match);
	return(tiddlerNames);
}

//
// Function: String.trim
// Removes whitespace from the beginning and end of a string.
//
// Parameters:
// none
//
// Returns:
// The trimmed string.
//

// Trim whitespace from both ends of a string
String.prototype.trim = function()
{
	var regexpTrim = new RegExp("^\\s*(.*?)\\s*$","mg");
	return(this.replace(regexpTrim,"$1"));
}

//
// Function: Array.indexOf
// Works like String.indexOf.
//

Array.prototype.indexOf || (Array.prototype.indexOf = function(v,n){
  n = (n==null)?0:n; var m = this.length;
  for(var i = n; i < m; i++)
    if(this[i] == v)
       return i;
  return -1;
});
//
// Section: Effects
//

//
// Function: fade
// Fades a DOM element in or out.
// 
// Parameters:
// el - the element to fade
// options - an object of options to use. This object must have a *fade*
//					 property, which should be either the string 'in' or 'out',
//					 corresponding to the direction of the fade. The second
//					 property used here, *onComplete*, is a function that is called
//					 once the fade is complete. This is optional.
//
// Returns:
// nothing
//

function fade (el, options)
{
	var current;
	var proxy = el.cloneNode(true);
	var direction = (options.fade == 'in') ? 1 : -1;
	
	el.parentNode.replaceChild(proxy, el);
	
	if (options.fade == 'in')
	{
		current = 0;
		proxy.style.visibility = 'visible';
	}
	else
		current = 1;

	setOpacity(proxy, current);	
	var interval = window.setInterval(tick, 25);
	
	function tick()
	{
		current += 0.05 * direction;
		
		setOpacity(proxy, Math.easeInOut(current));
		
		if (((direction == 1) && (current >= 1))
				|| ((direction == -1) && (current <= 0)))
		{
			el.style.visibility = (options.fade == 'in') ? 'visible' : 'hidden';
			proxy.parentNode.replaceChild(el, proxy);
			delete proxy;
			window.clearInterval(interval);	
			
			if (options.onComplete)
				options.onComplete();
		}
	};
	
	function setOpacity (el, opacity)
	{						
		var percent = Math.floor(opacity * 100);
			
		// IE
		el.style.zoom = 1;
		el.style.filter = 'alpha(opacity=' + percent + ')';
					
		// CSS 3
		el.style.opacity = opacity;
	};
};

//
// Function: scrollWindowTo
// This scrolls the browser window to ensure that a DOM element is
// in view. Make sure that the element has been added to the page
// before calling this function.
//
// Parameters:
// el - the element to scroll to.
//
// Returns:
// nothing
//

function scrollWindowTo (el)
{
	var start = window.scrollY ? window.scrollY : document.body.scrollTop;
	var end = ensureVisible(el);
	var distance = Math.abs(start - end);
	var progress = 0;
	var direction = (start > end) ? -1 : 1;
	var interval = window.setInterval(tick, 25);
	
	function tick()
	{
		progress += 0.1;
		window.scrollTo(0, start + direction * (distance * Math.easeInOut(progress)));
				
		if (progress >= 1)
			window.clearInterval(interval);
	};
	
	function ensureVisible (el)
	{
		var posTop = findPosY(el);
		var posBottom = posTop + el.offsetHeight;
		var winTop = window.scrollY ? window.scrollY : document.body.scrollTop;
		var winHeight = window.innerHeight ? window.innerHeight : document.body.clientHeight;
		var winBottom = winTop + winHeight;
				
		if (posTop < winTop)
			return posTop;
		else if (posBottom > winBottom)
		{
			if (el.offsetHeight < winHeight)
				return (posTop - (winHeight - el.offsetHeight) + 20);
			else
				return posTop;
		}
		else
			return posTop;
	};
	
	function findPosY (el)
	{
		var curtop = 0;
		while (el.offsetParent)
		{
			curtop += el.offsetTop;
			el = el.offsetParent;
		}
		return curtop;	
	};
}
//
// Class: History
//
// A class used to manage the state of the story -- displaying new passages
// and rewinding to the past.
//
// Property: History
// An array representing the state of the story. history[0] is the current
// state, history[1] is the state just before the present, and so on.
// Each entry in the history is an object with two properties.
//
// *passage* corresponds to the <Passage> just displayed.
//
// *variables* is in itself an object. Each property is a variable set
// by the story via the <<set>> macro.
//
// *hash* is a URL hash guaranteed to load that specific point in time.
//

//
// Constructor: History
// Initializes a History object.
// 
// Parameters:
// none
//

function History()
{
	this.history = [{ passage: null, variables: {}, hash: null }];
};

//
// Method: init
// This first attempts to restore the state of the story via the <restore>
// method. If that fails, it then either displays the passages linked in the
// *StartPassages* passage, or gives up and tries to display a passage
// named *Start*.
//
// Parameters:
// none
//
// Returns:
// nothing
//

History.prototype.init = function()
{
	var self = this;

	if (! this.restore())
		this.display('Start', null);
	
	this.hash = window.location.hash;
	this.interval = window.setInterval(function() { self.watchHash.apply(self) }, 250);
};

//
// Method: display
// Displays a passage on the page.
//
// Parameters:
// title - the title of the passage to display.
// link - the DOM element corresponding to the link that was clicked to
// view the passage. This parameter has no effect but is maintained
// for Jonah compatibility.
// render - may be either "quietly" or "offscreen". If a "quietly" value
// is passed, the passage's appearance is not animated. "offscreen"
// asks that the passage be rendered, but not displayed at all. This
// parameter is optional. If it is omitted, then the passage's appearance
// is animated.
//
// Returns:
// The DOM element containing the passage on the page.
//

History.prototype.display = function (title, link, render)
{	
	
	// create a fresh entry in the history
	
	var passage = tale.get(title);
	
	this.history.unshift({ passage: passage,
													variables: clone(this.history[0].variables) } );
	this.history[0].hash = this.save();
	
	// add it to the page
	
	var div = passage.render();
	
	if (render != 'offscreen')
	{
		removeChildren($('passages'));			
		$('passages').appendChild(div);
		
		// animate its appearance
		
		if (render != 'quietly')
			fade(div, { fade: 'in' });
	}
	
	if ((render == 'quietly') || (render == 'offscreen'))
		div.style.visibility = 'visible';
	
	if (render != 'offscreen')
	{
		document.title = tale.title;
		this.hash = this.save();
	
		if (passage.title != 'Start')
		{
			document.title += ': ' + passage.title;
			window.location.hash = this.hash;
		};
		
		window.scroll(0, 0);
	};
	
	return div;	
};

//
// Method: restart
// Restarts the story from the beginning. This actually forces the
// browser to refresh the page.
//
// Parameters:
// none
//
// Returns:
// none
//

History.prototype.restart = function()
{
	// clear any bookmark
	// this has the side effect of forcing a page reload
	// (in most cases)
	
	window.location.hash = '';
};

//
// Method: save
// Appends a hash to the page's URL that will be later
// read by the <restore> method. How this is generated is not
// guaranteed to remain constant in future releases -- but it
// is guaranteed to be understood by <restore>.
//
// Parameters:
// none
//
// Returns:
// nothing
//

History.prototype.save = function (passage)
{
	var order = '';

	// encode our history
	
	for (var i = this.history.length - 1; i >= 0; i--)
	{
		if ((this.history[i].passage) && (this.history[i].passage.id))
			order += this.history[i].passage.id.toString(36) + '.';
	};
	
	// strip the trailing period
	
	return '#' + order.substr(0, order.length - 1);
};

//
// Method: restore
// Attempts to restore the state of the story as saved by <save>.
//
// Parameters:
// none
//
// Returns:
// Whether this method actually restored anything.
//

History.prototype.restore = function ()
{
	try
	{
		if ((window.location.hash == '') || (window.location.hash == '#'))
			return false;
	
		var order = window.location.hash.replace('#', '').split('.');
		var passages = [];
		
		// render the passages in the order the reader clicked them
		// we only show the very last one
		
		for (var i = 0; i < order.length; i++)
		{
			var id = parseInt(order[i], 36);
			
			if (! tale.has(id))
				return false;
			
			
			var method = (i == order.length - 1) ? '' : 'offscreen';
			passages.unshift(this.display(id, null, method));
		};
		
		return true;
	}
	catch (e)
	{
		return false;
	};
};

//
// Method: watchHash
// Watches the browser's address bar for changes in its hash, and
// calls <restore> accordingly. This is set to run at an interval
// in <init>.
//
// Parameters:
// none
//
// Returns:
// nothing
//

History.prototype.watchHash = function()
{
	if (window.location.hash != this.hash)
	{	
				
		if ((window.location.hash != '') && (window.location.hash != '#'))
		{
			this.history = [{ passage: null, variables: {} }];
			removeChildren($('passages'));
			
			$('passages').style.visibility = 'hidden';
			
			if (! this.restore())
				alert('The passage you had previously visited could not be found.');
			
			$('passages').style.visibility = 'visible';
		}
		else
			window.location.reload();
		
		this.hash = window.location.hash;
	}
};

//
// Initialization
//

var version =
{
	major: 2, minor: 0, revision: 0,
	date: new Date('July 30, 2007'),
	extensions: {}
};

// passage storage and story history
var tale, state;

// Macros
var macros = {};

//
// Function: main
//
// Loads the story from the storage div, initializes macros and
// custom stylesheets, and displays the first passages of the story.
//
// Returns:
// nothing
// 

function main()
{	
	tale = new Tale();
	document.title = tale.title;

	setPageElement('storyTitle', 'StoryTitle', 'Untitled Story');
	
	if (tale.has('StoryAuthor'))
	{
		$('titleSeparator').innerHTML = '<br />';
		setPageElement('storyAuthor', 'StoryAuthor', '');
	};
	
	if (tale.has('StoryMenu'))
	{
		$('storyMenu').style.display = 'block';
		setPageElement('storyMenu', 'StoryMenu', '');
	};

	// initialize macros
	
	for (macro in macros)
		if (typeof macro.init == 'function')
			macro.init();
	
	// process passages tagged 'stylesheet'
	
	var styles = tale.lookup('tags', 'stylesheet');
	
	for (var i = 0; i < styles.length; i++)
		addStyle(styles[i].text);
		
	// process passages tagged 'script'
	
	var scripts = tale.lookup('tags', 'script');
		
	for (var i = 0; i < scripts.length; i++)
		try
		{
			 eval(scripts[i].text);
		}
		catch (e)
		{		
			alert('There is a technical problem with this story (' +
						scripts[i].title + ': ' + e.message + '). You may be able ' +
						'to continue reading, but all parts of the story may not ' +
						'work properly.');

		};
			
	// initialize history and display initial passages
	
	state = new History();
	state.init();
		
}
Interface =
{
	init: function()
	{
		main();
		$('snapback').onclick = Interface.showSnapback;
		$('restart').onclick = Interface.restart;
		$('share').onclick = Interface.showShare;
	},
	
	restart: function()
	{
		if (confirm('Are you sure you want to restart this story?'))
			state.restart();
	},
	
	showShare: function (event)
	{
		Interface.hideAllMenus();
		Interface.showMenu(event, $('shareMenu'))
	},
	
	showSnapback: function (event)
	{
		Interface.hideAllMenus();
		Interface.buildSnapback();
		Interface.showMenu(event, $('snapbackMenu'));
	},
	
	buildSnapback: function()
	{
		var hasItems = false;
		
		removeChildren($('snapbackMenu'));
	
		for (var i = state.history.length - 1; i >= 0; i--)
			if (state.history[i].passage &&
					state.history[i].passage.tags.indexOf('bookmark') != -1)
			{
				var el = document.createElement('div');
				el.hash = state.history[i].hash;
				el.onclick = function() { window.location.hash = this.hash };
				el.innerHTML = state.history[i].passage.excerpt();
				$('snapbackMenu').appendChild(el);
				hasItems = true;
			};
			
		if (! hasItems)
		{
			var el = document.createElement('div');
			el.innerHTML = '<i>No passages available</i>';
			$('snapbackMenu').appendChild(el);
		};
	},
	
	hideAllMenus: function()
	{
		$('shareMenu').style.display = 'none';	
		$('snapbackMenu').style.display = 'none';	
	},
	
	showMenu: function (event, el)
	{
		if (! event)
			event = window.event;
	
		var pos = { x: 0, y: 0 };

		if (event.pageX || event.pageY)
		{
			pos.x = event.pageX;
			pos.y = event.pageY;
		}
		else
			if (event.clientX || event.clientY)
			{
			pos.x = event.clientX + document.body.scrollLeft
  					 	+ document.documentElement.scrollLeft;
			pos.y = event.clientY + document.body.scrollTop
							+ document.documentElement.scrollTop;
			};
			
		el.style.top = pos.y + 'px';
		el.style.left = pos.x + 'px';
		el.style.display = 'block';
		document.onclick = Interface.hideAllMenus;
		event.cancelBubble = true;

		if (event.stopPropagation)
			event.stopPropagation();		
	}
};

window.onload = Interface.init;

//
// Jonah macros
//
// These provide various facilities to stories.
//

// <<back>>

version.extensions.backMacro = {major: 1, minor: 0, revision: 0};

macros['back'] = 
{
	handler: function (place, name, params)
	{
		var hash = '';
		
		if (params[0])
		{
			for (var i = 0; i < state.history.length; i++)
				if (state.history[i].passage.title == params[0])
				{
					hash = state.history[i].hash;
					break;
				};
				
			if (hash == '')
			{
				throwError(place, "can't find passage \"" + params[0] + '" in history');
				return;
			};
		}
		else
			hash = state.history[1].hash;

		el = document.createElement('a');
		el.className = 'back';
		el.href = hash;
		el.innerHTML = '<b>&laquo;</b> Back';
		place.appendChild(el);	
	}
};

// <<display>>

version.extensions.displayMacro = {major: 1, minor: 0, revision: 0};

macros['display'] =
{
	handler: function (place, name, params)
	{
		new Wikifier(place, tale.get(params[0]).text);
	}
};

// <<actions>>

version.extensions.actionsMacro = { major: 1, minor: 1, revision: 0 };

macros['actions'] =
{
	clicked: new Object(),
	
	handler: function (place, macroName, params)
	{
		var list = insertElement(place, 'ul');
		
		for (var i = 0; i < params.length; i++)
		{
			if (macros['actions'].clicked[params[i]])
				continue;
					
			var item = insertElement(list, 'li');
			var link = Wikifier.createInternalLink(item, params[i]);
			insertText(link, params[i]);
			
			// rewrite the function in the link
					
			link.onclick = function()
			{
				macros['actions'].clicked[this.id] = true;
				state.display(this.id, link);
			};
		};
	}
};

// <<print>>

version.extensions.printMacro = { major: 1, minor: 1, revision: 0 };

macros['print'] =
{
	handler: function (place, macroName, params, parser)
	{		
		try
		{
			var output = eval(parser.fullArgs());
			if (output)
				new Wikifier(place, output.toString());
		}
		catch (e)
		{
			throwError(place, 'bad expression: ' + e.message);
		}
	}
};

// <<set>>

version.extensions.setMacro = { major: 1, minor: 1, revision: 0 };

macros['set'] = 
{  
  handler: function (place, macroName, params, parser)
  {
  	macros['set'].run(parser.fullArgs());
  },
  
  run: function (expression)
  {
  	// you may call this directly from a script passage
  	
  	try
  	{
	  	return eval(Wikifier.parse(expression));
  	}
  	catch (e)
  	{
  		throwError(place, 'bad expression: ' + e.message);
  	};
  }
};

// <<if>>, <<else>>, and <<endif>>

version.extensions['ifMacros'] = { major: 1, minor: 0, revision: 0};

macros['if'] =
{
	handler: function (place, macroName, params, parser)
	{
		var condition = parser.fullArgs();
		var srcOffset = parser.source.indexOf('>>', parser.matchStart) + 2;
		var src = parser.source.slice(srcOffset);
		var endPos = -1;
		var trueClause = '';
		var falseClause = '';
		
		for (var i = 0, nesting = 1, currentClause = true; i < src.length; i++)
		{
			if (src.substr(i, 9) == '<<endif>>')
			{
				nesting--;
								
				if (nesting == 0)
				{
					endPos = srcOffset + i + 9; // length of <<endif>>
					break;
				}
			}
			
			if ((src.substr(i, 8) == '<<else>>') && (nesting == 1))
			{
				currentClause = 'false';
				i += 8;
			}
			
			if (src.substr(i, 5) == '<<if ')
				nesting++;
						
			if (currentClause == true)
				trueClause += src.charAt(i);
			else
				falseClause += src.charAt(i);
		};
		
		// display the correct clause
		
		try
		{
			if (eval(condition))
				new Wikifier(place, trueClause.trim());
			else
				new Wikifier(place, falseClause.trim());
		
			// push the parser past the entire expression
					
			if (endPos != -1)
				parser.nextMatch = endPos;
			else
				throwError(place, "can't find matching endif");
		}
		catch (e)
		{
			throwError(place, 'bad condition: ' + e.message);
		};
	}
};

macros['else'] = macros['endif'] = { handler: function() {} };

// <<remember>>

version.extensions.rememberMacro = {major: 1, minor: 0, revision: 0};

macros['remember'] =
{
	handler: function (place, macroName, params, parser)
	{
		var statement = parser.fullArgs();
		var expire = new Date();
		var variable, value;

		// evaluate the statement if any
		
		macros['set'].run(statement);
		
		// find the variable to save
		
		variable = statement.match(new RegExp(Wikifier.parse('$') + '(\\w+)', 'i'))[1];
		value = eval(Wikifier.parse('$' + variable));
						
		// simple JSON-like encoding
		
		switch (typeof value)
		{
			case 'string':
			value = '"' + value.replace(/"/g, '\\"') + '"';
			break;
			
			case 'number':
			case 'boolean':
			break;
			
			default:
			throwError(place, "can't remember $" + variable + ' (' + (typeof value) +
								 ')');
			return;
		};
		
		// save the variable as a cookie
		
		expire.setYear(expire.getFullYear() + 1);
		document.cookie = macros['remember'].prefix + variable +
											'=' + value + '; expires=' + expire.toGMTString();
	},
	
	init: function()
	{	
		// figure out our cookie prefix
		
		if (tale.has('StoryTitle'))
			macros['remember'].prefix = tale.get('StoryTitle').text + '_';
		else
			macros['remember'].prefix = '__jonah_';
	
		// restore all cookie'd values to local variables
		
		var cookies = document.cookie.split(';');
		
		for (var i = 0; i < cookies.length; i++)
		{
			var bits = cookies[i].split('=');
			
			if (bits[0].trim().indexOf(this.prefix) == 0)
			{
				// replace our cookie prefix with $ and evaluate the statement
				
				var statement = cookies[i].replace(this.prefix, '$');
				eval(Wikifier.parse(statement));
			};
		}
	}
};

// <<silently>>

version.extensions['SilentlyMacro'] = { major: 1, minor: 0, revision: 0 };

macros['silently'] =
{
	handler: function (place, macroName, params, parser)
	{
		var buffer = insertElement(null, 'div');
		var srcOffset = parser.source.indexOf('>>', parser.matchStart) + 2;
		var src = parser.source.slice(srcOffset);
		var endPos = -1;
		var silentText = '';

		for (var i = 0; i < src.length; i++)
		{
			if (src.substr(i, 15) == '<<endsilently>>')
				endPos = srcOffset + i + 15;
			else
				silentText += src.charAt(i);
		};
		
		if (endPos != -1)
		{
			new Wikifier(buffer, silentText);
			parser.nextMatch = endPos;
		}
		else
			throwError(place, "can't find matching endsilently");
		
		delete buffer;
	}
};

macros['endsilently'] =
{
	handler: function() { }
};
//
// Class: Passage
//
// This class represents an individual passage.
// This is analogous to the Tiddler class in the core TiddlyWiki code.
//
// Property: title
// The title of the passage, displayed at its top.
//
// Property: id
// An internal id of the passage. This is never seen by the reader,
// but it is used by the <History> class.
//
// Property: initialText
// The initial text of the passage. This is used by the reset method.
//
// Property: text
// The current text of the passage. This is usually the same as
// the <initialText> property, though macros such as <<choice>>
// may alter it.
//
// Property: tags
// An array of strings, each corresponding to a tag the passage belongs to.
//

//
// Constructor: Passage
//
// Initializes a new Passage object. You may either call this with
// a DOM element, which creates the passage from the text stored in the
// element, or you may pass only a title, 
//
// Parameters:
// title - the title of the passage to create. This parameter is required.
// el - the DOM element storing the content of the passage.
// This parameter is optional. If it is omitted, "this passage does not
// exist" is used as the passage's content.
// order - the order in which this passage was retrieved from the
// document's *storeArea* div. This is used to generate the passage's id.
// This parameter is optional, but should be included if el is specified.
//

function Passage (title, el, order)
{	
	this.title = title;

	if (el)
	{
		this.id = order;	
		this.initialText = this.text = Passage.unescapeLineBreaks(el.firstChild ? el.firstChild.nodeValue : "");
		this.tags = el.getAttribute("tags");
		
		if (typeof this.tags == 'string')
			this.tags = this.tags.readBracketedList();
		else
			this.tags = [];
	}
	else
	{
		this.initialText = this.text = '@@This passage does not exist.@@';
		this.tags = [];
	};
};

//
// Method: render
// 
// Renders the passage to a DOM element, including its title, toolbar,
// and content. It's up to the caller to add this to the DOM tree appropriately
// and animate its appearance.
//
// Parameters:
// none
//
// Returns:
// nothing
//

Passage.prototype.render = function()
{
	// construct passage
	
	var passage = insertElement(null, 'div', 'passage' + this.title, 'passage');
	passage.style.visibility = 'hidden';
	
	insertElement(passage, 'div', '', 'header');
		
	var body = insertElement(passage, 'div', '', 'content');
	new Wikifier(body, this.text);
	
	insertElement(passage, 'div', '', 'footer');
	
	
	return passage;
};

//
// Method: reset
// 
// Resets the passage's <text> property to its <initialText> property.
// This does not directly affect anything displayed on the page.
//
// Parameters:
// none
//
// Returns:
// nothing
//

Passage.prototype.reset = function()
{
	this.text = this.initialText;
};

//
// Method: excerpt
//
// Returns a brief excerpt of the passage's content.
//
// Parameters:
// none
//
// Returns:
// a string excerpt
//

Passage.prototype.excerpt = function()
{
	var text = this.text.replace(/<<.*?>>/g, '');
	text = text.replace(/!.*?\n/g, '');
	text = text.replace(/[\[\]\/]/g, '');
	var matches = text.match(/(.*?\s.*?\s.*?\s.*?\s.*?\s.*?\s.*?)\s/);
	return matches[1] + '...';
};

//
// Method: unescapeLineBreaks
// 
// A static function used by the constructor to convert string literals
// used by TiddlyWiki to indicate newlines into actual newlines.
//
// Parameters:
// text - a string to unescape
//
// Returns:
// a converted string
//

Passage.unescapeLineBreaks = function (text)
{
	if(text && text != "")
		return text.replace(/\\n/mg,"\n").replace(/\\/mg,"\\").replace(/\r/mg,"");
	else
		return "";
};
//
// Class: Tale
//
// Used to provide access to passages. This is analogous to the
// TiddlyWiki class in the core TiddlyWiki code.
//
// Property: passages
// An associative array of <Passage> objects in the story.
// The key for this array is the title of the passage.
//

//
// Constructor: Tale
//
// Initializes a new Tale object with the contents of the
// DOM element with the id *storeArea*, constructing new <Passage>s
// as it traverses the tree.
//
// Parameters:
// none
//

function Tale()
{	
	this.passages = {};

	if (document.normalize)
		document.normalize();
		
	var store = $('storeArea').childNodes;
	
	for (var i = 0; i < store.length; i++)
	{
		var el = store[i];
				
		if (el.getAttribute && (tiddlerTitle = el.getAttribute('tiddler')))
			this.passages[tiddlerTitle] = new Passage(tiddlerTitle, el, i);
	};
	
	this.title = 'Sugarcane';
	
	if (this.passages['StoryTitle'])
		this.title = this.passages['StoryTitle'].text;
};

//
// Method: has
//
// Checks whether the tale has a passage with either the title
// passed (if the key parameter is a string) or an id (if
// a number is passed instead).
//
// Parameters:
// key - the title or id of the passage to search for
//
// Returns:
// boolean
//

Tale.prototype.has = function (key)
{
	// returns whether a passage exists
		
	if (typeof key == 'string')
		return (this.passages[key] != null);
	else
	{
		for (i in this.passages)			
			if (this.passages[i].id == key)
				return true;
				
		return false;
	};
};

//
// Method: get
//
// A getter function that returns a certain <Passage> object belonging
// to the tale. You may either retrieve a passage by its title or id.
//
// Parameters:
// key - the title or id of the passage to retrieve
//
// Returns:
// A <Passage> object. If no passage exists matching the passed key,
// a null value is returned.
//
// See also:
// <Tale.lookup>
//

Tale.prototype.get = function (key)
{
	// returns a passage either by title or its id

	if (typeof key == 'string')
		return this.passages[key] || new Passage(key);
	else		
		for (i in this.passages)
			if (this.passages[i].id == key)
				return this.passages[i];
};

//
// Method: lookup
//
// Searches the Tale for all passages matching a certain criteria.
// You may optionally specify a secondary field to sort the results on.
//
// Parameters:
// field - the name of the <Passage> property to search on
// value - the value to match
// sortField - the name of the <Passage> property to sort matches on.
// This always sorts in descending order. If you need ascending order,
// use the Array class's reverse() method.
//
// Returns:
// An array of <Passage>s. If no passages met the search criteria,
// an empty array is returned.
//
// See also:
// <Tale.get>
//

Tale.prototype.lookup = function(field, value, sortField)
{
	var results = [];
	for (var t in this.passages)
	{
		var passage = this.passages[t];
		var found = false;
		
		for (var i = 0; i < passage[field].length; i++)
			if (passage[field][i] == value)
				results.push(passage);
	}

	if (! sortField)
		sortField = 'title';

	results.sort(function (a,b) {if(a[sortField] == b[sortField]) return(0); else return (a[sortField] < b[sortField]) ? -1 : +1; });
	
	return results;
};

//
// Method: reset
//
// Calls the <Passage.reset> method on all <Passage>s in the tale, restoring
// the story to its initial state.
//
// Parameters:
// none
//
// Returns:
// nothing
//

Tale.prototype.reset = function()
{
	
	for (i in this.passages)
		this.passages[i].reset();
};
//
// Section: General-purpose functions
//

//
// Function: $
// Returns the DOM element with the id passed.
//
// Parameters:
// id - the id to look up
//
// Returns:
// A DOM element, or null if none with the id exist.
//

function $ (id)
{
	if (typeof id == 'string')
		return document.getElementById(id);
	else
		return id;	
}

//
// Function: clone
// Performs a shallow copy of an object.
//
// Parameters:
// original - the object to copy
//
// Returns:
// The copied object.
//

function clone (original)
{
	var clone = {};

	for (property in original)
		clone[property] = original[property];
	
	return clone;
};

//
// Function: insertElement
// A shortcut function for creating a DOM element. All parameters are
// optional.
//
// Parameters:
// place - the parent element
// type - the type of element to create -- e.g. 'div' or 'span'
// id - the id to give the element
// className - the CSS class to give the element
// text - text to place inside the element. This is *not* interpreted
//				as HTML.
//
// Returns:
// The newly created element.
//

function insertElement (place, type, id, className, text)
{
	var el = document.createElement(type);
	
	if (id)
		el.id = id;

	if (className)
		el.className = className;
	
	if (text)
		insertText(el, text);
		
	if (place)
		place.appendChild(el);
		
	return el;
};

//
// Function: insertText
// Places text in a DOM element.
//
// Parameters:
// place - the element to add text to
// text - text to insert
//
// Returns:
// The newly created DOM text node.
//

function insertText (place, text)
{
	return place.appendChild(document.createTextNode(text));
};

//
// Function: removeChildren
// Removes all child elements from a DOM element.
//
// Parameters:
// el - the element to strip
//
// Returns:
// nothing
//

function removeChildren (el)
{
	while (el.hasChildNodes())
		el.removeChild(el.firstChild);
};

//
// Function: setPageElement
// Wikifies a passage into a DOM element.
//
// Parameters:
// id - the id of the element
// title - the title of the passage
// defaultText - text to use if the passage doesn't exist
//
// Returns:
// a DOM element, or null if none with the id exist.
//
// See also:
// <Wikifier>
//

function setPageElement (id, title, defaultText)
{	
	if (place = $(id))
	{
		removeChildren(place);
		
		if (tale.has(title))
			new Wikifier(place, tale.get(title).text);
		else
			new Wikifier(place, defaultText);
	};
};

//
// Function: addStyle
// Adds CSS styles to the document.
//
// Parameters:
// source - the CSS styles to add
//
// Returns:
// nothing
//

function addStyle (source)
{
	if (document.createStyleSheet) 
	{
		document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeEnd', '&nbsp;<style>' + source + '</style>');
	}
	else
	{
		var el = document.createElement("style");
		el.type = "text/css";
		el.appendChild(document.createTextNode(source));
		document.getElementsByTagName("head")[0].appendChild(el);
	}
};

//
// Function: throwError
// Displays an error message on the page.
//
// Parameters:
// place - the place to show the error message
// message - the message to display
//
// Returns:
// nothing
//

function throwError (place, message)
{
	new Wikifier(place, "'' @@ " + message + " @@ ''");
};

//
// Function: Math.easeInOut
// Eases a decimal number from 0 to 1.
//
// Parameters:
// i - the number to ease. Must be between 0 and 1.
//
// Returns:
// The eased value.
//

Math.easeInOut = function (i)
{
	return(1-((Math.cos(i * Math.PI)+1)/2));	
};

//
// Function: String.readMacroParams
// Parses a list of macro parameters.
//
// Parameters:
// none
//
// Returns:
// An array of parameters.
//

String.prototype.readMacroParams = function()
{
	var regexpMacroParam = new RegExp("(?:\\s*)(?:(?:\"([^\"]*)\")|(?:'([^']*)')|(?:\\[\\[([^\\]]*)\\]\\])|([^\"'\\s]\\S*))","mg");
	var params = [];
	do {
		var match = regexpMacroParam.exec(this);
		if(match)
			{
			if(match[1]) // Double quoted
				params.push(match[1]);
			else if(match[2]) // Single quoted
				params.push(match[2]);
			else if(match[3]) // Double-square-bracket quoted
				params.push(match[3]);
			else if(match[4]) // Unquoted
				params.push(match[4]);
			}
	} while(match);
	return params;
}

//
// Function: String.readBracketedList
// Parses a list of bracketed links -- e.g. *[[my link]]*.
//
// Parameters:
// none
//
// Returns:
// an array of link titles.
//

String.prototype.readBracketedList = function()
{
	var bracketedPattern = "\\[\\[([^\\]]+)\\]\\]";
	var unbracketedPattern = "[^\\s$]+";
	var pattern = "(?:" + bracketedPattern + ")|(" + unbracketedPattern + ")";
	var re = new RegExp(pattern,"mg");
	var tiddlerNames = [];
	do {
		var match = re.exec(this);
		if(match)
			{
			if(match[1]) // Bracketed
				tiddlerNames.push(match[1]);
			else if(match[2]) // Unbracketed
				tiddlerNames.push(match[2]);
			}
	} while(match);
	return(tiddlerNames);
}

//
// Function: String.trim
// Removes whitespace from the beginning and end of a string.
//
// Parameters:
// none
//
// Returns:
// The trimmed string.
//

// Trim whitespace from both ends of a string
String.prototype.trim = function()
{
	var regexpTrim = new RegExp("^\\s*(.*?)\\s*$","mg");
	return(this.replace(regexpTrim,"$1"));
}

//
// Function: Array.indexOf
// Works like String.indexOf.
//

Array.prototype.indexOf || (Array.prototype.indexOf = function(v,n){
  n = (n==null)?0:n; var m = this.length;
  for(var i = n; i < m; i++)
    if(this[i] == v)
       return i;
  return -1;
});
//
// Section: Effects
//

//
// Function: fade
// Fades a DOM element in or out.
// 
// Parameters:
// el - the element to fade
// options - an object of options to use. This object must have a *fade*
//					 property, which should be either the string 'in' or 'out',
//					 corresponding to the direction of the fade. The second
//					 property used here, *onComplete*, is a function that is called
//					 once the fade is complete. This is optional.
//
// Returns:
// nothing
//

function fade (el, options)
{
	var current;
	var proxy = el.cloneNode(true);
	var direction = (options.fade == 'in') ? 1 : -1;
	
	el.parentNode.replaceChild(proxy, el);
	
	if (options.fade == 'in')
	{
		current = 0;
		proxy.style.visibility = 'visible';
	}
	else
		current = 1;

	setOpacity(proxy, current);	
	var interval = window.setInterval(tick, 25);
	
	function tick()
	{
		current += 0.05 * direction;
		
		setOpacity(proxy, Math.easeInOut(current));
		
		if (((direction == 1) && (current >= 1))
				|| ((direction == -1) && (current <= 0)))
		{
			el.style.visibility = (options.fade == 'in') ? 'visible' : 'hidden';
			proxy.parentNode.replaceChild(el, proxy);
			delete proxy;
			window.clearInterval(interval);	
			
			if (options.onComplete)
				options.onComplete();
		}
	};
	
	function setOpacity (el, opacity)
	{						
		var percent = Math.floor(opacity * 100);
			
		// IE
		el.style.zoom = 1;
		el.style.filter = 'alpha(opacity=' + percent + ')';
					
		// CSS 3
		el.style.opacity = opacity;
	};
};

//
// Function: scrollWindowTo
// This scrolls the browser window to ensure that a DOM element is
// in view. Make sure that the element has been added to the page
// before calling this function.
//
// Parameters:
// el - the element to scroll to.
//
// Returns:
// nothing
//

function scrollWindowTo (el)
{
	var start = window.scrollY ? window.scrollY : document.body.scrollTop;
	var end = ensureVisible(el);
	var distance = Math.abs(start - end);
	var progress = 0;
	var direction = (start > end) ? -1 : 1;
	var interval = window.setInterval(tick, 25);
	
	function tick()
	{
		progress += 0.1;
		window.scrollTo(0, start + direction * (distance * Math.easeInOut(progress)));
				
		if (progress >= 1)
			window.clearInterval(interval);
	};
	
	function ensureVisible (el)
	{
		var posTop = findPosY(el);
		var posBottom = posTop + el.offsetHeight;
		var winTop = window.scrollY ? window.scrollY : document.body.scrollTop;
		var winHeight = window.innerHeight ? window.innerHeight : document.body.clientHeight;
		var winBottom = winTop + winHeight;
				
		if (posTop < winTop)
			return posTop;
		else if (posBottom > winBottom)
		{
			if (el.offsetHeight < winHeight)
				return (posTop - (winHeight - el.offsetHeight) + 20);
			else
				return posTop;
		}
		else
			return posTop;
	};
	
	function findPosY (el)
	{
		var curtop = 0;
		while (el.offsetParent)
		{
			curtop += el.offsetTop;
			el = el.offsetParent;
		}
		return curtop;	
	};
}
//
// Class: History
//
// A class used to manage the state of the story -- displaying new passages
// and rewinding to the past.
//
// Property: History
// An array representing the state of the story. history[0] is the current
// state, history[1] is the state just before the present, and so on.
// Each entry in the history is an object with two properties.
//
// *passage* corresponds to the <Passage> just displayed.
//
// *variables* is in itself an object. Each property is a variable set
// by the story via the <<set>> macro.
//
// *hash* is a URL hash guaranteed to load that specific point in time.
//

//
// Constructor: History
// Initializes a History object.
// 
// Parameters:
// none
//

function History()
{
	this.history = [{ passage: null, variables: {}, hash: null }];
};

//
// Method: init
// This first attempts to restore the state of the story via the <restore>
// method. If that fails, it then either displays the passages linked in the
// *StartPassages* passage, or gives up and tries to display a passage
// named *Start*.
//
// Parameters:
// none
//
// Returns:
// nothing
//

History.prototype.init = function()
{
	var self = this;

	if (! this.restore())
		this.display('Start', null);
	
	this.hash = window.location.hash;
	this.interval = window.setInterval(function() { self.watchHash.apply(self) }, 250);
};

//
// Method: display
// Displays a passage on the page.
//
// Parameters:
// title - the title of the passage to display.
// link - the DOM element corresponding to the link that was clicked to
// view the passage. This parameter has no effect but is maintained
// for Jonah compatibility.
// render - may be either "quietly" or "offscreen". If a "quietly" value
// is passed, the passage's appearance is not animated. "offscreen"
// asks that the passage be rendered, but not displayed at all. This
// parameter is optional. If it is omitted, then the passage's appearance
// is animated.
//
// Returns:
// The DOM element containing the passage on the page.
//

History.prototype.display = function (title, link, render)
{	
	
	// create a fresh entry in the history
	
	var passage = tale.get(title);
	
	this.history.unshift({ passage: passage,
													variables: clone(this.history[0].variables) } );
	this.history[0].hash = this.save();
	
	// add it to the page
	
	var div = passage.render();
	
	if (render != 'offscreen')
	{
		removeChildren($('passages'));			
		$('passages').appendChild(div);
		
		// animate its appearance
		
		if (render != 'quietly')
			fade(div, { fade: 'in' });
	}
	
	if ((render == 'quietly') || (render == 'offscreen'))
		div.style.visibility = 'visible';
	
	if (render != 'offscreen')
	{
		document.title = tale.title;
		this.hash = this.save();
	
		if (passage.title != 'Start')
		{
			document.title += ': ' + passage.title;
			window.location.hash = this.hash;
		};
		
		window.scroll(0, 0);
	};
	
	return div;	
};

//
// Method: restart
// Restarts the story from the beginning. This actually forces the
// browser to refresh the page.
//
// Parameters:
// none
//
// Returns:
// none
//

History.prototype.restart = function()
{
	// clear any bookmark
	// this has the side effect of forcing a page reload
	// (in most cases)
	
	window.location.hash = '';
};

//
// Method: save
// Appends a hash to the page's URL that will be later
// read by the <restore> method. How this is generated is not
// guaranteed to remain constant in future releases -- but it
// is guaranteed to be understood by <restore>.
//
// Parameters:
// none
//
// Returns:
// nothing
//

History.prototype.save = function (passage)
{
	var order = '';

	// encode our history
	
	for (var i = this.history.length - 1; i >= 0; i--)
	{
		if ((this.history[i].passage) && (this.history[i].passage.id))
			order += this.history[i].passage.id.toString(36) + '.';
	};
	
	// strip the trailing period
	
	return '#' + order.substr(0, order.length - 1);
};

//
// Method: restore
// Attempts to restore the state of the story as saved by <save>.
//
// Parameters:
// none
//
// Returns:
// Whether this method actually restored anything.
//

History.prototype.restore = function ()
{
	try
	{
		if ((window.location.hash == '') || (window.location.hash == '#'))
			return false;
	
		var order = window.location.hash.replace('#', '').split('.');
		var passages = [];
		
		// render the passages in the order the reader clicked them
		// we only show the very last one
		
		for (var i = 0; i < order.length; i++)
		{
			var id = parseInt(order[i], 36);
			
			if (! tale.has(id))
				return false;
			
			
			var method = (i == order.length - 1) ? '' : 'offscreen';
			passages.unshift(this.display(id, null, method));
		};
		
		return true;
	}
	catch (e)
	{
		return false;
	};
};

//
// Method: watchHash
// Watches the browser's address bar for changes in its hash, and
// calls <restore> accordingly. This is set to run at an interval
// in <init>.
//
// Parameters:
// none
//
// Returns:
// nothing
//

History.prototype.watchHash = function()
{
	if (window.location.hash != this.hash)
	{	
				
		if ((window.location.hash != '') && (window.location.hash != '#'))
		{
			this.history = [{ passage: null, variables: {} }];
			removeChildren($('passages'));
			
			$('passages').style.visibility = 'hidden';
			
			if (! this.restore())
				alert('The passage you had previously visited could not be found.');
			
			$('passages').style.visibility = 'visible';
		}
		else
			window.location.reload();
		
		this.hash = window.location.hash;
	}
};

//
// Initialization
//

var version =
{
	major: 2, minor: 0, revision: 0,
	date: new Date('July 30, 2007'),
	extensions: {}
};

// passage storage and story history
var tale, state;

// Macros
var macros = {};

//
// Function: main
//
// Loads the story from the storage div, initializes macros and
// custom stylesheets, and displays the first passages of the story.
//
// Returns:
// nothing
// 

function main()
{	
	tale = new Tale();
	document.title = tale.title;

	setPageElement('storyTitle', 'StoryTitle', 'Untitled Story');
	
	if (tale.has('StoryAuthor'))
	{
		$('titleSeparator').innerHTML = '<br />';
		setPageElement('storyAuthor', 'StoryAuthor', '');
	};
	
	if (tale.has('StoryMenu'))
	{
		$('storyMenu').style.display = 'block';
		setPageElement('storyMenu', 'StoryMenu', '');
	};

	// initialize macros
	
	for (macro in macros)
		if (typeof macro.init == 'function')
			macro.init();
	
	// process passages tagged 'stylesheet'
	
	var styles = tale.lookup('tags', 'stylesheet');
	
	for (var i = 0; i < styles.length; i++)
		addStyle(styles[i].text);
		
	// process passages tagged 'script'
	
	var scripts = tale.lookup('tags', 'script');
		
	for (var i = 0; i < scripts.length; i++)
		try
		{
			 eval(scripts[i].text);
		}
		catch (e)
		{		
			alert('There is a technical problem with this story (' +
						scripts[i].title + ': ' + e.message + '). You may be able ' +
						'to continue reading, but all parts of the story may not ' +
						'work properly.');

		};
			
	// initialize history and display initial passages
	
	state = new History();
	state.init();
		
}
Interface =
{
	init: function()
	{
		main();
		$('snapback').onclick = Interface.showSnapback;
		$('restart').onclick = Interface.restart;
		$('share').onclick = Interface.showShare;
	},
	
	restart: function()
	{
		if (confirm('Are you sure you want to restart this story?'))
			state.restart();
	},
	
	showShare: function (event)
	{
		Interface.hideAllMenus();
		Interface.showMenu(event, $('shareMenu'))
	},
	
	showSnapback: function (event)
	{
		Interface.hideAllMenus();
		Interface.buildSnapback();
		Interface.showMenu(event, $('snapbackMenu'));
	},
	
	buildSnapback: function()
	{
		var hasItems = false;
		
		removeChildren($('snapbackMenu'));
	
		for (var i = state.history.length - 1; i >= 0; i--)
			if (state.history[i].passage &&
					state.history[i].passage.tags.indexOf('bookmark') != -1)
			{
				var el = document.createElement('div');
				el.hash = state.history[i].hash;
				el.onclick = function() { window.location.hash = this.hash };
				el.innerHTML = state.history[i].passage.excerpt();
				$('snapbackMenu').appendChild(el);
				hasItems = true;
			};
			
		if (! hasItems)
		{
			var el = document.createElement('div');
			el.innerHTML = '<i>No passages available</i>';
			$('snapbackMenu').appendChild(el);
		};
	},
	
	hideAllMenus: function()
	{
		$('shareMenu').style.display = 'none';	
		$('snapbackMenu').style.display = 'none';	
	},
	
	showMenu: function (event, el)
	{
		if (! event)
			event = window.event;
	
		var pos = { x: 0, y: 0 };

		if (event.pageX || event.pageY)
		{
			pos.x = event.pageX;
			pos.y = event.pageY;
		}
		else
			if (event.clientX || event.clientY)
			{
			pos.x = event.clientX + document.body.scrollLeft
  					 	+ document.documentElement.scrollLeft;
			pos.y = event.clientY + document.body.scrollTop
							+ document.documentElement.scrollTop;
			};
			
		el.style.top = pos.y + 'px';
		el.style.left = pos.x + 'px';
		el.style.display = 'block';
		document.onclick = Interface.hideAllMenus;
		event.cancelBubble = true;

		if (event.stopPropagation)
			event.stopPropagation();		
	}
};

window.onload = Interface.init;

//
// Jonah macros
//
// These provide various facilities to stories.
//

// <<back>>

version.extensions.backMacro = {major: 1, minor: 0, revision: 0};

macros['back'] = 
{
	handler: function (place, name, params)
	{
		var hash = '';
		
		if (params[0])
		{
			for (var i = 0; i < state.history.length; i++)
				if (state.history[i].passage.title == params[0])
				{
					hash = state.history[i].hash;
					break;
				};
				
			if (hash == '')
			{
				throwError(place, "can't find passage \"" + params[0] + '" in history');
				return;
			};
		}
		else
			hash = state.history[1].hash;

		el = document.createElement('a');
		el.className = 'back';
		el.href = hash;
		el.innerHTML = '<b>&laquo;</b> Back';
		place.appendChild(el);	
	}
};

// <<display>>

version.extensions.displayMacro = {major: 1, minor: 0, revision: 0};

macros['display'] =
{
	handler: function (place, name, params)
	{
		new Wikifier(place, tale.get(params[0]).text);
	}
};

// <<actions>>

version.extensions.actionsMacro = { major: 1, minor: 1, revision: 0 };

macros['actions'] =
{
	clicked: new Object(),
	
	handler: function (place, macroName, params)
	{
		var list = insertElement(place, 'ul');
		
		for (var i = 0; i < params.length; i++)
		{
			if (macros['actions'].clicked[params[i]])
				continue;
					
			var item = insertElement(list, 'li');
			var link = Wikifier.createInternalLink(item, params[i]);
			insertText(link, params[i]);
			
			// rewrite the function in the link
					
			link.onclick = function()
			{
				macros['actions'].clicked[this.id] = true;
				state.display(this.id, link);
			};
		};
	}
};

// <<print>>

version.extensions.printMacro = { major: 1, minor: 1, revision: 0 };

macros['print'] =
{
	handler: function (place, macroName, params, parser)
	{		
		try
		{
			var output = eval(parser.fullArgs());
			if (output)
				new Wikifier(place, output.toString());
		}
		catch (e)
		{
			throwError(place, 'bad expression: ' + e.message);
		}
	}
};

// <<set>>

version.extensions.setMacro = { major: 1, minor: 1, revision: 0 };

macros['set'] = 
{  
  handler: function (place, macroName, params, parser)
  {
  	macros['set'].run(parser.fullArgs());
  },
  
  run: function (expression)
  {
  	// you may call this directly from a script passage
  	
  	try
  	{
	  	return eval(Wikifier.parse(expression));
  	}
  	catch (e)
  	{
  		throwError(place, 'bad expression: ' + e.message);
  	};
  }
};

// <<if>>, <<else>>, and <<endif>>

version.extensions['ifMacros'] = { major: 1, minor: 0, revision: 0};

macros['if'] =
{
	handler: function (place, macroName, params, parser)
	{
		var condition = parser.fullArgs();
		var srcOffset = parser.source.indexOf('>>', parser.matchStart) + 2;
		var src = parser.source.slice(srcOffset);
		var endPos = -1;
		var trueClause = '';
		var falseClause = '';
		
		for (var i = 0, nesting = 1, currentClause = true; i < src.length; i++)
		{
			if (src.substr(i, 9) == '<<endif>>')
			{
				nesting--;
								
				if (nesting == 0)
				{
					endPos = srcOffset + i + 9; // length of <<endif>>
					break;
				}
			}
			
			if ((src.substr(i, 8) == '<<else>>') && (nesting == 1))
			{
				currentClause = 'false';
				i += 8;
			}
			
			if (src.substr(i, 5) == '<<if ')
				nesting++;
						
			if (currentClause == true)
				trueClause += src.charAt(i);
			else
				falseClause += src.charAt(i);
		};
		
		// display the correct clause
		
		try
		{
			if (eval(condition))
				new Wikifier(place, trueClause.trim());
			else
				new Wikifier(place, falseClause.trim());
		
			// push the parser past the entire expression
					
			if (endPos != -1)
				parser.nextMatch = endPos;
			else
				throwError(place, "can't find matching endif");
		}
		catch (e)
		{
			throwError(place, 'bad condition: ' + e.message);
		};
	}
};

macros['else'] = macros['endif'] = { handler: function() {} };

// <<remember>>

version.extensions.rememberMacro = {major: 1, minor: 0, revision: 0};

macros['remember'] =
{
	handler: function (place, macroName, params, parser)
	{
		var statement = parser.fullArgs();
		var expire = new Date();
		var variable, value;

		// evaluate the statement if any
		
		macros['set'].run(statement);
		
		// find the variable to save
		
		variable = statement.match(new RegExp(Wikifier.parse('$') + '(\\w+)', 'i'))[1];
		value = eval(Wikifier.parse('$' + variable));
						
		// simple JSON-like encoding
		
		switch (typeof value)
		{
			case 'string':
			value = '"' + value.replace(/"/g, '\\"') + '"';
			break;
			
			case 'number':
			case 'boolean':
			break;
			
			default:
			throwError(place, "can't remember $" + variable + ' (' + (typeof value) +
								 ')');
			return;
		};
		
		// save the variable as a cookie
		
		expire.setYear(expire.getFullYear() + 1);
		document.cookie = macros['remember'].prefix + variable +
											'=' + value + '; expires=' + expire.toGMTString();
	},
	
	init: function()
	{	
		// figure out our cookie prefix
		
		if (tale.has('StoryTitle'))
			macros['remember'].prefix = tale.get('StoryTitle').text + '_';
		else
			macros['remember'].prefix = '__jonah_';
	
		// restore all cookie'd values to local variables
		
		var cookies = document.cookie.split(';');
		
		for (var i = 0; i < cookies.length; i++)
		{
			var bits = cookies[i].split('=');
			
			if (bits[0].trim().indexOf(this.prefix) == 0)
			{
				// replace our cookie prefix with $ and evaluate the statement
				
				var statement = cookies[i].replace(this.prefix, '$');
				eval(Wikifier.parse(statement));
			};
		}
	}
};

// <<silently>>

version.extensions['SilentlyMacro'] = { major: 1, minor: 0, revision: 0 };

macros['silently'] =
{
	handler: function (place, macroName, params, parser)
	{
		var buffer = insertElement(null, 'div');
		var srcOffset = parser.source.indexOf('>>', parser.matchStart) + 2;
		var src = parser.source.slice(srcOffset);
		var endPos = -1;
		var silentText = '';

		for (var i = 0; i < src.length; i++)
		{
			if (src.substr(i, 15) == '<<endsilently>>')
				endPos = srcOffset + i + 15;
			else
				silentText += src.charAt(i);
		};
		
		if (endPos != -1)
		{
			new Wikifier(buffer, silentText);
			parser.nextMatch = endPos;
		}
		else
			throwError(place, "can't find matching endsilently");
		
		delete buffer;
	}
};

macros['endsilently'] =
{
	handler: function() { }
};
//
// Class: Passage
//
// This class represents an individual passage.
// This is analogous to the Tiddler class in the core TiddlyWiki code.
//
// Property: title
// The title of the passage, displayed at its top.
//
// Property: id
// An internal id of the passage. This is never seen by the reader,
// but it is used by the <History> class.
//
// Property: initialText
// The initial text of the passage. This is used by the reset method.
//
// Property: text
// The current text of the passage. This is usually the same as
// the <initialText> property, though macros such as <<choice>>
// may alter it.
//
// Property: tags
// An array of strings, each corresponding to a tag the passage belongs to.
//

//
// Constructor: Passage
//
// Initializes a new Passage object. You may either call this with
// a DOM element, which creates the passage from the text stored in the
// element, or you may pass only a title, 
//
// Parameters:
// title - the title of the passage to create. This parameter is required.
// el - the DOM element storing the content of the passage.
// This parameter is optional. If it is omitted, "this passage does not
// exist" is used as the passage's content.
// order - the order in which this passage was retrieved from the
// document's *storeArea* div. This is used to generate the passage's id.
// This parameter is optional, but should be included if el is specified.
//

function Passage (title, el, order)
{	
	this.title = title;

	if (el)
	{
		this.id = order;	
		this.initialText = this.text = Passage.unescapeLineBreaks(el.firstChild ? el.firstChild.nodeValue : "");
		this.tags = el.getAttribute("tags");
		
		if (typeof this.tags == 'string')
			this.tags = this.tags.readBracketedList();
		else
			this.tags = [];
	}
	else
	{
		this.initialText = this.text = '@@This passage does not exist.@@';
		this.tags = [];
	};
};

//
// Method: render
// 
// Renders the passage to a DOM element, including its title, toolbar,
// and content. It's up to the caller to add this to the DOM tree appropriately
// and animate its appearance.
//
// Parameters:
// none
//
// Returns:
// nothing
//

Passage.prototype.render = function()
{
	// construct passage
	
	var passage = insertElement(null, 'div', 'passage' + this.title, 'passage');
	passage.style.visibility = 'hidden';
	
	insertElement(passage, 'div', '', 'header');
		
	var body = insertElement(passage, 'div', '', 'content');
	new Wikifier(body, this.text);
	
	insertElement(passage, 'div', '', 'footer');
	
	
	return passage;
};

//
// Method: reset
// 
// Resets the passage's <text> property to its <initialText> property.
// This does not directly affect anything displayed on the page.
//
// Parameters:
// none
//
// Returns:
// nothing
//

Passage.prototype.reset = function()
{
	this.text = this.initialText;
};

//
// Method: excerpt
//
// Returns a brief excerpt of the passage's content.
//
// Parameters:
// none
//
// Returns:
// a string excerpt
//

Passage.prototype.excerpt = function()
{
	var text = this.text.replace(/<<.*?>>/g, '');
	text = text.replace(/!.*?\n/g, '');
	text = text.replace(/[\[\]\/]/g, '');
	var matches = text.match(/(.*?\s.*?\s.*?\s.*?\s.*?\s.*?\s.*?)\s/);
	return matches[1] + '...';
};

//
// Method: unescapeLineBreaks
// 
// A static function used by the constructor to convert string literals
// used by TiddlyWiki to indicate newlines into actual newlines.
//
// Parameters:
// text - a string to unescape
//
// Returns:
// a converted string
//

Passage.unescapeLineBreaks = function (text)
{
	if(text && text != "")
		return text.replace(/\\n/mg,"\n").replace(/\\/mg,"\\").replace(/\r/mg,"");
	else
		return "";
};
//
// Class: Tale
//
// Used to provide access to passages. This is analogous to the
// TiddlyWiki class in the core TiddlyWiki code.
//
// Property: passages
// An associative array of <Passage> objects in the story.
// The key for this array is the title of the passage.
//

//
// Constructor: Tale
//
// Initializes a new Tale object with the contents of the
// DOM element with the id *storeArea*, constructing new <Passage>s
// as it traverses the tree.
//
// Parameters:
// none
//

function Tale()
{	
	this.passages = {};

	if (document.normalize)
		document.normalize();
		
	var store = $('storeArea').childNodes;
	
	for (var i = 0; i < store.length; i++)
	{
		var el = store[i];
				
		if (el.getAttribute && (tiddlerTitle = el.getAttribute('tiddler')))
			this.passages[tiddlerTitle] = new Passage(tiddlerTitle, el, i);
	};
	
	this.title = 'Sugarcane';
	
	if (this.passages['StoryTitle'])
		this.title = this.passages['StoryTitle'].text;
};

//
// Method: has
//
// Checks whether the tale has a passage with either the title
// passed (if the key parameter is a string) or an id (if
// a number is passed instead).
//
// Parameters:
// key - the title or id of the passage to search for
//
// Returns:
// boolean
//

Tale.prototype.has = function (key)
{
	// returns whether a passage exists
		
	if (typeof key == 'string')
		return (this.passages[key] != null);
	else
	{
		for (i in this.passages)			
			if (this.passages[i].id == key)
				return true;
				
		return false;
	};
};

//
// Method: get
//
// A getter function that returns a certain <Passage> object belonging
// to the tale. You may either retrieve a passage by its title or id.
//
// Parameters:
// key - the title or id of the passage to retrieve
//
// Returns:
// A <Passage> object. If no passage exists matching the passed key,
// a null value is returned.
//
// See also:
// <Tale.lookup>
//

Tale.prototype.get = function (key)
{
	// returns a passage either by title or its id

	if (typeof key == 'string')
		return this.passages[key] || new Passage(key);
	else		
		for (i in this.passages)
			if (this.passages[i].id == key)
				return this.passages[i];
};

//
// Method: lookup
//
// Searches the Tale for all passages matching a certain criteria.
// You may optionally specify a secondary field to sort the results on.
//
// Parameters:
// field - the name of the <Passage> property to search on
// value - the value to match
// sortField - the name of the <Passage> property to sort matches on.
// This always sorts in descending order. If you need ascending order,
// use the Array class's reverse() method.
//
// Returns:
// An array of <Passage>s. If no passages met the search criteria,
// an empty array is returned.
//
// See also:
// <Tale.get>
//

Tale.prototype.lookup = function(field, value, sortField)
{
	var results = [];
	for (var t in this.passages)
	{
		var passage = this.passages[t];
		var found = false;
		
		for (var i = 0; i < passage[field].length; i++)
			if (passage[field][i] == value)
				results.push(passage);
	}

	if (! sortField)
		sortField = 'title';

	results.sort(function (a,b) {if(a[sortField] == b[sortField]) return(0); else return (a[sortField] < b[sortField]) ? -1 : +1; });
	
	return results;
};

//
// Method: reset
//
// Calls the <Passage.reset> method on all <Passage>s in the tale, restoring
// the story to its initial state.
//
// Parameters:
// none
//
// Returns:
// nothing
//

Tale.prototype.reset = function()
{
	
	for (i in this.passages)
		this.passages[i].reset();
};
//
// Class: Wikifier
//
// Used to display text on the page. This is taken more or less verbatim
// from the TiddlyWiki core code, though not all formatters are available
// (notably the WikiWord link).
// 


//
// Constructor: Wikifier
// Wikifies source text into a DOM element. Any pre-existing contents are
// appended to. This should be used in place of TiddlyWiki's wikify()
// function.
//
// Parameters:
// place - the DOM element to render into 
// source - the source text to render
//
// Returns:
// nothing
//

function Wikifier(place, source)
{
	this.source = source;
	this.output = place;
	this.nextMatch = 0;
	this.assembleFormatterMatches(Wikifier.formatters);

	this.subWikify(this.output);
};

Wikifier.prototype.assembleFormatterMatches = function (formatters)
{
	this.formatters = [];
	var pattern = [];

	for(var n = 0; n < formatters.length; n++)
	{
		pattern.push("(" + formatters[n].match + ")");
		this.formatters.push(formatters[n]);
	};
		
	this.formatterRegExp = new RegExp(pattern.join("|"),"mg");
};

Wikifier.prototype.subWikify = function (output, terminator)
{
	// Temporarily replace the output pointer
	
	var oldOutput = this.output;
	this.output = output;
	
	// Prepare the terminator RegExp
	
	var terminatorRegExp = terminator ? new RegExp("(" + terminator + ")","mg") : null;
	do
	{
		// Prepare the RegExp match positions
	
		this.formatterRegExp.lastIndex = this.nextMatch;
		
		if(terminatorRegExp)
			terminatorRegExp.lastIndex = this.nextMatch;
		
		// Get the first matches
		
		var formatterMatch = this.formatterRegExp.exec(this.source);
		var terminatorMatch = terminatorRegExp ? terminatorRegExp.exec(this.source) : null;
		
		// Check for a terminator match
		
		if (terminatorMatch && (!formatterMatch || terminatorMatch.index <= formatterMatch.index))
		{
			// Output any text before the match

			if(terminatorMatch.index > this.nextMatch)
				this.outputText(this.output,this.nextMatch,terminatorMatch.index);

			// Set the match parameters

			this.matchStart = terminatorMatch.index;
			this.matchLength = terminatorMatch[1].length;
			this.matchText = terminatorMatch[1];
			this.nextMatch = terminatorMatch.index + terminatorMatch[1].length;

			// Restore the output pointer and exit

			this.output = oldOutput;
			return;		
		}
		// Check for a formatter match
		else if (formatterMatch)
			{
			// Output any text before the match
			
			if (formatterMatch.index > this.nextMatch)
				this.outputText(this.output,this.nextMatch,formatterMatch.index);
				
			// Set the match parameters
			
			this.matchStart = formatterMatch.index;
			this.matchLength = formatterMatch[0].length;
			this.matchText = formatterMatch[0];
			this.nextMatch = this.formatterRegExp.lastIndex;
			
			// Figure out which formatter matched
			
			var matchingformatter = -1;
			for (var t = 1; t < formatterMatch.length; t++)
				if (formatterMatch[t])
					matchingFormatter = t-1;
					
			// Call the formatter
			
			if (matchingFormatter != -1)
				this.formatters[matchingFormatter].handler(this);
			}
	}
	while (terminatorMatch || formatterMatch);
	
	// Output any text after the last match
	
	if(this.nextMatch < this.source.length)
	{
		this.outputText(this.output,this.nextMatch,this.source.length);
		this.nextMatch = this.source.length;
	};

	// Restore the output pointer
	this.output = oldOutput;
};

Wikifier.prototype.outputText = function(place, startPos, endPos)
{
	insertText(place, this.source.substring(startPos,endPos));
};

//
// Method: fullArgs
// Meant to be called by macros, this returns the text
// passed to the currently executing macro. Unlike TiddlyWiki's
// default mechanism, this does not attempt to split up the arguments
// into an array, thought it does do some magic with certain Twee operators
// (like gt, eq, and $variable).
//
// Parameters:
// none
//
// Returns:
// a parsed string of arguments
//

Wikifier.prototype.fullArgs = function()
{
	var startPos = this.source.indexOf(' ', this.matchStart);
	var endPos = this.source.indexOf('>>', this.matchStart);
	
	return Wikifier.parse(this.source.slice(startPos, endPos));
};

Wikifier.parse = function (expression)
{
	var result = expression.replace(/\$/g, 'state.history[0].variables.');
	result = result.replace(/\beq\b/gi, ' == ');
	result = result.replace(/\bneq\b/gi, ' != ');
	result = result.replace(/\bgt\b/gi, ' > ');
	result = result.replace(/\beq\b/gi, ' == ');
	result = result.replace(/\bneq\b/gi, ' != ');
	result = result.replace(/\bgt\b/gi, ' > ');
	result = result.replace(/\bgte\b/gi, ' >= ');
	result = result.replace(/\blt\b/gi, ' < ');
	result = result.replace(/\blte\b/gi, ' <= ');
	result = result.replace(/\band\b/gi, ' && ');
	result = result.replace(/\bor\b/gi, ' || ');
	result = result.replace(/\bnot\b/gi, ' ! ');

	return result;
};



Wikifier.formatHelpers =
{
	charFormatHelper: function(w)
	{
		var e = insertElement(w.output,this.element);
		w.subWikify(e,this.terminator);
	},
	
	inlineCssHelper:  function(w)
	{
		var styles = [];
		var lookahead = "(?:(" + Wikifier.textPrimitives.anyLetter + "+)\\(([^\\)\\|\\n]+)(?:\\):))|(?:(" + Wikifier.textPrimitives.anyLetter + "+):([^;\\|\\n]+);)";
		var lookaheadRegExp = new RegExp(lookahead,"mg");
		var hadStyle = false;
		do {
			lookaheadRegExp.lastIndex = w.nextMatch;
			var lookaheadMatch = lookaheadRegExp.exec(w.source);
			var gotMatch = lookaheadMatch && lookaheadMatch.index == w.nextMatch;
			if(gotMatch)
				{
				var s,v;
				hadStyle = true;
				if(lookaheadMatch[1])
					{
					s = lookaheadMatch[1].unDash();
					v = lookaheadMatch[2];
					}
				else
					{
					s = lookaheadMatch[3].unDash();
					v = lookaheadMatch[4];
					}
				switch(s)
					{
					case "bgcolor": s = "backgroundColor"; break;
					}
				styles.push({style: s, value: v});
				w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
				}
		} while(gotMatch);
		return styles;
	},

	monospacedByLineHelper: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart)
			{
			var text = lookaheadMatch[1];
			
			// IE specific hack
			
			if (navigator.userAgent.indexOf("msie") != -1 && navigator.userAgent.indexOf("opera") == -1)
				text = text.replace(/\n/g,"\r");
			var e = insertElement(w.output,"pre",null,null,text);
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			}
	}
};


Wikifier.formatters = [
{
	name: "table",
	match: "^\\|(?:[^\\n]*)\\|(?:[fhc]?)$",
	lookahead: "^\\|([^\\n]*)\\|([fhc]?)$",
	rowTerminator: "\\|(?:[fhc]?)$\\n?",
	cellPattern: "(?:\\|([^\\n\\|]*)\\|)|(\\|[fhc]?$\\n?)",
	cellTerminator: "(?:\\x20*)\\|",
	rowTypes: {"c": "caption", "h": "thead", "": "tbody", "f": "tfoot"},
	handler: function(w)
	{
		var table = insertElement(w.output,"table");
		w.nextMatch = w.matchStart;
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		var currRowType = null, nextRowType;
		var rowContainer, rowElement;
		var prevColumns = [];
		var rowCount = 0;
		do {
			lookaheadRegExp.lastIndex = w.nextMatch;
			var lookaheadMatch = lookaheadRegExp.exec(w.source);
			var matched = lookaheadMatch && lookaheadMatch.index == w.nextMatch;
			if(matched)
				{
				nextRowType = lookaheadMatch[2];
				if(nextRowType != currRowType)
					rowContainer = insertElement(table,this.rowTypes[nextRowType]);
				currRowType = nextRowType;
				if(currRowType == "c")
					{
					if(rowCount == 0)
						rowContainer.setAttribute("align","top");
					else
						rowContainer.setAttribute("align","bottom");
					w.nextMatch = w.nextMatch + 1;
					w.subWikify(rowContainer,this.rowTerminator);
					}
				else
					{
					rowElement = insertElement(rowContainer,"tr");
					this.rowHandler(w,rowElement,prevColumns);
					}
				rowCount++;
				}
		} while(matched);
	},
	rowHandler: function(w,e,prevColumns)
	{
		var col = 0;
		var currColCount = 1;
		var cellRegExp = new RegExp(this.cellPattern,"mg");
		do {
			cellRegExp.lastIndex = w.nextMatch;
			var cellMatch = cellRegExp.exec(w.source);
			matched = cellMatch && cellMatch.index == w.nextMatch;
			if(matched)
				{
				if(cellMatch[1] == "~")
					{
					var last = prevColumns[col];
					if(last)
						{
						last.rowCount++;
						last.element.setAttribute("rowSpan",last.rowCount);
						last.element.setAttribute("rowspan",last.rowCount);
						last.element.valign = "center";
						}
					w.nextMatch = cellMatch.index + cellMatch[0].length-1;
					}
				else if(cellMatch[1] == ">")
					{
					currColCount++;
					w.nextMatch = cellMatch.index + cellMatch[0].length-1;
					}
				else if(cellMatch[2])
					{
					w.nextMatch = cellMatch.index + cellMatch[0].length;;
					break;
					}
				else
					{
					var spaceLeft = false, spaceRight = false;
					w.nextMatch++;
					var styles = Wikifier.formatHelpers.inlineCssHelper(w);
					while(w.source.substr(w.nextMatch,1) == " ")
						{
						spaceLeft = true;
						w.nextMatch++;
						}
					var cell;
					if(w.source.substr(w.nextMatch,1) == "!")
						{
						cell = insertElement(e,"th");
						w.nextMatch++;
						}
					else
						cell = insertElement(e,"td");
					prevColumns[col] = {rowCount: 1, element: cell};
					lastColCount = 1;
					lastColElement = cell;
					if(currColCount > 1)
						{
						cell.setAttribute("colSpan",currColCount);
						cell.setAttribute("colspan",currColCount);
						currColCount = 1;
						}
					for(var t=0; t<styles.length; t++)
						cell.style[styles[t].style] = styles[t].value;
					w.subWikify(cell,this.cellTerminator);
					if(w.matchText.substr(w.matchText.length-2,1) == " ")
						spaceRight = true;
					if(spaceLeft && spaceRight)
						cell.align = "center";
					else if (spaceLeft)
						cell.align = "right";
					else if (spaceRight)
						cell.align = "left";
					w.nextMatch = w.nextMatch-1;
					}
				col++;
				}
		} while(matched);		
	}
},

{
	name: "rule",
	match: "^----$\\n?",
	handler: function(w)
	{
		insertElement(w.output,"hr");
	}
},

{
	name: "emdash",
	match: "--",
	handler: function(w)
	{
		var e = insertElement(w.output,"span");
		e.innerHTML = '&mdash;';
	}
},

{
	name: "heading",
	match: "^!{1,5}",
	terminator: "\\n",
	handler: function(w)
	{
		var e = insertElement(w.output,"h" + w.matchLength);
		w.subWikify(e,this.terminator);
	}
},

{
	name: "monospacedByLine",
	match: "^\\{\\{\\{\\n",
	lookahead: "^\\{\\{\\{\\n((?:^[^\\n]*\\n)+?)(^\\}\\}\\}$\\n?)",
	handler: Wikifier.formatHelpers.monospacedByLineHelper
},

{
	name: "monospacedByLineForPlugin",
	match: "^//\\{\\{\\{\\n",
	lookahead: "^//\\{\\{\\{\\n\\n*((?:^[^\\n]*\\n)+?)(\\n*^//\\}\\}\\}$\\n?)",
	handler: Wikifier.formatHelpers.monospacedByLineHelper
},

{
	name: "wikifyCommentForPlugin", 
	match: "^/\\*\\*\\*\\n",
	terminator: "^\\*\\*\\*/\\n",
	handler: function(w)
	{
		w.subWikify(w.output,this.terminator);
	}
},

{
	name: "quoteByBlock",
	match: "^<<<\\n",
	terminator: "^<<<\\n",
	handler: function(w)
	{
		var e = insertElement(w.output,"blockquote");
		w.subWikify(e,this.terminator);
	}
},

{
	name: "quoteByLine",
	match: "^>+",
	terminator: "\\n",
	element: "blockquote",
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp(this.match,"mg");
		var placeStack = [w.output];
		var currLevel = 0;
		var newLevel = w.matchLength;
		var t;
		do {
			if(newLevel > currLevel)
				{
				for(t=currLevel; t<newLevel; t++)
					placeStack.push(insertElement(placeStack[placeStack.length-1],this.element));
				}
			else if(newLevel < currLevel)
				{
				for(t=currLevel; t>newLevel; t--)
					placeStack.pop();
				}
			currLevel = newLevel;
			w.subWikify(placeStack[placeStack.length-1],this.terminator);
			insertElement(placeStack[placeStack.length-1],"br");
			lookaheadRegExp.lastIndex = w.nextMatch;
			var lookaheadMatch = lookaheadRegExp.exec(w.source);
			var matched = lookaheadMatch && lookaheadMatch.index == w.nextMatch;
			if(matched)
				{
				newLevel = lookaheadMatch[0].length;
				w.nextMatch += lookaheadMatch[0].length;
				}
		} while(matched);
	}
},

{
	name: "list",
	match: "^(?:(?:\\*+)|(?:#+))",
	lookahead: "^(?:(\\*+)|(#+))",
	terminator: "\\n",
	outerElement: "ul",
	itemElement: "li",
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		w.nextMatch = w.matchStart;
		var placeStack = [w.output];
		var currType = null, newType;
		var currLevel = 0, newLevel;
		var t;
		do {
			lookaheadRegExp.lastIndex = w.nextMatch;
			var lookaheadMatch = lookaheadRegExp.exec(w.source);
			var matched = lookaheadMatch && lookaheadMatch.index == w.nextMatch;
			if(matched)
				{
				if(lookaheadMatch[1])
					newType = "ul";
				if(lookaheadMatch[2])
					newType = "ol";
				newLevel = lookaheadMatch[0].length;
				w.nextMatch += lookaheadMatch[0].length;
				if(newLevel > currLevel)
					{
					for(t=currLevel; t<newLevel; t++)
						placeStack.push(insertElement(placeStack[placeStack.length-1],newType));
					}
				else if(newLevel < currLevel)
					{
					for(t=currLevel; t>newLevel; t--)
						placeStack.pop();
					}
				else if(newLevel == currLevel && newType != currType)
					{
						placeStack.pop();
						placeStack.push(insertElement(placeStack[placeStack.length-1],newType));
					}
				currLevel = newLevel;
				currType = newType;
				var e = insertElement(placeStack[placeStack.length-1],"li");
				w.subWikify(e,this.terminator);
				}
		} while(matched);
	}
},

{
	name: "prettyLink",
	match: "\\[\\[",
	lookahead: "\\[\\[([^\\|\\]]*?)(?:(\\]\\])|(\\|(.*?)\\]\\]))",
	terminator: "\\|",
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source)
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart && lookaheadMatch[2]) // Simple bracketted link
			{
			var link = Wikifier.createInternalLink(w.output,lookaheadMatch[1]);
			w.outputText(link,w.nextMatch,w.nextMatch + lookaheadMatch[1].length);
			w.nextMatch += lookaheadMatch[1].length + 2;
			}
		else if(lookaheadMatch && lookaheadMatch.index == w.matchStart && lookaheadMatch[3]) // Pretty bracketted link
			{
			var e;
			if(tale.has(lookaheadMatch[4]))
				e = Wikifier.createInternalLink(w.output,lookaheadMatch[4]);
			else
				e = Wikifier.createExternalLink(w.output,lookaheadMatch[4]);
			w.outputText(e,w.nextMatch,w.nextMatch + lookaheadMatch[1].length);
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			}
	}
},

{
	name: "urlLink",
	match: "(?:http|https|mailto|ftp):[^\\s'\"]+(?:/|\\b)",
	handler: function(w)
	{
		var e = Wikifier.createExternalLink(w.output,w.matchText);
		w.outputText(e,w.matchStart,w.nextMatch);
	}
},

{
	name: "image",
	match: "\\[(?:[<]{0,1})(?:[>]{0,1})[Ii][Mm][Gg]\\[",
	lookahead: "\\[([<]{0,1})([>]{0,1})[Ii][Mm][Gg]\\[(?:([^\\|\\]]+)\\|)?([^\\[\\]\\|]+)\\](?:\\[([^\\]]*)\\]?)?(\\])",
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) // Simple bracketted link
			{
			var e = w.output;
			if (lookaheadMatch[5])
				{
				if (tale.has(lookaheadMatch[5]))
					e = Wikifier.createInternalLink(w.output,lookaheadMatch[5]);
				else
					e = Wikifier.createExternalLink(w.output,lookaheadMatch[5]);
				}
			var img = insertElement(e,"img");
			if(lookaheadMatch[1])
				img.align = "left";
			else if(lookaheadMatch[2])
				img.align = "right";
			if(lookaheadMatch[3])
				img.title = lookaheadMatch[3];
			img.src = lookaheadMatch[4];
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			}
	}
},

{
	name: "macro",
	match: "<<",
	lookahead: "<<([^>\\s]+)(?:\\s*)([^>]*)>>",
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source)
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart && lookaheadMatch[1])
			{
			var params = lookaheadMatch[2].readMacroParams();			
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			try
				{
				var macro = macros[lookaheadMatch[1]];
				
				if (macro && macro.handler)
					macro.handler(w.output,lookaheadMatch[1],params,w);
				else
				{
					insertElement(w.output,"span",null,'marked','macro not found: ' + lookaheadMatch[1]);
				}
				}
			catch(e)
				{
				throwError(w.output, 'Error executing macro ' + lookaheadMatch[1] + ': ' + e.toString());
				}
			}
	}
},

{
	name: "html",
	match: "<[Hh][Tt][Mm][Ll]>",
	lookahead: "<[Hh][Tt][Mm][Ll]>((?:.|\\n)*?)</[Hh][Tt][Mm][Ll]>",
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source)
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart)
			{
			var e = insertElement(w.output,"span");
			e.innerHTML = lookaheadMatch[1];
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			}
	}
},

{
	name: "commentByBlock",
	match: "/%",
	lookahead: "/%((?:.|\\n)*?)%/",
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source)
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart)
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
	}
},

{
	name: "boldByChar",
	match: "''",
	terminator: "''",
	element: "strong",
	handler: Wikifier.formatHelpers.charFormatHelper
},

{
	name: "strikeByChar",
	match: "==",
	terminator: "==",
	element: "strike",
	handler: Wikifier.formatHelpers.charFormatHelper
},

{
	name: "underlineByChar",
	match: "__",
	terminator: "__",
	element: "u",
	handler: Wikifier.formatHelpers.charFormatHelper
},

{
	name: "italicByChar",
	match: "//",
	terminator: "//",
	element: "em",
	handler: Wikifier.formatHelpers.charFormatHelper
},

{
	name: "subscriptByChar",
	match: "~~",
	terminator: "~~",
	element: "sub",
	handler: Wikifier.formatHelpers.charFormatHelper
},

{
	name: "superscriptByChar",
	match: "\\^\\^",
	terminator: "\\^\\^",
	element: "sup",
	handler: Wikifier.formatHelpers.charFormatHelper
},

{
	name: "monospacedByChar",
	match: "\\{\\{\\{",
	lookahead: "\\{\\{\\{((?:.|\\n)*?)\\}\\}\\}",
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source)
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart)
			{
			var e = insertElement(w.output,"code",null,null,lookaheadMatch[1]);
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			}
	}
},

{
	name: "styleByChar",
	match: "@@",
	terminator: "@@",
	lookahead: "(?:([^\\(@]+)\\(([^\\)]+)(?:\\):))|(?:([^:@]+):([^;]+);)",
	handler:  function(w)
	{
		var e = insertElement(w.output,"span",null,null,null);
		var styles = Wikifier.formatHelpers.inlineCssHelper(w);
		if(styles.length == 0)
			e.className = "marked";
		else
			for(var t=0; t<styles.length; t++)
				e.style[styles[t].style] = styles[t].value;
		w.subWikify(e,this.terminator);
	}
},

{
	name: "lineBreak",
	match: "\\n",
	handler: function(w)
	{
		insertElement(w.output,"br");
	}
}
];

Wikifier.textPrimitives =
{
	anyDigit: "[0-9]",
	anyNumberChar: "[0-9\\.E]",
	urlPattern: "(?:http|https|mailto|ftp):[^\\s'\"]+(?:/|\\b)"
};

//
// Method: createInternalLink
// Creates a link to a passage. It automatically classes it so that
// broken links appear broken.
//
// Parameters:
// place - the DOM element to render into
// title - the title of the passage to link to
//
// Returns:
// the newly created link as a DOM element
//

Wikifier.createInternalLink = function (place, title)
{
	var el = insertElement(place, 'a', title);
	el.href = 'javascript:void(0)';
	
	if (tale.has(title))
		el.className = 'internalLink';
	else
		el.className = 'brokenLink';
		
	el.onclick = function() { state.display(title, el) };
		
	if (place)
		place.appendChild(el);
		
	return el;
};

//
// Method: createExternalLink
// Creates a link to an external URL.
//
// Parameters:
// place - the DOM element to render into
// url - the URL to link to
//
// Returns:
// the newly created link as a DOM element
//

Wikifier.createExternalLink = function (place, url)
{	
	var el = insertElement(place, 'a');
	el.href = url;
	el.className = 'externalLink';
	el.target = '_blank';
		
	if (place)
		place.appendChild(el);
		
	return el;
};


// certain versions of Safari do not handle Unicode properly

if(! ((new RegExp("[\u0150\u0170]","g")).test("\u0150")))
{
	Wikifier.textPrimitives.upperLetter = "[A-Z\u00c0-\u00de]";
	Wikifier.textPrimitives.lowerLetter = "[a-z\u00df-\u00ff_0-9\\-]";
	Wikifier.textPrimitives.anyLetter = "[A-Za-z\u00c0-\u00de\u00df-\u00ff_0-9\\-]";
}
else
{
	Wikifier.textPrimitives.upperLetter = "[A-Z\u00c0-\u00de\u0150\u0170]";
	Wikifier.textPrimitives.lowerLetter = "[a-z\u00df-\u00ff_0-9\\-\u0151\u0171]";
	Wikifier.textPrimitives.anyLetter = "[A-Za-z\u00c0-\u00de\u00df-\u00ff_0-9\\-\u0150\u0170\u0151\u0171]";
};
//
// Class: Wikifier
//
// Used to display text on the page. This is taken more or less verbatim
// from the TiddlyWiki core code, though not all formatters are available
// (notably the WikiWord link).
// 


//
// Constructor: Wikifier
// Wikifies source text into a DOM element. Any pre-existing contents are
// appended to. This should be used in place of TiddlyWiki's wikify()
// function.
//
// Parameters:
// place - the DOM element to render into 
// source - the source text to render
//
// Returns:
// nothing
//

function Wikifier(place, source)
{
	this.source = source;
	this.output = place;
	this.nextMatch = 0;
	this.assembleFormatterMatches(Wikifier.formatters);

	this.subWikify(this.output);
};

Wikifier.prototype.assembleFormatterMatches = function (formatters)
{
	this.formatters = [];
	var pattern = [];

	for(var n = 0; n < formatters.length; n++)
	{
		pattern.push("(" + formatters[n].match + ")");
		this.formatters.push(formatters[n]);
	};
		
	this.formatterRegExp = new RegExp(pattern.join("|"),"mg");
};

Wikifier.prototype.subWikify = function (output, terminator)
{
	// Temporarily replace the output pointer
	
	var oldOutput = this.output;
	this.output = output;
	
	// Prepare the terminator RegExp
	
	var terminatorRegExp = terminator ? new RegExp("(" + terminator + ")","mg") : null;
	do
	{
		// Prepare the RegExp match positions
	
		this.formatterRegExp.lastIndex = this.nextMatch;
		
		if(terminatorRegExp)
			terminatorRegExp.lastIndex = this.nextMatch;
		
		// Get the first matches
		
		var formatterMatch = this.formatterRegExp.exec(this.source);
		var terminatorMatch = terminatorRegExp ? terminatorRegExp.exec(this.source) : null;
		
		// Check for a terminator match
		
		if (terminatorMatch && (!formatterMatch || terminatorMatch.index <= formatterMatch.index))
		{
			// Output any text before the match

			if(terminatorMatch.index > this.nextMatch)
				this.outputText(this.output,this.nextMatch,terminatorMatch.index);

			// Set the match parameters

			this.matchStart = terminatorMatch.index;
			this.matchLength = terminatorMatch[1].length;
			this.matchText = terminatorMatch[1];
			this.nextMatch = terminatorMatch.index + terminatorMatch[1].length;

			// Restore the output pointer and exit

			this.output = oldOutput;
			return;		
		}
		// Check for a formatter match
		else if (formatterMatch)
			{
			// Output any text before the match
			
			if (formatterMatch.index > this.nextMatch)
				this.outputText(this.output,this.nextMatch,formatterMatch.index);
				
			// Set the match parameters
			
			this.matchStart = formatterMatch.index;
			this.matchLength = formatterMatch[0].length;
			this.matchText = formatterMatch[0];
			this.nextMatch = this.formatterRegExp.lastIndex;
			
			// Figure out which formatter matched
			
			var matchingformatter = -1;
			for (var t = 1; t < formatterMatch.length; t++)
				if (formatterMatch[t])
					matchingFormatter = t-1;
					
			// Call the formatter
			
			if (matchingFormatter != -1)
				this.formatters[matchingFormatter].handler(this);
			}
	}
	while (terminatorMatch || formatterMatch);
	
	// Output any text after the last match
	
	if(this.nextMatch < this.source.length)
	{
		this.outputText(this.output,this.nextMatch,this.source.length);
		this.nextMatch = this.source.length;
	};

	// Restore the output pointer
	this.output = oldOutput;
};

Wikifier.prototype.outputText = function(place, startPos, endPos)
{
	insertText(place, this.source.substring(startPos,endPos));
};

//
// Method: fullArgs
// Meant to be called by macros, this returns the text
// passed to the currently executing macro. Unlike TiddlyWiki's
// default mechanism, this does not attempt to split up the arguments
// into an array, thought it does do some magic with certain Twee operators
// (like gt, eq, and $variable).
//
// Parameters:
// none
//
// Returns:
// a parsed string of arguments
//

Wikifier.prototype.fullArgs = function()
{
	var startPos = this.source.indexOf(' ', this.matchStart);
	var endPos = this.source.indexOf('>>', this.matchStart);
	
	return Wikifier.parse(this.source.slice(startPos, endPos));
};

Wikifier.parse = function (expression)
{
	var result = expression.replace(/\$/g, 'state.history[0].variables.');
	result = result.replace(/\beq\b/gi, ' == ');
	result = result.replace(/\bneq\b/gi, ' != ');
	result = result.replace(/\bgt\b/gi, ' > ');
	result = result.replace(/\beq\b/gi, ' == ');
	result = result.replace(/\bneq\b/gi, ' != ');
	result = result.replace(/\bgt\b/gi, ' > ');
	result = result.replace(/\bgte\b/gi, ' >= ');
	result = result.replace(/\blt\b/gi, ' < ');
	result = result.replace(/\blte\b/gi, ' <= ');
	result = result.replace(/\band\b/gi, ' && ');
	result = result.replace(/\bor\b/gi, ' || ');
	result = result.replace(/\bnot\b/gi, ' ! ');

	return result;
};



Wikifier.formatHelpers =
{
	charFormatHelper: function(w)
	{
		var e = insertElement(w.output,this.element);
		w.subWikify(e,this.terminator);
	},
	
	inlineCssHelper:  function(w)
	{
		var styles = [];
		var lookahead = "(?:(" + Wikifier.textPrimitives.anyLetter + "+)\\(([^\\)\\|\\n]+)(?:\\):))|(?:(" + Wikifier.textPrimitives.anyLetter + "+):([^;\\|\\n]+);)";
		var lookaheadRegExp = new RegExp(lookahead,"mg");
		var hadStyle = false;
		do {
			lookaheadRegExp.lastIndex = w.nextMatch;
			var lookaheadMatch = lookaheadRegExp.exec(w.source);
			var gotMatch = lookaheadMatch && lookaheadMatch.index == w.nextMatch;
			if(gotMatch)
				{
				var s,v;
				hadStyle = true;
				if(lookaheadMatch[1])
					{
					s = lookaheadMatch[1].unDash();
					v = lookaheadMatch[2];
					}
				else
					{
					s = lookaheadMatch[3].unDash();
					v = lookaheadMatch[4];
					}
				switch(s)
					{
					case "bgcolor": s = "backgroundColor"; break;
					}
				styles.push({style: s, value: v});
				w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
				}
		} while(gotMatch);
		return styles;
	},

	monospacedByLineHelper: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart)
			{
			var text = lookaheadMatch[1];
			
			// IE specific hack
			
			if (navigator.userAgent.indexOf("msie") != -1 && navigator.userAgent.indexOf("opera") == -1)
				text = text.replace(/\n/g,"\r");
			var e = insertElement(w.output,"pre",null,null,text);
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			}
	}
};


Wikifier.formatters = [
{
	name: "table",
	match: "^\\|(?:[^\\n]*)\\|(?:[fhc]?)$",
	lookahead: "^\\|([^\\n]*)\\|([fhc]?)$",
	rowTerminator: "\\|(?:[fhc]?)$\\n?",
	cellPattern: "(?:\\|([^\\n\\|]*)\\|)|(\\|[fhc]?$\\n?)",
	cellTerminator: "(?:\\x20*)\\|",
	rowTypes: {"c": "caption", "h": "thead", "": "tbody", "f": "tfoot"},
	handler: function(w)
	{
		var table = insertElement(w.output,"table");
		w.nextMatch = w.matchStart;
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		var currRowType = null, nextRowType;
		var rowContainer, rowElement;
		var prevColumns = [];
		var rowCount = 0;
		do {
			lookaheadRegExp.lastIndex = w.nextMatch;
			var lookaheadMatch = lookaheadRegExp.exec(w.source);
			var matched = lookaheadMatch && lookaheadMatch.index == w.nextMatch;
			if(matched)
				{
				nextRowType = lookaheadMatch[2];
				if(nextRowType != currRowType)
					rowContainer = insertElement(table,this.rowTypes[nextRowType]);
				currRowType = nextRowType;
				if(currRowType == "c")
					{
					if(rowCount == 0)
						rowContainer.setAttribute("align","top");
					else
						rowContainer.setAttribute("align","bottom");
					w.nextMatch = w.nextMatch + 1;
					w.subWikify(rowContainer,this.rowTerminator);
					}
				else
					{
					rowElement = insertElement(rowContainer,"tr");
					this.rowHandler(w,rowElement,prevColumns);
					}
				rowCount++;
				}
		} while(matched);
	},
	rowHandler: function(w,e,prevColumns)
	{
		var col = 0;
		var currColCount = 1;
		var cellRegExp = new RegExp(this.cellPattern,"mg");
		do {
			cellRegExp.lastIndex = w.nextMatch;
			var cellMatch = cellRegExp.exec(w.source);
			matched = cellMatch && cellMatch.index == w.nextMatch;
			if(matched)
				{
				if(cellMatch[1] == "~")
					{
					var last = prevColumns[col];
					if(last)
						{
						last.rowCount++;
						last.element.setAttribute("rowSpan",last.rowCount);
						last.element.setAttribute("rowspan",last.rowCount);
						last.element.valign = "center";
						}
					w.nextMatch = cellMatch.index + cellMatch[0].length-1;
					}
				else if(cellMatch[1] == ">")
					{
					currColCount++;
					w.nextMatch = cellMatch.index + cellMatch[0].length-1;
					}
				else if(cellMatch[2])
					{
					w.nextMatch = cellMatch.index + cellMatch[0].length;;
					break;
					}
				else
					{
					var spaceLeft = false, spaceRight = false;
					w.nextMatch++;
					var styles = Wikifier.formatHelpers.inlineCssHelper(w);
					while(w.source.substr(w.nextMatch,1) == " ")
						{
						spaceLeft = true;
						w.nextMatch++;
						}
					var cell;
					if(w.source.substr(w.nextMatch,1) == "!")
						{
						cell = insertElement(e,"th");
						w.nextMatch++;
						}
					else
						cell = insertElement(e,"td");
					prevColumns[col] = {rowCount: 1, element: cell};
					lastColCount = 1;
					lastColElement = cell;
					if(currColCount > 1)
						{
						cell.setAttribute("colSpan",currColCount);
						cell.setAttribute("colspan",currColCount);
						currColCount = 1;
						}
					for(var t=0; t<styles.length; t++)
						cell.style[styles[t].style] = styles[t].value;
					w.subWikify(cell,this.cellTerminator);
					if(w.matchText.substr(w.matchText.length-2,1) == " ")
						spaceRight = true;
					if(spaceLeft && spaceRight)
						cell.align = "center";
					else if (spaceLeft)
						cell.align = "right";
					else if (spaceRight)
						cell.align = "left";
					w.nextMatch = w.nextMatch-1;
					}
				col++;
				}
		} while(matched);		
	}
},

{
	name: "rule",
	match: "^----$\\n?",
	handler: function(w)
	{
		insertElement(w.output,"hr");
	}
},

{
	name: "emdash",
	match: "--",
	handler: function(w)
	{
		var e = insertElement(w.output,"span");
		e.innerHTML = '&mdash;';
	}
},

{
	name: "heading",
	match: "^!{1,5}",
	terminator: "\\n",
	handler: function(w)
	{
		var e = insertElement(w.output,"h" + w.matchLength);
		w.subWikify(e,this.terminator);
	}
},

{
	name: "monospacedByLine",
	match: "^\\{\\{\\{\\n",
	lookahead: "^\\{\\{\\{\\n((?:^[^\\n]*\\n)+?)(^\\}\\}\\}$\\n?)",
	handler: Wikifier.formatHelpers.monospacedByLineHelper
},

{
	name: "monospacedByLineForPlugin",
	match: "^//\\{\\{\\{\\n",
	lookahead: "^//\\{\\{\\{\\n\\n*((?:^[^\\n]*\\n)+?)(\\n*^//\\}\\}\\}$\\n?)",
	handler: Wikifier.formatHelpers.monospacedByLineHelper
},

{
	name: "wikifyCommentForPlugin", 
	match: "^/\\*\\*\\*\\n",
	terminator: "^\\*\\*\\*/\\n",
	handler: function(w)
	{
		w.subWikify(w.output,this.terminator);
	}
},

{
	name: "quoteByBlock",
	match: "^<<<\\n",
	terminator: "^<<<\\n",
	handler: function(w)
	{
		var e = insertElement(w.output,"blockquote");
		w.subWikify(e,this.terminator);
	}
},

{
	name: "quoteByLine",
	match: "^>+",
	terminator: "\\n",
	element: "blockquote",
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp(this.match,"mg");
		var placeStack = [w.output];
		var currLevel = 0;
		var newLevel = w.matchLength;
		var t;
		do {
			if(newLevel > currLevel)
				{
				for(t=currLevel; t<newLevel; t++)
					placeStack.push(insertElement(placeStack[placeStack.length-1],this.element));
				}
			else if(newLevel < currLevel)
				{
				for(t=currLevel; t>newLevel; t--)
					placeStack.pop();
				}
			currLevel = newLevel;
			w.subWikify(placeStack[placeStack.length-1],this.terminator);
			insertElement(placeStack[placeStack.length-1],"br");
			lookaheadRegExp.lastIndex = w.nextMatch;
			var lookaheadMatch = lookaheadRegExp.exec(w.source);
			var matched = lookaheadMatch && lookaheadMatch.index == w.nextMatch;
			if(matched)
				{
				newLevel = lookaheadMatch[0].length;
				w.nextMatch += lookaheadMatch[0].length;
				}
		} while(matched);
	}
},

{
	name: "list",
	match: "^(?:(?:\\*+)|(?:#+))",
	lookahead: "^(?:(\\*+)|(#+))",
	terminator: "\\n",
	outerElement: "ul",
	itemElement: "li",
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		w.nextMatch = w.matchStart;
		var placeStack = [w.output];
		var currType = null, newType;
		var currLevel = 0, newLevel;
		var t;
		do {
			lookaheadRegExp.lastIndex = w.nextMatch;
			var lookaheadMatch = lookaheadRegExp.exec(w.source);
			var matched = lookaheadMatch && lookaheadMatch.index == w.nextMatch;
			if(matched)
				{
				if(lookaheadMatch[1])
					newType = "ul";
				if(lookaheadMatch[2])
					newType = "ol";
				newLevel = lookaheadMatch[0].length;
				w.nextMatch += lookaheadMatch[0].length;
				if(newLevel > currLevel)
					{
					for(t=currLevel; t<newLevel; t++)
						placeStack.push(insertElement(placeStack[placeStack.length-1],newType));
					}
				else if(newLevel < currLevel)
					{
					for(t=currLevel; t>newLevel; t--)
						placeStack.pop();
					}
				else if(newLevel == currLevel && newType != currType)
					{
						placeStack.pop();
						placeStack.push(insertElement(placeStack[placeStack.length-1],newType));
					}
				currLevel = newLevel;
				currType = newType;
				var e = insertElement(placeStack[placeStack.length-1],"li");
				w.subWikify(e,this.terminator);
				}
		} while(matched);
	}
},

{
	name: "prettyLink",
	match: "\\[\\[",
	lookahead: "\\[\\[([^\\|\\]]*?)(?:(\\]\\])|(\\|(.*?)\\]\\]))",
	terminator: "\\|",
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source)
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart && lookaheadMatch[2]) // Simple bracketted link
			{
			var link = Wikifier.createInternalLink(w.output,lookaheadMatch[1]);
			w.outputText(link,w.nextMatch,w.nextMatch + lookaheadMatch[1].length);
			w.nextMatch += lookaheadMatch[1].length + 2;
			}
		else if(lookaheadMatch && lookaheadMatch.index == w.matchStart && lookaheadMatch[3]) // Pretty bracketted link
			{
			var e;
			if(tale.has(lookaheadMatch[4]))
				e = Wikifier.createInternalLink(w.output,lookaheadMatch[4]);
			else
				e = Wikifier.createExternalLink(w.output,lookaheadMatch[4]);
			w.outputText(e,w.nextMatch,w.nextMatch + lookaheadMatch[1].length);
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			}
	}
},

{
	name: "urlLink",
	match: "(?:http|https|mailto|ftp):[^\\s'\"]+(?:/|\\b)",
	handler: function(w)
	{
		var e = Wikifier.createExternalLink(w.output,w.matchText);
		w.outputText(e,w.matchStart,w.nextMatch);
	}
},

{
	name: "image",
	match: "\\[(?:[<]{0,1})(?:[>]{0,1})[Ii][Mm][Gg]\\[",
	lookahead: "\\[([<]{0,1})([>]{0,1})[Ii][Mm][Gg]\\[(?:([^\\|\\]]+)\\|)?([^\\[\\]\\|]+)\\](?:\\[([^\\]]*)\\]?)?(\\])",
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) // Simple bracketted link
			{
			var e = w.output;
			if (lookaheadMatch[5])
				{
				if (tale.has(lookaheadMatch[5]))
					e = Wikifier.createInternalLink(w.output,lookaheadMatch[5]);
				else
					e = Wikifier.createExternalLink(w.output,lookaheadMatch[5]);
				}
			var img = insertElement(e,"img");
			if(lookaheadMatch[1])
				img.align = "left";
			else if(lookaheadMatch[2])
				img.align = "right";
			if(lookaheadMatch[3])
				img.title = lookaheadMatch[3];
			img.src = lookaheadMatch[4];
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			}
	}
},

{
	name: "macro",
	match: "<<",
	lookahead: "<<([^>\\s]+)(?:\\s*)([^>]*)>>",
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source)
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart && lookaheadMatch[1])
			{
			var params = lookaheadMatch[2].readMacroParams();			
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			try
				{
				var macro = macros[lookaheadMatch[1]];
				
				if (macro && macro.handler)
					macro.handler(w.output,lookaheadMatch[1],params,w);
				else
				{
					insertElement(w.output,"span",null,'marked','macro not found: ' + lookaheadMatch[1]);
				}
				}
			catch(e)
				{
				throwError(w.output, 'Error executing macro ' + lookaheadMatch[1] + ': ' + e.toString());
				}
			}
	}
},

{
	name: "html",
	match: "<[Hh][Tt][Mm][Ll]>",
	lookahead: "<[Hh][Tt][Mm][Ll]>((?:.|\\n)*?)</[Hh][Tt][Mm][Ll]>",
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source)
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart)
			{
			var e = insertElement(w.output,"span");
			e.innerHTML = lookaheadMatch[1];
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			}
	}
},

{
	name: "commentByBlock",
	match: "/%",
	lookahead: "/%((?:.|\\n)*?)%/",
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source)
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart)
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
	}
},

{
	name: "boldByChar",
	match: "''",
	terminator: "''",
	element: "strong",
	handler: Wikifier.formatHelpers.charFormatHelper
},

{
	name: "strikeByChar",
	match: "==",
	terminator: "==",
	element: "strike",
	handler: Wikifier.formatHelpers.charFormatHelper
},

{
	name: "underlineByChar",
	match: "__",
	terminator: "__",
	element: "u",
	handler: Wikifier.formatHelpers.charFormatHelper
},

{
	name: "italicByChar",
	match: "//",
	terminator: "//",
	element: "em",
	handler: Wikifier.formatHelpers.charFormatHelper
},

{
	name: "subscriptByChar",
	match: "~~",
	terminator: "~~",
	element: "sub",
	handler: Wikifier.formatHelpers.charFormatHelper
},

{
	name: "superscriptByChar",
	match: "\\^\\^",
	terminator: "\\^\\^",
	element: "sup",
	handler: Wikifier.formatHelpers.charFormatHelper
},

{
	name: "monospacedByChar",
	match: "\\{\\{\\{",
	lookahead: "\\{\\{\\{((?:.|\\n)*?)\\}\\}\\}",
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source)
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart)
			{
			var e = insertElement(w.output,"code",null,null,lookaheadMatch[1]);
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			}
	}
},

{
	name: "styleByChar",
	match: "@@",
	terminator: "@@",
	lookahead: "(?:([^\\(@]+)\\(([^\\)]+)(?:\\):))|(?:([^:@]+):([^;]+);)",
	handler:  function(w)
	{
		var e = insertElement(w.output,"span",null,null,null);
		var styles = Wikifier.formatHelpers.inlineCssHelper(w);
		if(styles.length == 0)
			e.className = "marked";
		else
			for(var t=0; t<styles.length; t++)
				e.style[styles[t].style] = styles[t].value;
		w.subWikify(e,this.terminator);
	}
},

{
	name: "lineBreak",
	match: "\\n",
	handler: function(w)
	{
		insertElement(w.output,"br");
	}
}
];

Wikifier.textPrimitives =
{
	anyDigit: "[0-9]",
	anyNumberChar: "[0-9\\.E]",
	urlPattern: "(?:http|https|mailto|ftp):[^\\s'\"]+(?:/|\\b)"
};

//
// Method: createInternalLink
// Creates a link to a passage. It automatically classes it so that
// broken links appear broken.
//
// Parameters:
// place - the DOM element to render into
// title - the title of the passage to link to
//
// Returns:
// the newly created link as a DOM element
//

Wikifier.createInternalLink = function (place, title)
{
	var el = insertElement(place, 'a', title);
	el.href = 'javascript:void(0)';
	
	if (tale.has(title))
		el.className = 'internalLink';
	else
		el.className = 'brokenLink';
		
	el.onclick = function() { state.display(title, el) };
		
	if (place)
		place.appendChild(el);
		
	return el;
};

//
// Method: createExternalLink
// Creates a link to an external URL.
//
// Parameters:
// place - the DOM element to render into
// url - the URL to link to
//
// Returns:
// the newly created link as a DOM element
//

Wikifier.createExternalLink = function (place, url)
{	
	var el = insertElement(place, 'a');
	el.href = url;
	el.className = 'externalLink';
	el.target = '_blank';
		
	if (place)
		place.appendChild(el);
		
	return el;
};


// certain versions of Safari do not handle Unicode properly

if(! ((new RegExp("[\u0150\u0170]","g")).test("\u0150")))
{
	Wikifier.textPrimitives.upperLetter = "[A-Z\u00c0-\u00de]";
	Wikifier.textPrimitives.lowerLetter = "[a-z\u00df-\u00ff_0-9\\-]";
	Wikifier.textPrimitives.anyLetter = "[A-Za-z\u00c0-\u00de\u00df-\u00ff_0-9\\-]";
}
else
{
	Wikifier.textPrimitives.upperLetter = "[A-Z\u00c0-\u00de\u0150\u0170]";
	Wikifier.textPrimitives.lowerLetter = "[a-z\u00df-\u00ff_0-9\\-\u0151\u0171]";
	Wikifier.textPrimitives.anyLetter = "[A-Za-z\u00c0-\u00de\u00df-\u00ff_0-9\\-\u0150\u0170\u0151\u0171]";
};
