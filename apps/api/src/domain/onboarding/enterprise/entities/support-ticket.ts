import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface SupportTicketProps {
  sessionId: UniqueEntityID;
  status: string;
  assignedTo?: string;
  context: Record<string, unknown>;
  createdAt: Date;
  closedAt?: Date;
}

export class SupportTicket extends Entity<SupportTicketProps> {
  get sessionId() {
    return this.props.sessionId;
  }

  get status() {
    return this.props.status;
  }

  get assignedTo() {
    return this.props.assignedTo;
  }

  get context() {
    return this.props.context;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get closedAt() {
    return this.props.closedAt;
  }

  assignAgent(agentId: string) {
    this.props.assignedTo = agentId;
    this.props.status = 'in_progress';
  }

  resolve() {
    this.props.status = 'resolved';
    this.props.closedAt = new Date();
  }

  close() {
    this.props.status = 'closed';
    this.props.closedAt = new Date();
  }

  static create(
    props: Optional<SupportTicketProps, 'status' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    return new SupportTicket(
      {
        ...props,
        status: props.status ?? 'open',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }
}
