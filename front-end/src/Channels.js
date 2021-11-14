/** @jsxImportSource @emotion/react */
import { useState /*useEffect*/ } from "react";
//import axios from "axios";
// Layout
import { Link } from "@mui/material";
const chann = [
  {
    name: "channel1",
    id: 1
  },
  {
    name: "channel2",
    id: 2
  },
  {
    name: "channel3",
    id: 3
  }
];
const styles = {
  root: {
    minWidth: "200px"
  },
  channel: {
    padding: ".2rem .5rem",
    whiteSpace: "nowrap"
  }
};

export default function Channels({ onChannel }) {
<<<<<<< HEAD
	const [channels /*setChannels*/] = useState(chann);
	// useEffect( () => {
	//   const fetch = async () => {
	//     const {data: channels} = await axios.get('http://localhost:3001/channels')
	//     setChannels(channels)
	//   }
	//   fetch()
	// }, [])
	return (
		<ul style={styles.root}>
			{channels.map((channel, i) => (
				<li key={i} css={styles.channel}>
					<Link
						href="#"
						onClick={(e) => {
							e.preventDefault();
							onChannel(channel);
						}}
					>
						{channel.name}
					</Link>
				</li>
			))}
		</ul>
	);
=======
  const [channels, setChannels] = useState(chann);
  // useEffect( () => {
  //   const fetch = async () => {
  //     const {data: channels} = await axios.get('http://localhost:3001/channels')
  //     setChannels(channels)
  //   }
  //   fetch()
  // }, [])
  return (
    <ul style={styles.root}>
      {channels.map((channel, i) => (
        <li key={i} css={styles.channel}>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onChannel(channel);
            }}
          >
            {channel.name}
          </Link>
        </li>
      ))}
    </ul>
  );
>>>>>>> origin/matt-develop
}