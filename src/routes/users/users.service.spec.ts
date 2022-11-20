import { Test, TestingModule } from '@nestjs/testing';
import { Account } from '../account/entities/account.entity';
import { AccountService } from '../account/account.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let userService: UsersService;
  let prisma: PrismaService;
  let accountService: AccountService;

  const fakeAccount = [
    {
      id: 1,
      balance: 100,
    },
  ];
  const accountServiceMock = {
    account: {
      create: jest.fn().mockReturnValue(fakeAccount[0]),
    },
  };
  const fakeUsers = [
    {
      id: 1,
      username: 'lucas',
      password: 'Password123',
      accountId: 1,
    },
    {
      id: 1,
      username: 'lucasSS',
      password: 'Password1234',
      accountId: 2,
    },
  ];
  const prismaMock = {
    create: jest.fn().mockReturnValue(fakeUsers[0]),
    findMany: jest.fn().mockReturnValue(fakeUsers),
    findUnique: jest.fn().mockReturnValue(fakeUsers[0]),
    update: jest.fn().mockReturnValue(fakeUsers[1]),
    delete: jest.fn(), // O método delete não retorna nada
    findOne: jest.fn().mockReturnValue(fakeUsers[0]),
    findAll: jest.fn().mockReturnValue(fakeUsers),
    remove: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: prismaMock,
        },
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: AccountService,
          useValue: { create: jest.fn().mockReturnValue(fakeAccount[0]) },
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
    accountService = module.get<AccountService>(AccountService);
  });

  it('should create a user', async () => {
    const dto = {
      username: 'lucas',
      password: 'Password123',
    };
    expect(userService.create(dto)).toEqual({
      id: expect.any(Number),
      username: 'lucas',
      password: 'Password123',
      accountId: expect.any(Number),
    });
  });

  it('should find a user', async () => {
    expect(userService.findOne(1)).toEqual({
      id: 1,
      username: 'lucas',
      password: 'Password123',
      accountId: 1,
    });
  });

  it('should update a user', async () => {
    const dto = {
      username: 'lucasSS',
      password: 'Password1234',
    };
    expect(userService.update(1, dto)).toEqual({
      id: 1,
      username: 'lucasSS',
      password: 'Password1234',
      accountId: expect.any(Number),
    });
  });

  it('should find many users', async () => {
    expect(userService.findAll()).toEqual([
      {
        id: 1,
        username: 'lucas',
        password: 'Password123',
        accountId: 1,
      },
      {
        id: 1,
        username: 'lucasSS',
        password: 'Password1234',
        accountId: 2,
      },
    ]);
  });
});
