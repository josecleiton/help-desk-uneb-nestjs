import { User } from './user.entity';
import { compare } from 'bcryptjs';
import { mocked } from 'ts-jest/utils';

jest.mock('bcryptjs');

describe('UserEntity', () => {
  let user: User;
  let mockedBcryptCompare;

  beforeEach(() => {
    user = new User();
    mockedBcryptCompare = mocked(compare);
  });

  it('should be defined', () => {
    expect(user).toBeDefined();
    expect(mockedBcryptCompare).toBeDefined();
  });

  describe('validatePassword', () => {
    it('should return true', async () => {
      mockedBcryptCompare.mockResolvedValue(true);
      const result = await user.validatePassword('testPassword');
      expect(mockedBcryptCompare).toBeCalled();
      expect(result).toEqual(true);
    });

    it('should return false', async () => {
      mockedBcryptCompare.mockResolvedValue(false);
      const result = await user.validatePassword('testPassword');
      expect(mockedBcryptCompare).toBeCalled();
      expect(result).toEqual(false);
    });
  });
});
