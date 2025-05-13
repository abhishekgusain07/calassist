import React, { useState, useRef, ChangeEvent, FormEvent, KeyboardEvent, CSSProperties, FC } from 'react';

// SVG Prop Types
interface SVGIconProps extends React.SVGProps<SVGSVGElement> {
  // You can add specific props for your SVGs if needed,
  // but React.SVGProps<SVGSVGElement> covers common ones like className.
}

// SVG Components with TypeScript
const ChevronDownIcon: FC<SVGIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m6 9 6 6 6-6"></path>
  </svg>
);

const PaperclipIcon: FC<SVGIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M13.234 20.252 21 12.3"></path>
    <path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"></path>
  </svg>
);

const ArrowUpIcon: FC<SVGIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m5 12 7-7 7 7"></path>
    <path d="M12 19V5"></path>
  </svg>
);

// Props interface for AIChatInput
interface AIChatInputProps {
  onSendMessage: (message: string) => void;
  onScrollToBottom: () => void;
  currentModel?: string;
  onModelSelect?: () => void;
  placeholder?: string;
  isLoading?: boolean;
  isAttachmentDisabled?: boolean;
  attachmentDisabledReason?: string;
  showUpgradeProText?: boolean;
}

const AIChatInput: FC<AIChatInputProps> = ({
  onSendMessage,
  onScrollToBottom,
  currentModel = "GPT-4o-mini",
  onModelSelect,
  placeholder = "Type your message here...",
  isLoading = false,
  isAttachmentDisabled = true,
  attachmentDisabledReason = "Attaching files is a subscriber-only feature",
  showUpgradeProText = true,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    // Basic auto-resize textarea functionality (optional)
    // if (textareaRef.current) {
    //   textareaRef.current.style.height = 'auto';
    //   textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    // }
  };

  const performSubmit = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      // Optionally reset textarea height if it was auto-resizing
      // if (textareaRef.current) {
      //   textareaRef.current.style.height = '48px';
      // }
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    performSubmit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      performSubmit();
    }
  };

  // Inline styles from the HTML structure with CSSProperties type
  const chatInputContainerStyle = {
    style: {
      '--gradientBorder-gradient': 'linear-gradient(180deg, var(--min), var(--max), var(--min)), linear-gradient(15deg, var(--min) 50%, var(--max))',
      '--start': '#000000e0', // Example values, these CSS variables should be defined in your global CSS 
      '--opacity': '1',
    } as CSSProperties
  };

  const formStyle: CSSProperties = {
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 80px 50px 0px, rgba(0, 0, 0, 0.07) 0px 50px 30px 0px, rgba(0, 0, 0, 0.06) 0px 30px 15px 0px, rgba(0, 0, 0, 0.04) 0px 15px 8px, rgba(0, 0, 0, 0.04) 0px 6px 4px, rgba(0, 0, 0, 0.02) 0px 2px 2px',
  };

  const textareaStyle: CSSProperties = {
    height: '48px', // Original HTML had height: 48px !important.
                     // !important isn't directly supported in React inline styles.
  };

  return (
    <div className="pointer-events-none absolute bottom-0 z-10 w-full px-2">
      <div className="relative mx-auto flex w-full max-w-3xl flex-col text-center">
        <div className="flex justify-center pb-4">
          <button
            onClick={onScrollToBottom}
            className="justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 disabled:cursor-not-allowed disabled:hover:bg-secondary/50 h-8 px-3 text-xs pointer-events-auto flex items-center gap-2 rounded-full border border-secondary/40 bg-[--chat-overlay] text-secondary-foreground/70 backdrop-blur-xl hover:bg-secondary"
            type="button" // Explicitly type buttons
          >
            <span className="pb-0.5">Scroll to bottom</span>
            <ChevronDownIcon className="lucide lucide-chevron-down -mr-1 h-4 w-4" />
          </button>
        </div>

        <div className="pointer-events-none">
          {showUpgradeProText && (
            <div className="pointer-events-auto mx-auto w-fit">
              <p id="radix-:rc:" className="text-sm text-muted-foreground sr-only">
                Upgrade to Pro
              </p>
            </div>
          )}
          <div className="pointer-events-auto">
            <div
              className="border-reflect relative rounded-t-[20px] bg-[--chat-input-background] p-2 pb-0 backdrop-blur-lg ![--c:--chat-input-gradient]"
              style={chatInputContainerStyle.style}
            >
              <form
                onSubmit={handleSubmit}
                className="relative flex w-full flex-col items-stretch gap-2 rounded-t-xl border border-b-0 border-white/70 bg-[--chat-input-background] px-3 py-3 text-secondary-foreground outline outline-8 outline-[hsl(var(--chat-input-gradient)/0.5)] max-sm:pb-6 sm:max-w-3xl dark:border-[hsl(0,0%,83%)]/[0.04] dark:bg-secondary/[0.045] dark:outline-chat-background/40"
                style={formStyle}
              >
                <div className="flex flex-grow flex-col">
                  <div className="flex flex-grow flex-row items-start">
                    <textarea
                      ref={textareaRef}
                      name="input"
                      id="chat-input"
                      placeholder={placeholder}
                      className="w-full resize-none bg-transparent text-base leading-6 text-foreground outline-none placeholder:text-secondary-foreground/60 disabled:opacity-0"
                      aria-label="Message input"
                      aria-describedby="chat-input-description"
                      autoComplete="off"
                      style={textareaStyle}
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                    />
                    <div id="chat-input-description" className="sr-only">
                      Press Enter to send, Shift + Enter for new line
                    </div>
                  </div>

                  <div className="-mb-px mt-2 flex w-full flex-row-reverse justify-between">
                    <div
                      className="-mr-0.5 -mt-0.5 flex items-center justify-center gap-2"
                      aria-label="Message actions"
                    >
                      <button
                        className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 disabled:cursor-not-allowed hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 rounded-md text-xs gap-2 px-2 py-1.5 text-muted-foreground size-9"
                        aria-label={isAttachmentDisabled ? attachmentDisabledReason : "Attach files"}
                        type="button"
                        aria-haspopup="dialog"
                        aria-expanded="false"
                        aria-controls="radix-:rd:"
                        data-state="closed"
                        disabled={isAttachmentDisabled || isLoading}
                        // onClick={() => { /* Implement attachment dialog logic */ }}
                      >
                        <PaperclipIcon className="lucide lucide-paperclip h-4 w-4" />
                      </button>
                      <button
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 disabled:cursor-not-allowed font-semibold bg-[rgb(162,59,103)] dark:bg-primary/20 dark:hover:bg-pink-800/70 shadow border-reflect button-reflect hover:bg-[#d56698] active:bg-[rgb(162,59,103)] dark:active:bg-pink-800/40 disabled:hover:bg-[rgb(162,59,103)] disabled:active:bg-[rgb(162,59,103)] disabled:dark:hover:bg-primary/20 disabled:dark:active:bg-primary/20 h-9 w-9 relative rounded-lg p-2 text-pink-50"
                        type="submit"
                        disabled={!inputValue.trim() || isLoading}
                        aria-label={inputValue.trim() ? "Send message" : "Message requires text"}
                        data-state="closed"
                      >
                        <ArrowUpIcon className="lucide lucide-arrow-up !size-5" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 md:flex-row md:items-center">
                      <div className="ml-[-7px] flex items-center gap-1">
                        <button
                          className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 disabled:cursor-not-allowed hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 rounded-md text-xs h-auto gap-2 px-2 py-1.5 -mb-2 text-muted-foreground"
                          type="button"
                          id="radix-:rf:"
                          aria-haspopup="menu"
                          aria-expanded="false"
                          data-state="closed"
                          onClick={onModelSelect}
                          disabled={isLoading}
                        >
                          <span className="text-sm font-medium">{currentModel}</span>
                          <ChevronDownIcon className="lucide lucide-chevron-down h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatInput;