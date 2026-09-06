export enum RequestStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Resolved = 'Resolved',
  Rejected = 'Rejected',
  Closed = 'Closed',
}

export const ALLOWED_TRANSITIONS: Record<
  RequestStatus,
  readonly RequestStatus[]
> = {
  [RequestStatus.Pending]: [RequestStatus.InProgress, RequestStatus.Rejected],
  [RequestStatus.InProgress]: [RequestStatus.Resolved, RequestStatus.Rejected],
  [RequestStatus.Resolved]: [RequestStatus.Closed],
  [RequestStatus.Rejected]: [],
  [RequestStatus.Closed]: [],
};

export function isRequestStatus(value: string): value is RequestStatus {
  return Object.values(RequestStatus).includes(value as RequestStatus);
}
