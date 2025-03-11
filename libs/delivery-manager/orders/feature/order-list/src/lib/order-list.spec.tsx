import { render } from '@testing-library/react';

import DeliveryManagerOrdersFeatureOrderList from './delivery-manager-orders-feature-order-list';

describe('DeliveryManagerOrdersFeatureOrderList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeliveryManagerOrdersFeatureOrderList />);
    expect(baseElement).toBeTruthy();
  });
});
