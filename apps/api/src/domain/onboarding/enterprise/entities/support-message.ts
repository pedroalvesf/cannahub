import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface SupportMessageProps {
  ticketId: UniqueEntityID;
  sender: string;
  content: string;
  createdAt: Date;
}

export class SupportMessage extends Entity<SupportMessageProps> {
  get ticketId() {
    return this.props.ticketId;
  }

  get sender() {
    return this.props.sender;
  }

  get content() {
    return this.props.content;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(
    props: Optional<SupportMessageProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    return new SupportMessage(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }
}
