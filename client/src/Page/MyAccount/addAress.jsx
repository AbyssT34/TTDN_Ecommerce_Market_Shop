import React, { useContext, useEffect, useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import { MyContext } from '../../App';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import Select from '@mui/material/Select';
import { FaRegTrashAlt } from 'react-icons/fa';
import CircularProgress from '@mui/material/CircularProgress';
import {  editData, fetchDataFromApi, postData } from '../../utils/api';

const AddAress = () => {
  const [phone, setPhone] = useState('');
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

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };

  const handleChangeAddressType = (event) => {
    setAddressType(event.target.value);
    setFormFields((prevState) => ({
      ...prevState,
      addressType: event.target.value,
    }));
  };

  useEffect(() => {
    if (context?.addressMode === 'edit') {
      fetchAddress(context?.addressId);
    }
  }, [context?.addressMode]);

  const handleSubmit = (e) => {
    e.preventDefault();

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
    if (formFields.lamdmark === '') {
      context.alertBox('error', 'Please enter your landmark');
      return false;
    }
    if (addressType === '') {
      context.alertBox('error', 'Please enter your address type');
      return false;
    }

    if (context?.addressMode === 'add') {
      setIsLoading(true);
      postData(`/api/address/add`, formFields, { withCredentials: true }).then((res) => {
        if (res?.error !== true) {
          context.alertBox('success', res?.message);
          setTimeout(() => {
            setIsLoading(false);
            context.setOpenAddressPanel(false);
          }, 500);

          context?.getUserAddress();

          setFormFields({
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

          setAddressType('');
          setPhone('');
        } else {
          context.alertBox('error', res?.message || 'Something went wrong');
          setIsLoading(false);
        }
      });
    }

    if (context?.addressMode === 'edit') {
      editData(`/api/address/${context?.addressId}`, formFields, { withCredentials: true }).then((res) => {
        setIsLoading(false);
        fetchDataFromApi(`/api/address/get?userId=${context?.userData?._id}`).then((res) => {
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
          context?.getUserAddress(res.data);
          context.setOpenAddressPanel(false);

          setFormFields({
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

          setAddressType('');
          setPhone('');
        });
      });
    }
  };

  const fetchAddress = (id) => {
    fetchDataFromApi(`/api/address/${id}`).then((res) => {
      const addr = res?.address || res?.data || {};
      setFormFields({
        _id: addr?._id || '',
        address_line1: addr?.address_line1 || '',
        city: addr?.city || '',
        state: addr?.state || '',
        pincode: addr?.pincode || '',
        country: addr?.country || '',
        mobile: addr?.mobile || '',
        userId: addr?.userId || '',
        addressType: addr?.addressType || '',
        lamdmark: addr?.lamdmark || '',
      });
      setPhone(addr?.mobile ? String(addr?.mobile) : '');
      setAddressType(addr?.addressType || '');
    });
  };

  return (
    <>
      <form action="" className="p-8 py-3 pb-8 px-4 " onSubmit={handleSubmit}>
        <div className="col w-[100%] mb-4">
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

        <div className="col w-[100%]  mb-4">
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

        <div className="col w-[100%]  mb-4">
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

        <div className="col w-[100%]  mb-4">
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

        <div className="col w-[100%]  mb-4">
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

        <div className="col w-[100%]  mb-4">
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

        <div className="col w-[100%]  mb-4">
          <TextField
            className="w-full"
            label="Landmark"
            variant="outlined"
            size="small"
            name="lamdmark"
            value={formFields.lamdmark}
            onChange={onChangeInput}
          />
        </div>

        <div className="flex  gap-5 pb-5 flex-col">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">Address Type</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              className="flex items-center gap-5"
              value={addressType}
              onChange={handleChangeAddressType}
            >
              <FormControlLabel value="Home" control={<Radio />} label="Home" />
              <FormControlLabel value="Office" control={<Radio />} label="Office" />
            </RadioGroup>
          </FormControl>
        </div>

        <div className="flex items-center gap-5">
          <Button type="submit" className="bg-org btn-lg w-full flex gap-2 items-center">
            {isLoading === true ? <CircularProgress color="inherit" /> : 'Save'}
          </Button>
          {/* 
          <Button
            className="bg-org btn-border btn-lg w-full flex gap-2 items-center"
            onClick={handleClose}
          >
            Cancel
          </Button> */}
        </div>
      </form>
    </>
  );
};

export default AddAress;
