import { Column, Entity, PrimaryColumn } from 'typeorm';
import { RequestStatus } from './request-status.enum';

@Entity('requests')
export class Request {
  @PrimaryColumn()
  id: string;

  @Column()
  number: string;

  @Column()
  title: string;

  @Column()
  serviceArea: string;

  @Column()
  status: RequestStatus;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;

  @Column({ nullable: true })
  resolvedAt?: string;

  @Column({ nullable: true })
  closedAt?: string;
}