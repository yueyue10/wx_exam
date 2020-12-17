const {
	Controller
} = require('uni-cloud-router')
module.exports = class ExamsController extends Controller {
	constructor(ctx) {
		super(ctx)
		this.examsServie = this.service.exam.exams
	}
	async getUserExamIngPapers() {
		const {
			uniIdToken
		} = this.ctx.data
		return this.examsServie.getUserExamIngPapers(uniIdToken)
	}
}
