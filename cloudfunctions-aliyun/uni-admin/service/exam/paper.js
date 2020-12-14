const {
	Service
} = require('uni-cloud-router')

module.exports = class PaperService extends Service {
	constructor(ctx) {
		super(ctx)
		this.questionCt = this.db.collection('question')
		this.paperCt = this.db.collection('paper')
		this.dbCmd = this.db.command
	}

	async addQuestion(question, paperId) {
		// 先添加到问题数据库
		question.create_date = Date.now()
		return this.questionCt.add(question).then(res => {
			console.log("questionId", res)
			let questionId = res.id
			console.log("questionId", questionId)
			//再查询问题
			return this.questionCt.doc(questionId).get()
		}).then(res => {
			console.log("questionData", res)
			let queObj = res.data[0]
			console.log("queObj", queObj)
			//查询问题后-再添加到试卷
			return this.paperCt.doc(paperId).update({
				question_list: this.dbCmd.push(queObj)
			})
		})
	}

	async updateQuestion(question, questionIdex, paperId) {
		let questionID = question._id
		delete question._id
		//0.先更新问题数据库
		return this.questionCt.where({
			_id: questionID
		}).update(question).then(res => {
			console.log("更新问题成功", res)
			//更新问题后-1.先删除掉试卷里面的问题
			return this.paperCt.doc(paperId).update({
				question_list: this.dbCmd.pull({
					_id: questionID
				})
			})
		}).then(res => {
			console.log("删除掉试卷里面的问题成功", res)
			//删除掉试卷里面的问题后-2.再查询问题数据库里的数据
			return this.questionCt.doc(questionID).get()
		}).then(res => {
			console.log("查询问题数据库里的数据成功", res)
			let queObj = res.data[0]
			console.log("queObj", queObj)
			//查询问题数据库后 3.再将问题添加到试卷里面
			return this.paperCt.doc(paperId).update({
				question_list: this.dbCmd.push({
					each: [queObj],
					position: questionIdex,
				})
			})
		})
	}
	async removeQuestion(questionId, questionIdex, paperId) {
		// 0.先问题表里的数据
		return this.questionCt.doc(questionId).remove().then(res => {
			console.log("删除问题数据成功", res)
			return this.paperCt.doc(paperId).update({
				question_list: this.dbCmd.pull({
					_id: questionId
				})
			})
		})
	}
	async createPaper(paperObj) {
		paperObj.status = 0
		paperObj.create_date = Date.now()
		// 先添加到试卷表
		return this.paperCt.add(paperObj).then(res => {
			console.log("paperId", res)
			let paperId = res.id
			// 再更新试卷信息到question表数据
			return this.questionCt.where({
				status: 0
			}).update({
				status: 1,
				paperId: paperId
			})
		})
	}
	async deletePaper(paperId) {
		// 先移除试卷相关问题
		return this.questionCt.where({
			paperId: paperId
		}).remove().then(res => {
			console.log("移除问题成功")
			return this.paperCt.doc(paperId).remove()
		})
	}
}
