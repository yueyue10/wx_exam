const {
	Controller
} = require('uni-cloud-router')
module.exports = class ExamNewController extends Controller {
	constructor(ctx) {
		super(ctx)
		this.examNewServie = this.service.exam.examNew
	}
	async getUserExamIngPapers() {
		const {
			uniIdToken
		} = this.ctx.data
		return this.examNewServie.getUserExamIngPapers(uniIdToken)
	}
	
	async createExam(){
		const {
			examObj,
			uniIdToken
		} = this.ctx.data
		return this.examNewServie.createExam(examObj, uniIdToken)
	}
}
