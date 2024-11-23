import { Country } from './country.model';

export interface UserAddress {
  id: string;
  firstName: string;
  lastName: string;
  postcode: string;
  street: string;
  city: string;
  phone: string;
  homeNumber: string;
  houseNumber?: string;
  country: Country;
  countryId: Country['id'];
}
