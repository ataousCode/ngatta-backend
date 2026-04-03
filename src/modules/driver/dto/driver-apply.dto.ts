import { ApiProperty } from '@nestjs/swagger';

export class DriverApplyDto {
  @ApiProperty({ type: 'string', format: 'binary', description: 'Photo of ID Card or Passport' })
  idCard: any;

  @ApiProperty({ type: 'string', format: 'binary', description: "Photo of Driver's License" })
  license: any;
}
