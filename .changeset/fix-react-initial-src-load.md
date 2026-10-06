---
'@lottiefiles/dotlottie-react': patch
---

Avoid loading the initial `src` twice when the React player is mounted. Both the regular and worker players now rely on their constructor to load the first animation, while later `src` changes still call `load`.
