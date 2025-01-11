import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum EInquiryType {
  PARTNERSHIP = "PARTNERSHIP",
  INVESTMENT = "INVESTMENT",
  GENERAL = "GENERAL",
}

@Entity({ name: "contacts" })
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 150 })
  name: string;

  @Column({ type: "varchar", length: 150 })
  surname: string;

  @Column({ type: "varchar", length: 150 })
  email: string;

  @Column({ type: "varchar", length: 150 })
  companyName: string;

  @Column({
    type: "enum",
    enum: EInquiryType,
    default: EInquiryType.GENERAL,
  })
  inquiryType: EInquiryType;

  @Column({ type: "text" })
  message: string;

  @Column({ type: "datetime" })
  created_at: Date;

  @Column({ type: "datetime" })
  updated_at: Date;

  @Column({ type: "datetime", nullable: true })
  deleted_at: Date;
}
