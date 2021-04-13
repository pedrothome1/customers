import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from "typeorm";
import { Customer } from "./Customer";

@Entity()
export class City extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    state: string;

    @OneToMany(() => Customer, customer => customer.city)
    customers: Customer[];

}
