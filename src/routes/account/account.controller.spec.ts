import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { PrismaService } from '../../prisma/prisma.service';
describe('AccountController', () => {
  let controller: AccountController;

  const fakeAccount = [
    {
      id: 1,
      balance: 100,
    },
  ];
  const prismaMock = {
    create: jest.fn().mockReturnValue(fakeAccount[0]),
    findMany: jest.fn().mockReturnValue(fakeAccount),
    findUnique: jest.fn().mockReturnValue(fakeAccount[0]),
    update: jest.fn().mockReturnValue(fakeAccount[1]),
    delete: jest.fn(), // O método delete não retorna nada
    findOne: jest.fn().mockReturnValue(fakeAccount[0]),
    findAll: jest.fn().mockReturnValue(fakeAccount),
    remove: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        AccountService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
