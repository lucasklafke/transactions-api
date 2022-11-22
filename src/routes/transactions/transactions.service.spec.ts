import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '../account/account.service';
import { UsersService } from '../users/users.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { FilterDto } from './dto/filter.dto';
import { TransferDto } from './dto/transfer.dto';
import { TransactionRepository } from './transaction.repository';
import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  let transactionService: TransactionsService;
  let transactionRepository: TransactionRepository;
  let accountService: AccountService;
  let usersService: UsersService;

  const fakeUsers = [
    {
      id: 1,
      username: 'lucas',
      password: 'Password123',
      accountId: 1,
    },
    {
      id: 2,
      username: 'lucasSS',
      password: 'Password1234',
      accountId: 2,
    },
  ];
  const mockUsersService = {
    create: jest.fn().mockReturnValue(fakeUsers[0]),
    findAll: jest.fn().mockReturnValue(fakeUsers),
    findOne: jest.fn().mockReturnValue(fakeUsers[0]),
    findOneByUsername: jest.fn().mockResolvedValue(fakeUsers[0]),
    update: jest.fn().mockReturnValue(1),
    remove: jest.fn().mockReturnValue(1),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: AccountService,
          useValue: {
            findAll: jest.fn(),
            getBalance: jest.fn(),
            findAccountByUserId: jest
              .fn()
              .mockResolvedValue({ id: 1, balance: 100 }),
            findOne: jest.fn(),
          },
        },
        {
          provide: TransactionRepository,
          useValue: {
            transfer: jest.fn().mockResolvedValue([
              {
                id: 2,
                balance: 50,
              },
              {
                id: 1,
                balance: 150,
              },
            ]),
            create: jest.fn().mockResolvedValue({
              id: 34,
              debitedAccountId: 80,
              creditedAccountId: 79,
              value: 50,
              createdAt: '2022-11-22T16:29:31.281Z',
            }),
            findAll: jest.fn().mockResolvedValue([
              [
                {
                  id: 2,
                  balance: 50,
                },
                {
                  id: 1,
                  balance: 150,
                },
              ],
              [
                {
                  id: 2,
                  balance: 50,
                },
                {
                  id: 1,
                  balance: 150,
                },
              ],
            ]),
            findAllCashout: jest.fn(),
            findAllCashIn: jest.fn(),
            findOne: jest.fn().mockResolvedValue({
              id: 34,
              debitedAccountId: 80,
              creditedAccountId: 79,
              value: 50,
              createdAt: '2022-11-22T16:29:31.281Z',
            }),
          },
        },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    transactionService = module.get<TransactionsService>(TransactionsService);
    transactionRepository = module.get<TransactionRepository>(
      TransactionRepository,
    );
    accountService = module.get<AccountService>(AccountService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(transactionService).toBeDefined();
  });

  describe('transfer endpoint', () => {
    it('should transfer', async () => {
      jest
        .spyOn(accountService, 'findAccountByUserId')
        .mockResolvedValueOnce({ id: 2, balance: 100 });

      const transactionDto: CreateTransferDto = {
        usernameToCredit: 'lucasSS',
        value: 50,
      };

      const transfer = await transactionService.transfer(2, transactionDto);
      expect(transfer).toEqual([
        {
          id: 2,
          balance: 50,
        },
        {
          id: 1,
          balance: 150,
        },
      ]);
    });

    it('should return conflict exception', async () => {
      const transactionDto: CreateTransferDto = {
        usernameToCredit: 'lucasSS',
        value: 50,
      };

      try {
        const transfer = await transactionService.transfer(2, transactionDto);
        expect(transfer).toBeUndefined();
      } catch (error) {
        expect(error).toEqual(
          new HttpException('You cannot transfer to yourself', 409),
        );
      }
    });

    it('should return not found exception', async () => {
      jest
        .spyOn(usersService, 'findOneByUsername')
        .mockResolvedValueOnce(undefined);
      const transactionDto: CreateTransferDto = {
        usernameToCredit: 'lucasSS',
        value: 50,
      };

      try {
        const transfer = await transactionService.transfer(2, transactionDto);
        expect(transfer).toBeUndefined();
      } catch (error) {
        expect(error).toEqual(new HttpException('userToCredit not found', 404));
      }
    });

    it('should return not found exception', async () => {
      jest
        .spyOn(accountService, 'findAccountByUserId')
        .mockResolvedValueOnce(undefined);
      const transactionDto: CreateTransferDto = {
        usernameToCredit: 'lucasSS',
        value: 50,
      };

      try {
        const transfer = await transactionService.transfer(2, transactionDto);
        expect(transfer).toBeUndefined();
      } catch (error) {
        expect(error).toEqual(
          new HttpException('CreditedAccount not found', 404),
        );
      }
    });

    it('should return not found exception', async () => {
      jest
        .spyOn(accountService, 'findAccountByUserId')
        .mockResolvedValueOnce({ id: 1, balance: 20 });
      const transactionDto: CreateTransferDto = {
        usernameToCredit: 'lucasSS',
        value: 50,
      };

      try {
        const transfer = await transactionService.transfer(2, transactionDto);
        expect(transfer).toBeUndefined();
      } catch (error) {
        expect(error).toEqual(new HttpException(`insufficient balance`, 409));
      }
    });
  });

  describe('create endpoint', () => {
    it('should create a transfer', async () => {
      const transactionDto: CreateTransactionDto = {
        creditedAccountId: 79,
        debitedAccountId: 80,
        value: 50,
      };
      expect(await transactionService.create(transactionDto)).toEqual({
        id: 34,
        debitedAccountId: 80,
        creditedAccountId: 79,
        value: 50,
        createdAt: '2022-11-22T16:29:31.281Z',
      });
    });

    it('should create a transfer', async () => {
      jest
        .spyOn(transactionRepository, 'create')
        .mockResolvedValueOnce(undefined);
      const transactionDto: CreateTransactionDto = {
        creditedAccountId: 79,
        debitedAccountId: 80,
        value: 50,
      };
      try {
        await transactionService.create(transactionDto);
      } catch (error) {
        expect(error).toEqual(
          new HttpException('error creating transaction', 500),
        );
      }
    });
  });

  describe('findAll endpoint', () => {
    it('should return all transactions', async () => {
      expect(await transactionRepository.findAll(1)).toEqual([
        [
          {
            id: 2,
            balance: 50,
          },
          {
            id: 1,
            balance: 150,
          },
        ],
        [
          {
            id: 2,
            balance: 50,
          },
          {
            id: 1,
            balance: 150,
          },
        ],
      ]);
    });

    it('should return not found exception', async () => {
      jest
        .spyOn(transactionRepository, 'findAll')
        .mockResolvedValueOnce(undefined);

      const filter: FilterDto = {
        cashIn: 'true',
        cashOut: 'true',
        date: '05/12/2022',
      };
      try {
        await transactionService.findAll(1, filter);
      } catch (error) {
        expect(error).toEqual(new HttpException('transaction not found', 404));
      }
    });
  });

  describe('findAll endpoint', () => {
    it('should return one transaction', async () => {
      expect(await transactionService.findOne(1)).toEqual({
        id: 34,
        debitedAccountId: 80,
        creditedAccountId: 79,
        value: 50,
        createdAt: '2022-11-22T16:29:31.281Z',
      });
    });

    it('should return not found exception', async () => {
      jest
        .spyOn(transactionRepository, 'findOne')
        .mockResolvedValueOnce(undefined);

      try {
        await transactionService.findOne(1);
      } catch (error) {
        expect(error).toEqual(new HttpException('transaction not found', 404));
      }
    });
  });
});
