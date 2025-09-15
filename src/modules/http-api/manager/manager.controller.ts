import { Controller, Delete, Get, Param, Patch } from '@nestjs/common';
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
    return await this.managerService.blockToggle(userId);
  }

  @Get('contact-us-comments')
  async getContactUsComments() {
    return await this.managerService.getContactUsComments();
  }

  @Delete('contact-us-comment/:commentId')
  async deleteContactUsComment(@Param('commentId') commentId: string) {
    return await this.managerService.deleteContactUsComment(commentId);
  }
}
