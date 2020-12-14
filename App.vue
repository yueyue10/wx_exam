<script>
	import {
		home
	} from "./router.js"
	export default {
		onLaunch: function() {
			
		},
		onShow: function() {
			let userToken = uni.getStorageSync("userToken")
			if (!userToken)
				uni.navigateTo({
					url: home
				})
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import '@/common/comm.css';
</style>
