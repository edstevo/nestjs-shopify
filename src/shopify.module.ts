import { DynamicModule, Module } from '@nestjs/common';
import { ShopifyModuleAsyncOptions, ShopifyModuleOptions } from './interfaces';
import { NestJsShopifyCoreModule } from './shopify.core.module';

@Module({})
export class NestJsShopifyModule {
  public static register(options: ShopifyModuleOptions): DynamicModule {
    return {
      module: NestJsShopifyModule,
      imports: [NestJsShopifyCoreModule.register(options)],
      exports: [NestJsShopifyCoreModule],
    };
  }

  public static registerAsync(
    options: ShopifyModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: NestJsShopifyModule,
      imports: [NestJsShopifyCoreModule.registerAsync(options)],
      exports: [NestJsShopifyCoreModule],
    };
  }
}
