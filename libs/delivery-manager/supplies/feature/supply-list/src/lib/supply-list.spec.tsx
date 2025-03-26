import { render } from '@testing-library/react';

import DeliveryManagerSuppliesFeatureSupplyList from './delivery-manager-supplies-feature-supply-list';

describe('DeliveryManagerSuppliesFeatureSupplyList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DeliveryManagerSuppliesFeatureSupplyList />,
    );
    expect(baseElement).toBeTruthy();
  });
});
