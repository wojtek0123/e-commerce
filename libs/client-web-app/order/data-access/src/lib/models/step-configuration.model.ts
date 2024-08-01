import { Step } from './step.model';

export interface StepConfiguration {
  previous: Step | null;
  current: Step | null;
  next: Step | null;
}
