import React from 'react';
import './App.scss';
import logo from './vetiq.svg';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import DogCSS from './components/DogCSS';

export default function App() {
  const [prompt, setPrompt] = React.useState('');
  const [response, setResponse] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [talking, setTalking] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading) {
      setResponse('');
      setLoading(true);

      const sse = new EventSource(
        `${process.env.REACT_APP_BACKEND_URL}?prompt=${prompt}`
      );

      sse.addEventListener('message', (res) => {
        // console.log('res:', JSON.parse(res.data)['text']);
        let updateMsg = JSON.parse(res.data)['text'];
        if (updateMsg !== '[[DONE]]') {
          setTalking(true);
          setResponse((r) => r + updateMsg);
        } else {
          setTalking(false);
          setLoading(false);
          console.log('sse closed');
          sse.close(); // very important ...
        }
      });
    }
  };

  const promptEnter = (e) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      handleSubmit(e);
    }
  };

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
        <button type="submit">Diagnose!</button>
        <DogCSS talking={talking}></DogCSS>
      </form>

      <span className="reactMarkdown">
        <ReactMarkdown>{response}</ReactMarkdown>
        <AlwaysScrollToBottom />
      </span>
    </div>
  );
}
