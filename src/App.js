import React from 'react';
import './styles/App.scss';
import logo from './images/vetiq.svg';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import DogCSS from './components/DogCSS';
import { Plugins } from '@capacitor/core';

export default function App() {
  const [prompt, setPrompt] = React.useState('');
  const [response, setResponse] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [talking, setTalking] = React.useState(false);
  const [helpContent, setHelpContent] = React.useState('?');

  /*
  React.useEffect(() => {
    if (talking) {
      console.log('currently talking');
    } else {
      console.log('NOT currently talking');
    }
  }, [talking]);
  */

  const { VetIqPlugin } = Plugins;

  const makePurchase = async () => {
    try {
      console.log('VetIqPlugin: ', VetIqPlugin);

      const result = await VetIqPlugin.makePurchase();
      console.log('Purchase successful:', result);
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  // sending our prompt to the backend!
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading && prompt.trim() !== '') {
      setResponse('');
      setLoading(true);

      // open a new eventsource, at our self-hosted chatgpt-querying backend api point..
      const sse = new EventSource(
        `${process.env.REACT_APP_BACKEND_URL}?prompt=${prompt}`
      );

      // if we get a message (chunk/token of the ChatGPT response) sent, start showing it..
      sse.addEventListener('message', (res) => {
        let updateMsg = JSON.parse(res.data)['text'];
        if (updateMsg !== '[[DONE]]') {
          // continue adding to response, dog is now talking..
          setTalking(true);
          console.log(`|${updateMsg}|`);
          setResponse((r) => r + updateMsg);
        } else {
          // response is done, dog stops talking, and close the eventsource!
          setTalking(false);
          setLoading(false);
          sse.close(); // very important ...
        }
      });

      // if there's an error, close the connection
      sse.addEventListener('error', (e) => {
        setTalking(false);
        setLoading(false);
        sse.close();
        setResponse(
          'Oops.. I&#39;m having an issue contacting the server! Please try again later.'
        );
        console.log('An error occurred while attempting to connect:', e);
      });
    }
  };

  // so that we can press enter on the textarea to submit our prompt!
  const promptEnter = (e) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      handleSubmit(e);
    }
  };

  // this is a custom const that ensures we always continually scroll to the bottom of the output chat box
  const AlwaysScrollToBottom = () => {
    const elementRef = React.useRef();
    React.useEffect(() =>
      elementRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      })
    );
    return <div ref={elementRef} />;
  };

  return (
    <div className="container">
      <form onSubmit={(e) => handleSubmit(e)}>
        <img src={logo} alt="VetIQ"></img>
        <textarea
          cols="80"
          rows="5"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={promptEnter}
          autoFocus
          placeholder="Describe your pet&#39;s symptoms here"
        />
        <button type="submit">{loading ? 'Thinking...' : 'Diagnose!'}</button>
        <DogCSS talking={talking}></DogCSS>
      </form>

      <span className="reactMarkdown">
        {talking && (
          <div className="scroll-prompt" id="js_scrollPrompt">
            <div className="scroll-prompt-shape"></div>
          </div>
        )}
        <ReactMarkdown>{response}</ReactMarkdown>
        {/* <AlwaysScrollToBottom /> */}
      </span>

      <span
        className="helpIcon"
        onMouseOver={() =>
          setHelpContent(
            "This is a BETA - responses aren't medical advice, and could be weird. Working on it!"
          )
        }
        onMouseOut={() => setHelpContent('?')}
        onClick={() => makePurchase()}
      >
        {helpContent}
      </span>
    </div>
  );
}
