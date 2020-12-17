const {
	Service
} = require('uni-cloud-router')

module.exports = class ExamNewService extends Service {
	constructor(ctx) {
		super(ctx)
		this.questionCt = this.db.collection('question')
		this.paperCt = this.db.collection('paper')
		this.examCt = this.db.collection('exam')
		this.dbCmd = this.db.command
	}

	//获取用户正在考试的试卷
	async getUserExamIngPapers(uniIdToken) {
		//先获取用户信息
		await this.service.user.checkToken(uniIdToken)
		const userAuth = this.ctx.auth
		console.log("userAuth=======", userAuth.role)
		//查询用户考过的试卷
		let uExams = await this.examCt.aggregate()
			.match({
				userId: userAuth.uid
			}).project({
				_id: 1
			}).end()
		console.log("uExams=======", JSON.stringify(uExams))
		let uExamList = [] //用户考过的试卷id集合
		uExams.data.forEach(exam => {
			uExamList.push(exam._id)
		})
		console.log("uExamList=======", uExamList)
		// 查询符合用户的试卷：等级匹配、未考过的【未结束的，已发布的】
		let cur_date = Date.now()
		let paperRes = await this.paperCt.aggregate()
			.match({
				status: 1,
				start_time: this.dbCmd.lt(cur_date),
				end_time: this.dbCmd.gt(cur_date)
			})
			.unwind('$user_role')
			.match({
				user_role: this.dbCmd.in(userAuth.role),
				_id: this.dbCmd.nin(uExamList)
			}).group({
				_id: '$_id'
			}).end()
		console.log("paperRes=======", JSON.stringify(paperRes))
		return paperRes
	}

	// 创建用户考试试卷
	async createExam(examObj, uniIdToken) {
		//先检查参数
		delete examObj._id
		let errMsg = uniIdToken ? "" : "需要uniIdToken参数";
		errMsg = examObj.paperId ? "" : "需要paperId参数";
		if (errMsg) return this.createResult(errMsg)

		//1.先获取用户信息
		await this.service.user.checkToken(uniIdToken)
		const userAuth = this.ctx.auth
		console.log("userAuth=======", userAuth.role)
		//2.查询用户是否考过当前试卷
		let uExams = await this.examCt.aggregate()
			.match({
				userId: userAuth.uid,
				paperId: examObj.paperId
			}).project({
				_id: 1
			}).end()
		console.log("uExams=======", JSON.stringify(uExams))
		if (uExams.affectedDocs > 0) {
			errMsg = "用户已经考过该试卷。"
			return return this.createResult(errMsg)
		}
		//3.计算用户考卷分数并添加考卷里面
		examObj.create_date = Date.now()
		// 添加用户userId标识
		console.log("uid", userAuth.uid)
		examObj.userId = userAuth.uid
		await this.computePaperScore(examObj)
		return this.examCt.add(examObj)
	}
	
	// 计算试卷分数
	async computePaperScore(examObj) {
		let paperInfo = await this.paperCt.doc(examObj.paperId).get()
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
	
	// 创建返回结果
	createResult(errMsg) {
		let result = {
			code: 0,
			data: "",
			message: errMsg
		}
		return result;
	}
}
