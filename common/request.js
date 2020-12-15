import {
	home
} from "../router.js"
export function request(action, data, {
	functionName = 'uni-exam',
	showModal = true
} = {}) {
	let userToken = uni.getStorageSync("userToken")
	// alert(JSON.stringify(userToken))
	data.uniIdToken=userToken.token
	return uniCloud.callFunction({
		name: functionName,
		data: {
			action,
			data
		}
	}).then(({
		result
	}) => {
		// debugger
		if (!result) {
			return Promise.resolve(result)
		}
		if (result.code) {
			if (typeof result.code === 'string' && result.code.indexOf('TOKEN_INVALID') === 0) {
				uni.reLaunch({
					url: home
				})
			}
			const err = new Error(result.msg)
			err.code = result.code
			return Promise.reject(err)
		}
		const {
			token,
			tokenExpired
		} = result
		if (token && tokenExpired) {
			uni.setStorageSync('userToken', {
				token,
				tokenExpired
			})
		}
		return Promise.resolve(result)
	}).catch(err => {
		showModal && uni.showModal({
			content: err.message || '请求服务失败',
			showCancel: false
		})
		return Promise.reject(err)
	})
}

export function initRequest(Vue) {
	Vue.prototype.$request = request
}
