import {
  DynamicModule,
  Global,
  Module,
  Provider,
  ValueProvider,
} from '@nestjs/common';
import {
  ShopifyModuleAsyncOptions,
  ShopifyModuleOptions,
  ShopifyModuleOptionsFactory,
} from './interfaces';
import * as Shopify from 'shopify-api-node';
import { SHOPIFY_MODULE_OPTIONS, SHOPIFY_SERVICE } from './constants';

@Global()
@Module({})
export class ShopifyCoreModule {
  public static register(options: ShopifyModuleOptions): DynamicModule {
    const shopify = new Shopify(options);

    const shopifyProvider: ValueProvider = {
      provide: SHOPIFY_SERVICE,
      useValue: shopify,
    };

    return {
      module: ShopifyCoreModule,
      providers: [shopifyProvider],
      exports: [shopifyProvider],
    };
  }

  public static registerAsync(
    options: ShopifyModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: ShopifyCoreModule,
      imports: options.imports || [],
      providers: [
        ...this.createAsyncProviders(options),
        ...this.createShopifyProviders(),
      ],
      exports: [SHOPIFY_SERVICE],
    };
  }

  private static createShopifyProviders(): Provider[] {
    return [
      {
        provide: SHOPIFY_SERVICE,
        inject: [SHOPIFY_MODULE_OPTIONS],
        useFactory(options: ShopifyModuleOptions): Shopify {
          const shopify = new Shopify(options);
          return shopify;
        },
      },
    ];
  }

  static createAsyncProviders(options: ShopifyModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    } else if (!options.useClass) {
      throw new Error('Invalid configuration');
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }
  static createAsyncOptionsProvider(
    options: ShopifyModuleAsyncOptions,
  ): Provider<any> {
    if (options.useFactory) {
      return {
        provide: SHOPIFY_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = options.useClass || options.useExisting;

    if (!inject) {
      throw new Error(
        'Invalid configuration. Must provide useFactory, useClass or useExisting',
      );
    }

    return {
      provide: SHOPIFY_MODULE_OPTIONS,
      async useFactory(
        optionsFactory: ShopifyModuleOptionsFactory,
      ): Promise<ShopifyModuleOptions> {
        const opts = await optionsFactory.createShopifyModuleOptions();
        return opts;
      },
      inject: [inject],
    };
  }
}
