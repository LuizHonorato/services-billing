export default interface ProcessChargesInputPort {
  execute(input: any): Promise<void>;
}
