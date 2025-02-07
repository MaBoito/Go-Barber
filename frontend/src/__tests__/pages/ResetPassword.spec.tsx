import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import ResetPassword from '../../pages/ResetPassword';
import api from '../../services/api';

const mockedNavigate = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
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

jest.mock('../../services/api', () => ({
  post: jest.fn(),
}));

describe('ResetPassword Page', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
    (api.post as jest.Mock).mockClear();
    Object.defineProperty(window, 'location', {
      value: {
        search: '?token=abcd1234',
      },
    });
  });

  it('Should be able to reset password', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField =
      getByPlaceholderText('Confirmar da senha');
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123456' },
    });
    (api.post as jest.Mock).mockResolvedValueOnce({});

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('Should not be able to reset password if passwords do not match', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField =
      getByPlaceholderText('Confirmar da senha');
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '654321' },
    });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(getByText('Confirmação incorreta')).toBeTruthy();
    });
  });

  it('should return error if token invalid', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        search: '',
      },
    });
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField =
      getByPlaceholderText('Confirmar da senha');
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123456' },
    });
    (api.post as jest.Mock).mockResolvedValueOnce({});

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });

  it('Should display an error message if password reset fails', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField =
      getByPlaceholderText('Confirmar da senha');
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123456' },
    });

    (api.post as jest.Mock).mockRejectedValueOnce(new Error());

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
