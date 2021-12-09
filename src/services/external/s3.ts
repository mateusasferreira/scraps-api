import s3 from 'aws-sdk/clients/s3'
import fs from 'fs'
const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_BUCKET_ACCESS_KEY
const secretAccessKey = process.env.AWS_BUCKET_SECRET

class S3Service {
  private instance;

  constructor() {
  	this.instance = new s3({
  		region,
  		accessKeyId,
  		secretAccessKey,
  	})
  }

  async uploadFile(file): Promise<string>{
  	const fileStream = fs.createReadStream(file.path)

  	const uploadParams = {
  		Bucket: bucketName,
  		Body: fileStream,
  		Key: file.filename
  	}

  	const result = await this.instance.upload(uploadParams).promise()
  	console.log(result)
  	return result.Key
  }

  getFileStream(fileKey){
  	const downloadParams = {
  		Key: fileKey,
  		Bucket: bucketName
  	}
	
  	return this.instance.getObject(downloadParams).createReadStream()
  }
}

export default new S3Service()