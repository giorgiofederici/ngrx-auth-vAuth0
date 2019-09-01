import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { tap, exhaustMap, map, catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import * as fromAuth from '../actions/auth.actions';
import { LogoutPromptComponent } from '@app/auth/components/logout-prompt.component';
import { AuthService } from '@app/auth/services/auth.service';
import { of, empty } from 'rxjs';

@Injectable()
export class AuthEffects {
  // Login — calls the login method on AuthService, which triggers Auth0. Does not dispatch an action.
  @Effect({ dispatch: false })
  login$ = this.actions$
    .ofType<fromAuth.Login>(fromAuth.AuthActionTypes.Login)
    .pipe(
      tap(() => {
        return this.authService.login();
      })
    );

  // Login Complete — calls parseHash$ on AuthService, which returns an observable of the parsed hash.
  // If there's a token, this effect calls setAuth, clears the hash from the window location, and then dispatches the LoginSuccess action.
  // If there's not a token, the effect dispatches the LoginFailure action with the error as its payload.
  @Effect()
  loginComplete$ = this.actions$
    .ofType<fromAuth.Login>(fromAuth.AuthActionTypes.LoginComplete)
    .pipe(
      exhaustMap(() => {
        return this.authService.parseHash$().pipe(
          map((authResult: any) => {
            if (authResult && authResult.accessToken) {
              this.authService.setAuth(authResult);
              window.location.hash = '';
              return new fromAuth.LoginSuccess();
            }
          }),
          catchError(error => of(new fromAuth.LoginFailure(error)))
        );
      })
    );

  // Login Redirect — This effect happens when LoginSuccess is dispatched.
  // It redirects the user to home (using the authSuccessUrl property on the AuthService) and does not dispatch a new action.
  @Effect({ dispatch: false })
  loginRedirect$ = this.actions$
    .ofType<fromAuth.LoginSuccess>(fromAuth.AuthActionTypes.LoginSuccess)
    .pipe(
      tap(() => {
        this.router.navigate([this.authService.authSuccessUrl]);
      })
    );

  // Login Error Redirect — This effect happens when LoginFailure is dispatched.
  // It redirects the user back to login (using the authFailureUrl property on the AuthService) and does not dispatch a new action.
  @Effect({ dispatch: false })
  loginErrorRedirect$ = this.actions$
    .ofType<fromAuth.LoginFailure>(fromAuth.AuthActionTypes.LoginFailure)
    .pipe(
      map(action => action.payload),
      tap((err: any) => {
        if (err.error_description) {
          console.error(`Error: ${err.error_description}`);
        } else {
          console.error(`Error: ${JSON.stringify(err)}`);
        }
        this.router.navigate([this.authService.authFailureUrl]);
      })
    );

  // When CheckLogin is dispatched, this effect will call checkSession on the AuthService,
  // which, like parseHash, returns token data. If there's token data, the effect will call
  // the setAuth method and dispatch the LoginSuccess action.
  // If there's an error, the effect will dispatch LoginFailure.
  // Those actions will work the same way as with logging in - navigating to home on success or login on failure.
  @Effect()
  checkLogin$ = this.actions$
    .ofType<fromAuth.CheckLogin>(fromAuth.AuthActionTypes.CheckLogin)
    .pipe(
      exhaustMap(() => {
        if (this.authService.authenticated) {
          return this.authService.checkSession$({}).pipe(
            map((authResult: any) => {
              if (authResult && authResult.accessToken) {
                this.authService.setAuth(authResult);
                return new fromAuth.LoginSuccess();
              }
            }),
            catchError(error => {
              this.authService.resetAuthFlag();
              return of(new fromAuth.LoginFailure({ error }));
            })
          );
        } else {
          return empty();
        }
      })
    );

  // Logout Confirmation — This effect will display the log out confirmation dialog.
  // It will then process the result by dispatching either the LogoutConfirmed or LogoutCancelled actions.
  @Effect()
  logoutConfirmation$ = this.actions$
    .ofType<fromAuth.Logout>(fromAuth.AuthActionTypes.Logout)
    .pipe(
      exhaustMap(() =>
        this.dialogService
          .open(LogoutPromptComponent)
          .afterClosed()
          .pipe(
            map(confirmed => {
              if (confirmed) {
                return new fromAuth.LogoutConfirmed();
              } else {
                return new fromAuth.LogoutCancelled();
              }
            })
          )
      )
    );

  // Logout — This effect happens after LogoutConfirmed has been dispatched.
  // It will call the logout function on the AuthService, which tells Auth0 to log us out and redirect back home.
  // This effect does not dispatch another action.
  @Effect({ dispatch: false })
  logout$ = this.actions$
    .ofType<fromAuth.LogoutConfirmed>(fromAuth.AuthActionTypes.LogoutConfirmed)
    .pipe(tap(() => this.authService.logout()));

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private dialogService: MatDialog
  ) {}
}
