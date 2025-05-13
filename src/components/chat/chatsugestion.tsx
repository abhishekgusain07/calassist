// ChatSuggestions.tsx
import React, { useState } from 'react';
import { CodeIcon, GraduationCapIcon, NewspaperIcon, SparklesIcon } from '../icons';


interface SuggestionButtonProps {
  icon: React.ElementType;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const SuggestionButton: React.FC<SuggestionButtonProps> = ({ icon: Icon, label, isSelected, onClick }) => {
  return (
    <button
      className="justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 disabled:cursor-not-allowed bg-primary text-primary-foreground shadow hover:bg-pink-600/90 disabled:hover:bg-primary h-9 flex items-center gap-1 rounded-xl px-5 py-2 font-semibold outline-1 outline-secondary/70 backdrop-blur-xl data-[selected=false]:bg-secondary/30 data-[selected=false]:text-secondary-foreground/90 data-[selected=false]:outline data-[selected=false]:hover:bg-secondary max-sm:size-16 max-sm:flex-col sm:gap-2 sm:rounded-full"
      data-selected={isSelected}
      onClick={onClick}
      type="button" // Good practice for buttons not submitting forms
    >
      <Icon className="lucide max-sm:block" /> {/* Applied general lucide class and max-sm:block as per original */}
      <div>{label}</div>
    </button>
  );
};

interface QuestionButtonProps {
  question: string;
  onClick: (question: string) => void;
}

const QuestionButton: React.FC<QuestionButtonProps> = ({ question, onClick }) => {
  return (
    <div className="flex items-start gap-2 border-t border-secondary/40 py-1 first:border-none">
      <button
        className="w-full rounded-md py-2 text-left text-secondary-foreground hover:bg-secondary/50 sm:px-3"
        onClick={() => onClick(question)}
        type="button"
      >
        <span>{question}</span>
      </button>
    </div>
  );
};

interface ChatSuggestionsProps {
  onSuggestionClick?: (suggestion: string) => void;
  onQuestionClick?: (question: string) => void;
}

const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({
  onSuggestionClick = (suggestion) => console.log('Suggestion clicked:', suggestion),
  onQuestionClick = (question) => console.log('Question clicked:', question),
}) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  const suggestions = [
    { id: 'create', label: 'Create', icon: SparklesIcon },
    { id: 'explore', label: 'Explore', icon: NewspaperIcon },
    { id: 'code', label: 'Code', icon: CodeIcon },
    { id: 'learn', label: 'Learn', icon: GraduationCapIcon },
  ];

  const questions = [
    'How does AI work?',
    'Are black holes real?',
    'How many Rs are in the word "strawberry"?',
    'What is the meaning of life?',
  ];

  const handleSuggestionClick = (label: string) => {
    setSelectedSuggestion(label);
    onSuggestionClick(label);
  };

  return (
    <div
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
      className="mx-auto flex w-full max-w-3xl flex-col space-y-12 px-4 pb-10 pt-safe-offset-10"
    >
      <div className="flex h-[calc(100vh-20rem)] items-start justify-center">
        <div className="w-full space-y-6 px-2 pt-[calc(max(15vh,2.5rem))] duration-300 animate-in fade-in-50 zoom-in-95 sm:px-8">
          <h2 className="text-3xl font-semibold">How can I help you?</h2>
          <div className="flex flex-row flex-wrap gap-2.5 text-sm max-sm:justify-evenly">
            {suggestions.map((suggestion) => (
              <SuggestionButton
                key={suggestion.id}
                icon={suggestion.icon}
                label={suggestion.label}
                isSelected={selectedSuggestion === suggestion.label}
                onClick={() => handleSuggestionClick(suggestion.label)}
              />
            ))}
          </div>
          <div className="flex flex-col text-foreground">
            {questions.map((question, index) => (
              <QuestionButton
                key={index}
                question={question}
                onClick={onQuestionClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSuggestions;