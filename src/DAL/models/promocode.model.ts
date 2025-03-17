import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum EDiscountType {
    PERCENTAGE = "percentage",
    AMOUNT = "amount",
}

@Entity({ name: "promocodes" })
export class Promocode extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column()
    discount_type: EDiscountType;

    @Column()
    discount_value: number;

    // conditions

    @Column()
    from_date: Date;

    @Column()
    to_date: Date;

    @Column()
    min_order_amount: number;

    @Column()
    max_order_amount: number;
}
