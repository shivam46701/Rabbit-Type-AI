import { useState, useEffect, useRef, useCallback } from 'react';
import { generateRandomWords, getPassageByTopic, getRandomQuote } from '../data/textData';
import './Practice.css';

const TOPICS = ['Technology', 'Science', 'Literature', 'Business', 'Programming', 'Philosophy', 'History', 'Sports'];

const TIME_TO_WORDS = {
    15: 20,
    30: 40,
    60: 80,
    120: 150
};

export default function Practice() {
    const [text, setText] = useState('');
    const [userInput, setUserInput] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [stats, setStats] = useState({ wpm: 0, rawWpm: 0, accuracy: 100, errors: 0 });

    const [includePunctuation, setIncludePunctuation] = useState(false);
    const [includeNumbers, setIncludeNumbers] = useState(false);
    const [testMode, setTestMode] = useState('time');
    const [timeLimit, setTimeLimit] = useState(30);
    const [wordCount, setWordCount] = useState(25);

    const [showAISearch, setShowAISearch] = useState(false);
    const [aiSearchQuery, setAiSearchQuery] = useState('');

    const inputRef = useRef(null);
    const timerRef = useRef(null);
    const aiSearchRef = useRef(null);
    const containerRef = useRef(null);

    // Global keyboard listener
    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            if (showAISearch) return;

            if (e.key === 'Tab') {
                e.preventDefault();
                if (testMode !== 'zen') {
                    fetchText();
                } else {
                    resetTest();
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                resetTest();
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [showAISearch, testMode, includePunctuation, includeNumbers, timeLimit, wordCount]);

    useEffect(() => {
        fetchText();
    }, []);

    useEffect(() => {
        if (testMode !== 'ai' && testMode !== 'zen') {
            fetchText();
        }
        if (testMode === 'zen') {
            setText('');
            resetTest();
        }
    }, [testMode]);

    useEffect(() => {
        if (testMode === 'words') {
            fetchText();
        }
    }, [wordCount, includePunctuation, includeNumbers]);

    useEffect(() => {
        if (testMode === 'time') {
            fetchText();
        }
    }, [timeLimit, includePunctuation, includeNumbers]);

    useEffect(() => {
        if (showAISearch && aiSearchRef.current) {
            aiSearchRef.current.focus();
        }
    }, [showAISearch]);

    useEffect(() => {
        if (!showAISearch && !isFinished) {
            inputRef.current?.focus();
        }
    }, [showAISearch, isFinished, text]);

    const fetchText = useCallback(() => {
        let newText;
        if (testMode === 'quote') {
            newText = getRandomQuote();
        } else {
            const count = testMode === 'time' ? TIME_TO_WORDS[timeLimit] || 50 : wordCount;
            newText = generateRandomWords(count, includePunctuation, includeNumbers);
        }
        setText(newText);
        resetTest();
    }, [testMode, timeLimit, wordCount, includePunctuation, includeNumbers]);

    const fetchAIText = useCallback(() => {
        if (!aiSearchQuery.trim()) return;

        const passage = getPassageByTopic(aiSearchQuery);
        setText(passage);
        setShowAISearch(false);
        setAiSearchQuery('');
        resetTest();
    }, [aiSearchQuery]);

    const resetTest = useCallback(() => {
        setUserInput('');
        setIsActive(false);
        setIsFinished(false);
        setStartTime(null);
        setCurrentTime(0);
        setStats({ wpm: 0, rawWpm: 0, accuracy: 100, errors: 0 });
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setTimeout(() => inputRef.current?.focus(), 10);
    }, []);

    useEffect(() => {
        if (isActive && !isFinished) {
            timerRef.current = setInterval(() => {
                const elapsed = Date.now() - startTime;
                setCurrentTime(elapsed);

                if (testMode === 'time' && elapsed >= timeLimit * 1000) {
                    finishTest();
                }
            }, 100);
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, isFinished, startTime, testMode, timeLimit]);

    const finishTest = () => {
        setIsFinished(true);
        setIsActive(false);
        clearInterval(timerRef.current);
    };

    useEffect(() => {
        if (!isActive || userInput.length === 0) return;

        const timeElapsed = (Date.now() - startTime) / 1000 / 60;

        let correctChars = 0;
        let errors = 0;

        for (let i = 0; i < userInput.length; i++) {
            if (userInput[i] === text[i]) {
                correctChars++;
            } else {
                errors++;
            }
        }

        const rawWpm = Math.round((userInput.length / 5) / timeElapsed) || 0;
        const wpm = Math.round((correctChars / 5) / timeElapsed) || 0;
        const accuracy = userInput.length > 0
            ? Math.round((correctChars / userInput.length) * 100)
            : 100;

        setStats({ wpm, rawWpm, accuracy, errors, correctChars });

        if (testMode !== 'time' && testMode !== 'zen' && userInput.length >= text.length) {
            finishTest();
        }
    }, [userInput, text, isActive, startTime, testMode]);

    const handleInput = (e) => {
        const value = e.target.value;

        if (testMode === 'zen') {
            if (!isActive && value.length === 1) {
                setIsActive(true);
                setStartTime(Date.now());
            }
            setUserInput(value);
            return;
        }

        if (!isActive && value.length === 1) {
            setIsActive(true);
            setStartTime(Date.now());
        }

        if (testMode === 'time' || value.length <= text.length) {
            setUserInput(value);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
        }
    };

    const handleAIKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            fetchAIText();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setShowAISearch(false);
            setAiSearchQuery('');
            inputRef.current?.focus();
        }
    };

    const getTimeDisplay = () => {
        if (testMode === 'time') {
            return Math.max(0, timeLimit - Math.floor(currentTime / 1000));
        }
        return Math.floor(currentTime / 1000);
    };

    const handleAIClick = () => {
        setTestMode('ai');
        setShowAISearch(true);
    };

    const handleContainerClick = () => {
        if (!showAISearch) {
            inputRef.current?.focus();
        }
    };

    const renderText = () => {
        if (testMode === 'zen') {
            return (
                <div className="zen-display">
                    <span className="zen-typed">{userInput}</span>
                    <span className="caret" />
                </div>
            );
        }

        return (
            <>
                {text.split('').map((char, index) => {
                    let className = 'char';

                    if (index < userInput.length) {
                        className += userInput[index] === char ? ' correct' : ' incorrect';
                    } else if (index === userInput.length) {
                        className += ' current';
                    } else {
                        className += ' pending';
                    }

                    return (
                        <span key={index} className={className}>
                            {index === userInput.length && <span className="caret" />}
                            {char}
                        </span>
                    );
                })}
            </>
        );
    };

    return (
        <div className="practice" ref={containerRef} onClick={handleContainerClick}>
            <div className="practice-container">
                <div className="mode-bar">
                    <div className="mode-group">
                        <button
                            className={`mode-btn ${includePunctuation ? 'active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setIncludePunctuation(!includePunctuation); }}
                        >
                            <span className="mode-icon">@</span>
                            punctuation
                        </button>
                        <button
                            className={`mode-btn ${includeNumbers ? 'active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setIncludeNumbers(!includeNumbers); }}
                        >
                            <span className="mode-icon">#</span>
                            numbers
                        </button>
                    </div>

                    <div className="mode-separator" />

                    <div className="mode-group">
                        <button
                            className={`mode-btn ${testMode === 'time' ? 'active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setTestMode('time'); }}
                        >
                            <span className="mode-icon">⏱</span>
                            time
                        </button>
                        <button
                            className={`mode-btn ${testMode === 'words' ? 'active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setTestMode('words'); }}
                        >
                            <span className="mode-icon">A</span>
                            words
                        </button>
                        <button
                            className={`mode-btn ${testMode === 'quote' ? 'active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setTestMode('quote'); }}
                        >
                            <span className="mode-icon">"</span>
                            quote
                        </button>
                        <button
                            className={`mode-btn ${testMode === 'zen' ? 'active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setTestMode('zen'); }}
                        >
                            <span className="mode-icon">◇</span>
                            zen
                        </button>
                    </div>

                    <div className="mode-separator" />

                    <div className="mode-group">
                        <button
                            className={`mode-btn ai-mode ${testMode === 'ai' ? 'active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); handleAIClick(); }}
                        >
                            <span className="mode-icon">✨</span>
                            AI
                        </button>
                    </div>

                    <div className="mode-separator" />

                    <div className="mode-group numbers-group">
                        {testMode === 'time' && [15, 30, 60, 120].map(t => (
                            <button
                                key={t}
                                className={`mode-btn number-btn ${timeLimit === t ? 'active' : ''}`}
                                onClick={(e) => { e.stopPropagation(); setTimeLimit(t); }}
                            >
                                {t}
                            </button>
                        ))}
                        {testMode === 'words' && [10, 25, 50, 100].map(w => (
                            <button
                                key={w}
                                className={`mode-btn number-btn ${wordCount === w ? 'active' : ''}`}
                                onClick={(e) => { e.stopPropagation(); setWordCount(w); }}
                            >
                                {w}
                            </button>
                        ))}
                    </div>
                </div>

                {showAISearch && (
                    <div className="ai-overlay" onClick={() => { setShowAISearch(false); inputRef.current?.focus(); }}>
                        <div className="ai-modal" onClick={e => e.stopPropagation()}>
                            <div className="ai-header">
                                <span>✨</span> Generate text about...
                            </div>
                            <input
                                ref={aiSearchRef}
                                type="text"
                                className="ai-input"
                                placeholder="Enter any topic..."
                                value={aiSearchQuery}
                                onChange={(e) => setAiSearchQuery(e.target.value)}
                                onKeyDown={handleAIKeyDown}
                            />
                            <div className="ai-topics">
                                {TOPICS.map(topic => (
                                    <button
                                        key={topic}
                                        className="ai-topic"
                                        onClick={() => {
                                            setAiSearchQuery(topic);
                                            const passage = getPassageByTopic(topic);
                                            setText(passage);
                                            setShowAISearch(false);
                                            resetTest();
                                        }}
                                    >
                                        {topic}
                                    </button>
                                ))}
                            </div>
                            <div className="ai-hint">Press Enter to generate</div>
                        </div>
                    </div>
                )}

                <div className="stats">
                    <div className="stat main-stat">
                        <span className="stat-num">{stats.wpm}</span>
                        <span className="stat-text">wpm</span>
                    </div>
                    <div className="stat">
                        <span className="stat-num">{stats.accuracy}%</span>
                        <span className="stat-text">acc</span>
                    </div>
                    <div className="stat">
                        <span className="stat-num">{getTimeDisplay()}</span>
                        <span className="stat-text">{testMode === 'time' ? 'sec' : 's'}</span>
                    </div>
                </div>

                <div className={`type-box ${isFinished ? 'finished' : ''} ${testMode === 'zen' ? 'zen' : ''}`}>
                    <div className="text-content">
                        {renderText()}
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={userInput}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        className="hidden-input"
                        autoComplete="off"
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck="false"
                        disabled={isFinished}
                    />
                </div>

                {isFinished && (
                    <div className="results">
                        <div className="results-row">
                            <div className="result-item big">
                                <span className="result-num">{stats.wpm}</span>
                                <span className="result-text">wpm</span>
                            </div>
                            <div className="result-item">
                                <span className="result-num">{stats.accuracy}%</span>
                                <span className="result-text">accuracy</span>
                            </div>
                            <div className="result-item">
                                <span className="result-num">{stats.rawWpm}</span>
                                <span className="result-text">raw</span>
                            </div>
                            <div className="result-item">
                                <span className="result-num">{stats.errors}</span>
                                <span className="result-text">errors</span>
                            </div>
                        </div>
                        <div className="results-hint">
                            Press <kbd>tab</kbd> for next • <kbd>esc</kbd> to retry
                        </div>
                    </div>
                )}

                {!isFinished && (
                    <div className="hint">
                        <kbd>tab</kbd> new text • <kbd>esc</kbd> reset
                    </div>
                )}
            </div>
        </div>
    );
}
