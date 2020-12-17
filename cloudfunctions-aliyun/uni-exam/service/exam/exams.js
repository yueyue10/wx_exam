const {
	Service
} = require('uni-cloud-router')

module.exports = class ExamsService extends Service {
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
		console.log("uExamList=======",uExamList)
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
}
