import { Prisma } from '@prisma/client';
export class User implements Prisma.UserUncheckedCreateInput {
  id: number;
  username: string;
  password: string;
  accountId: number;
}
