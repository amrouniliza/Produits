import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';

import { Prisma, Product } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

const mockDatabaseService = {
  product: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ProductsService', () => {
  let service: ProductsService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: Prisma.ProductCreateInput = {
        name: 'Test Product',
        price: 100,
        description: 'A test product',
        stock: 10, 
      };
      const result = { id: 1, ...createProductDto } as Product;

      jest.spyOn(databaseService.product, 'create').mockResolvedValue(result);

      expect(await service.create(createProductDto)).toEqual(result);
      expect(databaseService.product.create).toHaveBeenCalledWith({ data: createProductDto });
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result: Product[] = [{
        id: 1,
        name: 'Test Product',
        price: 100,
        description: 'A test product',
        origin: '',
        type: '',
        weight: 0,
        stock: 0,
        dateAdded: undefined,
        dateModified: undefined,
        availability: false,
        averageRating: 0
      }];

      jest.spyOn(databaseService.product, 'findMany').mockResolvedValue(result);

      expect(await service.findAll()).toEqual(result);
      expect(databaseService.product.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const result: Product = {
        id: 1,
        name: 'Test Product',
        price: 100,
        description: 'A test product',
        origin: '',
        type: '',
        weight: 0,
        stock: 0,
        dateAdded: undefined,
        dateModified: undefined,
        availability: false,
        averageRating: 0
      };

      jest.spyOn(databaseService.product, 'findUnique').mockResolvedValue(result);

      expect(await service.findOne(1)).toEqual(result);
      expect(databaseService.product.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an error if product is not found', async () => {
      jest.spyOn(databaseService.product, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: Prisma.ProductUpdateInput = {
        name: 'Updated Product',
        price: 150,
        description: 'An updated test product',
      };
      const existingProduct: Product = {
        id: 1,
        name: 'Test Product',
        price: 100,
        description: 'A test product',
        origin: '',
        type: '',
        weight: 0,
        stock: 0,
        dateAdded: undefined,
        dateModified: undefined,
        availability: false,
        averageRating: 0
      };
      const updatedProduct: Product = {
        id: existingProduct.id,
        name: updateProductDto.name as string,
        description: updateProductDto.description as string,
        price: updateProductDto.price as number,
        origin: existingProduct.origin,
        type: existingProduct.type,
        weight: existingProduct.weight,
        stock: existingProduct.stock,
        dateAdded: existingProduct.dateAdded,
        dateModified: existingProduct.dateModified,
        availability: existingProduct.availability,
        averageRating: existingProduct.averageRating,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingProduct);
      jest.spyOn(databaseService.product, 'update').mockResolvedValue(updatedProduct);

      expect(await service.update(1, updateProductDto)).toEqual(updatedProduct);
      expect(databaseService.product.update).toHaveBeenCalledWith({ where: { id: 1 }, data: updateProductDto });
    });

    it('should throw an error if product to update is not found', async () => {
      const updateProductDto: Prisma.ProductUpdateInput = {
        name: 'Updated Product',
        price: 150,
        description: 'An updated test product',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.update(1, updateProductDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const existingProduct: Product = {
        id: 1,
        name: 'Test Product',
        price: 100,
        description: 'A test product',
        origin: '',
        type: '',
        weight: 0,
        stock: 0,
        dateAdded: undefined,
        dateModified: undefined,
        availability: false,
        averageRating: 0
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingProduct);
      jest.spyOn(databaseService.product, 'delete').mockResolvedValue(existingProduct);

      expect(await service.remove(1)).toEqual(existingProduct);
      expect(databaseService.product.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an error if product to remove is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
