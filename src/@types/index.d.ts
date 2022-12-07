import { User as MyUser } from '@prisma/client';

declare global {
  namespace Express {
    export interface User extends MyUser {}
  }
}
