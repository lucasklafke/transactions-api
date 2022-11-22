import { Test, TestingModule } from '@nestjs/testing';
import { BcryptUtil } from '../../utils/bcrypt.util';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { HttpStatus } from '@nestjs/common';
describe('AuthService', () => {
  let authService: AuthService;
  let bcrypt: BcryptUtil;
  let jwtService: JwtService;
  let usersService: UsersService;

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
  const mockBcryptUtils = {
    encrypt: jest.fn().mockReturnValue(true),
    decrypt: jest.fn().mockResolvedValue(true),
  };
  const mockJwtService = {
    sign: jest.fn().mockReturnValue('token'),
  };
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
        AuthService,
        {
          provide: BcryptUtil,
          useValue: mockBcryptUtils,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    bcrypt = module.get<BcryptUtil>(BcryptUtil);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('testing login', () => {
    it('should return token when login is successful', async () => {
      jest.spyOn(jwtService, 'sign').mockImplementationOnce((): any => {
        return 'token';
      });
      const user = {
        id: 1,
        username: 'lucas',
        password: 'Lucas123',
        accountId: 1,
      };
      expect(authService.login(user)).toEqual({
        token: 'token',
      });
    });
  });

  describe('testing validateUser', () => {
    it('should return a user', async () => {
      const username = 'lucas123';
      const password = 'Lucas123';

      try {
        const user = await authService.validateUser(username, password);
      } catch (error) {
        expect(error).toBeUndefined();
      }
      expect(bcrypt.decrypt('123', '123')).toBeTruthy();
      expect(await authService.validateUser(username, password)).toEqual(
        fakeUsers[0],
      );
    });

    it('should return null if user does not exist', async () => {
      const username = 'lucas123';
      const password = 'Lucas123';
      jest
        .spyOn(usersService, 'findOneByUsername')
        .mockImplementationOnce((): any => {
          throw new Error();
        });
      expect(await authService.validateUser(username, password)).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const username = 'lucas123';
      const password = 'Lucas123';
      jest.spyOn(bcrypt, 'decrypt').mockImplementationOnce((): any => {
        return false;
      });
      expect(await authService.validateUser(username, password)).toBeNull();
    });
  });
});
