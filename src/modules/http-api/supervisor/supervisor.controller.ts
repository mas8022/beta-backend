import { Body, Controller, Param, Patch } from '@nestjs/common';
import { SupervisorService } from './supervisor.service';
import { Auth } from 'src/common/decorators/auth.decorator';

@Auth('SUPERVISOR')
@Controller('supervisor')
export class SupervisorController {
  constructor(private readonly supervisorService: SupervisorService) {}

  @Patch('edit-roles/:userId')
  async editRoles(@Body('roles') roles: any, @Param('userId') userId: string) {
    return await this.supervisorService.editRoles(roles, userId);
  }
}
