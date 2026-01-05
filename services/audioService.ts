const audioCache: { [src: string]: HTMLAudioElement } = {};
const synth = window.speechSynthesis;
let currentUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Plays a sound effect from a given source URL.
 * Caches the Audio object for performance.
 * @param src The path to the sound file.
 */
export function playSound(src: string): void {
    try {
        let audio = audioCache[src];
        if (!audio) {
            // All sound files must be placed in the /public directory.
            audio = new Audio(src);
            audioCache[src] = audio;
        }
        audio.currentTime = 0; // Rewind to start
        audio.play().catch(error => {
            if (error.name === 'NotAllowedError') {
                // Autoplay was prevented. This is a common browser policy.
                // We can ignore this error silently as it's not critical.
                return;
            }
            // Check for specific media loading errors. These are often due to missing files.
            const errorMessage = (error.message || '').toLowerCase();
            if (error instanceof DOMException && errorMessage.includes('supported source')) {
                // This is a more helpful warning for the developer.
                console.warn(`Slangbot Audio Warning: Could not play sound from '${src}'. This usually means the file is missing or in an unsupported format. Please ensure all sound files are present in the '/public/assets/sounds/' directory and are a common web format like .mp3, .wav, or .ogg.`);
            } else {
                // Log other unexpected playback errors.
                console.error(`Audio playback error for ${src}:`, error);
            }
        });
    } catch (error) {
        console.error(`Error initializing audio for ${src}:`, error);
    }
}

/**
 * Speaks a given text string using the browser's TTS engine.
 * @param text The string to speak.
 * @param onEnd A callback function to execute when speech finishes.
 */
export function speak(text: string, onEnd: () => void): void {
    if (synth.speaking) {
        synth.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
        currentUtterance = null;
        onEnd();
    };
    utterance.onerror = (event) => {
        console.error('SpeechSynthesis Error', event);
        currentUtterance = null;
        onEnd();
    };
    currentUtterance = utterance;
    synth.speak(utterance);
}

/**
 * Stops any currently speaking utterance.
 */
export function stopSpeaking(): void {
    if (synth.speaking) {
        synth.cancel();
    }
}