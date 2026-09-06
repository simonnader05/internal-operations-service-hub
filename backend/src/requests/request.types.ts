import { RequestStatus } from './request-status.enum';

export type ServiceArea = 'HR' | 'IT';

export interface ServiceRequest {
  id: string;
  number: string;
  title: string;
  serviceArea: ServiceArea;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
}
