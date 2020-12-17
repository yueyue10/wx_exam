<template>
	<view class="container" style="padding: 15px;">
		<view v-for="(exam,index) in examList" class="exam-item hor-layout-side">
			<view class="ver-layout">
				<view style="font-size: 14px;margin-bottom: 8px;font-weight: bold;">题目：{{exam.title}}</view>
				<view class="hor-layout">
					考试时间：<uni-dateformat :date="exam.create_date"></uni-dateformat>
				</view>
			</view>
			<view class="ver-layout-center-all" style="display: flex;">
				<view style="color: #5898F4;">得分：{{exam.uTotalScore}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				examList: []
			}
		},
		onLoad() {
			this.getUserExams()
		},
		methods: {
			getUserExams() {
				this.$request('exam/exam/getUserExams', {}).then(res => {
					// debugger
					let result = res.data
					console.log("result", result[0])
					if (result && result.length > 0) {
						this.examList = result
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
			}
		}
	}
</script>

<style>
	.exam-item {
		background: #cfe0e6;
		border-radius: 5px;
		padding: 10px;
		font-size: small;
	}
</style>
