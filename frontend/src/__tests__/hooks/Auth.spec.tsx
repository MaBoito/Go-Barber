import { renderHook, waitFor, act } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { AuthProvider, useAuth } from '../../hooks/Auth';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  it('should be able to sign in', async () => {
    const apiResponse = {
      user: { id: 'user123', name: 'Name test', email: 'teste@test.com' },
      token: 'token-123',
    };

    apiMock.onPost('sessions').reply(200, apiResponse);

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });
    await act(async () => {
      await result.current.signIn({
        email: 'teste@test.com',
        password: '123456',
      });
    });

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith(
        '@GoBarber:token',
        apiResponse.token,
      );
      expect(setItemSpy).toHaveBeenCalledWith(
        '@GoBarber:user',
        JSON.stringify(apiResponse.user),
      );

      expect(result.current.user.email).toEqual('teste@test.com');
    });
  });

  it('should restore saved data from storage when auth inits', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-123';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user123',
            name: 'Name test',
            email: 'teste@test.com',
          });
        default:
          return null;
      }
    });
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });
    expect(result.current.user.email).toEqual('teste@test.com');
  });

  it('should be able to sign out', () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.signOut();
    });

    expect(removeItemSpy).toHaveBeenCalledTimes(2);
    expect(result.current.user).toBeUndefined();
  });

  it('should be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });
    const user = {
      id: 'user123',
      name: 'Name test',
      email: 'teste@test.com',
      avatar_url: 'imag.png',
    };

    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    );

    expect(result.current.user).toEqual(user);
  });
});
