import { getLevel } from '../fetch';
import fetchData from '../http';

jest.mock('../http');

describe('getLevel', () => {
  beforeEach(() => {
    fetchData.mockClear();
  });

  test('should return level info when status is ok', () => {
    fetchData.mockReturnValue({
      status: 'ok',
      level: 15
    });

    const result = getLevel(123);

    expect(fetchData).toHaveBeenCalledWith('https://server/user/123');
    expect(result).toBe('Ваш текущий уровень: 15');
  });

  test('should return unavailable message when status is not ok', () => {
    fetchData.mockReturnValue({
      status: 'error',
      level: 0
    });

    const result = getLevel(456);

    expect(fetchData).toHaveBeenCalledWith('https://server/user/456');
    expect(result).toBe('Информация об уровне временно недоступна');
  });

  test('should return unavailable message when status is missing', () => {
    fetchData.mockReturnValue({
      level: 10
    });

    const result = getLevel(789);

    expect(fetchData).toHaveBeenCalledWith('https://server/user/789');
    expect(result).toBe('Информация об уровне временно недоступна');
  });

  test('should return unavailable message when response is empty', () => {
    fetchData.mockReturnValue({});

    const result = getLevel(999);

    expect(fetchData).toHaveBeenCalledWith('https://server/user/999');
    expect(result).toBe('Информация об уровне временно недоступна');
  });

  test('should handle different user IDs', () => {
    fetchData.mockReturnValue({
      status: 'ok',
      level: 5
    });

    const result1 = getLevel('user-123');
    const result2 = getLevel(0);
    const result3 = getLevel('');

    expect(fetchData).toHaveBeenCalledWith('https://server/user/user-123');
    expect(fetchData).toHaveBeenCalledWith('https://server/user/0');
    expect(fetchData).toHaveBeenCalledWith('https://server/user/');
    expect(result1).toBe('Ваш текущий уровень: 5');
  });
});