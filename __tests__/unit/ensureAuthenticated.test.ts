import {Request, Response, NextFunction} from 'express'
import ensureAuthenticated from '../../src/middlewares/ensureAuthenticated'
import jwt from 'jsonwebtoken'

//jest.mock('express')

jest.mock('jsonwebtoken')

const mockedJwt = jwt as jest.Mocked<typeof jwt>

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
let nextFunction: NextFunction = jest.fn();


beforeEach(() => {
    mockRequest = {
      
    };
    mockResponse = {
      status: jest.fn().mockImplementation(() => {
        return {
          json: jest.fn()
        }
      }),
    };

    jest.clearAllMocks()
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
    mockedJwt.verify.mockImplementationOnce(() => {
      throw new Error()
    });
    
    mockRequest = {
      headers: {
        'authorization': 'Bearer 1234'
      }
    }
    
    ensureAuthenticated(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction)

    expect(mockResponse.status).toBeCalledWith(401)
  })

  it('should call next if token is valid', async () => {
    mockedJwt.verify.mockImplementation(() => { return {payload: {id: 1}}})
      
    mockRequest = {
      headers: {
        'authorization': 'Bearer 1234'
      },
      body: {}
    }
    
    ensureAuthenticated(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction)
    
    expect(nextFunction).toBeCalledTimes(1)
  })
})