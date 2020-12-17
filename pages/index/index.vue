<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<!-- <view>登录</view> -->
		<view style="margin-top: 50px;">
			<view class="hor-layout-center">
				<view style="margin-right: 10px;">账号</view>
				<input v-model="account" placeholder="请输入账号" style="padding: 5px;border: #F1F1F1 solid 1px;" />
			</view>
			<view class="hor-layout-center" style="margin-top: 15px;position: relative;">
				<view style="margin-right: 10px;">密码</view>
				<input v-model="password" placeholder="请输入密码" :password="!canPsdSee" style="padding: 5px;border: #F1F1F1 solid 1px;" />
				<uni-icons type="eye" size="20" :color="canPsdSee?'#8a8a8a':'#dcdcdc'" @click="changePsdState" style="position: absolute;right: 5px;"></uni-icons>
			</view>
		</view>
		<button size="mini" :type="canLogin?'primary':'default'" style="margin-top: 20px;" @click="onLoginClick">登录</button>
	</view>
</template>

<script>
	import {
		exam,
		paper
	} from "../../router.js"
	export default {
		data() {
			return {
				title: 'Hello',
				canPsdSee: false,
				account: '',
				password: ''
			}
		},
		computed: {
			canLogin() {
				let loginValue = this.account && this.password
				return loginValue
			}
		},
		onLoad() {

		},
		methods: {
			changePsdState() {
				let canPsdSee = this.canPsdSee ? false : true
				this.canPsdSee = canPsdSee
			},
			onLoginClick() {
				let loginValue = this.account && this.password
				if (!loginValue) {
					uni.showToast({
						title: "请输入用户名密码"
					})
					return
				}
				let value = {
					username: this.account,
					password: this.password
				}
				this.$request('user/userLogin', value).then(res => {
					uni.setStorageSync("userInfo", res.userInfo)
					uni.showToast({
						title: "登录成功！"
					})
					setTimeout(() => {
						uni.reLaunch({
							url: exam
						})
					}, 500)
				}).catch(err => {
					uni.showToast({
						title: err.message || "请求失败!"
					})
				})
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}
</style>
