<template>
	<div class="m-video__wrap">
		<div id="playvideo" class="m-video"></div>
	</div>
</template>

<script>
var video = require('@/js/player.js')
export default {
	name: 'MVideo',
	data() {
		return {
			msg: 'Welcome to use video module',
			_videoType: null,
			_videoId: null,
			_autoplay: false
		}
	}
	, props: {
		videoType: {
			type: String,
			default: 'youku'
		}
		, videoId: {
			type: String,
			default: 'XMjc4MzM4NTY0MA=='
		}
		, autoplay: {
			type: Boolean,
			default: false
		}
	}
	, mounted() {
		this.setVideoType();
		this.setVideoId();
		// console.log(this.autoplay)
	}

	, methods: {
		setVideoId() {
			// console.log('setVideoId')
			if (!this.videoId || typeof this.videoId === 'undefined' || typeof this.videoId === null) {
				this._videoId = 'XMjc4MzM4NTY0MA==';
			} else {
				this._videoId = this.videoId;
			}
			// console.log('this._videoId:', this._videoId)
		},
		setVideoType() {
			// console.log('setVideoType')
			if (!this.videoType || typeof this.videoType === 'undefined' || typeof this.videoType === null) {
				this._videoType = 'youku';
			} else {
				this._videoType = this.videoType;
			}
			// console.log('this._videoType:', this._videoType)

		},
		play(obj) {
			var me = this;
			if (typeof window.createVideo === 'function') {

				createVideo({
					id: "playvideo",
					autoplay: obj.autoplay ? obj.autoplay : me._autoplay,
					minWin: false,			 //适用于腾讯视频
					qqchannel: false, 		//是否腾讯直播
					multiple: {
						typeid: obj.videoType ? obj.videoType : me._videoType,//视频类型 qq|tencent/youku/youcan/sohu/iqiyi/cc/douyu/bilibili/huya
						// 　　　　typeid:'qq' ,//视频类型 qq|tencent/youku/youcan/sohu/iqiyi/cc/douyu/bilibili/huya
						sid: obj.videoId ? obj.videoId : me._videoId, //视频id => youku,腾讯
						// 　　　　sid:'u0502ewsnbw', //视频id => youku,腾讯
						cid: "",		//视频cid(虎牙)
						vid: "",     //(爱奇艺/cc/斗鱼/虎牙/B站)
						playtype: "",//游看视频播放类型
						pic: ""
					}
				});

				this.callback({ stateus: true, msg: 'ok' });
				console.log('播放视频')
			} else {
				console.log('player.js未见没成功加载');
				this.callback({ stateus: false, msg: 'player.js未见没成功加载' })
			}
		}
		,
		callback(msg) {
			this.$emit('callback', msg)
		}
	},
	watch: {
		autoplay(val) {
			if (typeof val !== 'undefined' && typeof val !== null) {
				this._autoplay = val;
			}
		},
		videoType(val) {
			this.setVideoType();
		},
		videoId(val) {
			if (val) {
				this.setVideoId();
				this.play({ autoplay: this._autoplay, videoType: this._videoType, videoId: this._videoId })
			}
		}

	}
}

</script>

<style scoped lang="scss" rel="stylesheet/scss" type="text/css">
.m-video {
	position: relative;
	height: 170px;
	embed {
		display: block;
		width: 100%;
		height: 100%;
	}
}
</style>
