import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm'
import { User } from './User'

@Entity('scraps')
export class Scrap {
  @PrimaryGeneratedColumn('uuid')
  id: string 

  @Column({nullable: false})
  content: string

  @ManyToOne(() => User, user => user.scraps_sent, {onDelete: 'SET NULL'})
  sender: string
  
  @ManyToOne(() => User, user => user.scraps_received, {onDelete: 'SET NULL'})
  receiver: string

  @CreateDateColumn()
  created_at: string

}