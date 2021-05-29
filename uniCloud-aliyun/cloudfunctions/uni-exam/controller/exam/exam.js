const {
	Controller
} = require('uni-cloud-router')
module.exports = class ExamController extends Controller {
	constructor(ctx) {
		super(ctx)
		this.examServie = this.service.exam.exam
	}
	// 获取考试中的试卷
	async getExamPapers() {
		const {
			uniIdToken
		} = this.ctx.data
		//检查token并赋值role信息
		console.log("uniIdToken", uniIdToken)
		return this.examServie.getExamPapers(uniIdToken)
	}
	// 获取试卷详情
	async getPaperInfo() {
		const {
			paperId
		} = this.ctx.data
		console.log("paperId", paperId)
		return this.examServie.getPaperInfo(paperId)
	}
	// 创建考试
	async createExam() {
		const {
			examObj,
			uniIdToken
		} = this.ctx.data
		return this.examServie.createExam(examObj, uniIdToken)
	}
	async getUserExams() {
		const {
			uniIdToken
		} = this.ctx.data
		return this.examServie.getUserExams(uniIdToken)
	}
}
