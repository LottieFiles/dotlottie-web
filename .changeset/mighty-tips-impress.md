---
'@lottiefiles/dotlottie-react': minor
---

**Feature Update: 🎸 Add optional `animationId`, `themeId`, and `themeData` props to `DotLottieReact` component**

We are excited to introduce new optional props to the `DotLottieReact` component: `animationId`, `themeId`, and `themeData`.

**New Features:**

* **`animationId`**: Allows you to specify and render a particular animation from a `.lottie` file containing multiple animations.
* **`themeId`**: Enables the application of a particular theme from the loaded `.lottie` file to the currently active animation.
* **`themeData`**: Allows you to pass custom theme data to the currently active animation.

**Usage Example:**

```jsx
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React, { useState, useEffect } from 'react';

const App = () => {
    const [dotLottie, setDotLottie] = useState(null);
    const [animations, setAnimations] = useState([]);
    const [themes, setThemes] = useState([]);
    const [currentThemeId, setCurrentThemeId] = useState('');
    const [currentAnimationId, setCurrentAnimationId] = useState('');

    useEffect(() => {
        const onLoad = () => {
            if (dotLottie) {
                setAnimations(dotLottie.manifest.animations || []);
                setThemes(dotLottie.manifest.themes || []);
                setCurrentAnimationId(dotLottie.activeAnimationId);
                setCurrentThemeId(dotLottie.activeThemeId);
            }
        };

        dotLottie?.addEventListener('load', onLoad);

        return () => {
            dotLottie?.removeEventListener('load', onLoad);
        };
    }, [dotLottie]);

    return (
        <div>
            <DotLottieReact dotLottieRefCallback={setDotLottie} animationId={currentAnimationId} />
            <label>Theme:</label>
            {currentThemeId && (
                <select value={currentThemeId} onChange={(e) => setCurrentThemeId(e.target.value)}>
                    {themes.map((theme) => (
                        <option key={theme.id} value={theme.id}>{theme.id}</option>
                    ))}
                </select>
            )}
            <label>Animation:</label>
            {currentAnimationId && (
                <select value={currentAnimationId} onChange={(e) => setCurrentAnimationId(e.target.value)}>
                    {animations.map((animation) => (
                        <option key={animation.id} value={animation.id}>{animation.id}</option>
                    ))}
                </select>
            )}
        </div>
    );
};
```
