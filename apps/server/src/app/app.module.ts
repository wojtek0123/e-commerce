import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { CartItemsModule } from '../cart-items/cart-items.module';
import { DiscountsModule } from '../discounts/discounts.module';
import { OrderDetailsModule } from '../order-details/order-details.module';
import { OrderItemsModule } from '../order-items/order-items.module';
import { PaymentDetailsModule } from '../payment-details/payment-details.module';
import { ProductCategoriesModule } from '../product-categories/product-categories.module';
import { ProductInventoriesModule } from '../product-inventories/product-inventories.module';
import { ProductsModule } from '../products/products.module';
import { ShoppingSessionsModule } from '../shopping-sessions/shopping-sessions.module';
import { UserAddressesModule } from '../user-addresses/user-addresses.module';
import { UserPaymentsModule } from '../user-payments/user-payments.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    UsersModule,
    AuthModule,
    CartItemsModule,
    DiscountsModule,
    OrderDetailsModule,
    OrderItemsModule,
    PaymentDetailsModule,
    ProductCategoriesModule,
    ProductInventoriesModule,
    ProductsModule,
    ShoppingSessionsModule,
    UserAddressesModule,
    UserPaymentsModule,
  ],
})
export class AppModule {}
