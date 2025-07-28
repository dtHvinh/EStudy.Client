import { useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Dictaphone = () => {
  const [name, setName] = useState("");

  const commands = [
    {
      command: "set my name to *",
      callback: (name: string) => {
        setName(name);
      },
    },
    {
      command: "my name is *",
      callback: (name: string) => {
        setName(name);
      },
    },
    {
      command: "reset",
      callback: ({ resetTranscript }: { resetTranscript: () => void }) => {
        resetTranscript();
      },
    },
  ];

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition({ commands });

  const startListening = () =>
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div>
      <button onClick={startListening}>Start</button>
      <button onClick={SpeechRecognition.abortListening}>Abort</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>{transcript}</p>
      <p>My name is {name}</p>
    </div>
  );
};
export default Dictaphone;
