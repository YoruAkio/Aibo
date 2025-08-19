import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Brain, User2, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState, useEffect, useRef } from 'react';
import { createHighlighter } from 'shiki';
import { useTheme } from '@/contexts/theme-context';

// @note shared highlighter instance to avoid recreating on every render
let shikiHighlighter = null;
let highlighterPromise = null;

const getHighlighter = async () => {
  if (shikiHighlighter) {
    return shikiHighlighter;
  }

  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: [
        'javascript',
        'typescript',
        'python',
        'java',
        'cpp',
        'c',
        'rust',
        'go',
        'php',
        'ruby',
        'swift',
        'kotlin',
        'bash',
        'shell',
        'json',
        'xml',
        'html',
        'css',
        'scss',
        'sql',
        'yaml',
        'dockerfile',
        'markdown',
        'text',
      ],
    }).then(highlighter => {
      shikiHighlighter = highlighter;
      return highlighter;
    });
  }

  return highlighterPromise;
};

// @note individual message bubble component
export function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={isUser ? 'self-end max-w-[80%]' : 'self-start max-w-[80%]'}>
      <div className="flex items-start gap-2">
        {!isUser && (
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              <Brain className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        )}
        <div
          className={
            isUser
              ? 'rounded-xl bg-primary text-primary-foreground px-3 py-2 shadow-sm max-w-full overflow-hidden'
              : 'rounded-xl bg-muted text-foreground px-3 py-2 shadow-sm max-w-full overflow-hidden'
          }
        >
          {message.isLoading ? (
            <LoadingIndicator />
          ) : (
            <>
              <MessageContent content={message.content} />
              {!isUser && <MessageCopyButton content={message.content} />}
            </>
          )}
        </div>
        {isUser && (
          <Avatar className="size-8">
            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
              <User2 className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}

// @note loading indicator for ai responses
function LoadingIndicator() {
  return (
    <div className="flex items-center gap-1">
      <div className="flex space-x-1">
        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
      </div>
      <span className="text-xs text-muted-foreground ml-2">
        Aibo sedang mengetik...
      </span>
    </div>
  );
}

// @note copy button component for entire message
function MessageCopyButton({ content }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-2 px-2 py-1 rounded hover:bg-muted/50"
      title={copied ? 'Copied!' : 'Copy message'}
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-green-500" />
          <span className="text-green-500">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

// @note shiki code block component with syntax highlighting
function ShikiCodeBlock({ language, code }) {
  const [highlightedCode, setHighlightedCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const mountedRef = useRef(true);
  const { theme } = useTheme();

  useEffect(() => {
    mountedRef.current = true;

    const highlightCode = async () => {
      try {
        setIsLoading(true);
        setError(false);

        // @note show fallback immediately, then enhance with highlighting
        const fallbackHtml = `<pre style="margin: 0; padding: 1rem; background: hsl(var(--muted)); color: hsl(var(--foreground)); font-size: 0.75rem; line-height: 1.4; font-family: 'JetBrains Mono'; overflow-x: auto; white-space: pre-wrap; border-radius: 0;"><code>${code
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')}</code></pre>`;

        if (mountedRef.current) {
          setHighlightedCode(fallbackHtml);
          setIsLoading(false);
        }

        // @note then enhance with shiki highlighting
        const highlighter = await getHighlighter();

        if (!mountedRef.current) return;

        // @note determine theme based on current theme
        const shikiTheme = theme === 'dark' ? 'github-dark' : 'github-light';

        const highlighted = highlighter.codeToHtml(code, {
          lang: language || 'text',
          theme: shikiTheme,
          transformers: [
            {
              // @note custom transformer to apply theme colors
              root(node) {
                // Initialize properties if not exists
                if (!node.properties) {
                  node.properties = {};
                }
                // Remove default background and apply theme colors
                if (node.properties.style) {
                  node.properties.style = node.properties.style
                    .replace(/background-color:[^;]+;?/g, '')
                    .replace(/color:[^;]+;?/g, '');
                }
                // Add custom CSS variables for theming
                node.properties.style = `${
                  node.properties.style || ''
                } background: transparent; color: hsl(var(--foreground));`;
              },
              pre(node) {
                // Initialize properties if not exists
                if (!node.properties) {
                  node.properties = {};
                }
                // Apply custom styling to pre element
                node.properties.style = `margin: 0; padding: 1rem; background: hsl(var(--muted)); font-size: 0.75rem; line-height: 1.4; font-family: "JetBrains Mono"; overflow-x: auto; border-radius: 0;`;
              },
              code(node) {
                // Initialize properties if not exists
                if (!node.properties) {
                  node.properties = {};
                }
                // Ensure code element uses theme colors
                node.properties.style = `background: transparent; color: hsl(var(--foreground)); font-family: "JetBrains Mono";`;
              },
            },
          ],
        });

        if (mountedRef.current) {
          setHighlightedCode(highlighted);
        }
      } catch (err) {
        console.error('Shiki highlighting error:', err);
        if (mountedRef.current) {
          setError(true);
          // Keep fallback if highlighting fails
          const fallbackHtml = `<pre style="margin: 0; padding: 1rem; background: hsl(var(--muted)); color: hsl(var(--foreground)); font-size: 0.75rem; line-height: 1.4; font-family: 'JetBrains Mono'; overflow-x: auto; white-space: pre-wrap; border-radius: 0;"><code>${code
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')}</code></pre>`;
          setHighlightedCode(fallbackHtml);
          setIsLoading(false);
        }
      }
    };

    highlightCode();

    return () => {
      mountedRef.current = false;
    };
  }, [language, code, theme]);

  if (isLoading && !highlightedCode) {
    return (
      <div className="overflow-x-auto bg-muted">
        <div className="p-4 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
            <span>Preparing code...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="overflow-x-auto bg-muted [&_pre]:!bg-muted [&_code]:!text-foreground"
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
    />
  );
}
// @note copy button component for code blocks
function CodeCopyButton({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-accent"
      title={copied ? 'Copied!' : 'Copy code'}
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-green-500" />
          <span className="text-green-500">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

// @note message content component with markdown support
function MessageContent({ content }) {
  return (
    <div className="text-xs leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // @note custom code block renderer with shiki syntax highlighting
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const codeString = String(children).replace(/\n$/, '');

            if (!inline && language) {
              return (
                <div className="relative my-4 rounded-lg overflow-hidden bg-card border border-border">
                  {/* @note header with language and copy button */}
                  <div className="flex items-center justify-between px-4 py-2 bg-muted/20 border-b border-border">
                    <span className="text-xs font-medium text-muted-foreground">
                      {language}
                    </span>
                    <CodeCopyButton code={codeString} />
                  </div>
                  {/* @note code content with shiki highlighting */}
                  <ShikiCodeBlock language={language} code={codeString} />
                </div>
              );
            }

            // @note handle code blocks without language specification
            if (!inline) {
              return (
                <div className="relative my-4 rounded-lg overflow-hidden bg-card border border-border">
                  {/* @note header with language and copy button */}
                  <div className="flex items-center justify-between px-4 py-2 bg-muted/20 border-b border-border">
                    <span className="text-xs font-medium text-muted-foreground">
                      code
                    </span>
                    <CodeCopyButton code={codeString} />
                  </div>
                  {/* @note code content with shiki highlighting */}
                  <ShikiCodeBlock language="text" code={codeString} />
                </div>
              );
            }

            return (
              <code
                className="bg-muted/50 text-foreground px-1 py-0.5 rounded text-xs font-mono border-0"
                style={{
                  fontFamily: 'JetBrains Mono',
                  fontSize: '0.7rem',
                }}
                {...props}
              >
                {children}
              </code>
            );
          },
          // @note custom paragraph styling
          p({ children }) {
            return <p className="mb-2 last:mb-0">{children}</p>;
          },
          // @note custom heading styling
          h1({ children }) {
            return (
              <h1 className="text-sm font-bold mb-2 mt-3 first:mt-0">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="text-sm font-semibold mb-2 mt-3 first:mt-0">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-xs font-semibold mb-1 mt-2 first:mt-0">
                {children}
              </h3>
            );
          },
          // @note custom list styling
          ul({ children }) {
            return (
              <ul className="space-y-1 ml-4 mb-2 list-disc">{children}</ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="space-y-1 ml-4 mb-2 list-decimal">{children}</ol>
            );
          },
          li({ children }) {
            return <li className="text-xs">{children}</li>;
          },
          // @note custom blockquote styling
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-border pl-3 italic mb-2 bg-muted/50 py-2 text-muted-foreground">
                {children}
              </blockquote>
            );
          },
          // @note custom table styling - matches codeblock header/content colors
          table({ children }) {
            return (
              <div className="overflow-x-auto mb-4 rounded-lg border border-border bg-card">
                <table className="min-w-full text-xs">{children}</table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="bg-muted/20 border-b border-border">
                {children}
              </thead>
            );
          },
          tbody({ children }) {
            return <tbody className="divide-y divide-border">{children}</tbody>;
          },
          tr({ children }) {
            return (
              <tr className="hover:bg-muted/60 transition-colors">
                {children}
              </tr>
            );
          },
          th({ children }) {
            // @note remove code formatting from table headers
            const processChildren = child => {
              if (typeof child === 'object' && child?.props?.children) {
                return child.props.children;
              }
              return child;
            };

            const cleanChildren = Array.isArray(children)
              ? children.map(processChildren)
              : processChildren(children);

            return (
              <th className="px-3 py-2 text-left font-semibold text-muted-foreground border-r border-border last:border-r-0 bg-muted/20">
                <span className="font-mono text-xs font-semibold">
                  {cleanChildren}
                </span>
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-3 py-2 text-foreground border-r border-border last:border-r-0 bg-muted">
                {children}
              </td>
            );
          },
          // @note custom strong/bold styling
          strong({ children }) {
            return <strong className="font-semibold">{children}</strong>;
          },
          // @note custom emphasis/italic styling
          em({ children }) {
            return <em className="italic">{children}</em>;
          },
          // @note custom link styling
          a({ children, href }) {
            return (
              <a
                href={href}
                className="text-primary hover:text-primary/80 hover:underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
