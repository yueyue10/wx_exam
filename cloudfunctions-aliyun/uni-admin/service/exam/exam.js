const {
	Service
} = require('uni-cloud-router')

module.exports = class ExamService extends Service {
	constructor(ctx) {
		super(ctx)
		this.questionCt = this.db.collection('question')
		this.paperCt = this.db.collection('paper')
		this.examCt = this.db.collection('exam')
		this.dbCmd = this.db.command
	}
	// 获取用户信息
	async getUserInfo(uniIdToken) {
		await this.service.user.checkToken(uniIdToken)
		const userAuth = this.ctx.auth
		console.log("userAuth", userAuth)
		return userAuth
	}

	async getExamPapers(uniIdToken) {
		// 查询到正在考试的试卷
		let inExamRes = await this.getInExamPaper()
		if (inExamRes.data.length <= 0)
			return inExamRes
		let paperList = inExamRes.data
		// 查询用户信息
		let userAuth = await this.getUserInfo(uniIdToken)
		// 查询符合用户的试卷
		let uInExamRes = await this.filterUserInExamPapers(userAuth.role, paperList)
		if (uInExamRes.data.length <= 0)
			return uInExamRes
		let uInExamPapers = uInExamRes.data
		// 查询用户未考过的试卷
		let uCanExamRes = await this.filterUserCanExamPapers(userAuth.uid, uInExamPapers)
		if (uCanExamRes.data.length <= 0)
			return uCanExamRes
		return {
			code: 0,
			data: uCanExamRes.data,
			message: '成功',
		}
	}
	// 获取正在考试中的试卷
	async getInExamPaper() {
		let cur_date = Date.now()
		const paperRes = await this.paperCt.where({
			status: 1,
			start_time: this.dbCmd.lt(cur_date),
			end_time: this.dbCmd.gt(cur_date)
		}).get()
		console.log("paperRes", paperRes)
		//查询到正在考试的试卷
		let paperList = paperRes.data
		console.log("paperList", paperList)
		return {
			code: 0,
			data: paperList,
			message: paperList.length <= 0 ? "没有考试中的试卷" : "success"
		}
	}
	// 筛选用户可考试的试卷
	async filterUserInExamPapers(userRoles, paperList) {
		let mPpList = [] //属于用户的试卷
		paperList.forEach(paperItem => {
			let hasIn = false //是否有相同元素
			paperItem.user_role.forEach(paperRole => {
				let inRole = userRoles.includes(paperRole)
				if (inRole) hasIn = true
			})
			//判断试卷的角色和用户的角色有相同元素，就将试卷导出到mPpList
			if (hasIn) mPpList.push(paperItem)
		})
		console.log("filterUserInExamPapers", mPpList)
		return {
			code: 0,
			data: mPpList,
			message: mPpList.length <= 0 ? "没有符合用户的试卷" : "success"
		}
	}
	// 筛选用户可考、未考的试卷
	async filterUserCanExamPapers(uid, paperList) {
		let uExamRes = await this.getUserExams("", uid)
		let uExamPapers = uExamRes.data //用户已经考过的试卷
		console.log("uExamPapers", uExamPapers)
		let mPpList = [] //用户未考的试卷
		paperList.forEach(paperItem => {
			let hasIn = false //是否有相同元素
			uExamPapers.forEach(uExamPaper => {
				if (paperItem._id == uExamPaper.paperId) hasIn = true
			})
			//判断试卷的id没有在用户考过的试卷中，就将试卷导出到mPpList
			if (!hasIn) mPpList.push(paperItem)
		})
		console.log("filterUserCanExamPapers", mPpList)
		return {
			code: 0,
			data: mPpList,
			message: mPpList.length <= 0 ? "没有用户待考试的试卷" : "success"
		}
	}

	// 获取试卷详情
	async getPaperInfo(paperId) {
		return this.paperCt.doc(paperId).get()
	}

	// 创建用户考试试卷
	async createExam(examObj, uniIdToken) {
		let errMsg = uniIdToken ? "" : "需要uniIdToken参数";
		errMsg = examObj.paperId ? "" : "需要paperId参数";
		if (errMsg)
			return {
				code: 0,
				data: "",
				message: errMsg
			}
		examObj.create_date = Date.now()
		// 添加用户userId标识
		await this.service.user.checkToken(uniIdToken)
		const uid = this.ctx.auth.uid
		console.log("uid", uid)
		examObj.userId = uid
		await this.computePaperScore(examObj)
		return this.examCt.add(examObj)
	}

	// 计算试卷分数
	async computePaperScore(examObj) {
		let paperInfo = await this.getPaperInfo(examObj.paperId)
		paperInfo = paperInfo.data[0]
		console.log("paperInfo", paperInfo)
		let uTotalScore = 0
		examObj.question_list.forEach(exmQueItem => {
			var paperQue = paperInfo.question_list.filter(paperQueItem => {
				return paperQueItem._id == exmQueItem._id;
			})
			paperQue = paperQue[0]
			console.log("paperQue", paperQue)
			let isEqu = ""
			if (exmQueItem.type == 0)
				isEqu = this.isArrayEquals(exmQueItem.uAnswer, paperQue.answer)
			if (exmQueItem.type == 1)
				isEqu = this.isDecideEquals(exmQueItem.uDecide, paperQue.decide)
			exmQueItem.uScore = isEqu ? exmQueItem.score : 0;
			uTotalScore += exmQueItem.uScore
		})
		examObj.uTotalScore = uTotalScore
	}
	// 判断两个数组是否一致
	isArrayEquals(array1, array2) {
		console.log("isArrayEquals", array1, array2)
		return array1.length == array2.length && array1.every((v, i) => {
			return v === array2[i]
		});
	}
	// 判断两个值是否一致	
	isDecideEquals(str, bool) {
		let decideBoo = str === "true"
		return bool == decideBoo;
	}

	// 用户已经考过的考试uniIdToken和uid两参数任选一个
	async getUserExams(uniIdToken, uid = "") {
		if (!uid) await this.service.user.checkToken(uniIdToken)
		uid = this.ctx.auth.uid
		let uExams = await this.examCt.where({
			userId: uid
		}).get()
		console.log("getUserExams", uExams.data, uid)
		let result = {
			code: 0,
			data: uExams.data,
			message: uExams.data.length <= 0 ? '没有用户的考卷' : 'success'
		}
		return result;
	}
}
