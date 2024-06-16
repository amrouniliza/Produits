import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async create(createProductDto: Prisma.ProductCreateInput) {
    this.logger.log('Creating a new product', createProductDto);
    return this.databaseService.product.create({ data: createProductDto });
  }

  async findAll() {
    this.logger.log('Fetching all products');
    return this.databaseService.product.findMany();
  }

  async findOne(id: number): Promise<Product | null> {
    this.logger.log(`Fetching product with ID ${id}`);
    const product = await this.databaseService.product.findUnique({
      where: { id },
    });
    if (!product) {
      this.logger.warn(`Product with ID ${id} not found`);
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: Prisma.ProductUpdateInput,
  ): Promise<Product | null> {
    this.logger.log(`Updating product with ID ${id}`, updateProductDto);
    const existingProduct = await this.findOne(id);
    if (!existingProduct) {
      this.logger.warn(`Product with ID ${id} not found`);
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
    this.logger.log(`Removing product with ID ${id}`);
    const existingProduct = await this.findOne(id);
    if (!existingProduct) {
      this.logger.warn(`Product with ID ${id} not found`);
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return this.databaseService.product.delete({ where: { id } });
  }
}
