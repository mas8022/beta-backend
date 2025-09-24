import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { CollaborateService } from './collaborate.service';
import { CreateCollaborateDto } from './dto/create-collaborate.dto';

@Controller('collaborate')
export class CollaborateController {
  constructor(private readonly collaborateService: CollaborateService) {}

  @Post()
  create(@Body() createCollaborateDto: CreateCollaborateDto) {
    return this.collaborateService.create(createCollaborateDto);
  }
  
}
