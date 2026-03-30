import React, { useContext, useState } from 'react';
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

  return (
    <>
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

          <Button
            className="bg-org btn-border btn-lg w-full flex gap-2 items-center"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
};

export default AddAress;
