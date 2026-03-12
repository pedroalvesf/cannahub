import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Document,
  DocumentProps,
} from '@/domain/patient/enterprise/entities/document';

let documentCounter = 0;

export function makeDocument(
  override: Partial<DocumentProps> = {},
  id?: UniqueEntityID,
) {
  documentCounter++;

  return Document.create(
    {
      userId: new UniqueEntityID(),
      type: 'prescription',
      url: `https://s3.example.com/documents/doc-${documentCounter}.pdf`,
      ...override,
    },
    id,
  );
}
