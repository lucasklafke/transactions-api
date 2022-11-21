import { Test, TestingModule } from '@nestjs/testing';
import { AccountRepository } from './account.repository';
import { AccountService } from './account.service';

describe('AccountService', () => {
  let accountService: AccountService;
  let accountRepository: AccountRepository;
  const fakeAccount = [
    {
      id: 1,
      balance: 100,
    },
  ];
  const RepositoryMock = {
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
        {
          provide: AccountRepository,
          useValue: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findOne: jest.fn(),
            findAll: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    accountService = module.get<AccountService>(AccountService);
    accountRepository = module.get<AccountRepository>(AccountRepository);
  });

  it('should be defined', () => {
    expect(accountService).toBeDefined();
  });
});
