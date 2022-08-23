import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerDocs from '@docs/swagger.json'

import userRoutes from '@domain/user/user.routes'
import authRoutes from '@domain/auth/auth.routes'
import profileRoutes from '@domain/profile/profile.routes'
import scrapsRoutes from '@domain/scrap/scrap.routes'

const routes = Router()

routes.use('/users', userRoutes)
routes.use('/auth', authRoutes)
routes.use('/profile', profileRoutes)
routes.use('/scraps', scrapsRoutes)
routes.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

export default routes