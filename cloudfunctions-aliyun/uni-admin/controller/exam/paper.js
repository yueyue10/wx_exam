const {
	Controller
} = require('uni-cloud-router')
module.exports = class PaperController extends Controller {
	constructor(ctx) {
		super(ctx)
		this.paperServie = this.service.exam.paper
	}
	async addQuestion() {
		const {
			question,
			paperId
		} = this.ctx.data
		return this.paperServie.addQuestion(question, paperId)
	}
	async updateQuestion() {
		const {
			question,
			questionIdex,
			paperId
		} = this.ctx.data
		return this.paperServie.updateQuestion(question, questionIdex, paperId)
	}
	async removeQuestion() {
		const {
			questionId,
			questionIdex,
			paperId
		} = this.ctx.data
		return this.paperServie.removeQuestion(questionId, questionIdex, paperId)
	}
	async createPaper() {
		const {
			paperObj
		} = this.ctx.data
		return this.paperServie.createPaper(paperObj)
	}
	async deletePaper() {
		const {
			paperId
		} = this.ctx.data
		return this.paperServie.deletePaper(paperId)
	}
}
