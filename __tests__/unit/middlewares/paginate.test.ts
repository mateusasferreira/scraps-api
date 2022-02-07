import {Request, Response, NextFunction} from 'express'
import { OneToMany } from 'typeorm';
import paginate from '../../../src/middlewares/paginate'

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
let nextFunction: NextFunction = jest.fn();

describe('pagination middleware', () => {
  it('should parse page and limit queries', () => {
    mockRequest = {
      query: {
        limit: '10',
        page: '3'
      },
      body: {}
    };

    paginate(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction);

    expect(mockRequest.body.limit).toBe(10)
    expect(mockRequest.body.skip).toBe(20)
  })
})