import {AccessControl} from 'accesscontrol'

const ac = new AccessControl()

ac.grant('user')
	.createOwn('scrap')
	.deleteOwn('scrap')
	.updateOwn('scrap')
	.readAny('scrap')

export default ac

