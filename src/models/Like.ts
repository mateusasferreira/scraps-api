import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Scrap } from './Scrap'
import { User } from './User'

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn()
  created_at: string

	@ManyToOne(() => Scrap, scrap => scrap.likes, {onDelete: 'CASCADE', eager: false})
  scrap: Scrap
  
	@ManyToOne(() => User, {onDelete: 'CASCADE'})
	user: User
}