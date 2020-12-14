const {
	Service
} = require('uni-cloud-router')

module.exports = class RoleService extends Service {
	constructor(ctx) {
		super(ctx)
		this.collection = this.db.collection('uni-id-roles')
		this.dbCmd = this.db.command
	}

	async list() {
		const roleList = await this.collection.limit(100).get()
		return roleList
	}

	async romeName(role_ids) {
		let rome_names = await this.collection.where({
			role_id: this.dbCmd.in(role_ids)
		}).get()
		return rome_names
	}
}
