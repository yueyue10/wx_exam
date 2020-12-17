<template>
	<view class="content">
		<block v-if="examList.length>0" v-for="(item,index) in examList" :key="index">
			<view class="exam-list" @click="onExamClick(item)">
				<view>题目：{{item.title}}</view>
				<view>
					开始时间：<uni-dateformat :date="item.start_time" :threshold="[0, 0]"></uni-dateformat>
				</view>
				<view>
					结束时间：<uni-dateformat :date="item.end_time" :threshold="[0, 0]"></uni-dateformat>
				</view>
			</view>
		</block>
		<view v-if="examList.length<=0" class="no-data-view" style="color: #777777;">
			<view class="hor-layout-center" style="width: fit-content;margin: auto;">
				<uni-icons type="help" size="20" style="margin-right: 5px;" color="#777777"></uni-icons>
				<text>暂无考试</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		paper
	} from '../../router.js'
	export default {
		data() {
			return {
				examList: []
			}
		},
		onLoad() {

		},
		onShow() {
			this.getExamList()
		},
		methods: {
			getExamList() {
				this.$request('exam/exam/getExamPapers', {}).then(res => {
					// debugger
					console.log(res)
					this.examList = res.data
				}).catch(err => {
					// debugger
					uni.showToast({
						title: err.message || "请求失败!"
					})
				})
			},
			onExamClick(examItem) {
				uni.navigateTo({
					url: paper + "?paperId=" + examItem._id
				})
			}
		}
	}
</script>

<style>
	page {
		background: #F4F4FA;
	}

	.exam-list {
		margin: 10px;
		padding: 15px;
		background: #e8e8e8;
		border-radius: 7px;
		font-size: small;
	}

	.no-data-view {
		position: fixed;
		top: 45vh;
		width: 100%;
		text-align: center;
	}
</style>
