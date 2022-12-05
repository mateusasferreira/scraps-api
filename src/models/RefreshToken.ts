import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'


@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  token: string

  @ManyToOne(() => User, user => user.token, {onDelete: 'CASCADE'})
  user: User
}