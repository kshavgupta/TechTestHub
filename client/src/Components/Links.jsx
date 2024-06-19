import React from 'react';
import { Box, Link, IconButton, Stack, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/X';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" mt={1}>
      {'Copyright © '}
      <Link href="/">TechTestHub&nbsp;</Link>
      {new Date().getFullYear()}
    </Typography>
  );
}

const Links = () => {
  return (
    <Box
        sx={{
        display: 'flex',
        justifyContent: 'space-between',
        pt: { xs: 4, sm: 8 },
        width: '100%',
        borderTop: '1px solid',
        borderColor: 'divider',
        }}
    >
        <div>
            <Link color="text.secondary" href="#">
                Privacy Policy
            </Link>
            <Typography display="inline" sx={{ mx: 0.5, opacity: 0.5 }}>
                &nbsp;•&nbsp;
            </Typography>
            <Link color="text.secondary" href="#">
                Terms of Service
            </Link>
            <Copyright />
        </div>
        <Stack
            direction="row"
            justifyContent="left"
            spacing={1}
            useFlexGap
            sx={{
                color: 'text.secondary',
            }}
        >
        <IconButton
            color="inherit"
            href="https://github.com/kshavgupta/TechTestHub"
            aria-label="GitHub"
            sx={{ alignSelf: 'center' }}
        >
            <FacebookIcon />
        </IconButton>
        <IconButton
            color="inherit"
            href="https://www.linkedin.com/in/ayashika-gupta-a93147231/"
            aria-label="X"
            sx={{ alignSelf: 'center' }}
        >
            <TwitterIcon />
        </IconButton>
        <IconButton
            color="inherit"
            href="https://www.linkedin.com/in/kshavgupta/"
            aria-label="LinkedIn"
            sx={{ alignSelf: 'center' }}
        >
            <LinkedInIcon />
        </IconButton>
        </Stack>
    </Box>
  );
};

export default Links;




