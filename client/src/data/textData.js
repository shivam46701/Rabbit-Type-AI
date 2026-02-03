// Text data - all passages and word generation logic
const topicPassages = {
    technology: [
        "Artificial intelligence is transforming the way we live and work. Machine learning algorithms can now recognize images, understand speech, and make complex decisions. As these technologies continue to evolve, they promise to bring unprecedented changes to healthcare, transportation, and education.",
        "The internet has revolutionized global communication and commerce. From social media platforms to e-commerce giants, digital technology has created new opportunities for connection and business. Cloud computing enables companies to scale their operations without massive infrastructure investments.",
        "Programming languages are the building blocks of software development. From Python to JavaScript, each language has unique strengths and use cases. Understanding multiple languages allows developers to choose the right tools for each project and create more efficient solutions.",
        "Cybersecurity has become essential in our interconnected world. Hackers constantly develop new methods to exploit vulnerabilities, while security experts work to protect sensitive data. Strong passwords, encryption, and regular updates are fundamental to staying safe online.",
        "Smartphones have become extensions of ourselves, containing our photos, messages, and memories. These powerful devices connect us to information and people around the globe. Mobile app development continues to grow as our reliance on these pocket computers increases."
    ],
    science: [
        "The universe contains billions of galaxies, each with millions or billions of stars. Our solar system orbits in the Milky Way, a spiral galaxy approximately one hundred thousand light-years in diameter. Scientists continue to discover new planets and cosmic phenomena.",
        "Climate change represents one of the greatest challenges facing humanity today. Rising temperatures are affecting ecosystems worldwide, causing sea levels to rise and weather patterns to shift. Scientists work tirelessly to understand and address these complex environmental changes.",
        "The human brain contains approximately eighty-six billion neurons, each connecting to thousands of others. This vast network enables consciousness, memory, and creativity. Neuroscientists are still discovering how these connections create our thoughts and experiences.",
        "DNA contains the genetic instructions for all living organisms. The double helix structure was discovered in nineteen fifty-three and revolutionized our understanding of life. Gene editing technologies now allow scientists to modify genetic code with unprecedented precision.",
        "Quantum physics describes the strange behavior of particles at the smallest scales. Particles can exist in multiple states simultaneously and become entangled across vast distances. These principles are being harnessed to develop quantum computers of immense power."
    ],
    literature: [
        "Great literature has the power to transport readers to different worlds and perspectives. Through carefully crafted prose, authors explore the depths of human emotion and experience. Classic novels continue to resonate with readers across generations and cultures.",
        "Poetry distills language into its most concentrated form, using rhythm and imagery to evoke powerful emotions. From ancient epics to modern free verse, poets have always sought to capture the essence of human experience in carefully chosen words.",
        "The art of storytelling has been central to human culture since ancient times. Whether passed down through oral traditions or written in books, stories help us make sense of our world and understand our place within it.",
        "Shakespeare crafted plays that continue to captivate audiences centuries later. His exploration of love, power, and human nature transcends time and culture. The Bard's works have influenced countless writers and artists throughout history.",
        "Fiction allows us to experience lives different from our own. Through characters and plots, we develop empathy and understanding. Good stories change the way we see ourselves and the world around us."
    ],
    business: [
        "Successful entrepreneurs understand that innovation requires both creativity and persistence. Building a startup involves identifying market opportunities, developing solutions, and adapting to challenges. The most successful companies focus on solving real problems for their customers.",
        "Financial literacy is essential for personal and professional success. Understanding concepts like compound interest, diversification, and risk management helps individuals make better decisions about saving, investing, and spending their money wisely.",
        "Leadership involves more than simply giving orders or managing tasks. Effective leaders inspire their teams, communicate clearly, and create environments where creativity and collaboration can flourish. They understand that success comes from empowering others.",
        "Marketing strategies have evolved dramatically in the digital age. Social media, content creation, and data analytics now drive customer engagement. Brands must tell authentic stories that resonate with their target audiences.",
        "Remote work has transformed how businesses operate worldwide. Video conferencing and collaboration tools enable teams to work from anywhere. Companies are reimagining office spaces and work culture for a more flexible future."
    ],
    programming: [
        "Clean code is essential for maintainable software projects. Writing readable functions, using meaningful variable names, and following consistent patterns helps teams collaborate effectively. Good code should be easy to understand and modify.",
        "Version control systems like Git enable developers to track changes and collaborate on projects efficiently. Branching strategies allow teams to work on features independently before merging their code. Understanding these tools is essential for modern software development.",
        "Testing is a crucial part of the software development process. Unit tests verify individual components work correctly, while integration tests ensure different parts work together. Automated testing helps catch bugs early and maintains code quality over time.",
        "Algorithms are step-by-step procedures for solving problems. Understanding sorting, searching, and data structures is fundamental to computer science. Efficient algorithms can dramatically improve application performance.",
        "APIs allow different software systems to communicate with each other. Web services enable applications to share data and functionality. REST and GraphQL are popular approaches for building modern APIs."
    ],
    philosophy: [
        "Philosophy asks fundamental questions about existence, knowledge, and morality. From ancient Greek thinkers to modern philosophers, these inquiries shape how we understand ourselves and our place in the universe.",
        "Ethics examines what it means to live a good life and make moral decisions. Different philosophical traditions offer varying perspectives on virtue, duty, and consequences. These ideas continue to influence law, politics, and personal choices.",
        "The nature of consciousness remains one of philosophy's greatest mysteries. How does subjective experience arise from physical matter? This hard problem continues to puzzle philosophers and scientists alike.",
        "Free will debates whether our choices are truly our own or determined by prior causes. This question has implications for personal responsibility, criminal justice, and understanding human behavior.",
        "Existentialists emphasize individual freedom and the responsibility to create meaning in life. In a universe without inherent purpose, we must define our own values and authentic existence."
    ],
    history: [
        "Ancient civilizations developed writing, agriculture, and the foundations of modern society. From Mesopotamia to Egypt, Rome to China, these cultures left lasting influences on art, government, and human knowledge.",
        "The Renaissance marked a rebirth of classical learning and artistic achievement in Europe. This period saw revolutionary advances in science, art, and philosophy that shaped the modern world.",
        "Industrial revolutions transformed how goods were produced and how people lived. Factories replaced workshops, cities grew rapidly, and new social classes emerged. These changes continue to echo in our technological society.",
        "World wars reshaped the political boundaries and power structures of the twentieth century. Millions of lives were lost, empires fell, and new nations emerged. The lessons of these conflicts still inform international relations.",
        "Social movements have fought for civil rights, gender equality, and human dignity throughout history. Ordinary people organizing together have achieved extraordinary change. These struggles continue around the world today."
    ],
    sports: [
        "Athletes dedicate years of training to master their sports and achieve peak performance. Physical conditioning, mental focus, and tactical understanding combine to create champions. The pursuit of excellence drives competitors to push human limits.",
        "Team sports teach valuable lessons about cooperation, communication, and shared goals. Players must balance individual abilities with collective strategy. The best teams develop chemistry that transcends individual talent.",
        "The Olympics bring together athletes from around the world in peaceful competition. This ancient tradition celebrates human achievement and international friendship. Each Games creates new heroes and unforgettable moments.",
        "Sports technology continues to advance performance and safety. From advanced materials to motion analysis, science helps athletes train smarter and compete better. Video review systems have changed how games are officiated.",
        "Fans form passionate communities around their favorite teams and athletes. Sports create shared experiences and cultural identities. The emotional investment in competition brings people together across differences."
    ],
    general: [
        "Practice makes progress in any skill you wish to develop. Regular effort compounds over time, leading to significant improvement. Whether learning a language, instrument, or sport, consistent practice is the key to mastery.",
        "The quick brown fox jumps over the lazy dog near the river bank. This sentence contains every letter of the alphabet and is commonly used for typing practice. Mastering it helps develop muscle memory for all keys.",
        "Coffee culture has spread worldwide, with cafes becoming important social spaces. From espresso in Italy to pour-over in specialty shops, each brewing method creates unique flavors. Many people start their day with this beloved beverage.",
        "Travel expands our understanding of different cultures and perspectives. Experiencing new places, foods, and customs enriches our lives. Even short trips can provide fresh insights and lasting memories.",
        "Music has the power to evoke emotions and create connections between people. From classical symphonies to modern pop, different genres speak to different experiences. Learning an instrument opens new worlds of expression."
    ]
};

