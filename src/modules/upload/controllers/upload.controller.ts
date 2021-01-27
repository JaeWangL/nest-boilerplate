import { Controller, Body, Delete, NotAcceptableException, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { ApiFile, ApiFiles } from '@infrastructure/decorators';
import JwtAccessGuard from '@infrastructure/guards/jwt-access.guard';
import BlobService from '@shared/azure/blob.service';
import { DeleteFileRequest, DeleteFilesRequest } from '../dtos';

@ApiTags('Upload')
@Controller('upload')
@ApiBearerAuth()
export default class UploadController {
  constructor(private readonly blobSvc: BlobService) {}

  @Delete('file')
  @UseGuards(JwtAccessGuard)
  async deleteFile(@Body() req: DeleteFileRequest): Promise<boolean> {
    await this.blobSvc.deleteBlobAsync('images', req.fileName);

    return true;
  }

  @Delete('files')
  @UseGuards(JwtAccessGuard)
  async deleteFiles(@Body() req: DeleteFilesRequest): Promise<boolean> {
    await this.blobSvc.deleteBlobsAsync('images', req.fileNames);

    return true;
  }

  @Post('file')
  @ApiConsumes('multipart/form-data')
  @ApiFile('file')
  @UseGuards(JwtAccessGuard)
  async uploadFile(@Req() req: FastifyRequest): Promise<string> {
    const uploadedFile = await req.file();
    const result = await this.blobSvc.uploadBlobAsync('images', uploadedFile);
    if (!result) {
      throw new NotAcceptableException('Uploading file was failed');
    }

    return result;
  }

  @Post('files')
  @ApiConsumes('multipart/form-data')
  @ApiFiles('files')
  @UseGuards(JwtAccessGuard)
  async uploadFiles(@Req() req: FastifyRequest): Promise<string[]> {
    // NOTE: This is not error. this is in official docs with `fasitfy-multipart`
    const uploadedFiles = await req.files();
    const results = await this.blobSvc.uploadBlobsAsync('images', uploadedFiles);
    if (!results) {
      throw new NotAcceptableException('Uploading files was failed');
    }

    return results;
  }
}
