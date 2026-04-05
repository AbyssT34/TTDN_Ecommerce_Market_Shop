import { Button } from '@mui/material';
import React from 'react'
import { Link } from 'react-router-dom';

const OrderFailed = () => {
  return (
    <section className="w-full p-10 py-20 flex items-center justify-center flex-col gap-2">
      <img src="/delete.png" width="120" />
      <h3 className="mb-0 text-[25px] "> Your order is failed</h3>
      <p className="mt-0">your order is faild due to some reason .</p>
      <Link to={'/'}>
        <Button className="bg-org btn-border">Back to home</Button>
      </Link>
    </section>
  );
}

export default OrderFailed;
