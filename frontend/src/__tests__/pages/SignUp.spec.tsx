import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react';
import SignUp from '../../pages/SignUp';
import api from '../../services/api';

const mockedNavigate = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useNavigate: () => mockedNavigate,
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/Toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('SignUp Page', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  jest.mock('../../services/api', () => {
    return {
      post: jest.fn(),
      delete: jest.fn(),
    };
  });

  it('Should be able to sign up', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Cadastrar');

    fireEvent.change(nameField, { target: { value: 'Name Test2' } });
    fireEvent.change(emailField, { target: { value: 'test2@test.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/');
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      );
    });

    fireEvent.change(nameField, { target: { value: 'Name Test2' } });
    fireEvent.change(emailField, { target: { value: 'test2@test.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
    const response = await api.post('/sessions', {
      email: 'test2@test.com',
      password: '123456',
    });

    const { token } = response.data;

    await act(async () => {
      const deleteResponse = await api.delete('/delete', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(deleteResponse.status).toBe(204);
    });
  });
  it('Should not be able to sign up with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Cadastrar');

    fireEvent.change(nameField, { target: { value: 'Name Test2' } });
    fireEvent.change(emailField, { target: { value: 'not-valid-email' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedNavigate).not.toHaveBeenCalled();
    });
  });
});
