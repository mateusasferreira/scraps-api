import {mock} from 'jest-mock-extended'
import { Repository } from 'typeorm'

const repositoryMock = mock<Repository<any>>()

const typeorm = {
  		getRepository: () => repositoryMock,
  
  		BaseEntity: class Mock {},
  		ObjectType: () => {},
  		Entity: () => {},
  		InputType: () => {},
  		Index: () => {},
  		PrimaryGeneratedColumn: () => {},
  		PrimaryColumn: () => {},
  		JoinColumn: () => {},
  		Column: () => {},
  		CreateDateColumn: () => {},
  		UpdateDateColumn: () => {},
  		OneToMany: () => {},
  		ManyToOne: () => {},
			OneToOne: () => {},
  	}

module.exports = typeorm