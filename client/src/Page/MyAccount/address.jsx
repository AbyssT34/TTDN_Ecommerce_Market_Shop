import React, { useContext, useEffect, useState } from 'react';
import AccountSidebar from '../../componets/AccountSidebar';
import Radio from '@mui/material/Radio';
import { MyContext } from '../../App';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { deleteData, fetchDataFromApi, postData } from '../../utils/api';
import { FaRegTrashAlt } from 'react-icons/fa';

const label = { inputProps: { 'arial-label': 'checkbox demo' } };

const Address = () => {
  const [address, setAddress] = useState([]);
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState(false);
  const [isOpenMoel, setIsOpenModel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    address_line1: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    mobile: '',
    status: '',
    userId: '',
    selected: false,
  });

  const context = useContext(MyContext);

  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
    setFormFields((prevState) => ({
      ...prevState,
      status: event.target.value,
    }));
  };
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (formFields.address_line1 === '') {
      context.alertBox('error', 'Please enter Address Line 1');
      return false;
    }

    if (formFields.city === '') {
      context.alertBox('error', 'Please enter your city name');
      return false;
    }

    if (formFields.state === '') {
      context.alertBox('error', 'Please enter your state');
      return false;
    }
    if (formFields.pincode === '') {
      context.alertBox('error', 'Please enter your pincode');
      return false;
    }
    if (formFields.country === '') {
      context.alertBox('error', 'Please enter your country');
      return false;
    }
    if (phone === '') {
      context.alertBox('error', 'Please enter your 10 digit mobile');
      return false;
    }

    postData(`/api/address/add`, formFields, { withCredentials: true }).then((res) => {
      console.log(res);
      if (res?.error !== true) {
        setIsLoading(false);
        context.alertBox('success', res?.message);
        setIsOpenModel(false);
        fetchDataFromApi(`/api/address/get?userId=${context?.userData?._id}`).then((res) => {
          setAddress(res.data);
        });
      } else {
        context.alertBox('error', res?.message || 'Something went wrong');
        setIsLoading(false);
      }
    });
  };

  const handleClose = () => {
    setIsOpenModel(false);
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
                onClick={() => setIsOpenModel(true)}
              >
                <span className="text-[14px] font-[500]">Add Address</span>
              </div>

              <div className="flex gap-2 flex-col mt-4">
                {address?.length > 0 &&
                  address?.map((address, index) => {
                    return (
                      <>
                        <div
                          className="addressBox group relative w-full flex items-center justify-center border border-dashed
                                     border-[rgba(0,0,0,0.2)] bg-[#f1f1f1] p-3 rounded-md cursor-pointer"
                        >
                          <label className="mr-auto">
                            <Radio
                              {...label}
                              name="address"
                              value={address?._id}
                              checked={selectedValue === address?._id}
                              onChange={handleChange}
                            />
                            <span className="text-[12px]">
                              {address?.address_line1 +
                                ' ' +
                                address?.city +
                                ' ' +
                                address?.country +
                                ' ' +
                                address?.state +
                                ' ' +
                                address?.pincode}
                            </span>
                          </label>
                          <span
                            onClick={() => removeAddress(address?._id)}
                            className="hidden group-hover:flex  items-center justify-center w-[30px] h-[30px] 
                           z-50 rounded-full bg-gray-500 text-white ml-auto"
                          >
                            <FaRegTrashAlt />
                          </span>
                        </div>
                      </>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={isOpenMoel}>
        <DialogTitle>Add Address</DialogTitle>
        <form action="" className="p-8 py-3 pb-8 " onSubmit={handleSubmit}>
          <div className="flex items-center gap-5 pb-5">
            <div className="col w-[100%]">
              <TextField
                className="w-full"
                label="Address Line 1"
                variant="outlined"
                size="small"
                name="address_line1"
                value={formFields.address_line1}
                onChange={onChangeInput}
              />
            </div>
          </div>

          <div className="flex items-center gap-5 pb-5">
            <div className="col w-[50%]">
              <TextField
                className="w-full"
                label="City"
                variant="outlined"
                size="small"
                name="city"
                value={formFields.city}
                onChange={onChangeInput}
              />
            </div>

            <div className="col w-[50%]">
              <TextField
                className="w-full"
                label="State"
                variant="outlined"
                size="small"
                name="state"
                value={formFields.state}
                onChange={onChangeInput}
              />
            </div>
          </div>

          <div className="flex items-center gap-5 pb-5">
            <div className="col w-[50%]">
              <TextField
                className="w-full"
                label="Pincode"
                variant="outlined"
                size="small"
                name="pincode"
                value={formFields.pincode}
                onChange={onChangeInput}
              />
            </div>

            <div className="col w-[50%]">
              <TextField
                className="w-full"
                label="Country"
                variant="outlined"
                size="small"
                name="country"
                value={formFields.country}
                onChange={onChangeInput}
              />
            </div>
          </div>

          <div className="flex items-center gap-5 pb-5">
            <div className="col w-[50%]">
              <PhoneInput
                defaultCountry="vn"
                value={phone}
                onChange={(phone) => {
                  setPhone(phone);
                  setFormFields((prevState) => ({
                    ...prevState,
                    mobile: phone,
                  }));
                }}
              />
            </div>

            <div className="col w-[50%]">
              <Select
                value={status}
                onChange={handleChangeStatus}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                size="small"
                className="w-full"
              >
                <MenuItem value={true}>True</MenuItem>
                <MenuItem value={false}>False</MenuItem>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Button type="submit" className="bg-org btn-lg w-full flex gap-2 items-center">
              Save
            </Button>

            <Button
              className="bg-org btn-border btn-lg w-full flex gap-2 items-center"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default Address;
