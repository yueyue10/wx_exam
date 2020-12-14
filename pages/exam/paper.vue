<template>
	<view class="container">
		<view class="exam-title">考试题目：{{paperInfo.title}}</view>
		<view class="hor-layout-center-all exam-time" v-if="paperInfo.start_time">
			<view>开始时间：</view>
			<uni-dateformat :date="paperInfo.start_time" format="yyyy/MM/dd hh:mm"></uni-dateformat>
		</view>
		<view class="hor-layout-center-all exam-time" style="margin-top: 5px;" v-if="paperInfo.end_time">
			<view>结束时间：</view>
			<uni-dateformat :date="paperInfo.end_time" format="yyyy/MM/dd hh:mm"></uni-dateformat>
		</view>
		<!-- 题目列表 -->
		<view v-for="(item,index) in paperInfo.question_list" class="question-item">
			<view v-if="unComplete==index" style="text-align: center;color:#f63d46;">未作答</view>
			<!-- 题目 -->
			<view class="hor-layout-center question-title">
				<text style="font-weight: bold;">{{index+1}}. </text>
				{{item.title}}
				<text class="question-score">({{item.score}}分)</text>
			</view>
			<!-- 选择题 -->
			<view style="margin: 10px;" v-if="item.type==0">
				<view v-for="(opt,ind) in item.options">
					<view>{{opt.text}}. {{opt.content}}</view>
				</view>
				<view class="hor-layout-center" style="margin-top: 10px;">
					<view>选择答案：</view>
					<checkbox-group @change="unComplete=-1;item.uAnswer=$event.detail.value">
						<label v-for="(opt,ind) in item.options">
							{{opt.text}}.
							<checkbox :value="opt.text" color="#FFCC33" style="transform:scale(0.7)" />
						</label>
					</checkbox-group>
				</view>
			</view>
			<!-- 判断题 -->
			<view class="hor-layout-center" style="margin: 10px;" v-if="item.type==1">
				<view>选择答案：</view>
				<radio-group @change="unComplete=-1;item.uDecide=$event.detail.value">
					<label>
						<radio style="transform:scale(0.7)" value="true" />正确
					</label>
					<label style="margin-left: 20px;">
						<radio style="transform:scale(0.7)" value="false" />错误
					</label>
				</radio-group>
			</view>
		</view>
		<view class="submit-view" @click="submitExam">提交</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				paperInfo: {},
				checkOtpions: [],
				unComplete: -1
			}
		},
		onLoad(event) {
			let paperId = event.paperId
			this.paperId = paperId
			this.getPaperInfo()
		},
		methods: {
			getPaperInfo() {
				this.$request('exam/exam/getPaperInfo', {
					paperId: this.paperId
				}).then(res => {
					// debugger
					let result = res.data
					console.log("result", result[0])
					if (result && result.length > 0) {
						this.paperInfo = result[0]
					} else {
						uni.showToast({
							title: '暂无数据'
						})
					}
				}).catch(err => {
					// debugger
					uni.showToast({
						title: err.message || "请求失败!"
					})
				})
			},
			submitExam() {
				let paperInfo = this.paperInfo
				console.log(paperInfo.question_list)
				let unComplete = -1;
				for (var index = 0; index < paperInfo.question_list.length; index++) {
					let item = paperInfo.question_list[index]
					if (item.type == 0 && (!item.uAnswer || item.uAnswer.length <= 0)) {
						unComplete = index;
						break;
					}
					if (item.type == 1 && (!item.uDecide || item.uDecide.length <= 0)) {
						unComplete = index;
						break;
					}
				}
				this.unComplete = unComplete
				if (unComplete != -1) {
					uni.showToast({
						title: `第${unComplete+1}题未作答！`
					})
				} else {
					paperInfo.paperId = paperInfo._id
					this.$request('exam/exam/createExam', {
						examObj: paperInfo
					}).then(res => {
						// debugger
						uni.showToast({
							title: "提交成功！"
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 1000)
					}).catch(err => {
						// debugger
						uni.showToast({
							title: err.message || "请求失败!"
						})
					})
				}
			}
		}
	}
</script>

<style>
	.container {
		padding: 15px;
	}

	.exam-title {
		font-weight: bold;
		font-size: large;
		width: 100%;
		text-align: center;
	}

	.exam-time {
		font-size: small;
		margin-top: 10px;
		width: 100%;
	}

	.question-item {
		font-size: small;
		margin: 10px 3px;
		padding: 7px;
		border-radius: 5px;
		background: #C8C7CC;
	}

	.question-title {
		font-size: medium;
		font-weight: 500;
	}

	.question-score {
		margin-left: 5px;
		font-size: small;
		color: #007AFF;
	}

	.submit-view {
		color: white;
		width: 150px;
		position: fixed;
		bottom: 10px;
		padding: 10px 0px;
		background: #55aa00;
		border-radius: 5px;
		text-align: center;
		left: calc(50% - 75px);
	}
</style>
