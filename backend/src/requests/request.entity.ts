import { Column, Entity, PrimaryColumn } from 'typeorm';
import { RequestStatus } from './request-status.enum';

@Entity('requests')
export class Request {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ type: 'text' })
  number: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  serviceArea: string;

  @Column({ type: 'text' })
  status: RequestStatus;

  @Column({ type: 'text' })
  createdAt: string;

  @Column({ type: 'text' })
  updatedAt: string;

  @Column({ type: 'text', nullable: true })
  resolvedAt?: string;

  @Column({ type: 'text', nullable: true })
  closedAt?: string;
}
