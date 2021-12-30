import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { User } from './User'

@Entity('scraps')
export class Scrap {
  @PrimaryGeneratedColumn('uuid')
  id: string 

  @Column({nullable: false})
  content: string

  @Column()
  senderId: string
  
  @Column()
  receiverId: string

  @ManyToOne(() => User, user => user.scraps_sent, {onDelete: 'SET NULL'})
  @JoinColumn({name: 'senderId'})
  sender: User
  
  @ManyToOne(() => User, user => user.scraps_received, {onDelete: 'SET NULL'})
  @JoinColumn({name: 'receiverId'})
  receiver: User

  @CreateDateColumn()
  created_at: string
}