import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerDocs from '@docs/swagger.json'

import userRoutes from '@routes/userRoutes'
import authRoutes from '@routes/authRoutes'
import profileRoutes from '@routes/profileRoutes'
import scrapsRoutes from '@routes/scrapsRoutes'

const routes = Router()

routes.use('/users', userRoutes)
routes.use('/auth', authRoutes)
routes.use('/profile', profileRoutes)
routes.use('/scraps', scrapsRoutes)
routes.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

export default routes