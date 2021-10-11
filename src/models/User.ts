import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  username: string
  
  @Column()
  email: string
  
  @Column()
  password_hash: string
  
  @CreateDateColumn()
  created_at: string
}