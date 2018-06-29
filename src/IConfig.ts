export interface IConfig {
  /**
   * Messages
   */
  messages: {
    /**
     * Error messages
     */
    errors: {
      empty_username: string;
      empty_password: string;
      username_already_in_use: string;
      username_not_registered: string;
      invalid_password: string;
      unauthorized: string;
      invalid_token: string;
      no_permission: string;
    };
  };

  /**
   * JWT secret
   */
  secret: string;

  /**
   * Use build-in auth router
   */
  enableSimpleAuth: boolean;

  /**
   * Default roles to sign to new user.
   */
  defaultRoles: string[];

  /**
   * Token expires in
   */
  expiresIn: string;
}