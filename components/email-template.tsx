interface EmailTemplateProps {
  data: {
    fullName: string;
    totalPrice: string;
    address: string;
    products: {
      name: string;
      price: string;
      color: string;
      size: string;
      quantity: number;
    }[];
  };
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  data,
}) => {
  return (
    <div className="bg-gray-100 p-4">
      <div className="bg-white p-4 shadow-md">
        <h1 className="text-2xl font-bold mb-2">
          Thank you for your order, {data.fullName}!
        </h1>
        <p className="mb-4">Your order number is: {data.products.length}</p>
      </div>

      <div className="bg-white p-4 shadow-md mt-4">
        <h2 className="text-xl font-bold mb-2">Order details</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Product</th>
              <th className="text-left">Price</th>
              <th className="text-left">Color</th>
              <th className="text-left">Size</th>
              <th className="text-left">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((product) => (
              <tr key={product.name}>
                <td className="border px-4 py-2">{product.name}</td>
                <td className="border px-4 py-2">{product.price}</td>
                <td className="border px-4 py-2">{product.color}</td>
                <td className="border px-4 py-2">{product.size}</td>
                <td className="border px-4 py-2">{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4">Total price: {data.totalPrice}</p>
      </div>

      <div className="bg-white p-4 shadow-md mt-4">
        <h3 className="text-lg font-bold mb-2">Shipping information</h3>
        <p className="mb-2">
          Your order will be shipped to the following address:
          <br />
          {data.address}
        </p>
        <p>Orders usually arrive 2-3 days after order confirmation</p>
      </div>

      <div className="bg-white p-4 shadow-md mt-4">
        <h3 className="text-lg font-bold mb-2">Contact us</h3>
        <p className="mb-2">
          If you have any questions about your order, please do not hesitate to
          contact us:
          <br />
          Email: Haamerce@resend.dev
          <br />
          Phone: 0966936341
        </p>
      </div>
      <div
        style={{ backgroundImage: `url(/logoHaamerce.png)` }}
        className="h-[80px] w-[140px] bg-no-repeat bg-center bg-cover"
      ></div>
    </div>
  );
};
