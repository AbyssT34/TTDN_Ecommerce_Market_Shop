import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { IoCloseSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import CategoryCollapse from '../../CategoryCollapse';

const CategoryPanel = (props) => {
  const toggleDrawer = (newOpen) => () => {
    props.setIsopenCategoryPanel(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" className="categoryPanel">
      <h3 className="p-3 text-[16px] font-[500] flex items-center justify-between">
        Shop By Categories{' '}
        <IoCloseSharp onClick={toggleDrawer(false)} className="cursor-pointer text-[20px]" />
      </h3>
      <CategoryCollapse />
    </Box>
  );

  return (
    <div>
      <Drawer open={props.isopenCategoryPanel} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default CategoryPanel;
