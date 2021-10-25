import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm'
import { RefreshTokens } from './RefreshTokens'

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({unique: true})
  username: string
  
  @Column({unique: true})
  email: string
  
  @Column()
  password_hash: string

  @Column({default: false})
  confirmed: boolean;
  
  @CreateDateColumn()
  created_at: string

  @OneToMany(() => RefreshTokens, token => token.user)
  token: RefreshTokens[]
}