export interface ColumnMetadata {
  name: string;
  type: string;
  nullable: boolean;
  default: string | null;
}
