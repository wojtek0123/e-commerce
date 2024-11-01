import { TestBed } from '@angular/core/testing';
import { Route, Router } from '@angular/router';
import { CanMatchFn } from '@angular/router';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { canMatchAuth } from './auth.guard';

import { AuthStore } from '@e-commerce/client-web/auth/data-access';
import { signal } from '@angular/core';

describe('canMatchAuth Guard', () => {
  let guard: CanMatchFn;
  let router: Router;
  let appRoutePaths: { HOME: () => string[] };
  let route: Route;

  const authStore = {
    isAuthenticated: signal(true),
  };

  beforeEach(() => {
    router = { createUrlTree: jest.fn() } as unknown as Router;

    appRoutePaths = { HOME: () => ['/home'] };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthStore, useValue: authStore },
        { provide: APP_ROUTE_PATHS_TOKEN, useValue: appRoutePaths },
      ],
    });

    guard = canMatchAuth;
  });

  it('should allow navigation if the user is not authenticated', () => {
    // Set up the mock to return false (user not authenticated)
    // (authStore.isAuthenticated as jest.Mock).mockReturnValue(false);
    authStore.isAuthenticated.set(false);

    // Call the guard function
    const result = guard(route, []);

    // Assert that it returns `true`, meaning navigation is allowed
    expect(result).toBe(true);
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect to HOME if the user is authenticated', () => {
    // Set up the mock to return true (user authenticated)
    authStore.isAuthenticated.set(true);

    // Call the guard function
    const result = guard(route, []);

    // Assert that it returns a UrlTree pointing to the HOME path
    expect(result).toEqual(router.createUrlTree(appRoutePaths.HOME()));
    expect(router.createUrlTree).toHaveBeenCalledWith(appRoutePaths.HOME());
  });
});
