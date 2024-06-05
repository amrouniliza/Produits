import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Prisma } from '@prisma/client';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  create(@Body() createProductDto: Prisma.ProductCreateInput) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: Prisma.ProductCreateInput) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!id) {
      console.log('No id provided')
    }
    if (!id) {
      console.log('No id provided')
    }
    if (!id) {
      console.log('No id provided')
    }
    if (!id) {
      console.log('No id provided')
    }
    if (!id) {
      console.log('No id provided')
    }
    if (!id) {
      console.log('No id provided')
    }
    return this.productsService.remove(+id);
  }
}
