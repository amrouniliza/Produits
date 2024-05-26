import { Injectable, NotFoundException } from '@nestjs/common';
import {Prisma,Product} from '@prisma/client'
import { DatabaseService } from 'src/database/database.service';


@Injectable()
export class ProductsService {
  constructor(private readonly databaseService:DatabaseService){}
  async create(createClientDto: Prisma.ProductCreateInput) {
    return this.databaseService.product.create({ data: createClientDto });
  }

  findAll() {
    return this.databaseService.product.findMany();
  }

  async findOne(id: number): Promise<Product | null> {
    const product = await this.databaseService.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: Prisma.ProductUpdateInput): Promise<Product | null> {
    const existingProduct = await this.findOne(id);
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    const updatedProduct = await this.databaseService.product.update({
      where: {
        id: id,
      },
      data: updateProductDto,
    });
    return updatedProduct;
  }

  async remove(id: number): Promise<Product> {
    const existingProduct = await this.findOne(id);
    if (!existingProduct){
    throw new NotFoundException (`Product with ID ${id} not found`);}
    return this.databaseService.product.delete({ where: { id } });
  }
}
