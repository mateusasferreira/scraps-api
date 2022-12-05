import S3 from 'aws-sdk/clients/s3'
import {v4 as uuid} from 'uuid'
import { IFileService, IFileServiceConfig } from '../interfaces/IFileService'

export class S3Service implements IFileService {

  constructor( 
		private config: IFileServiceConfig,
		private instance: S3 
	) { }

  private generateFilename(): string {
  	const timestamp = Date.now()
  	const filename = `${uuid()}-${timestamp}`
  	return filename
  }	

  async upload (file: Buffer) {
  	const filename = this.generateFilename()

  	const uploadParams = {
  		Bucket: this.config.bucketName,
  		Body: file.buffer,
  		Key: filename
  	}

  	const result = await this.instance.upload(uploadParams).promise()
  	return result.Key
  }

  get(key: string) {
  	const downloadParams = {
  		Key: key,
  		Bucket: this.config.bucketName
  	}
	
  	return this.instance.getObject(downloadParams).createReadStream()
  }
}
