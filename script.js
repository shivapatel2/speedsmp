// Modal Management
function openModal(episodeId) {
    const modal = document.getElementById(episodeId);
    if (modal) modal.classList.add("open"); // Add "open" class to show the modal
  }
  
  function closeModal(episodeId) {
    const modal = document.getElementById(episodeId);
    const listenButton = document.querySelector(`#${episodeId} .listen-button`);
    const pauseButton = document.querySelector(`#${episodeId} .pause-button`);
    const resumeButton = document.querySelector(`#${episodeId} .resume-button`);
    const textElement = document.getElementById(`${episodeId}-text`);
  
    if (modal) {
      modal.style.animation = "fadeOutModal 0.5s forwards";
      setTimeout(() => {
        modal.classList.remove("open");
        modal.style.animation = "";
      }, 500); // Wait for the animation to complete
    }
  
    // Stop any ongoing speech synthesis
    window.speechSynthesis.cancel();
  
    // Reset buttons and clear text highlights
    resetButtons(listenButton, pauseButton, resumeButton);
    clearHighlight(textElement);
  }
  
  // Speech Synthesis Management
  let speechInstances = {}; // Store speech instances per episode
  
  function startSpeech(textId, episodeId) {
    const textElement = document.getElementById(textId);
    const listenButton = document.querySelector(`#${episodeId} .listen-button`);
    const pauseButton = document.querySelector(`#${episodeId} .pause-button`);
    const resumeButton = document.querySelector(`#${episodeId} .resume-button`);
  
    if (!textElement) {
      console.error(`Element with id "${textId}" not found.`);
      return;
    }
  
    const text = textElement.innerText || textElement.textContent;
  
    // Create a new SpeechSynthesisUtterance instance
    const speechInstance = new SpeechSynthesisUtterance(text);
    speechInstances[episodeId] = speechInstance;
  
    // Configure voice properties
    speechInstance.lang = "en-US";
    speechInstance.pitch = 1;
    speechInstance.rate = 1;
    speechInstance.volume = 1;
  
    // Highlight words as they are spoken
    speechInstance.onboundary = (event) => {
      const currentIndex = event.charIndex;
      highlightText(textElement, currentIndex);
    };
  
    // Handle speech end
    speechInstance.onend = () => {
      resetButtons(listenButton, pauseButton, resumeButton);
      clearHighlight(textElement);
    };
  
    // Stop any ongoing speech and start new speech
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speechInstance);
  
    // Update button visibility
    listenButton.style.display = "none";
    pauseButton.style.display = "inline-block";
    resumeButton.style.display = "none";
  }
  
  function pauseSpeech(episodeId) {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
  
      // Toggle button visibility
      const pauseButton = document.querySelector(`#${episodeId} .pause-button`);
      const resumeButton = document.querySelector(`#${episodeId} .resume-button`);
      pauseButton.style.display = "none";
      resumeButton.style.display = "inline-block";
    }
  }
  
  function resumeSpeech(episodeId) {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
  
      // Toggle button visibility
      const pauseButton = document.querySelector(`#${episodeId} .pause-button`);
      const resumeButton = document.querySelector(`#${episodeId} .resume-button`);
      pauseButton.style.display = "inline-block";
      resumeButton.style.display = "none";
    }
  }
  
  function resetButtons(listenButton, pauseButton, resumeButton) {
    listenButton.style.display = "inline-block"; // Show Listen button
    pauseButton.style.display = "none"; // Hide Pause button
    resumeButton.style.display = "none"; // Hide Resume button
  }
  
  // Function to highlight a word in the text
  function highlightText(element, startIndex) {
    const text = element.innerText || element.textContent;
    const before = text.slice(0, startIndex); // Text before the word
    const word = text.slice(startIndex).split(" ")[0]; // Word to highlight
    const after = text.slice(startIndex + word.length); // Text after the word
  
    // Update inner HTML with the highlighted word styled
    element.innerHTML = `${before}<span class="highlight">${word}</span>${after}`;
  }
  
  // Function to clear highlighting from the text
  function clearHighlight(element) {
    // Replace HTML with the plain text (removes highlighting)
    element.innerHTML = element.innerText || element.textContent;
  }
  
  // Episode Navigation
  const TOTAL_EPISODES = 9; // Total number of episodes
  
  function navigateEpisode(direction, currentEpisode) {
    const nextEpisode =
      currentEpisode < TOTAL_EPISODES ? currentEpisode + 1 : null;
    const prevEpisode = currentEpisode > 1 ? currentEpisode - 1 : null;
  
    const targetEpisode = direction === "next" ? nextEpisode : prevEpisode;
  
    if (targetEpisode) {
      closeModal(`episode${currentEpisode}`);
      setTimeout(() => openModal(`episode${targetEpisode}`), 200); // Short delay for smooth transition
      handleButtonVisibility(targetEpisode);
    }
  }
  
  function handleButtonVisibility(currentEpisode) {
    const prevButton = document.querySelector(
      `#episode${currentEpisode} .prev-episode`
    );
    const nextButton = document.querySelector(
      `#episode${currentEpisode} .next-episode`
    );
  
    if (prevButton) prevButton.disabled = currentEpisode === 1; // Disable if first episode
    if (nextButton) nextButton.disabled = currentEpisode === TOTAL_EPISODES; // Disable if last episode
  }