import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'

@Entity('follows')
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn()
  created_at: string

  @ManyToOne(() => User, user => user.following, {onDelete: 'CASCADE'})
  follower: User
  
	@ManyToOne(() => User, user => user.followedBy, {onDelete: 'CASCADE'})
	following: User
}