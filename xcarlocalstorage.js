xcar_localStorage={}; 
//检测是否支持localStorage
xcar_localStorage.checkAgent=function(){
	if(typeof localStorage.getItem!='function'){
		return false;
	}	
}
//设置本地存储项目
xcar_localStorage.setItem=function(n,d,t,datatype,dataname){
	xcar_localStorage.checkAgent();
	var iName=n;
	var iData='';
	var iTime='';
	if(t){
		//iTime=Date.parse(new Date())+t*24*60*60*1000;
		iTime=Date.parse(new Date())+t*1000;  //以秒作为单位
	}
	if(typeof datatype=='ajax'){
		xcar_localStorage.ajax('get',d,'',function(data){
			var datajson={name:n,data:data,time:iTime};
			localStorage.setItem(datajson.name,JSON.stringify(datajson));
			if(typeof dataname!='function'){
				return false;	
			}else{
				dataname(datajson);
			};
		})
	}else if(datatype=='script'){
		if(typeof dataname!='function'){
			return false;	
		}else{
			var oScript=document.createElement('script');
			oScript.src=d;
			document.getElementsByTagName('head')[0].appendChild(oScript);
			oScript.onload=function(){
				var datajson={name:n,data:'',time:iTime};
				dataname(datajson);
			}
		};
	}else{
		var datajson={name:n,data:d,time:iTime};
		localStorage.setItem(datajson.name,JSON.stringify(datajson));
	};
};
xcar_localStorage.checkItem=function(n,fn){
	xcar_localStorage.checkAgent();
	var oData='';
	if(localStorage.getItem(n)!=null){
		var oData=JSON.parse(localStorage.getItem(n));
		var timestamp = Date.parse(new Date());
		if(timestamp>=oData.time && oData.time!=''){
			localStorage.removeItem(n);
			return true;	
		}else{
			return false;
		};
	}else{
		if(fn){
			fn();	
		}else{
			return null;
		};
	};
};
xcar_localStorage.resetItem=function(n,d,t,datatype,dataname){
	xcar_localStorage.checkAgent();
	var oName=n;
	if(xcar_localStorage.checkItem(oName) || xcar_localStorage.checkItem(oName)==null){
		xcar_localStorage.setItem(n,d,t,datatype,dataname);
	};
};
xcar_localStorage.ajax=function(method, url, data, fnSuc) {
	var oAjax = null;
	if (window.XMLHttpRequest) {
		oAjax = new XMLHttpRequest();
	} else {
		oAjax = new ActiveXObject('Microsoft.XMLHTTP');
	};
	if (method == 'get') {
		url += '?' + data;
	};
	oAjax.open(method, url, true);
	if (method == 'get') {
		oAjax.send();
	} else {
		oAjax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		oAjax.send(data);
	};
	oAjax.onreadystatechange = function() {
		if (oAjax.readyState == 4) {
			if (oAjax.status == 200) {
				fnSuc(oAjax.responseText);
			};
		};
	};
};
xcar_localStorage.callback=function(d,x){
	d.data=x;
	localStorage.setItem(d.name,JSON.stringify(d));
};
xcar_localStorage.getItem=function(n,type){
	return type=='obj' ? JSON.parse(localStorage.getItem(n)).data : localStorage.getItem(n);	
};