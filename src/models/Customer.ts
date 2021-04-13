import moment from "moment";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from "typeorm";
import { City } from "./City";

@Entity()
export class Customer extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    gender: string;

    @Column()
    birthdate: Date;

    @ManyToOne(() => City, city => city.customers, {
      eager: true
    })
    city: City;

    get age() {
      return moment().diff(moment(this.birthdate), "years");
    }

    toJSON() {
      return { ...this, age: this.age };
    }

}
