import * as React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import AppAppBar from './AppAppBar';
import Welcome from './Welcome';
import Upload from './Upload';
import Testimonials from './Testimonials';
import FAQ from './FAQ';
import Footer from './Footer';

export default function Home({ mode, toggleColorMode }) {
  return (
    <div>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Welcome mode={mode} toggleColorMode={toggleColorMode}/>
      <Box sx={{ bgcolor: 'background.default' }}>
        <Divider />
        <Upload />
        <Divider />
        <Testimonials />
        <Divider />
        <FAQ />
        <Divider />
        <Footer />
      </Box>
    </div>
  );
}