import { Injectable } from '@cryxto/ioc-n-di';
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access';
import { createAccessControl } from 'better-auth/plugins/access';
import z from 'zod';

const permissions = [
  'create',
  'share',
  'update',
  'delete',
  'read',
  'revoke',
  'invite',
  'reserve',
  'approve',
  'disapprove',
] as const;

export const PermissionSchema = z.enum(permissions);

export type Permission = z.infer<typeof PermissionSchema>;

/**
 * AccessControll manages role-based access control (RBAC)
 * Defines permissions for admin, and regular user roles
 */
@Injectable()
export class AccessControll {
  access = createAccessControl({
    ...defaultStatements,
    signup: permissions,
    docs: permissions,
    test: permissions,
  });

  admin = this.access.newRole({
    signup: [
      'create',
      'read',
      'update',
      'delete',
      'approve',
      'disapprove',
      'invite',
    ],
    docs: ['read'],
    ...adminAc.statements,
  });

  regular = this.access.newRole({
    test: ['read'],
  });
}
