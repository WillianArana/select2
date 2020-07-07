export interface IOptionData {
  id: string;
  text: string;
  disabled?: boolean;
  children?: Array<IOptionData>;
  additional?: any;
}
