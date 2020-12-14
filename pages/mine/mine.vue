<template>
	<view class="container">
		<view class="top-layout">
			<image class="top-image"></image>
			<view class="top-info" @click="">
				<image class="user-icon" :src="avatarUrl"></image>
				<view>{{userInfo.username}}</view>
			</view>
		</view>
		<!-- 功能列表 -->
		<view style="margin-top: 40rpx">
			<block v-for="(item,index) in myList" :key="index">
				<view class="my-item hor-layout-center" @click="onItemClick(item)">
					<uni-icons class="my-item_icon" :type="item.icon" size="20"></uni-icons>
					<view class="my-item-title">{{item.title}}</view>
					<uni-icons class="my-item_right" type="arrowright" size="20"></uni-icons>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatarUrl: require('static/user_icon.jpg'),
				userInfo: {},
				myList: [{
					title: '我的考试',
					icon: 'paperclip',
					url: "aboutme"
				}, {
					title: '访客记录',
					icon: 'help',
					url: "visitors"
				}, {
					title: '个人网址',
					icon: 'email',
					weburl: 'https://zhaoyj.work'
				}],
			}
		},
		onLoad() {
			let userInfo = uni.getStorageSync("userInfo")
			this.userInfo = userInfo
			console.log("userInfo", userInfo)
		},
		methods: {
			onItemClick(item) {

			}
		}
	}
</script>

<style>
	.container {
		width: 100%;
		height: 100vh;
		background: #F4F4FA;
	}

	.top-layout {
		/* background-color: #2277f0; */
		background: linear-gradient(#2277f0, #5898f4);
		height: 260px;
		position: relative;
		display: flex;
		flex-direction: row;
	}

	.top-image {
		bottom: 0px;
		width: 100%;
		height: 100px;
		position: absolute;
		background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSJhdXRvIj4NCgkJCQk8ZyBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDcpIj4NCgkJCQkJPHBhdGggZD0iTSAwIDcwIFEgNzUgMzksIDE1MCA3MCBUIDMwMCA3MCBUIDQ1MCA3MCBUIDYwMCA3MCBUIDc1MCA3MCBWIDEwMCBIIDAgViAwIj48L3BhdGg+DQoJCQkJCTxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgYXR0cmlidXRlVHlwZT0iWE1MIiB0eXBlPSJ0cmFuc2xhdGUiIGZyb209IjAiIHRvPSItMzAwIiBkdXI9IjIuNXMiDQoJCQkJCSByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlVHJhbnNmb3JtPg0KCQkJCTwvZz4NCgkJCQk8ZyBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDcpIj4NCgkJCQkJPHBhdGggZD0iTSAwIDcwIFEgODcuNSA0NywgMTc1IDcwIFQgMzUwIDcwIFQgNTI1IDcwIFQgNzAwIDcwIFQgODc1IDcwIFQgMTA1MCA3MCBWIDEwMCBIIDAgViAwIj48L3BhdGg+DQoJCQkJCTxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgYXR0cmlidXRlVHlwZT0iWE1MIiB0eXBlPSJ0cmFuc2xhdGUiIGZyb209IjAiIHRvPSItMzUwIiBkdXI9IjRzIg0KCQkJCQkgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZVRyYW5zZm9ybT4NCgkJCQk8L2c+DQoJCQkJPGcgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA3KSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTkwMy44NjggMCkiPg0KCQkJCQk8cGF0aCBkPSJNIDAgNzAgUSAxMzUgMzYsIDI3MCA3MCBUIDU0MCA3MCBUIDgxMCA3MCBUIDEwODAgNzAgViAxMDAgSCAwIFYgMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM4LjIzMjI4NDM2Nzc5NjQ3NCwgMCkiPjwvcGF0aD4NCgkJCQkJPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiBhdHRyaWJ1dGVUeXBlPSJYTUwiIHR5cGU9InRyYW5zbGF0ZSIgZnJvbT0iMCIgdG89Ii01NDAiIGR1cj0iM3MiDQoJCQkJCSByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlVHJhbnNmb3JtPg0KCQkJCTwvZz4NCgkJCTwvc3ZnPg==');
	}

	.top-info {
		position: relative;
		margin: auto;
		margin-top: 190rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.user-icon {
		width: 110rpx;
		height: 110rpx;
		border-radius: 50%;
	}

	.my-item {
		position: relative;
		background: white;
		height: 88rpx;
		margin-top: 27rpx;
	}

	.my-item_icon {
		color: #A0C3F8;
		font-size: 47rpx;
		line-height: 47rpx;
		margin-left: 40rpx;
	}

	.my-item-title {
		font-size: 28rpx;
		margin-left: 20rpx;
	}

	.my-item_right {
		height: 60rpx;
		font-size: 60rpx;
		line-height: 60rpx;
		position: absolute;
		right: 40rpx;
		color: #CBCBCB;
	}
</style>
