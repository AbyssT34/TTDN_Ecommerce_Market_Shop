import React, { useContext } from 'react';
import { Button } from '@mui/material';
import { BsFillBagCheckFill } from 'react-icons/bs';
import MyListtems from './MyListtems';
import AccountSidebar from '../../componets/AccountSidebar';
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';

const MyList = () => {
  const context = useContext(MyContext);

  return (
    <>
      <section className="py-10 w-full">
        <div className="container flex gap-5">
          <div className="col1 w-[20%]">
            <AccountSidebar />
          </div>
          <div className="col2 w-[70%]">
            <div className="shadow-md rounded-md bg-white">
              <div className="py-2 px-3 border-b border-[rgba(0,0,0,0.1)]">
                <h2 className="">My List</h2>
                <p className="mt-0">
                  There are{' '}
                  <span className="font-bold text-primary">{context?.myListData?.length}</span>{' '}
                  products in your My List
                </p>
              </div>

              {context?.myListData?.length > 0 ? (
                context.myListData.map((item, index) => <MyListtems key={index} item={item} />)
              ) : (
                <div className="flex items-center justify-center flex-col py-10 px-3">
                  <img src="/list.png" className="w-[100px]" alt="Empty list" />
                  <h3>My List is currently empty</h3>
                  <Link to={'/'}>
                    <Button className="bg-org btn-sm">Continue Shopping</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MyList;
