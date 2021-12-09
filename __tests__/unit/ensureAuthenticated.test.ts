import {Request, Response, NextFunction} from 'express'
import ensureAuthenticated from '../../src/middlewares/ensureAuthenticated'

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
let nextFunction: NextFunction = jest.fn();


beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockImplementation(() => {
        return {
          json: jest.fn()
        }
      }),
    };
});

describe('Ensure authentication middleware', () => {
  it('should respond with 403 status if no headers are provided', () => {
    
    mockRequest = {
      headers: {}
    }
    
    ensureAuthenticated(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction)

    expect(mockResponse.status).toBeCalledWith(403)
  })

  it('should respond with 401 if token is not valid', () => {
    mockRequest = {
      headers: {
        'authorization': 'Bearer 1234'
      }
    }
    
    ensureAuthenticated(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction)

    expect(mockResponse.status).toBeCalledWith(401)
  })
})
