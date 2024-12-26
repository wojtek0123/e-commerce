import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { BooksModule } from '../books/books.module';
import { AuthorsModule } from '../authors/authors.module';
import { PublishersModule } from '../publishers/publishers.module';
import { CategoriesModule } from '../categories/categories.module';
import { ConfigModule } from '@nestjs/config';
import { CartItemsModule } from '../cart-items/cart-items.module';
import { UserAddressesModule } from '../user-addresses/user-addresses.module';
import { ShoppingSessionsModule } from '../shopping-sessions/shopping-sessions.module';
import { ProductInventoriesModule } from '../product-inventories/product-inventories.module';
import { CountriesModule } from '../countries/countries.module';
import { ShippingMethodsModule } from '../shipping-methods/shipping-methods.module';
import { OrderDetailsModule } from '../order-details/order-details.module';
import { OrderItemsModule } from '../order-items/order-items.module';
import { FavouriteBooksListsModule } from '../favourite-books-lists/favourite-books-lists.module';
import { CreditCardsModule } from '../credit-cards/credit-cards.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    BooksModule,
    AuthorsModule,
    PublishersModule,
    CategoriesModule,
    CartItemsModule,
    UserAddressesModule,
    ShoppingSessionsModule,
    ProductInventoriesModule,
    CountriesModule,
    ShippingMethodsModule,
    OrderDetailsModule,
    OrderItemsModule,
    CreditCardsModule,
    FavouriteBooksListsModule,
  ],
})
export class AppModule {}
