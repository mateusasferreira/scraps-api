export function mapErrorToHttp(error): {status: number, message: string} {
  switch (error.name) {
    case 'ValidationError':
      return {status: 400, message: error.message}
    case 'AuthenticationError':
      return {status: 401, message: error.message}
    case 'AuthorizationError':
      return {status: 403, message: error.message}
    case 'NotFoundError':
      return {status: 404, message: error.message}
    default:
      return {status: 500, message: 'Internal Server Error'}
  }
}