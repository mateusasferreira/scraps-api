/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Request, Response, NextFunction } from 'express'
import ac from '@config/accessControl.config'


const methods = {
	read: {
		any: 'readAny',
		own: 'readOwn'
	},
	create: {
		any: 'createAny',
		own: 'createOwn'
	},
	update: {
		any: 'updateAny',
		own: 'updateOwn'
	},
	delete: {
		any: 'deleteAny',
		own: 'deleteOwn'
	},
  
}

function grantAccess(resource: string, action: string) {
	return function(req: Request, res: Response, next: NextFunction) {
		const permissions = ac.can('user')
		const actions = methods[action]
		const permissionToAny = permissions[actions.any](resource)
		const permissionToOwn = permissions[actions.own](resource)

		if(!permissionToAny && !permissionToOwn){
			res.sendStatus(403)
			return
		}

		req.user.permissions = {
			any: permissionToAny.granted,
			own: permissionToOwn.granted
		}
    
		next()
	}
}

export default grantAccess