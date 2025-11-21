"use client";
import { useRef, useState, MutableRefObject } from "react";

interface FAQItem {
  q: string;
  a: string;
}

interface FaqsCardProps {
  faqsList: FAQItem;
  idx: number;
}

const FaqsCard = ({ faqsList, idx }: FaqsCardProps) => {
  const answerElRef = useRef() as MutableRefObject<HTMLDivElement | null>;
  const [state, setState] = useState(false);
  const [answerH, setAnswerH] = useState("0px");

  const handleOpenAnswer = () => {
    const el = answerElRef.current;
    if (!el) return;

    const answerElH = el.childNodes[0] as HTMLElement;
    setState(!state);
    setAnswerH(`${answerElH.offsetHeight + 20}px`);
  };

  return (
    <div
      className="space-y-3 mt-5 overflow-hidden border-b"
      key={idx}
      onClick={handleOpenAnswer}
    >
      <h4 className="cursor-pointer pb-5 flex items-center justify-between text-lg text-gray-700 font-medium">
        {faqsList.q}
        {state ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        )}
      </h4>

      <div
        ref={answerElRef}
        className="duration-300"
        style={state ? { height: answerH } : { height: "0px" }}
      >
        <div>
          <p className="text-gray-500">{faqsList.a}</p>
        </div>
      </div>
    </div>
  );
};

export default function FAQSection() {
  const faqsList: FAQItem[] = [
    {
      q: "What is Moniq AI used for?",
      a: "Moniq AI helps credit analysts evaluate field submissions using alternative data such as images, text notes, and behavioral indicators to produce fair and explainable credit scoring results.",
    },
    {
      q: "How does the scoring process work?",
      a: "AI extracts measurable insights from collected data, then a hybrid decision support system (WASPAS) converts those insights into structured rankings and recommended decisions.",
    },
    {
      q: "Does Moniq AI require machine learning model training?",
      a: "Only structured business metrics require training. Text and image understanding can use large language models with well-designed prompts without additional training.",
    },
    {
      q: "What data does Moniq AI use?",
      a: "The system can process field photos, observational notes, merchant information, operational details, and other non-financial indicators common in micro and rural lending environments.",
    },
    {
      q: "Is borrower data secure?",
      a: "All processed data is encrypted, and the platform supports secure access control to ensure that sensitive borrower information is protected at every stage.",
    },
  ];

  return (
    <section className="leading-relaxed max-w-screen-xl mt-12 mx-auto px-4 md:px-8">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl text-gray-800 font-semibold">Frequently Asked Questions</h1>
        <p className="text-gray-600 max-w-lg mx-auto text-lg">
          Common questions about how Moniq AI works and how it supports credit assessment.
        </p>
      </div>

      <div className="mt-14 max-w-2xl mx-auto">
        {faqsList.map((item, idx) => (
          <FaqsCard key={idx} idx={idx} faqsList={item} />
        ))}
      </div>
    </section>
  );
}
