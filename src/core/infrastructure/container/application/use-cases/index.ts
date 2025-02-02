import ProcessChargesUseCase from '@/core/application/use-cases/process-charges.use-case';
import ProcessChargesInputPort from '@/core/ports/in/process-charges.input-port';
import { container } from 'tsyringe';

container.registerSingleton<ProcessChargesInputPort>(
  'ProcessChargesInputPort',
  ProcessChargesUseCase,
);
