import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

export default function ProcessChargesDocumentation() {
  return applyDecorators(
    ApiTags('Process Charges'),
    ApiOperation({
      summary: 'Process charges',
      description:
        'This endpoint is used to process charges for a specific customer and send e-mails for their clients.',
    }),
    ApiParam({
      name: 'customerId',
      type: String,
    }),
    ApiBody({
      description: 'CSV file with charges data',
      required: true,
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'The CSV file containing charges',
          },
        },
      },
    }),
    ApiNoContentResponse({
      description: 'No content',
    }),
  );
}
