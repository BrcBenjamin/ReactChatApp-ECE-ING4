/** @jsxImportSource @emotion/react */
import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
// Layout
import { useTheme } from '@mui/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
// Markdown
import { unified } from 'unified';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import html from 'rehype-stringify';
// Time
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import updateLocale from 'dayjs/plugin/updateLocale';
//local
import MessageChanger from './MessageChanger';

dayjs.extend(calendar);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  calendar: {
    sameElse: 'DD/MM/YYYY hh:mm A'
  }
});

const useStyles = (theme) => ({
  root: {
    position: 'relative',
    flex: '1 1 auto',
    overflow: 'auto',
    '& ul': {
      margin: 0,
      padding: 0,
      textIndent: 0,
      listStyleType: 0
    }
  },
  message: {
    padding: '.2rem .5rem',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,.05)'
    }
  },
  fabWrapper: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '50px'
  },
  fab: {
    position: 'fixed !important',
    top: '0',
    width: '50px'
  }
});

const LiList = ({ message, i, value, channel, setMessages }) => {
  const [isShown, setIsShown] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const styles = useStyles(useTheme());
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setIsShown(false);
  };
  return (
    <li
      key={i}
      css={styles.message}
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      <p>
        <span>{message.author}</span>
        {' - '}
        <span>{dayjs().calendar(message.creation)}</span>
        {isShown && (
          <MoreVertIcon
            color='info'
            onClick={handleClick}
            style={{ margin: '-10px 0px' }}
          />
        )}
        <MessageChanger
          anchorEl={anchorEl}
          open={open}
          handleClose={handleClose}
          message={message}
          channel={channel}
          setMessages={setMessages}
        />
      </p>
      <div dangerouslySetInnerHTML={{ __html: value }}></div>
    </li>
  );
};

export default forwardRef(
  ({ messages, onScrollDown, channel, setMessages }, ref) => {
    const styles = useStyles(useTheme());
    // Expose the `scroll` action
    useImperativeHandle(ref, () => ({
      scroll: scroll
    }));
    const rootEl = useRef(null);
    const scrollEl = useRef(null);

    const scroll = () => {
      scrollEl.current.scrollIntoView();
    };
    // See https://dev.to/n8tb1t/tracking-scroll-position-with-react-hooks-3bbj
    const throttleTimeout = useRef(null); // react-hooks/exhaustive-deps

    useLayoutEffect(() => {
      const rootNode = rootEl.current; // react-hooks/exhaustive-deps
      const handleScroll = () => {
        if (throttleTimeout.current === null) {
          throttleTimeout.current = setTimeout(() => {
            throttleTimeout.current = null;
            const { scrollTop, offsetHeight, scrollHeight } = rootNode; // react-hooks/exhaustive-deps
            onScrollDown(scrollTop + offsetHeight < scrollHeight);
          }, 200);
        }
      };

      handleScroll();
      rootNode.addEventListener('scroll', handleScroll);
      return () => rootNode.removeEventListener('scroll', handleScroll);
    });
    return (
      <div css={styles.root} ref={rootEl}>
        <ul>
          {messages.map((message, i) => {
            const { value } = unified()
              .use(markdown)
              .use(remark2rehype)
              .use(html)
              .processSync(message.content);
            return (
              <LiList
                message={message}
                i={i}
                value={value}
                channel={channel}
                setMessages={setMessages}
              />
            );
          })}
        </ul>
        <div ref={scrollEl} />
      </div>
    );
  }
);
