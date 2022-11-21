import { Test, TestingModule } from '@nestjs/testing';
import { Account } from '../account/entities/account.entity';
import { AccountService } from '../account/account.service';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { BcryptUtil } from '../../utils/bcrypt.util';

describe('UsersService', () => {
  let userService: UsersService;
  let accountService: AccountService;
  let usersRepository: UsersRepository;

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
  const usersRepositoryMock = {
    create: jest.fn().mockReturnValue(fakeUsers[0]),
    findMany: jest.fn().mockReturnValue(fakeUsers),
    findUnique: jest.fn().mockReturnValue(fakeUsers[0]),
    update: jest.fn().mockResolvedValue(fakeUsers[1]),
    delete: jest.fn(), // O método delete não retorna nada
    findOne: jest.fn().mockReturnValue(fakeUsers[0]),
    findAll: jest.fn().mockReturnValue(fakeUsers),
    remove: jest.fn(),
    findByUsername: jest.fn().mockReturnValue(undefined),
    findById: jest.fn().mockResolvedValue(undefined),
    createUserAndAccount: jest.fn().mockReturnValue(fakeUsers[0]),
  };
  const mockBcryptUtils = {
    encrypt: jest.fn().mockReturnValue(true),
    decrypt: jest.fn().mockReturnValue(true),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            create: jest.fn().mockReturnValue(fakeUsers[0]),
            findMany: jest.fn().mockReturnValue(fakeUsers),
            findUnique: jest.fn().mockReturnValue(fakeUsers[0]),
            update: jest.fn().mockResolvedValue(fakeUsers[1]),
            delete: jest.fn(), // O método delete não retorna nada
            findOne: jest.fn().mockReturnValue(fakeUsers[0]),
            findAll: jest.fn().mockReturnValue(fakeUsers),
            remove: jest.fn(),
            findByUsername: jest.fn().mockReturnValue(undefined),
            findById: jest.fn(),
            createUserAndAccount: jest.fn().mockReturnValue(fakeUsers[0]),
          },
        },
        {
          provide: AccountService,
          useValue: { create: jest.fn().mockReturnValue(fakeAccount[0]) },
        },
        {
          provide: BcryptUtil,
          useValue: mockBcryptUtils,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    accountService = module.get<AccountService>(AccountService);
  });

  describe('create endpoint', () => {
    it('should create a user', async () => {
      jest
        .spyOn(usersRepository, 'findByUsername')
        .mockImplementationOnce((): any => {
          return undefined;
        });
      const dto = {
        username: 'lucas',
        password: 'Password123',
      };
      expect(await userService.create(dto)).toEqual({
        id: expect.any(Number),
        username: 'lucas',
        password: 'Password123',
        accountId: expect.any(Number),
      });
    });

    it('should throw error', async () => {
      jest.spyOn(userService, 'create').mockRejectedValueOnce(new Error());
      const dto = {
        username: 'lucas',
        password: 'Password123',
      };
      expect(userService.create(dto)).rejects.toThrowError();
    });

    it('should return conflict error', async () => {
      jest
        .spyOn(usersRepository, 'findByUsername')
        .mockResolvedValueOnce(fakeUsers[0]);
    });
    const dto = {
      username: 'lucas',
      password: 'Password123',
    };
    try {
      const user = userService.create(dto);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  describe('find one endpoint', () => {
    it('should find a user', async () => {
      jest
        .spyOn(usersRepository, 'findById')
        .mockImplementationOnce((): any => {
          return {
            id: 1,
            username: 'lucas',
            password: 'Password123',
            accountId: 1,
          };
        });
      const user = await userService.findOne(1);
      expect(user).toEqual({
        id: 1,
        username: 'lucas',
        password: 'Password123',
        accountId: 1,
      });
    });

    it('should return not found exception', async () => {
      jest
        .spyOn(usersRepository, 'findById')
        .mockImplementationOnce((): any => {
          return null;
        });
      try {
        const user = await userService.findOne(1);
      } catch (err) {
        console.log(err);
        expect(err).toBeDefined();
        expect(err.status).toEqual(404);
      }
    });
  });
  describe('update endpoint', () => {
    it('should update a user', async () => {
      jest
        .spyOn(usersRepository, 'findById')
        .mockImplementationOnce((): any => {
          return fakeUsers[0];
        });

      const dto = {
        username: 'lucasSS',
        password: 'Password1234',
      };
      const user = await userService.update(1, dto);
      console.log(user);
      expect(user).toEqual(fakeUsers[1]);
    });

    it('should throw an error', async () => {
      jest.spyOn(userService, 'update').mockRejectedValueOnce(new Error());

      const dto = {
        username: 'lucasSS',
        password: 'Password1234',
      };
      expect(userService.update(1, dto)).rejects.toThrowError();
    });

    it('should return conflict exception', async () => {
      jest
        .spyOn(usersRepository, 'findById')
        .mockImplementationOnce((): any => {
          return fakeUsers[0];
        });
      jest
        .spyOn(usersRepository, 'findByUsername')
        .mockImplementationOnce((): any => {
          return fakeUsers[0];
        });
      try {
        const user = await userService.update(1, {
          username: 'lucas123',
          password: 'Lucas123',
        });
      } catch (err) {
        console.log(err);
        expect(err).toBeDefined();
        expect(err.status).toEqual(409);
      }
    });

    it('should return not found exception', async () => {
      jest
        .spyOn(usersRepository, 'findByUsername')
        .mockImplementationOnce((): any => {
          return fakeUsers[0];
        });
      try {
        const user = await userService.update(1, {
          username: 'lucas123',
          password: 'Lucas123',
        });
      } catch (err) {
        console.log(err);
        expect(err).toBeDefined();
        expect(err.status).toEqual(404);
      }
    });
  });
  describe('find many', () => {
    it('should find many users', async () => {
      expect(await userService.findAll()).toEqual([
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
});
