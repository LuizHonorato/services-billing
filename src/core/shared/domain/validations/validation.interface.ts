export default interface ValidationInterface {
  validate(entity: any): { errors: string[] };
}