const commonWords = [
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
    'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
    'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
    'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
    'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
    'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
    'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
    'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
    'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
    'very', 'best', 'never', 'still', 'should', 'let', 'long', 'learn', 'practice', 'type',
    'keyboard', 'finger', 'speed', 'accurate', 'word', 'sentence', 'paragraph', 'text', 'write', 'read',
    'fast', 'slow', 'better', 'improve', 'skill', 'train', 'focus', 'try', 'test', 'score',
    'quick', 'jump', 'move', 'flow', 'rhythm', 'smooth', 'steady', 'calm', 'clear', 'sharp',
    'bright', 'dark', 'light', 'soft', 'hard', 'warm', 'cool', 'fresh', 'clean', 'pure'
];

const punctuationMarks = ['.', ',', '!', '?', ';', ':'];
const numberWords = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

// Generate random words
export function generateRandomWords(count, includePunctuation = false, includeNumbers = false) {
    const words = [];

    for (let i = 0; i < count; i++) {
        let word = commonWords[Math.floor(Math.random() * commonWords.length)];

        if (includeNumbers && Math.random() < 0.15) {
            const num = numberWords[Math.floor(Math.random() * numberWords.length)];
            word = Math.random() < 0.5 ? num + word : word + num;
        }

        words.push(word);

        if (includePunctuation && Math.random() < 0.2 && i < count - 1) {
            const punct = punctuationMarks[Math.floor(Math.random() * punctuationMarks.length)];
            words[words.length - 1] = words[words.length - 1] + punct;
        }
    }

    if (includePunctuation && words.length > 0) {
        const lastWord = words[words.length - 1];
        if (!punctuationMarks.some(p => lastWord.endsWith(p))) {
            words[words.length - 1] = lastWord + '.';
        }
    }

    return words.join(' ');
}

