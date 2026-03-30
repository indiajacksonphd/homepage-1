document.addEventListener("DOMContentLoaded", () => {
  const emailTrigger = document.getElementById("email-trigger");
  const emailOverlay = document.getElementById("email-overlay");
  const emailCancel = document.getElementById("email-cancel");
  const emailForm = document.getElementById("email-form");
  const emailError = document.getElementById("email-error");

  const firstNameInput = document.getElementById("email-first-name");
  const lastNameInput = document.getElementById("email-last-name");
  const emailAddressInput = document.getElementById("email-address");
  const subjectInput = document.getElementById("email-subject");
  const messageInput = document.getElementById("email-message");
  const messageCounter = document.getElementById("message-counter");
  const humanQuestion = document.getElementById("human-question");
  const humanAnswerInput = document.getElementById("email-human-answer");

  const submitButton = emailForm.querySelector("button[type='submit']");
  const cancelButton = document.getElementById("email-cancel");

  let humanAnswer = 0;

  function generateHumanQuestion() {
    const a = Math.floor(Math.random() * 8) + 1;
    const b = Math.floor(Math.random() * 8) + 1;
    humanAnswer = a + b;
    humanQuestion.textContent = `I am a human: ${a} + ${b} = ?`;
  }

  function openEmailPopup() {
    generateHumanQuestion();
    emailError.textContent = "";
    emailOverlay.classList.remove("email-overlay-hidden");
    firstNameInput.focus();
  }

  function closeEmailPopup() {
    emailOverlay.classList.add("email-overlay-hidden");
    emailForm.reset();
    emailError.textContent = "";
  }

  emailTrigger.addEventListener("click", openEmailPopup);

  emailCancel.addEventListener("click", closeEmailPopup);

  emailOverlay.addEventListener("click", (event) => {
    if (event.target === emailOverlay) {
      closeEmailPopup();
    }
  });

  // Blocks most emoji and pictographs
  function containsEmoji(str) {
    const emojiRegex = /[\p{Extended_Pictographic}\p{Emoji_Presentation}]/u;
    return emojiRegex.test(str);
  }

  function containsInvalidNameChars(str) {
    // letters, spaces, apostrophes, hyphens only
    return !/^[A-Za-z][A-Za-z\s'-]*$/.test(str);
  }

  function isValidEmail(str) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  }

  function sanitizeTrim(value) {
    return value.trim();
  }

  emailForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    emailError.textContent = "";

    const firstName = sanitizeTrim(firstNameInput.value);
    const lastName = sanitizeTrim(lastNameInput.value);
    const emailAddress = sanitizeTrim(emailAddressInput.value);
    const subject = sanitizeTrim(subjectInput.value);
    const message = sanitizeTrim(messageInput.value);
    const humanResponse = sanitizeTrim(humanAnswerInput.value);

    /*
    if (!firstName || !lastName || !emailAddress || !subject || !message || !humanResponse) {
      emailError.textContent = "All fields are required.";
      return;
    }

    if (containsEmoji(firstName) || containsEmoji(lastName) || containsEmoji(emailAddress) || containsEmoji(subject) || containsEmoji(message)) {
      emailError.textContent = "Emojis are not allowed in any field.";
      return;
    }

    if (containsInvalidNameChars(firstName)) {
      emailError.textContent = "First name may only contain letters, spaces, apostrophes, and hyphens.";
      return;
    }

    if (containsInvalidNameChars(lastName)) {
      emailError.textContent = "Last name may only contain letters, spaces, apostrophes, and hyphens.";
      return;
    }

    if (!isValidEmail(emailAddress)) {
      emailError.textContent = "Please enter a valid email address.";
      return;
    }

    if (message.length < 5) {
      emailError.textContent = "Message must be at least 20 characters.";
      return;
    }

    if (message.length > 1000) {
      emailError.textContent = "Message must be 1000 characters or fewer.";
      return;
    }

    if (!/^\d+$/.test(humanResponse) || Number(humanResponse) !== humanAnswer) {
      emailError.textContent = "Human verification answer is incorrect.";
      generateHumanQuestion();
      humanAnswerInput.value = "";
      return;
    }
    */

    const errors = [];

    if (!firstName) {
      errors.push("First name is required.");
    }
    
    if (!lastName) {
      errors.push("Last name is required.");
    }
    
    if (!emailAddress) {
      errors.push("Email address is required.");
    } else if (!isValidEmail(emailAddress)) {
      errors.push("A valid email address is required.");
    }
    
    if (!subject) {
      errors.push("Subject is required.");
    }
    
    if (!message) {
      errors.push("Message is required.");
    } else {
      if (message.length < 5) {
        errors.push("Message must be at least 5 characters.");
      }
      if (message.length > 1000) {
        errors.push("Message must be 1000 characters or fewer.");
      }
    }
    
    if (!humanResponse) {
      errors.push("Human verification answer is required.");
    } else if (!/^\d+$/.test(humanResponse) || Number(humanResponse) !== humanAnswer) {
      errors.push("Human verification answer is incorrect.");
      generateHumanQuestion();
      humanAnswerInput.value = "";
    }
    
    if (firstName && containsEmoji(firstName)) {
      errors.push("First name cannot contain emojis.");
    }
    
    if (lastName && containsEmoji(lastName)) {
      errors.push("Last name cannot contain emojis.");
    }
    
    if (emailAddress && containsEmoji(emailAddress)) {
      errors.push("Email address cannot contain emojis.");
    }
    
    if (subject && containsEmoji(subject)) {
      errors.push("Subject cannot contain emojis.");
    }
    
    if (message && containsEmoji(message)) {
      errors.push("Message cannot contain emojis.");
    }
    
    if (firstName && containsInvalidNameChars(firstName)) {
      errors.push("First name may only contain letters, spaces, apostrophes, and hyphens.");
    }
    
    if (lastName && containsInvalidNameChars(lastName)) {
      errors.push("Last name may only contain letters, spaces, apostrophes, and hyphens.");
    }
    
    if (errors.length > 0) {
      emailError.innerHTML = errors.map(error => `<div>${error}</div>`).join("");
      return;
    }

    const payload = {
      firstName,
      lastName,
      email: emailAddress,
      subject,
      message,
      submittedAt: new Date().toISOString(),
      humanVerified: true
    };

    console.log("Contact form payload:", payload);

    submitButton.disabled = true;
    cancelButton.disabled = true;

    try {
      const result = await submitContactForm(payload);
      console.log("API response:", result);

      emailError.style.color = "#7CFC98";
      emailError.textContent = "Message sent successfully!";
    
      setTimeout(() => {
        closeEmailPopup();
        emailError.style.color = "";
      }, 1500);

    } catch (error) {
      console.error("Submission failed:", error);
      emailError.style.color = "";
      emailError.textContent = "Failed to send message. Please try again.";
    } finally {
      // Always re-enable buttons after response
      submitButton.disabled = false;
      cancelButton.disabled = false;
    }
  });


  messageInput.addEventListener("input", () => {
    if (messageInput.value.length > 200) {
      messageInput.value = messageInput.value.slice(0, 200);
    }
  
    const count = messageInput.value.length;
    messageCounter.textContent = `${count} / 200 characters`;
  
    if (count > 180) {
      messageCounter.style.color = "#ff6b6b";
    } else {
      messageCounter.style.color = "";
    }
  });

  async function submitContactForm(payload) {
    const res = await fetch("https://dihadyi5wh.execute-api.us-east-1.amazonaws.com/default/homepage-contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.error || "Something went wrong");
    }
  
    return data;
  }

});

  function switchAboutTab(tabName) {
    // Hide all image tabs
    document.getElementById('bio-tab').style.display = 'none';
    document.getElementById('outreach-tab').style.display = 'none';
    document.getElementById('media-tab').style.display = 'none';
    document.getElementById('shop-tab').style.display = 'none';
  
    // Remove active class from image tab buttons only
    document.querySelectorAll('.tab-btn-about').forEach(btn => btn.classList.remove('active'));
  
    // Show selected tab
    document.getElementById(`${tabName}-tab`).style.display = 'block';
  
    // Highlight selected button
    const buttonMap = {
      'about': document.querySelector(".tab-btn-about:nth-child(1)"),
      'outreach': document.querySelector(".tab-btn-about:nth-child(2)"),
      'media': document.querySelector(".tab-btn-about:nth-child(3)"),
      'shop': document.querySelector(".tab-btn-about:nth-child(4)")
    };
    if (buttonMap[tabName]) {
      buttonMap[tabName].classList.add('active');
    }
}



function switchWorksTab(tabName) {
    // Hide all image tabs
    document.getElementById('cv-tab').style.display = 'none';
    document.getElementById('science-tab').style.display = 'none';
    document.getElementById('software-tab').style.display = 'none';
    document.getElementById('policy-tab').style.display = 'none';
  
    // Remove active class from image tab buttons only
    document.querySelectorAll('.tab-btn-works').forEach(btn => btn.classList.remove('active'));
  
    // Show selected tab
    document.getElementById(`${tabName}-tab`).style.display = 'block';
  
    // Highlight selected button
    const buttonMap = {
      'cv': document.querySelector(".tab-btn-works:nth-child(1)"),
      'science': document.querySelector(".tab-btn-works:nth-child(2)"),
      'software': document.querySelector(".tab-btn-works:nth-child(3)"),
      'policy': document.querySelector(".tab-btn-works:nth-child(4)")
    };
    if (buttonMap[tabName]) {
      buttonMap[tabName].classList.add('active');
    }
}
