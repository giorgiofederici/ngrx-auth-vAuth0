import { Action } from '@ngrx/store';

/*  LOGIN
 * 1) User clicks the “Log In” button to trigger the Auth0 login screen.
 * 2) After going through the Auth0 authentication process, the user will be redirected to a callback route in our application.
 * 3) That CallbackComponent will need to trigger an action to parse the hash fragment and set the user session.
 *    (Hint: this is where we’re altering our application state.)
 * 4) Once that’s done, the user should be redirected to a home route.
 * 5) If the user refreshes while logged in, the authentication state should persist.
 *  I can identify several actions here:

 * Login — to trigger the Auth0 login screen.
 * LoginComplete — to handle the Auth0 callback.
 * LoginSuccess — to update our authentication state isLoggedIn to true and navigate to the home route.
 * LoginFailure — to handle errors.
 * CheckLogin - to see if the user is still logged in on the server and update the state accordingly.
 *
*/

/* LOGOUT
 * The logout process is similar:
 * 1) User clicks “Log Out” button to trigger a confirmation dialog.
 * 2) If the user clicks “Cancel,” the dialog will close.
 * 3) If the user clicks “Okay,” we’ll trigger the Auth0 logout process.
 * 4) Once logged out, Auth0 will redirect the user back to the application, which should default to the login route when not authenticated.
 * Can you think of what actions we’ll need? I spotted these:

 * Logout — to trigger the logout confirmation dialog
 * LogoutCancelled — to close the logout dialog.
 * LogoutConfirmed — to tell Auth0 to log out and redirect home.
 */

/*
 * You can see that, in our example, we’re only using a payload for the LoginFailure action to pass in an error message.
 * If we were using a user profile, we’d need to define a payload in LoginComplete in order to handle it in the reducer.
 * Instead, we'll just be handling the token through an effect and an AuthService we'll create later.
 */

export enum AuthActionTypes {
  Login = '[Login Page] Login',
  LoginComplete = '[Login Page] Login Complete',
  LoginSuccess = '[Auth API] Login Success',
  LoginFailure = '[Auth API] Login Failure',
  CheckLogin = '[Auth] Check Login',
  Logout = '[Auth] Confirm Logout',
  LogoutCancelled = '[Auth] Logout Cancelled',
  LogoutConfirmed = '[Auth] Logout Confirmed'
}

export class Login implements Action {
  readonly type = AuthActionTypes.Login;
}

export class LoginComplete implements Action {
  readonly type = AuthActionTypes.LoginComplete;
}

export class LoginSuccess implements Action {
  readonly type = AuthActionTypes.LoginSuccess;
}

export class LoginFailure implements Action {
  readonly type = AuthActionTypes.LoginFailure;

  constructor(public payload: any) {}
}

export class CheckLogin implements Action {
  readonly type = AuthActionTypes.CheckLogin;
}

export class Logout implements Action {
  readonly type = AuthActionTypes.Logout;
}

export class LogoutConfirmed implements Action {
  readonly type = AuthActionTypes.LogoutConfirmed;
}

export class LogoutCancelled implements Action {
  readonly type = AuthActionTypes.LogoutCancelled;
}

export type AuthActions =
  | Login
  | LoginComplete
  | LoginSuccess
  | LoginFailure
  | CheckLogin
  | Logout
  | LogoutCancelled
  | LogoutConfirmed;
