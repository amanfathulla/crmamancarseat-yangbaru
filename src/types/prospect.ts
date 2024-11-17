export interface Prospect {
  id: string;
  name: string;
  phone: string;
  carModel: string;
  location: string;
  createdAt: string;
}

export interface ProspectFormData extends Omit<Prospect, 'id'> {
  id?: string;
}