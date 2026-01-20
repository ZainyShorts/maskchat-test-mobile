export function generateRandomMixed() {
    // 1. Generate 6-digit random number
    const random6 = Math.floor(100000 + Math.random() * 900000);

    // 2. Get current timestamp
    const timestamp1 = Date.now();

    // 3. Get another timestamp (for example, a few seconds later or a random offset)
    const timestamp2 = Date.now() + Math.floor(Math.random() * 10000); // random offset in ms

    // 4. Combine all as string
    const combined: string = `${random6}${timestamp1}${timestamp2}`;

    // 5. Shuffle the string randomly
    const shuffled: string = combined.split('').sort(() => 0.5 - Math.random()).join('');

    return shuffled;
}
