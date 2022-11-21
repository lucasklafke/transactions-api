import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { AccountService } from './account.service';

describe('AccountService', () => {
  let service: AccountService;

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
      providers: [
        AccountService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
