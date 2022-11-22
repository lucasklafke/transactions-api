import { HttpException } from '@nestjs/common';
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
    {
      id: 2,
      balance: 200,
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
            findMany: jest.fn().mockResolvedValue(fakeAccount),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findById: jest.fn().mockResolvedValue(fakeAccount[0]),
            findAll: jest.fn().mockResolvedValue(fakeAccount),
            remove: jest.fn(),
            findByUserId: jest.fn().mockResolvedValue({
              Account: fakeAccount[0],
            }),
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

  describe('findAll endpoint', () => {
    it('repository should return an array', async () => {
      expect(await accountService.findAll()).toEqual(fakeAccount);
    });
  });

  describe('getBalance endpoint', () => {
    it('should get the balance', async () => {
      expect(await accountService.getBalance(1)).toEqual(
        fakeAccount[0].balance,
      );
    });

    it('should return not found exception', async () => {
      jest.spyOn(accountRepository, 'findByUserId').mockResolvedValueOnce(null);
      try {
        const balance = await accountService.getBalance(1);
        expect(balance).toBeUndefined();
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toEqual(new HttpException('account not found', 404));
      }
    });
  });

  describe('findAccountByUserId endpoint', () => {
    it('should return an account given user id', async () => {
      expect(await accountService.findAccountByUserId(1)).toEqual(
        fakeAccount[0],
      );
    });

    it('should return exception when account not found', async () => {
      jest.spyOn(accountRepository, 'findByUserId').mockResolvedValueOnce(null);

      try {
        const account = await accountService.findAccountByUserId(1);
        expect(account).toBeUndefined();
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toEqual(new HttpException('account not found', 404));
      }
    });
  });

  describe('findOne endpoint', () => {
    it('should return an account given user id', async () => {
      expect(await accountService.findOne(1)).toEqual(fakeAccount[0]);
    });

    it('should return an not found exception', async () => {
      jest
        .spyOn(accountRepository, 'findById')
        .mockResolvedValueOnce(undefined);
      try {
        const account = await accountService.findOne(1);

        expect(account).toBeUndefined();
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toEqual(new HttpException('account not found', 404));
      }
    });
  });
});
