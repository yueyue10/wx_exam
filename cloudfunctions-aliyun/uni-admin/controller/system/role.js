const {
	Controller
} = require('uni-cloud-router')
const uniID = require('uni-id')
module.exports = class RoleController extends Controller {
	constructor(ctx) {
		super(ctx)
		this.roleServie = this.service.system.role
	}
	async remove() {
		const {
			id
		} = this.ctx.data

		return uniID.deleteRole({
			roleID: id
		})
	}
	async list() {
		return this.roleServie.list()
	}
	async romeName() {
		const {
			role_ids
		} = this.ctx.data
		return this.roleServie.romeName(role_ids)
	}
}
