document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToLogin = document.getElementById('switch-to-login');
    
    const loginFormEl = document.getElementById('login-form');
    const signupFormEl = document.getElementById('signup-form');
    
    const loginUsernameError = document.getElementById('login-username-error');
    const loginPasswordError = document.getElementById('login-password-error');
    const loginSuccess = document.getElementById('login-success');
    const loginError = document.getElementById('login-error');
    
    const signupUsernameError = document.getElementById('signup-username-error');
    const signupEmailError = document.getElementById('signup-email-error');
    const signupPasswordError = document.getElementById('signup-password-error');
    const signupConfirmPasswordError = document.getElementById('signup-confirm-password-error');
    const signupSuccess = document.getElementById('signup-success');
    const signupError = document.getElementById('signup-error');
    
    function showLoginForm() {
      loginForm.classList.remove('hidden');
      signupForm.classList.add('hidden');
    }
    
    function showSignupForm() {
      loginForm.classList.add('hidden');
      signupForm.classList.remove('hidden');
    }
    
    switchToSignup.addEventListener('click', (e) => {
      e.preventDefault();
      showSignupForm();
    });
    
    switchToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      showLoginForm();
    });
    
    function resetErrors(form) {
      const errorElements = form.querySelectorAll('.error-message');
      errorElements.forEach(el => {
        el.classList.add('hidden');
        el.textContent = '';
      });
      
      const successElements = form.querySelectorAll('.success-message');
      successElements.forEach(el => {
        el.classList.add('hidden');
        el.textContent = '';
      });
    }
    
    function validateLoginForm(username, password) {
      let isValid = true;
      
      resetErrors(loginFormEl);
      
      if (!username) {
        loginUsernameError.textContent = 'Username is required';
        loginUsernameError.classList.remove('hidden');
        isValid = false;
      }
      
      if (!password) {
        loginPasswordError.textContent = 'Password is required';
        loginPasswordError.classList.remove('hidden');
        isValid = false;
      } else if (password.length < 6) {
        loginPasswordError.textContent = 'Password must be at least 6 characters';
        loginPasswordError.classList.remove('hidden');
        isValid = false;
      }
      
      return isValid;
    }
    
    function validateSignupForm(username, email, password, confirmPassword) {
      let isValid = true;
      
      resetErrors(signupFormEl);
      
      if (!username) {
        signupUsernameError.textContent = 'Username is required';
        signupUsernameError.classList.remove('hidden');
        isValid = false;
      } else if (username.length < 3) {
        signupUsernameError.textContent = 'Username must be at least 3 characters';
        signupUsernameError.classList.remove('hidden');
        isValid = false;
      }
      
      if (!email) {
        signupEmailError.textContent = 'Email is required';
        signupEmailError.classList.remove('hidden');
        isValid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        signupEmailError.textContent = 'Please enter a valid email';
        signupEmailError.classList.remove('hidden');
        isValid = false;
      }
      
      if (!password) {
        signupPasswordError.textContent = 'Password is required';
        signupPasswordError.classList.remove('hidden');
        isValid = false;
      } else if (password.length < 6) {
        signupPasswordError.textContent = 'Password must be at least 6 characters';
        signupPasswordError.classList.remove('hidden');
        isValid = false;
      }
      
      if (!confirmPassword) {
        signupConfirmPasswordError.textContent = 'Please confirm your password';
        signupConfirmPasswordError.classList.remove('hidden');
        isValid = false;
      } else if (password !== confirmPassword) {
        signupConfirmPasswordError.textContent = 'Passwords do not match';
        signupConfirmPasswordError.classList.remove('hidden');
        isValid = false;
      }
      
      return isValid;
    }
    
    loginFormEl.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value;
      
      if (validateLoginForm(username, password)) {
        loginSuccess.textContent = 'Login successful! Redirecting...';
        loginSuccess.classList.remove('hidden');
        
        setTimeout(() => {
          console.log('Redirecting to dashboard...');
        }, 2000);
        
        let text = loginSuccess.textContent;
        loginSuccess.textContent = '';
        let i = 0;
        const typeWriter = () => {
          if (i < text.length) {
            loginSuccess.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
          }
        };
        typeWriter();
      }
    });
    
    signupFormEl.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const username = document.getElementById('signup-username').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;
      const confirmPassword = document.getElementById('signup-confirm-password').value;
      
      if (validateSignupForm(username, email, password, confirmPassword)) {
        signupSuccess.textContent = 'Account created successfully! Redirecting to login...';
        signupSuccess.classList.remove('hidden');
        
        setTimeout(() => {
          showLoginForm();
          signupFormEl.reset();
        }, 3000);
        
        let text = signupSuccess.textContent;
        signupSuccess.textContent = '';
        let i = 0;
        const typeWriter = () => {
          if (i < text.length) {
            signupSuccess.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
          }
        };
        typeWriter();
      }
    });
    
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
      input.addEventListener('keydown', () => {
        console.log('Type sound!');
      });
    });
    
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
        
        const glitchInterval = setInterval(() => {
          const glitchX = Math.random() * 10 - 5;
          const glitchY = Math.random() * 10 - 5;
          button.style.transform = `translate(${glitchX}px, ${glitchY}px)`;
          
          setTimeout(() => {
            button.style.transform = 'translate(0, 0)';
          }, 50);
        }, 200);
        
        button.addEventListener('mouseleave', () => {
          clearInterval(glitchInterval);
          button.style.transform = 'translate(0, 0)';
        });
      });
    });
  });
  
  
  
  