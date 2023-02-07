import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { mapErrorToHttp } from "@utils/errorHttpMapper";

@Catch()
export class ErrorHandler implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

		const {status, message} = mapErrorToHttp(exception)

		if(message) {
			response.status(status).json({
				errors: [{message}]
			})
		} else {
			response.sendStatus(status)
		}
  }
}