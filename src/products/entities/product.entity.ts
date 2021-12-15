import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column()
  price: number;

  @Column({ default: 0 })
  qty: number;

  @Column({ nullable: true })
  image: string;
}
