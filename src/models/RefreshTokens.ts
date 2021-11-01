import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'


@Entity('refresh_tokens')
export class RefreshTokens {
  @PrimaryGeneratedColumn('uuid')
  token: string

  @ManyToOne(() => User, user => user.token)
  user: User
}