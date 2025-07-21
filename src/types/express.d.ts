interface AuthRequest extends Request {
  user: import('src/@core/contracts/auth/auth-user-payload.dto').AuthUserPayload;
}
