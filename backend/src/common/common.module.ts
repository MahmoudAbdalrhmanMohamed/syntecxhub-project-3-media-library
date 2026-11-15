import { Global, Module } from '@nestjs/common';
import { ParseObjectIdPipe } from './pipes/parse-object-id.pipe';

@Global()
@Module({
  providers: [ParseObjectIdPipe],
  exports: [ParseObjectIdPipe],
})
export class CommonModule {}
