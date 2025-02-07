import React from 'react';
import { Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/Auth';

interface RouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
  path: string;
}

const CustomRoute: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <Route
      {...rest}
      element={
        isPrivate === !!user ? (
          <Component />
        ) : (
          <Navigate
            to={isPrivate ? '/' : '/dashboard'}
            state={{ from: location }} 
          />
        )
      }
    />
  );
};

export default CustomRoute;
