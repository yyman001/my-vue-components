/*
2015.10.19 v 1.02 修复jQuery.width()/jQuery.height()使用style.width的Bug
2015.11.02 v 1.03 修改腾讯视频支持直播
2015.11.25 v 1.04 增加搜狐视频播放器
2015.12.14 v 1.04 增加minWin参数控制视频窗口是否小窗口
2015.12.30 v 1.05 增加爱奇艺视频播放器
2015.12.31 v 1.05 优化优酷、搜狐等不能播放的问题
2015.1.14 v 1.06 腾讯视频接口改2.0
2016.6.7 v 1.07 兼容优酷多个播放器。
2016.6.8 v 1.07 增加游看播放器代码
2016.8.17 v 1.07 修改youcan视频代码
2016.8.17 v 1.08 添加cc播放器
2016.8.19 v 1.08 游看添加playtype=mp4
2016.8.24 v 1.09 优酷 腾讯兼容多视频问题。
2017.4.19 v 1.09 优酷播放器禁止cookies问题 加cna
2017.5.12 v 1.09 cc直播修复
*/
; (function (window, undefined) {
	var jQuery = window.$ || undefined;
	if (!jQuery) {//模拟jquery
		var rquickExpr = /^#([\w-]+|\w+)$/;//匹配#id
		jQuery = function (selector) {
			return new jQuery.fn.init(selector);
		};
		jQuery.fn = jQuery.prototype = {
			//获取对象的类型
			getType: function (o) {
				var _t;
				return ((_t = typeof (o)) == "object" ? o == null && "null" || Object.prototype.toString.call(o).slice(8, -1) : _t).toLowerCase();
			},
			html: function (value) {
				var elem = this[0] || {};
				if (value === undefined && elem.nodeType === 1) {
					return elem.innerHTML;
				}
				if (typeof value === "string") {
					elem.innerHTML = value;
				} else if (value && value.nodeType === 1) {
					elem.innerHTML = "";
					elem.appendChild(value);
				}
			},
			/**
			 * @description 实现对象的拷贝功能(source 拷贝到 target)
			 * @params {Object} target 目标对象
			 * @params {Object} source 原对象
			 */
			extend: function (target, source) {
				for (var p in source) {
					if (jQuery.fn.getType(source[p]) == "array" || jQuery.fn.getType(source[p]) == "object") {
						target[p] = jQuery.fn.getType(source[p]) == "array" ? [] : {};
						arguments.callee(target[p], source[p]);
					} else {
						target[p] = source[p];
					}
				}
				return target;
			},
			attr: function (name) {
				return this[0].getAttribute(name);
			},
			width: function () {
				return this[0].offsetWidth;
			},
			height: function () {
				return this[0].offsetHeight;
			},
			getScript: function (url, callback) {
				var script = document.createElement('script');
				script.type = "text/javascript";
				if (script.readyState) {
					script.onreadystatechange = function () {
						if (script.readyState == "loaded" || script.readyState == "complete") {
							script.onreadystatechange = null;
							if (callback) {
								callback();
							}
						}
					}
				} else {
					script.onload = function () {
						if (callback) {
							callback();
						}
					}
				}
				script.src = url;
				document.body.appendChild(script);
			}
		};
		jQuery.fn.init = function (selector) {
			if (!selector) {
				return this;
			}
			if (typeof selector === "string") {
				match = rquickExpr.exec(selector);
				if (match && match[1]) {
					if (match[1]) {
						elem = document.getElementById(match[1]);
						if (elem && elem.parentNode) {
							this.length = 1;
							this[0] = elem;
							this.selector = selector;
						}
					}
				}
			}
		};
		var arr = new Array("init", "extend", "html", "attr", "width", "height", "getScript");
		for (i in arr) {
			jQuery[arr[i]] = jQuery.fn[arr[i]];
		}
		jQuery.init.prototype = jQuery.fn;
		//window.$=$=jQuery;
	}
	var timeout, qqNum = 0, youkuNum = 0, qqArr = { loading: false, list: [] }, youkuArr = { loading: false },
		playVideo = function (opt) {
			//this.length={qq:0,youku:0};//暂时只记录qq、youku的视频个数
			this.init(opt);
		};
	playVideo.prototype = {
		init: function (opt) {
			var t = this;
			if (!t.options) {
				t.options = {
					id: "playvideo",//容器id
					type: "qq",//视频类型(qq/tencent/youku)
					qqchannel: false,//是否直播(腾讯)
					playtype: 'replay',
					sid: "",//视频id
					vid: "",//视频vid(爱奇艺)
					cid: "",//虎牙 
					title: "",//标题(腾讯)
					isIframe: false,//是否启用iframe调用(爱奇艺)
					pic: "",//默认图片(只对腾讯视频有效)
					minWin: false,//视频窗口为小窗口(只对腾讯视频有效)
					autoplay: false//是否自动播放
				}
			}
			jQuery.extend(t.options, opt);
			t.play();
		},
		play: function () {
			var t = this;
			if (t.options.sid) {
				jQuery("#" + t.options.id).html("");
				if (t.options.type === "youku") {
					if (!window.YKU) {
						if (jQuery.ajax) {
							jQuery.ajax({
								url: 'http://player.youku.com/jsapi',
								dataType: "script",
								cache: true,//消除自动加上的timestamp
								success: function () {
									t.playYouku();
								}
							});
						} else if (jQuery.getScript) {
							jQuery.getScript("http://player.youku.com/jsapi", function () {
								t.playYouku();
							});
						} else {
							console.log("优酷接口文件未加载");
						}
					} else {
						t.playYouku();
					}
				} else if (t.options.type === "qq" || t.options.type === 'tencent') {
					if (!window.tvp) {
						qqArr.list.push(t);
						if (!qqArr.loading) {
							qqArr.loading = true;
							if (jQuery.ajax) {
								jQuery.ajax({
									//url: 'http://imgcache.gtimg.cn/tencentvideo_v1/tvp/js/tvp.player_v2.js',
									url: 'http://imgcache.qq.com/tencentvideo_v1/tvp/js/tvp.player_v2_jq.js',
									dataType: "script",
									cache: true,//消除自动加上的timestamp
									success: function () {
										//setTimeout(function(){//兼容多视频问题
										qqArr.loading = false;
										t.playQQlist();
										//},qqNum*200)
									}
								});
							} else if (jQuery.getScript) {
								jQuery.getScript("http://imgcache.gtimg.cn/tencentvideo_v1/tvp/js/tvp.player_v2.js", function () {
									qqArr.loading = false;
									//setTimeout(function(){//兼容多视频问题
									t.playQQlist();
									//},qqNum*200)
								});
							} else {
								console.log("腾讯接口文件未加载");
							}
						}
					} else {
						//setTimeout(function(){//兼容多视频问题
						t.playQQ();
						//},qqNum*200)
					}
				} else if (t.options.type === "sohu") {
					if (!window.SohuMobilePlayer && document.addEventListener) {
						if (jQuery.getScript) {
							jQuery.getScript("http://img01.static.appgame.com/libs/jsCommon/player/min.sohu_player.js?ver=1.01", function () {
								//jQuery.getScript("http://tv.sohu.com/upload/touch/static/scripts/tv/min.sohu_player.js",function(){
								t.playSohu();
							});
						} else {
							console.log("搜狐接口文件未加载");
						}
					} else {
						t.playSohu();
					}
				} else if (t.options.type === "iqiyi") {
					if (t.options.isIframe) {
						var iframe = document.createElement("iframe");
						iframe.setAttribute("src", "http://open.iqiyi.com/developer/player_js/coopPlayerIndex.html?vid=" + t.options.vid + "&tvId=" + t.options.sid + "&accessToken=2.f22860a2479ad60d8da7697274de9346&appKey=3955c3425820435e86d0f4cdfe56f5e7&appId=1368&height=100%&width=100%");
						iframe.setAttribute("frameborder", 0);
						iframe.setAttribute("allowfullscreen", true);
						iframe.setAttribute("width", "100%");
						iframe.setAttribute("height", "100%");
						jQuery("#" + t.options.id).html(iframe);
					} else {
						if (!window.Q && document.addEventListener) {
							if (jQuery.getScript) {
								jQuery.getScript("http://img01.static.appgame.com/libs/jsCommon/player/sea1.2.min.js", function () {
									window.Q = window.Q || {};
									Q.PageInfo = Q.PageInfo || {};
									Q.PageInfo.playInfo = {};
									Q.PageInfo.playInfo.videoFormat = "mp4";//视频格式
									Q.PageInfo.playInfo.qipuId = t.options.sid;
									Q.PageInfo.playInfo.vid = t.options.vid;
									Q.PageInfo.playInfo.aid = t.options.sid;
									t.playIqiyi();
								});
							} else {
								console.log("爱奇艺接口文件未加载");
							}
						} else {
							t.playIqiyi();
						}
					}
				} else if (t.options.type === "youcan") {
					if (!window.videojs) {
						var link = document.createElement('link');
						link.type = 'text/css';
						link.rel = 'stylesheet';
						link.href = 'http://vss.static.youcan.mobi/Static/videojs/video-js-5.10.2.min.css';
						document.getElementsByTagName("head")[0].appendChild(link);
						if (jQuery.getScript) {
							jQuery.getScript("http://vss.static.youcan.mobi/Static/videojs/video-5.10.2.min.js", function () {
								jQuery.getScript("http://vss.static.youcan.mobi/Static/videojs/videojs-media-sources.js", function () {
									jQuery.getScript("http://vss.static.youcan.mobi/Static/videojs/videojs-hls-2.0.1.min.js", function () {
										t.playYoucan();
									});
								});
							});

						} else {
							console.log("游看接口文件未加载");
						}
					} else {
						t.playYoucan();
					}
				} else if (t.options.type === "cc") {
					if (t.isPC()) {
						t.playCc();
					} else {
						if (!window.util) {
							if (jQuery.getScript) {
								if (!window.$) {
									jQuery.getScript("http://img01.static.appgame.com/libs/jsCommon/jquery/2.1.4/jquery.min.js", function () {
										jQuery.getScript("http://cc.163.com/activity/common/js/MobileUtil.min.js?ver=1.01", function () {
											t.playCc();
										});
									});
								} else {
									jQuery.getScript("http://cc.163.com/activity/common/js/MobileUtil.min.js?ver=1.01", function () {
										t.playCc();
									});
								}
							} else {
								console.log("搜狐接口文件未加载");
							}
						} else {
							t.playCc();
						}
					}

				} else if (t.options.type === "douyu") {
					//if(t.isPC()){
					//	t.playDouYu();
					//}else{
					if (!window.$) {
						jQuery.getScript("http://img01.static.appgame.com/libs/jsCommon/jquery/2.1.4/jquery.min.js", function () {
							t.playDouYu();
						});
					} else {
						t.playDouYu();
					}
					//}

				} else if (t.options.type === "bilibili") {
					//if(t.isPC()){
					//	t.playBiLiBiLi();
					//}else{
					if (!window.$) {
						jQuery.getScript("http://img01.static.appgame.com/libs/jsCommon/jquery/2.1.4/jquery.min.js", function () {
							t.playBiLiBiLi();
						});
					} else {
						t.playBiLiBiLi();
					}
					//}

				} else if (t.options.type === "huya") {
					//if(t.isPC()){
					//	t.playHuYa();
					//}else{
					if (!window.$) {
						jQuery.getScript("http://img01.static.appgame.com/libs/jsCommon/jquery/2.1.4/jquery.min.js", function () {
							t.playHuYa();
						});
					} else {
						t.playHuYa();
					}
					//	}

				}
			}
		},
		playYouku: function () {
			var t = this;
			if (!t.isPC()) {
				clearTimeout(timeout);
				var player = new YKU.Player(t.options.id, {
					//styleid: '0',//炫彩播放器样式 0-9
					client_id: '1a0718786643b0ef',//优酷开放平台创建应用的client_id
					vid: t.options.sid,//视频ID
					show_related: false,//播放完成是否显示相关视频
					autoplay: t.options.autoplay,//是否自动播放视频
					//password: '1a0718786643b0ef',//免密码播放
					//embsig: t.options.id,//嵌入式播放器签名(非网站类应用必须设置)
				});

				if (jQuery.ajax) {
					$("#" + t.options.id).attr("sid", t.options.sid);
					$("#" + t.options.id).addClass("youku_video");
					timeout = setTimeout(function () {//同时出现多个优酷播放器
						//console.log(t.options.sid)
						//jQuery.getScript("js/h5videobugfix.js");
						t.multipleVideo();
					}, 500);
				}

			} else {//不用接口(window下的safari不能播放)
				t.setEmbed("http://static.youku.com/v1.0.0590/v/swf/loader.swf", "VideoIDS=" + t.options.sid + "&isAutoPlay=" + t.options.autoplay + "&winType=BDskin&embedid=&wd=&partnerid=1a0718786643b0ef&vext=&cna=uWReEDxU4CACAXF3zjeWIU1U");
			}
		},
		playQQlist: function () {
			for (var i = 0; i < qqArr.list.length; i++) {
				qqArr.list[i].playQQ();
			}
		},
		playQQ: function () {
			qqNum++;
			var t = this;
			var width = jQuery("#" + t.options.id).width();
			var height = jQuery("#" + t.options.id).height();
			var video = new tvp.VideoInfo();
			var opts = {
				width: width,
				height: height,
				video: video,
				//isVodFlashShowCfg:0,//是否显示控制按钮
				//isVodFlashShowSearchBar:0,//是否显示顶部搜索框
				//	isVodFlashShowEnd:0,//是否显示播放结束后的推荐视频
				autoplay: t.options.autoplay ? 1 : 0,//是否自动播放
				controls: 0,//HTML5是否显示控制栏
				vodFlashExtVars: { bullet: 0 },//关闭弹幕
				loadingSwf: "http://imgcache.qq.com/minivideo_v1/vd/res/skins/web_small_loading.swf",
				pic: (t.options.pic && t.options.pic != "undefined") ? t.options.pic : "",
				vodFlashSkin: t.options.minWin ? "http://imgcache.qq.com/minivideo_v1/vd/res/skins/TencentPlayerMiniSkin.swf" : "",
				//	vodFlashUrl:"http://imgcache.qq.com/tencentvideo_v1/player/TencentPlayer.swf",//点播
				//  liveFlashUrl:"http://imgcache.qq.com/tencentvideo_v1/player/TencentPlayer.swf",//直播
				modId: t.options.id
			}
			console.log(t.options.sid)
			if (!t.options.qqchannel) {
				video.setVid(t.options.sid);//视频vid
				video.setCoverId("vid");//专辑id
				video.setTitle(t.options.title || "");
				opts.isVodFlashShowCfg = 0;//是否显示控制按钮
				opts.isVodFlashShowSearchBar = 0;//是否显示顶部搜索框
				opts.isVodFlashShowEnd = 0;//是否显示播放结束后的推荐视频

			} else {
				video.setChannelId(t.options.sid);
				opts.type = 1;
				opts.isLiveFlashShowCfg = 0;//直播是否显示控制按钮
			}
			var player = new tvp.Player();
			player.create(opts);
		},
		playSohu: function () {
			var t = this;
			if (document.addEventListener) {
				var width = jQuery("#" + t.options.id).width();
				var height = jQuery("#" + t.options.id).height();
				var player = new SohuMobilePlayer(t.options.id, {
					vid: t.options.sid,
					isAutoPlay: t.options.autoplay,
					poster: t.options.pic || "",//播放器封面图 (String, 可选)
					width: width,//播放器宽度 （Number，可选）
					height: height,//播放器高度 （Number，可选）
					//adClose:1,//是否禁播广告，默认为0不禁止（Number，可选）。
					topBarNor: 0,//是否显示顶部标题,0不显示
					shareBtn: 0,//是否显示分享按钮,0不显示
					downloadBtn: 0,//是否显示下载按钮,0不显示
					miniWinBtn: 0,//是否显示新窗口按钮,0不显示
				}, "");
			} else {//区分ie8或以下
				t.setEmbed("http://share.vrs.sohu.com/" + t.options.sid + "/v.swf", "miniWinBtn=0&autoplay=" + t.options.autoplay + "&vid=" + t.options.sid + "&downloadBtn=0&shareBtn=0&topBarNor=0&adClose=1&pageurl=http://www.sohu.com/");
			}
		},
		playIqiyi: function () {
			var t = this;
			if (document.addEventListener && Zepto.os.phone) {//手机端
				window.__page_start = new Date().getTime();
				var video = document.createElement("video");
				var id = t.options.id + new Date().getTime();
				video.id = id;
				if (!t.options.autoplay) {
					video.setAttribute("controls", true);
					video.setAttribute("preload", "metadata");
					video.setAttribute("autobuffer", true);
				}
				video.setAttribute("poster", t.options.pic),
					jQuery("#" + t.options.id).html(video);
				Q.PageInfo.playInfo.id = id;
				Q.PageInfo.playInfo.autoplay = t.options.autoplay;
				seajs.use("http://img01.static.appgame.com/libs/jsCommon/player/miniplayer.min.js", function () {
					Q.video.load({
						aid: t.options.sid,
						tvid: t.options.sid,
						qipuId: t.options.sid,
						vid: t.options.vid,
						vfrm: "",
						publicLevel: "0" * 1,
						isUGC: true,
						duration: "0",
						ADPlayerID: "",//广告id
						rate: 1
					});
				});
			} else {
				t.setEmbed("http://dispatcher.video.qiyi.com/disp/shareplayer.swf", "vid=" + t.options.vid + "&tvId=" + t.options.sid + "&apic=" + t.options.pic + "&coop=&cid=&bd=1")
			}
		},
		playYoucan: function () {
			var t = this;
			var video = document.createElement("VIDEO");
			//video.setAttribute("autoplay",t.options.autoplay);
			//video.setAttribute("poster",t.options.pic);
			var random = new Date().getTime();
			var id = "playVideo" + random;
			video.setAttribute("id", id);
			video.setAttribute("x-webkit-airplay", true);
			video.setAttribute("webkit-playsinline", true);
			video.setAttribute("class", "video-js vjs-default-skin vjs-big-play-centered");
			//video.setAttribute("controls",true);
			//video.setAttribute("preload","auto");
			//video.setAttribute("width","100%");
			//video.setAttribute("height","100%");
			//video.setAttribute("data-setup","");
			var html = '<source src="http://img.youcan.mobi/recordings/z1.appgame.' + t.options.sid + '/' + t.options.sid + '.m3u8" type="application/x-mpegURL" width="100%" height="100%">';
			if (t.options.playtype == "live") {
				html = '<source src="http://live-hls.youcan.mobi/appgame/' + t.options.sid + '.m3u8" type="application/x-mpegURL" width="100%" height="100%">';
			} else if (t.options.playtype == "mp4") {
				html = '<source src="' + t.options.sid + '" type="video/mp4" width="100%" height="100%">';
			}
			html += '<p class="vjs-no-js">如果无法播放该视频，请换一个<a href="http://videojs.com/html5-video-support/" target="_blank">支持HTML5视频功能的浏览器</a></p>';
			video.innerHTML = html;
			jQuery("#" + t.options.id).html(video);
			var player = videojs(id, {
				controls: true,//控制条
				autoplay: t.options.autoplay,//自动播放
				preload: "auto",//预加载？
				poster: t.options.pic,//默认图片
				loop: false,//循环播放
				width: "100%",
				height: "100%",
				textTrackDisplay: false,//是否开启弹幕
				textTrackSettings: false,//弹幕设置
				controlBar: true
			}, function () {

			});
		},
		playCc: function () {
			var t = this;
			var obj = document.getElementById(t.options.id);
			var height = obj.offsetHeight || 800,
				width = obj.offsetWidth || 500;
			if (t.isPC()) {
				var ran = Math.round(Math.random() * 1e10);
				obj.innerHTML = '<embed src="http://res.cc.netease.com/webcc/v2/static/swf/ClientLoader.swf?' + ran + '&winWidth=' + width + '&winHeigh=' + height + '&webccType=4000&gametype=-1000&playerStatus=1&videoUrl=http://service.hi.163.com/static/v/CCMediaPlayer.swf?v=0.3.9&geturl=1&maskinterval=30&secret=None&defaultip=114.113.200.201&file=' + t.options.vid + '&provider=rhttp&debug=true&groupcgihost=group.v.cc.163.com&autoplay=true" wmode="opaque" allowfullscreen="true" quality="high" bgcolor="#060f1e" allowscriptaccess="always" base="." width="999" height="' + height + '">';
			} else {
				//obj.innerHTML='<embed src="http://cc.163.com/activity/daily/client_video_play/room.html?cid='+t.options.sid+'" wmode="opaque" allowfullscreen="true" quality="high" bgcolor="#060f1e" allowscriptaccess="always" base="." width="100%" height="'+height+'">';
				/*$.getData("http://cc.163.com/live/channel/?format=jsonp&channelids=" + t.options.sid, 'jsonp').done(function(res) {
					res = res.data[0];
					if (res.nolive) {//没有直播
						obj.innerHTML="主播正在休息哦！";
					} else {
						var m3u8 = res.m3u8,
						poster = t.options.pic||res.poster;/*,
						cid = res.cid,
						nickname = res.nickname,
						visitor = res.total_visitor,
						
						protrait = res.purl,//俏像
						roomid = res.roomid;*/
				/*$.getJSON(m3u8, function(data) {
					obj.innerHTML='<video class="video js-video active" webkit-playsinline="" controls="controls" preload="auto" autoplay="autoplay" poster="'+poster+'"><source src="' + data.videourl + '"/></video>';
				});
			}
		});*/
				jQuery.ajax({
					//url: 'http://imgcache.gtimg.cn/tencentvideo_v1/tvp/js/tvp.player_v2.js',
					url: "http://cc.163.com/live/channel/?format=jsonp&channelids=" + t.options.sid,
					dataType: "jsonp",
					cache: true,//消除自动加上的timestamp
					success: function (res) {
						res = res.data[0];
						if (res.nolive) {//没有直播
							obj.innerHTML = "主播正在休息哦！";
						} else {
							var m3u8 = res.m3u8,
								poster = t.options.pic || res.poster;
							$.getJSON(m3u8, function (data) {
								obj.innerHTML = '<video class="video js-video active" playsinline webkit-playsinline controls="controls" preload="auto" autoplay="autoplay" poster="' + poster + '"><source src="' + data.videourl + '"/></video>';
							});
						}
					}
				});
			}
		},
		playDouYu: function () {
			var t = this;
			if (t.isPC()) {
				t.setObject("https://staticlive.douyucdn.cn/common/share/play.swf?room_id=" + t.options.sid, "");
				t.setMB();
			} else {
				if (t.options.vid != '') {
					var str1 = t.getRandString(32);
					jQuery("#" + t.options.id).html('<video controls="controls" width="100%" height="100%" preload="auto" webkit-playsinline="" style="display: inline;" poster="' + t.options.pic + '" type="application/x-mpegURL" src="http://hls3a.douyucdn.cn/live/' + t.options.vid + '"><p>您的浏览器不支持 video 标签</p></video>');
				} else {
					t.setNoVideo();
				}
			}
		},
		playBiLiBiLi: function () {
			var t = this;
			if (t.isPC()) {
				t.setObject("http://static.hdslb.com/live-static/swf/LivePlayerEx_1.swf", "onready=playerOnReady&autoload=1&cid=" + t.options.sid + "&room_id=" + t.options.sid + "&start=" + Math.floor(new Date().getTime() / 1000) + "&cover=" + t.options.pic + "&state=LIVE&rnd=" + Math.floor(new Date().getTime() / 1000) + "&initTime=" + new Date().getTime());
				t.setMB();
			} else {
				/*$.ajax({
					url:'http://zhuanti.appgame.com/wp-content/themes/appgame-zhuanti/getVideoData.php',
					type: "GET",
					timeout:3000,
					dataType:"JSONP",
					data:{url:"http://live.bilibili.com/api/playurl?platform=h5&cid="+t.options.sid},
					success:function(data){
						data=eval("("+data.content+")");
						jQuery("#"+t.options.id).html('<video width="100%" poster="'+t.options.pic+'" height="100%" preload="auto" webkit-playsinline="" style="display: inline;"><source src="'+data.data+'" type="video/mp4"></video>');
					},
					error:function(e){
						console.log(e);
					}
				});*/
				if (t.options.vid != '') {
					var str1 = t.getRandString(32);
					var str2 = t.getRandString(3);
					jQuery("#" + t.options.id).html('<video controls="controls" width="100%" height="100%" poster="' + t.options.pic + '" preload="auto" webkit-playsinline="" style="display: inline;"><source src="http://wshls.acgvideo.com/live/live_' + t.options.vid + '/playlist.m3u8?wsSecret=' + str1 + '&wsTime=57987' + str2 + '" type="video/mp4"></video>');
				} else {
					t.setNoVideo();
				}
			}
		},
		playHuYa: function () {
			var t = this;
			if (t.isPC()) {
				t.setObject("http://weblbs.yystatic.com/s/" + t.options.cid + "/" + t.options.sid + "/huyacoop.swf", "");
				t.setMB();
			} else {
				if (t.options.vid != '') {
					var str1 = t.getRandString(32);
					var str2 = t.getRandString(32);
					//jQuery("#"+t.options.id).html('<video webkit-playsinline="" preload="none" width="100%" height="100%" poster="'+t.options.pic+'" controls="controls"><source src="http://hls.yy.com/newlive/'+t.options.vid+'.m3u8?org=huya&appid=0&uuid='+str1+'&t='+Math.floor(new Date().getTime()/1000)+'&tk='+str2+'&uid=0"><span>您的手机版本，网页版暂未能支持！</span></video>');

					jQuery("#" + t.options.id).html('<video webkit-playsinline="" preload="none" width="100%" height="100%" poster="' + t.options.pic + '" controls="controls"><source src="http://hls.yy.com/newlive/' + t.options.cid + '_' + t.options.sid + '_10057.m3u8?org=huya&appid=0&' + t.options.vid + '"><span>您的手机版本，网页版暂未能支持！</span></video>');

				} else {
					t.setNoVideo();
				}
			}
			//t.setObject("http://weblbs.yystatic.com/s/"+t.options.sid+"/"+t.options.sid+"/huyacoop.swf","topSid="+t.options.sid+"&subSid="+t.options.sid+"&type=huyacoop&_yyAuth=12&topSid=44896721&subSid=44896721&newtuna=1&referer=&pageFull=1&iSourceType=1&screenType=0&normalpub=1&furl=&referer=http%3A%2F%2Fwww.huya.com");
			//topSid=44896721&subSid=44896721&type=jsscene&_yyAuth=12&rso=&rso_desc=&from=&vappid=10057&gameId=393&furl=&referer=http%3A%2F%2Fwww.huya.com%2F1615181357&ref=&pageFull=1&iSourceType=1&screenType=0&normalpub=1
		},
		getRandString: function (num) {
			var s = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
			var str = "", random;
			for (; num--;) {
				random = Math.floor(Math.random() * 36);//0-35
				str += s[random];
			}
			return str;
		},
		setEmbed: function (src, flashvars) {
			var t = this;
			var video = document.createElement("embed");
			video.setAttribute("flashvars", flashvars);
			video.setAttribute("src", src);
			video.setAttribute("allowfullscreen", true);
			video.setAttribute("wmode", "transparent");
			video.setAttribute("quality", "high");
			video.setAttribute("style", "visibility: visible;");
			video.setAttribute("pluginspage", "http://www.macromedia.com/go/getflashplayer");
			video.setAttribute("type", "application/x-shockwave-flash");
			jQuery("#" + t.options.id).html(video);
		},
		setMB: function () {
			var t = this;
			var style = $("#" + t.options.id).css("position");
			style = style == "static" ? "relative" : style;
			$("#" + t.options.id).css({ position: style, overflow: "hidden" });
			$("#" + t.options.id).one("mouseenter", function () {
				$('<div style="position:absolute;left:100px;bottom:40px;width:100%;height:100%;background-color:transparent;"><div style="position:absolute;width:100%;height:100%;bottom:80px;left:-100px;background-color:transparent;"></div></div>').appendTo($(this));
			});
		},
		setNoVideo: function () {
			var t = this;
			$("#" + t.options.id).css({ background: 'url(novideo.jpg) no-repeat center center #000', backgroundSize: "50%" });
		},
		setObject: function (src, flashvars) {
			var t = this;
			var video = document.createElement("object");
			video.setAttribute("type", "application/x-shockwave-flash");
			video.setAttribute("data", src);
			video.setAttribute("width", "100%");
			video.setAttribute("height", "100%");
			video.innerHTML = '<param name="allowfullscreeninteractive" value="true"><param name="allowfullscreen" value="true"><param name="quality" value="high"><param name="allowscriptaccess" value="always"><param name="wmode" value="transparent"><param name="flashvars" value="' + flashvars + '">';
			jQuery("#" + t.options.id).html(video);
		},
		isPC: function () {
			var userAgentInfo = navigator.userAgent;
			var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
			var flag = true;
			for (var v = 0; v < Agents.length; v++) {
				if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
			}
			return flag;
		},
		multipleVideo: function () {//兼容优酷同时出现多个播放器
			var t = this, multipleVideoIndex = 0;
			function initH5video() {
				var $video = $('.youku_video:eq(' + multipleVideoIndex + ')');
				var $poster = $video.find('.x-video-poster img');
				var background = $poster.attr('src');
				var title = $video.find('.x-title').text();
				var $parent = $poster.parents('.youku_video');
				$video.data('background', background);
				$video.data('title', title);

				if ($('.youku_video').length <= 1) {
					return;
				}
				multipleVideoIndex++;
				if (multipleVideoIndex < multipleNum) {
					setTimeout(function () {
						setH5Video($('.youku_video').eq(multipleVideoIndex));
					}, 300);
				} else if (multipleVideoIndex == multipleNum) {
					t.multipleVideoInit = true;
					setH5Video($('.youku_video').eq(0));
				}
			}
			var multipleVideoIndex = 0;
			var multipleNum;
			t.multipleVideoInit = false;
			//$(function() {
			if (!YKP.isMobile) {
				return;
			}
			multipleNum = $('.youku_video').length;
			if (multipleNum <= 1) {
				return;
			}
			setH5Video($('.youku_video').eq(0));
			var v_pos = {};
			$('.youku_video').each(function () {
				var $v = $(this);
				var top = $(this).offset().top;
				v_pos[top] = $v;
			});
			var height = $(window).height();
			var hasVideo = false;
			$(window).on('scroll', function () {
				if (!t.multipleVideoInit) {
					return false;
				}
				var top = $('body').scrollTop();
				var bottom = top + height;
				var vs = [];
				for (var key in v_pos) {
					if (key > top && key < bottom) {
						vs.push(v_pos[key]);
					}
				}
				if (vs.length == 1) {
					if (!hasVideo) {
						hasVideo = true;
						setH5Video(vs[0]);
					}
				} else {
					hasVideo = false;
				}
			});

			//});
			function setH5VideoInfo(id) {
				$('.youku_video').html('<div class="title" style="background: rgba(0,0,0,0.7);position: relative; font-size: 14px; color: #bbbbbb; padding: 0 15px; z-index: 20; line-height: 35px;"></div><div style="width: 86px; height: 86px; position: absolute; left: 50%; top: 50%; margin-left: -43px; margin-top: -43px; background: url(http://player.youku.com/h5player/img/xplayerv4.png) no-repeat 0 0;"></div>');
				$('.youku_video').each(function () {
					var background = $(this).data('background');
					if (background) {
						$(this).css({ 'background': 'url("' + background + '")', 'background-size': '100%', 'position': 'relative' });
					} else {
						$(this).css({ 'background': 'black', 'background-size': '100%', 'position': 'relative' });
					}
					var title = $(this).data('title');
					if (title) {
						$(this).find('.title').html(title);
					}
					$(this).unbind('click');
					$(this).bind('click', function () {
						if ($(this).find('.x-player').length == 0) {
							setH5Video($(this), true);
						}
					});
				})
			}
			function setH5Video($div, auto) {
				var sid = $div.attr('sid');
				var id = $div.attr('id');
				setH5VideoInfo(sid);
				var autoplay = false;
				if (auto) {
					autoplay = true;
				}
				var player0 = new YKU.Player(id, {
					client_id: '1a0718786643b0ef',
					vid: sid,
					autoplay: autoplay,
					events: { onPlayerReady: function () { initH5video(); } }
				});
			}

		}
	}
	/*var playVideoObj=function(opt){
		this.init(opt);
	}
	playVideoObj.prototype=new playVideo();
	playVideoObj.prototype.constructor = playVideoObj;*/
	window.createVideo = function (opt) {
		var options = {
			id: "playvideo",//容器id
			autoplay: false,
			isIframe: false,//是否启用iframe调用(爱奇艺)
			qqchannel: false,//是否直播(腾讯)
			playtype: 'replay',//游看播放类型(live 直播 replay 回放)
			minWin: false,//视频窗口为小窗口(只对腾讯视频有效)
			multiple: ""
		}, typeid, sid, vid, pic, title, playtype, cid;
		jQuery.extend(options, opt);
		if (typeof options.multiple == "object") {
			typeid = options.multiple.typeid;
			sid = options.multiple.sid;
			vid = options.multiple.vid;
			cid = options.multiple.cid;
			pic = options.multiple.pic;
			title = options.multiple.vtitle;
			playtype = options.multiple.playtype || options.playtype;
		} else {
			obj = jQuery("#" + options.id);
			typeid = obj.attr("typeid");
			sid = obj.attr("sid");
			vid = obj.attr("vid");
			cid = obj.attr("cid");
			pic = obj.attr("pic");
			title = obj.attr("vtitle");
			playtype = obj.attr("playtype") || options.playtype;
		}
		var opts = { id: options.id, minWin: options.minWin, type: typeid, title: title, playtype: playtype, qqchannel: options.qqchannel, isIframe: options.isIframe, cid: cid, sid: sid, vid: vid, pic: pic, autoplay: options.autoplay == false ? false : true }
		new playVideo(opts);
	};
})(window);