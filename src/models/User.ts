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

  @Column({default: false})
  confirmed: boolean;
  
  @CreateDateColumn()
  created_at: string
}