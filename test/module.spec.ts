import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Injectable } from '@nestjs/common';
import { ShopifyModule } from 'src/shopify.module';
import {
  ShopifyModuleOptions,
  ShopifyModuleOptionsFactory,
} from 'src/interfaces';
import Shopify from 'shopify-api-node';
import * as got from 'got';
import { SHOPIFY_SERVICE } from 'src/constants';

const options: ShopifyModuleOptions = {
  shopName: 'test-shop.myshopify.com',
  apiKey: 'test-api-key',
  password: 'test-password',
};

@Injectable()
class ShopifyModuleConfigService implements ShopifyModuleOptionsFactory {
  createShopifyModuleOptions(): ShopifyModuleOptions {
    return options;
  }
}

describe('ShopifyModule', () => {
  let app: INestApplication;
  let service: Shopify;

  describe('#register', () => {
    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [ShopifyModule.register(options)],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();

      service = moduleFixture.get<Shopify>(SHOPIFY_SERVICE);
    });

    it('should be defined', () => {
      expect(app).toBeDefined();
    });

    it('should query shopify ok', async () => {
      await expect(service.product.list()).rejects.toThrow(got.HTTPError);
    });
  });

  describe('#registerAsync', () => {
    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
          ShopifyModule.registerAsync({
            useClass: ShopifyModuleConfigService,
          }),
        ],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();

      service = moduleFixture.get<Shopify>(SHOPIFY_SERVICE);
    });

    it('should be defined', () => {
      expect(app).toBeDefined();
    });

    it('should query shopify ok', async () => {
      await expect(service.product.list()).rejects.toThrow(got.HTTPError);
    });
  });
});
