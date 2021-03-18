import { DynamicModule, Module } from '@nestjs/common';
import { ShopifyModuleAsyncOptions, ShopifyModuleOptions } from './interfaces';
import { ShopifyCoreModule } from './shopify.core.module';

@Module({})
export class NestJsShopifyModule {
  public static register(options: ShopifyModuleOptions): DynamicModule {
    return {
      module: NestJsShopifyModule,
      imports: [ShopifyCoreModule.register(options)],
      exports: [ShopifyCoreModule],
    };
  }

  public static registerAsync(
    options: ShopifyModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: NestJsShopifyModule,
      imports: [ShopifyCoreModule.registerAsync(options)],
      exports: [ShopifyCoreModule],
    };
  }
}
