import { Controller, Get, Param, Patch } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { FindUserParamDto } from './dto/find-user-param.dto';

@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Get('find-users/:phone')
  async findUser(@Param() param: FindUserParamDto) {
    return await this.managerService.findUser(param);
  }

  @Patch('users/:userId')
  async blockToggle(@Param('userId') userId: string) {
    try {
      
      return await this.managerService.blockToggle(userId);
    } catch (error) {
      console.log(error);
      
    }
  }
}
