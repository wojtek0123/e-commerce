-- AlterTable
CREATE SEQUENCE creditcard_id_seq;
ALTER TABLE "CreditCard" ALTER COLUMN "id" SET DEFAULT nextval('creditcard_id_seq'),
ADD CONSTRAINT "CreditCard_pkey" PRIMARY KEY ("id");
ALTER SEQUENCE creditcard_id_seq OWNED BY "CreditCard"."id";
