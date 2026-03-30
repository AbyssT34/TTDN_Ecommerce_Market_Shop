import React, { useContext, useEffect, useState } from 'react';
import AccountSidebar from '../../componets/AccountSidebar';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import { MyContext } from '../../App';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import Select from '@mui/material/Select';

import { deleteData, editData, fetchDataFromApi, postData } from '../../utils/api';
import { FaRegTrashAlt } from 'react-icons/fa';
import AddressBox from './addressBox';
import CircularProgress from '@mui/material/CircularProgress';

const label = { inputProps: { 'arial-label': 'checkbox demo' } };

const Address = () => {
  const [address, setAddress] = useState([]);
  const [phone, setPhone] = useState('');
  const [isOpenMoel, setIsOpenModel] = useState(false);
  const [mode, setMode] = useState('add');
  const [addressId, setAddressId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addressType, setAddressType] = useState('');
  const [formFields, setFormFields] = useState({
    address_line1: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    mobile: '',
    userId: '',
    addressType: '',
    lamdmark: '',
  });

  const context = useContext(MyContext);


  useEffect(() => {
    if (context?.userData?._id !== undefined) {
      setFormFields((prevState) => ({
        ...prevState,
        userId: context?.userData?._id,
      }));
    }
  }, [context?.userData]);

  useEffect(() => {
    if (context?.userData?._id !== '' && context?.userData?._id !== undefined) {
      fetchDataFromApi(`/api/address/get?userId=${context?.userData?._id}`).then((res) => {
        setAddress(res.data);
      });
    }
  }, [context?.userData]);

  const removeAddress = (id) => {
    deleteData(`/api/address/${id}`).then((res) => {
      fetchDataFromApi(`/api/address/get?userId=${context?.userData?._id}`).then((res) => {
        setAddress(res.data);
      });
    });
  };




 

  return (
    <>
      <section className="py-10 w-full">
        <div className="container flex gap-5">
          <div className="col1 w-[20%]">
            <AccountSidebar />
          </div>
          <div className="col2 w-[50%]">
            <div className="card bg-white p-5 shadow-md rounded-md mb-5">
              <div className="flex items-center pb-3">
                <h2 className="pb-0">Address</h2>
              </div>
              <hr />

              <div
                className="flex items-center justify-center p-5 rounded-md border border-dashed
                          border-[rgba(0,0,0,0.2)] bg-[#f1faff] hover:bg-[#e7f3f9] cursor-pointer"
                onClick={() => context?.toggleAddressPanel(true)}
              >
                <span className="text-[14px] font-[500]">Add Address</span>
              </div>

              <div className="flex gap-2 flex-col mt-4">
                {address?.length > 0 &&
                  address?.map((address, index) => {
                    return (
                      <>
                        <AddressBox address={address} key={index} removeAddress={removeAddress} />
                      </>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Address;
