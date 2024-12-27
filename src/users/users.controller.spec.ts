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
            getAllUsers: jest.fn(),
            getUser: jest.fn(),
            getAllAdmins: jest.fn(),
            updateToAdmin: jest.fn(),
            updateToUser: jest.fn(),
            updateName: jest.fn(),
            removeUser: jest.fn(),
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
      role: 'user'
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
      role: 'user'
    };
    jest.spyOn(service, 'getUser').mockResolvedValue(result);

    expect(await controller.getUser ('1')).toBe(result);
  });

  it('should return all admins', async () => {
    const result = [{
      id: 1,
      name: 'Admin User',
      createdAt: new Date(),
      updatedAt: new Date(),
      email: 'admin.user@example.com',
      hash: 'hashedpassword',
      role: 'admin'
    }];
    jest.spyOn(service, 'getAllAdmins').mockResolvedValue(result);

    expect(await controller.getAllAdmins()).toBe(result);
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

  it('should update a user name', async () => {
    const result = { message: 'User  with ID 1 has been updated successfully.' };
    jest.spyOn(service, 'updateName').mockResolvedValue(result.message);

    expect(await controller.updateName('1', { name: 'New Name' })).toBe(result);
  });

  it('should delete a user', async () => {
    const result = { message: 'User  with ID 1 has been deleted successfully.' };
    jest.spyOn(service, 'removeUser').mockResolvedValue(result.message);

    expect(await controller.deleteUser ('1')).toBe(result);
  });
});