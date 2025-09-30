import 'fastify';
import type { User } from 'src/modules/users/user.model';

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
    author?: User;
    manager?: User;
    admin?: User;
  }
}
