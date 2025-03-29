import { Country } from './country.model';

export interface UserAddress {
  id: string;
  postcode: string;
  street: string;
  city: string;
  homeNumber: string;
  houseNumber?: string;
  country: Country;
  countryId: Country['id'];
}
