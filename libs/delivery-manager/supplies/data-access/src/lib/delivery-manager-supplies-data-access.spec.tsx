import { render } from '@testing-library/react';

import DeliveryManagerSuppliesDataAccess from './delivery-manager-supplies-data-access';

describe('DeliveryManagerSuppliesDataAccess', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeliveryManagerSuppliesDataAccess />);
    expect(baseElement).toBeTruthy();
  });
});
