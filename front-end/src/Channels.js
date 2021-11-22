/** @jsxImportSource @emotion/react */
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
// Layout
import { Link as RouterLink } from 'react-router-dom';
import { Link, IconButton } from '@mui/material';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
// Local
import Context from './Context';
import { useNavigate } from 'react-router-dom';
import Discussions from './Discussions';

const styles = {
  root: {
    minWidth: '200px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    backgroundColor: 'white'
  },
  list: {
    overflow: 'auto'
  },
  channel: {
    padding: '1.2rem',
    whiteSpace: 'nowrap',
    ':hover': {
      backgroundColor: 'lightgrey'
    }
  }
};

const ChannelComponent = ({ i, channel, deleteChannel }) => {
  const [isShown, setIsShown] = useState(false);
  const { oauth, channels, setChannels, currentChannel, setCurrentChannel } =
    useContext(Context);
  const navigate = useNavigate();
  return (
    <li
      key={i}
      css={styles.channel}
      onMouseEnter={(e) => {
        setIsShown(true);
        setCurrentChannel(channel);
      }}
      onMouseLeave={(e) => setIsShown(false)}
      onClick={(e) => {
        e.preventDefault();
        navigate(`/channels/${channel.id}`);
      }}
    >
      <Link
        sx={{ textDecoration: 'none', color: 'black' }}
        href={`/channels/${channel.id}`}
      >
        {channel.name}
      </Link>
      {isShown && (
        <IconButton
          style={{ float: 'right', margin: '-15px' }}
          color='info'
          onClick={() => deleteChannel(channel)}
        >
          <RemoveOutlinedIcon />
        </IconButton>
      )}
    </li>
  );
};

export default function Channels() {
  const { oauth, channels, setChannels } = useContext(Context);
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: channels } = await axios.get(
          'http://localhost:3001/channels',
          {
            headers: {
              Authorization: `Bearer ${oauth.access_token}`
            }
          }
        );
        setChannels(channels);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [oauth, setChannels]);

  const fetchChannels = async () => {
    const { data: channels } = await axios.get(
      'http://localhost:3001/channels',
      {
        headers: {
          Authorization: `Bearer ${oauth.access_token}`
        }
      }
    );
    setChannels(channels);
  };

  const deleteChannel = async (channel) => {
    const config = {
      headers: {
        Authorization: `Bearer ${oauth.access_token}`
      },
      data: {
        name: channel.name,
        id: channel.id
      }
    };
    const { data: channels } = await axios.delete(
      `http://localhost:3001/channels/${channel.id}`,
      { config }
    );

    fetchChannels(channels);
  };

  return (
    <div css={styles.root}>
      <Discussions />
      <ul css={styles.list}>
        {/* <li css={styles.channel}>
          <Link to='/channels' component={RouterLink}>
            Welcome
          </Link>
        </li> */}
        {channels.map((channel, i) => (
          <ChannelComponent
            i={i}
            channel={channel}
            deleteChannel={deleteChannel}
          />
        ))}
      </ul>
    </div>
  );
}