// Get passage by topic
export function getPassageByTopic(topic) {
    const normalizedTopic = topic.toLowerCase().trim();

    for (const [key, passages] of Object.entries(topicPassages)) {
        if (normalizedTopic.includes(key) || key.includes(normalizedTopic)) {
            return passages[Math.floor(Math.random() * passages.length)];
        }
    }

    const keywords = {
        'space': 'science', 'star': 'science', 'planet': 'science',
        'code': 'programming', 'software': 'programming', 'javascript': 'programming', 'python': 'programming',
        'ai': 'technology', 'computer': 'technology', 'robot': 'technology',
        'book': 'literature', 'story': 'literature', 'novel': 'literature',
        'money': 'business', 'startup': 'business', 'company': 'business',
        'life': 'philosophy', 'meaning': 'philosophy',
        'ancient': 'history', 'war': 'history',
        'game': 'sports', 'team': 'sports', 'athlete': 'sports',
        'food': 'general', 'music': 'general', 'travel': 'general'
    };

    for (const [keyword, topicKey] of Object.entries(keywords)) {
        if (normalizedTopic.includes(keyword)) {
            const passages = topicPassages[topicKey];
            return passages[Math.floor(Math.random() * passages.length)];
        }
    }

    const generalPassages = topicPassages.general;
    return generalPassages[Math.floor(Math.random() * generalPassages.length)];
}

// Get random quote
export function getRandomQuote() {
    const allPassages = Object.values(topicPassages).flat();
    return allPassages[Math.floor(Math.random() * allPassages.length)];
}
