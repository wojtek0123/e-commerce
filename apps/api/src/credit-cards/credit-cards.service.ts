import { Injectable } from '@nestjs/common';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { PrismaService } from '../prisma/prisma.service';
import { getUserIdFromAccessToken } from '../common/utils/get-user-id-from-access-token';
import { hash } from 'bcrypt';
import { omit } from 'lodash';
import { CreditCard } from '@prisma/client';

@Injectable()
export class CreditCardsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(authHeader: string, data: CreateCreditCardDto) {
    const userId = getUserIdFromAccessToken(authHeader);

    const hashedSecurityCode = await this._hashData(data.securityCode);
    const hashedExpirationDate = await this._hashData(data.expirationDate);

    const creditCard = await this.prisma.creditCard.create({
      data: {
        number: data.number,
        securityCode: hashedSecurityCode,
        expirationDate: hashedExpirationDate,
        userId,
      },
    });

    return this._removeVulnerability(creditCard);
  }

  async findOne(authHeader: string) {
    const userId = getUserIdFromAccessToken(authHeader);

    const creditCard = await this.prisma.creditCard.findUnique({
      where: { userId },
    });

    return this._removeVulnerability(creditCard);
  }

  async update(authHeader: string, id: number, data: UpdateCreditCardDto) {
    const userId = getUserIdFromAccessToken(authHeader);
    const creditCard = await this.prisma.creditCard.update({
      where: { id, userId },
      data,
    });

    return this._removeVulnerability(creditCard);
  }

  async remove(authHeader: string, id: number) {
    const userId = getUserIdFromAccessToken(authHeader);
    const creditCard = await this.prisma.creditCard.delete({
      where: { id, userId },
    });
    return this._removeVulnerability(creditCard);
  }

  private _hashData(data: string) {
    return hash(data, 256);
  }

  private _removeVulnerability(data: CreditCard | null) {
    if (!data) return null;

    return omit(data, 'securityCode', 'expirationDate');
  }
}
