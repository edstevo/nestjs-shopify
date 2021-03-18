import { ModuleMetadata, Type } from '@nestjs/common';
import { IPrivateShopifyConfig } from 'shopify-api-node';

export type ShopifyModuleOptions = IPrivateShopifyConfig;

export interface ShopifyModuleOptionsFactory {
  createShopifyModuleOptions():
    | Promise<ShopifyModuleOptions>
    | ShopifyModuleOptions;
}

export interface ShopifyModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<ShopifyModuleOptionsFactory>;
  useClass?: Type<ShopifyModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<ShopifyModuleOptions> | ShopifyModuleOptions;
}
