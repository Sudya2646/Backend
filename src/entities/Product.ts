import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sku: string;

  @Column()
  name: string;

  @Column("decimal")
  price: number;

  @Column({ nullable: true }) // ✅ Ensure it's nullable if image upload is optional
  image: string;

  @Column({ nullable: true }) // ✅ Add this to support image1
  image1: string;
}
