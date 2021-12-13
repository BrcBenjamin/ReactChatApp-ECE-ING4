/** @jsxImportSource @emotion/react */
import Avatar from '@mui/material/Avatar';
import {useContext, useState, useEffect} from 'react';
import axios from 'axios';
//Layout
import {Modal, Typography, TextField, Box, Button, IconButton} from '@mui/material';
//Local
import Context from './Context';

const styles = {
  box: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'max-content',
    bgcolor: 'white',
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  box2: {
    display: 'flex',
    alignItems: 'center',
    color: 'white'
  },
  boxAvatar: {
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    marginLeft: '150px'
  }
};
export default function AvatarProfil({clickable}) {
  const [open, setOpen] = useState(false);
  const {user, setUser} = useContext(Context);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const testFunction = () => {
    console.log(user);
  };

  const DefaultAvatar = () => {
    //Use the Avatar database after the first modification
    if (user?.img !== '') {
      return <Avatar src={user?.img} />;
    }
    // Set default Avatar to the first letter of the username
    else {
      const str = user?.username.charAt(0);
      return <Avatar sx={{bgcolor: 'grey'}}>{str?.toUpperCase()}</Avatar>;
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let baseURL = '';
      // Make new FileReader
      let reader = new FileReader();
      // Convert the file to base64 text
      reader.readAsDataURL(file);
      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  const handleFileInputChange = async (e) => {
    getBase64(e.target.files[0])
      .then((result) => {
        user.img = result;
        console.log(user);
        axios.put(`http://localhost:3001/users/${user.id}`, user);
        setUser(user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {clickable ? (
        <IconButton
          onClick={() => {
            handleOpen();
            testFunction();
          }}>
          <DefaultAvatar />
        </IconButton>
      ) : (
        <DefaultAvatar />
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'>
        <Box sx={styles.box}>
          <Typography
            color='black'
            id='modal-modal-title'
            variant='h6'
            component='h6'>
            Welcome on your profil !
          </Typography>
          <Box sx={styles.boxAvatar}>
            <DefaultAvatar />
            <input type='file' id='imgAvatar' onChange={handleFileInputChange} />
          </Box>
          <Box sx={styles.box2}>
            <TextField id='UserName' variant='standard' label='set Username' />
          </Box>
          <Box sx={styles.box2}>
            <Typography
              color='black'
              id='modal-modal-title'
              variant='h6'
              component='h6'>
              Username:
            </Typography>
            <TextField id='UserName' variant='standard' sx={{marginLeft: '20px'}} />
          </Box>
          <Button variant='outlined'>Save</Button>
        </Box>
      </Modal>
    </div>
  );
}
