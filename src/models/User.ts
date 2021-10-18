import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'

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
}