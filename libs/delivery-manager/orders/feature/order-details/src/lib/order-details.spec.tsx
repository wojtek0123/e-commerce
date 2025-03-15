import { render } from '@testing-library/react';

import DeliveryManagerOrderFeatureOrderDetails from './delivery-manager-order-feature-order-details';

describe('DeliveryManagerOrderFeatureOrderDetails', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeliveryManagerOrderFeatureOrderDetails />);
    expect(baseElement).toBeTruthy();
  });
});
