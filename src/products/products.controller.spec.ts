import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Prisma, Product } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

const mockProductsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: Prisma.ProductCreateInput = {
        name: 'Test Product',
        price: 100,
        description: 'A test product',
        stock: 10,
      };
      const result = { id: 1, ...createProductDto };

      jest.spyOn(service, 'create').mockResolvedValue(result as Product);

      expect(await controller.create(createProductDto)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result: Product[] = [{
        id: 1,
        name: 'Test Product',
        price: 100,
        description: 'A test product',
        origin: 'Some origin',
        type: 'Some type',
        weight: 10,
        stock: 5,
        dateAdded: new Date(),
        dateModified: new Date(),
        availability: true,
        averageRating: 4.5,
      }];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const result: Product = {
        id: 1,
        name: 'Test Product',
        price: 100,
        description: 'A test product',
        origin: 'Some origin',
        type: 'Some type',
        weight: 10,
        stock: 5,
        dateAdded: new Date(),
        dateModified: new Date(),
        availability: true,
        averageRating: 4.5,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
    });

    it('should throw an error if product is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException('Product with ID 1 not found'));

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: Prisma.ProductUpdateInput = {
        name: 'Updated Product',
        price: 150,
        description: 'An updated test product',
      };
      const result = { id: 1, ...updateProductDto };

      jest.spyOn(service, 'update').mockResolvedValue(result as Product);

      expect(await controller.update('1', updateProductDto as Prisma.ProductCreateInput)).toEqual(result);
      expect(service.update).toHaveBeenCalledWith(1, updateProductDto);
    });

    it('should throw an error if product to update is not found', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException('Product with ID 1 not found'));

      await expect(controller.update('1', {} as Prisma.ProductCreateInput)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const result: Product = {
        id: 1,
        name: 'Test Product',
        price: 100,
        description: 'A test product',
        origin: 'Some origin',
        type: 'Some type',
        weight: 10,
        stock: 5,
        dateAdded: new Date(),
        dateModified: new Date(),
        availability: true,
        averageRating: 4.5,
      };

      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.remove('1')).toEqual(result);
    });

    it('should throw an error if product to remove is not found', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException('Product with ID 1 not found'));

      await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
