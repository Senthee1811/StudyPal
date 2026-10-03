import { Controller, Post, Get, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { DocumentService } from './document.service.js';
import { InternalAuthGuard, CurrentUser } from '@studypal/service-kit';
import { InternalAuthContext } from '@studypal/types';
import { CreateUploadIntentSchema } from '@studypal/contracts';
import { AppException } from '@studypal/service-kit';

@Controller('documents')
@UseGuards(InternalAuthGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload-intents')
  async createUploadIntent(@CurrentUser() user: InternalAuthContext, @Body() body: any) {
    const parsed = CreateUploadIntentSchema.safeParse(body);
    if (!parsed.success) {
      throw AppException.validationFailed('Invalid upload intent request', parsed.error.format());
    }
    const result = await this.documentService.createUploadIntent(user, parsed.data);
    return { success: true, data: result };
  }

  @Post(':id/complete-upload')
  async completeUpload(@CurrentUser() user: InternalAuthContext, @Param('id') id: string) {
    const result = await this.documentService.completeUpload(user, id);
    return { success: true, data: result };
  }

  @Get()
  async listDocuments(@CurrentUser() user: InternalAuthContext) {
    const data = await this.documentService.listDocuments(user);
    return { success: true, data };
  }

  @Get(':id')
  async getDocument(@CurrentUser() user: InternalAuthContext, @Param('id') id: string) {
    const data = await this.documentService.getDocument(user, id);
    return { success: true, data };
  }

  @Delete(':id')
  async deleteDocument(@CurrentUser() user: InternalAuthContext, @Param('id') id: string) {
    const data = await this.documentService.deleteDocument(user, id);
    return { success: true, data };
  }
}
