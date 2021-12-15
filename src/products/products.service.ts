import { HttpException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
  ) {}

  async uploadImage(id: number, image) {
    const product = await this.productsRepository.findOne(id);
    if (!product) {
      throw new HttpException('Продукта с таким id не существует!', 400);
    }
    return await this.productsRepository.update(id, { image });
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const candidate = await this.productsRepository.findOne({
      name: createProductDto.name,
    });
    if (!candidate) {
      return await this.productsRepository.save(createProductDto);
    } else {
      throw new HttpException('Продукт с таким названием уже существует!', 400);
    }
  }

  async getAllProducts(limit = 99, offset = 0): Promise<Product[]> {
    return await this.productsRepository.find({ skip: offset, take: limit });
  }

  async getOneProduct(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne(id);
    if (!product) {
      throw new HttpException('Продукта с таким id не существует!', 400);
    } else return product;
  }

  async updateProduct(id, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.findOne(id);
    if (!product) {
      throw new HttpException('Продукта с таким id не существует!', 400);
    }
    return await this.productsRepository.update(id, updateProductDto);
  }

  async deleteProduct(id) {
    const product = await this.productsRepository.findOne(id);
    if (!product) {
      throw new HttpException('Продукта с таким id не существует!', 400);
    } else if (product.image !== null) {
      fs.unlink('./uploads/images/' + product.image, async (err) => {
        if (err) throw err;
        console.log('Картинка успешно удалена');
        return await this.productsRepository.delete(id);
      });
    }
    return await this.productsRepository.delete(id);
  }
}
