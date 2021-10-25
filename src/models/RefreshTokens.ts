import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm'
import { User } from './User'


@Entity('refresh_tokens')
export class RefreshTokens {
  @PrimaryColumn()
  token: string

  @ManyToOne(() => User, user => user.token)
  user: User
}