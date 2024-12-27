import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getAllUsers: jest.fn().mockResolvedValue([]),
            getUser: jest.fn().mockResolvedValue({}),
            getAllAdmins: jest.fn().mockResolvedValue([]),
            updateToAdmin: jest.fn().mockResolvedValue({ message: '' }),
            updateToUser: jest.fn().mockResolvedValue({ message: '' }),
            updateName: jest.fn().mockResolvedValue({ message: '' }),
            removeUser: jest.fn().mockResolvedValue({ message: '' }),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users', async () => {
    const result = [{
      id: 1,
      name: 'John Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
      email: 'john.doe@example.com',
      hash: 'hashedpassword',
      role: 'user',
      verificationToken: 'someVerificationToken',
      isVerified: true,
      refreshToken: 'someRefreshToken'
    }];
    jest.spyOn(service, 'getAllUsers').mockResolvedValue(result);

    expect(await controller.getAllUsers()).toBe(result);
  });

  it('should return a user by ID', async () => {
    const result = {
      id: 1,
      name: 'John Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
      email: 'john.doe@example.com',
      hash: 'hashedpassword',
      role: 'user',
      refreshToken: 'someRefreshToken',
      isVerified: true,
      verificationToken: 'someVerificationToken'
    };
    jest.spyOn(service, 'getUser').mockResolvedValue(result);

    expect(await controller.getUser ('1')).toBe(result);
  });
  
  it('should update a user to admin', async () => {
    const result = { message: 'User  has been updated to admin.' };
    jest.spyOn(service, 'updateToAdmin').mockResolvedValue(result);

    expect(await controller.updateToAdmin('1')).toBe(result);
  });

  it('should update an admin to user', async () => {
    const result = { message: 'Admin has been updated to user.' };
    jest.spyOn(service, 'updateToUser').mockResolvedValue(result);

    expect(await controller.updateToUser ('1')).toBe(result);
  });

  
  it('should delete a user', async () => {
    const result = { message: 'User  with ID 1 has been deleted successfully.' };
    jest.spyOn(service, 'removeUser').mockResolvedValue(result.message);

    expect(await controller.deleteUser ('1')).toBe(result);
  });
});