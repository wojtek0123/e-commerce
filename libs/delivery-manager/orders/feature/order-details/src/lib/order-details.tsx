import { useQuery } from '@tanstack/react-query';
import { OrderDetails as Order } from '@e-commerce/shared/api-models';
import axios from 'axios';
import { useParams } from 'react-router';
import { OrderStatus } from '@prisma/client';

export function OrderDetails() {
  const { id } = useParams();

  const { isLoading, isError, data } = useQuery<Order>({
    queryKey: ['order'],
    queryFn: async () => {
      const { data } = await axios.get<Order>(
        `http://localhost:3000/order-details/${id}`,
      );

      return data;
    },
    staleTime: Infinity,
  });

  if (isLoading) {
    return <div className="skeleton h-32 w-full"></div>;
  }

  if (isError) {
    return <div>Something went wrong! Try later!</div>;
  }

  console.log(data.status);

  return (
    <>
      {data.status === OrderStatus.PREPARED_FOR_SHIPPING && (
        <div>
          <p>
            Once you hand over the package to the courier, you can mark this
            order as 'Shipped' in the system.
          </p>
          <button className="btn btn-primary">Mark as shipped</button>
        </div>
      )}
      {data.status !== OrderStatus.PREPARED_FOR_SHIPPING && (
        <div className="flex flex-col gap-4 w-full">
          <h1>Welcome to DeliveryManagerOrderFeatureOrderDetails!</h1>
          <div className="flex w-full p-base rounded-base bg-neutral">
            <span>{data.shippingMethod.name}</span>
            <span>{data.shippingMethod.price}</span>
            <span>{data.shippingMethod.deliveryTime}</span>
          </div>

          <div className="wrapper">
            <button className="flex flex-col items-start !justify-start gap-4 pr-14">
              <span className="flex gap-4 justify-start">
                <span className="text-sm text-muted-color font-semibold w-24 text-start">
                  Phone
                </span>
                <span className="text-base !text-start">
                  {data.orderAddress.phone}
                </span>
              </span>
              <span className="flex gap-4 justify-start">
                <span className="text-sm text-muted-color font-semibold w-24 text-start">
                  Name
                </span>
                <span className="text-base flex justify-start">
                  {data.orderAddress.firstName}
                  {data.orderAddress.lastName}
                </span>
              </span>
              <span className="flex gap-4">
                <span className="text-sm text-muted-color font-semibold min-w-24 text-start">
                  Address
                </span>
                <span className="flex flex-col items-start">
                  <span className="text-base !text-start">
                    {data.orderAddress.street}
                    {data.orderAddress.homeNumber}
                    {data.orderAddress.houseNumber
                      ? '/ ' + data.orderAddress.houseNumber
                      : ''}
                    ,{data.orderAddress.postcode}, {data.orderAddress.city},
                    {data.orderAddress.country.name}
                  </span>
                </span>
              </span>
            </button>
          </div>

          <div>
            <span>{data.orderAddress.city}</span>
            <span>{data.orderAddress.street}</span>
            <span>{data.orderAddress.homeNumber}</span>
            <span>{data.orderAddress.houseNumber}</span>
            <span>{data.orderAddress.postcode}</span>
            <span>{data.orderAddress.phone}</span>
            <span>{data.orderAddress.firstName}</span>
            <span>{data.orderAddress.lastName}</span>
            <button className="btn">Generate label</button>
          </div>

          <span>Books</span>
          <div className="overflow-x-auto rounded-box">
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <th>Image</th>
                  <th>Authors</th>
                  <th>Favorite Color</th>
                </tr>
              </thead>
              <tbody>
                {data.orderItems?.map((item) => (
                  <tr key={item.id}>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                    <td>
                      <img
                        className="max-h-48"
                        src={item.book.coverImage}
                        alt={item.book.title + ' cover image'}
                      />
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        {item.book.authors?.map((author) => (
                          <span key={crypto.randomUUID()}>{author.name}</span>
                        ))}
                      </div>
                    </td>
                    <td>Blue</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default OrderDetails;
