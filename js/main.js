const baseUrl = 'https://tarmeezacademy.com/api/v1';
// login modal
const loginBtn = document.getElementById('login-btn');
const username = document.getElementById('username');
const password = document.getElementById('password');
const loginModal = document.getElementById('login-modal');
// register modal
const registerBtn = document.getElementById('register-btn');
const rUsername = document.getElementById('r-username');
const rPassword = document.getElementById('r-password');
const rName = document.getElementById('name');
const email = document.getElementById('email');
const registerImg = document.getElementById('register-img');
const registerModal = document.getElementById('register-modal');

const invalid = document.getElementById('invalid');
// logout btn
const logoutBtn = document.getElementById('logout');
const logoutContainer = document.getElementById('logout-container');
// add post btn
const addtBtn = document.getElementById('add-btn-home');
// add comment form
const addComment = document.getElementById('add-comment');
const addCommentImg = document.querySelector('.add-comment-user-img');
// User post control
const userPostControl = document.getElementsByClassName('post-control');
// posts container
const postsContainer = document.getElementById('posts');
// alert container
const alertPlaceholder = document.getElementById('alert');
// default user profile image
const defaultUserImg = `
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#bbb" class="bi bi-person-fill border border-1 rounded-circle" viewBox="0 0 16 16">
  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
</svg>`;

// =============== Hide Modal ============
// =====================================
const hideModal = modal => {
  const modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.hide();
}

// =============== Build logging UI ============
// ======================================
const getCurrentUser = () => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : storedUser;
};

const setUpLogUI = () => {
  const token = localStorage.getItem('token');
  const user = getCurrentUser();
  const userLink = document.querySelector('#logout-container a');

  const loginBtn = document.getElementById('login');
  const registerBtn = document.getElementById('register');

  if (token) {
    userLink.setAttribute('title', `${user.username}`);
    userLink.innerHTML = `
      ${ typeof user.profile_image === 'string' && user.profile_image.length ? `<img src="${user.profile_image}" alt="${user.name}" title="${user.name}" class="rounded-circle">` : defaultUserImg }
      <strong>${user.username}</strong>`;
    loginBtn.classList.add('hide-me');
    registerBtn.classList.add('hide-me');
    logoutContainer.classList.remove('hide-me');
    if (postsContainer && addtBtn ) {
      addtBtn.classList.remove('hide-me');
    }
    if (addComment) {
      addtBtn.classList.add('hide-me');
      addComment.classList.remove('hide-me');
      addCommentImg.setAttribute('title', `${user.username}`);
      addCommentImg.innerHTML = `${typeof user.profile_image === 'string' && user.profile_image.length ? `<img src="${user.profile_image}" alt="${user.username}">` : defaultUserImg }`;
    }
    if (userPostControl.length) {
      for( let x of userPostControl) {
        let authorId = x.getAttribute('data-author');
        +authorId === user.id ? x.classList.remove('hide-me') : x.classList.add('hide-me');
        
      }
    }
  } else {
    loginBtn.classList.remove('hide-me');
    registerBtn.classList.remove('hide-me');
    logoutContainer.classList.add('hide-me');
    addtBtn && addtBtn.classList.add('hide-me');
    addComment && addComment.classList.add('hide-me');
    if (userPostControl.length) {
      for( let x of userPostControl) {

        x.classList.add('hide-me');
      }
    }
  }
}
window.onload = () => setUpLogUI();

// =============== Alerts ============
// ======================================
const showAlert = (message, type) => {
  const appendAlert = () => {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('id', 'close-alert')
    wrapper.innerHTML = [
      `<svg xmlns="http://www.w3.org/2000/svg" class="d-none">
        <symbol id="check-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
        </symbol>
        <symbol id="exclamation-triangle-fill" viewBox="0 0 16 16">
          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
        </symbol>
      </svg>
      <div class="alert alert-${type} alert-dismissible d-flex align-items-center" role="alert">`,
      `<svg class="bi flex-shrink-0 me-2" role="img" aria-label="${type === 'success' ? 'Success:' : 'Danger:'}"><use xlink:href="#${type === 'success' ? 'check-circle' : 'exclamation-triangle'}-fill"></use></svg>`,
      `   <div>${message}</div>`,
      '</div>'
    ].join('')
    alertPlaceholder.append(wrapper)
  }
  setTimeout(() => {
    appendAlert(message, type);
  }, 250)
  setTimeout(() => {
    const alertHide = bootstrap.Alert.getOrCreateInstance('#close-alert');
    alertHide.close()
  }, 1500)
}

// =============== login ============
// ======================================
const isNotEmpty = input => input && !input.value.trim().length;
// Disable login Button if user not fill inputs
loginBtn.disabled = isNotEmpty(username) || isNotEmpty(password);
username.addEventListener('input', () => {

  loginBtn.disabled = isNotEmpty(username) || isNotEmpty(password) || password.value.trim().length < 6
})
password.addEventListener('input', () => {

  loginBtn.disabled = isNotEmpty(username) || isNotEmpty(password) || password.value.trim().length < 6
})

// Handle login form validation
loginBtn.addEventListener('click', () => {
  const params = {
    'username': username.value.trim(),
    'password': password.value.trim()
  };
  showLoader(true);
  axios.post(`${baseUrl}/login`, params)
  .then(response => {
    showLoader(false);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    hideModal(loginModal);
    showAlert('Logged in successfully', 'success');
    setUpLogUI();
  }).catch(e => {
      if(e.response.data.errors.password || e.response.data.errors.email) {
        console.log(e.response.data.errors)
        showAlert(`Invalid password or username.`, 'danger')
        username.classList.add('is-invalid');
        password.classList.add('is-invalid');
        document.getElementById('invalid').innerText = 'Invalid password or username.'
      } else {
        showAlert(`${e.response.data.message}`, 'danger')
        username.classList.remove('is-invalid');
        password.classList.remove('is-invalid');
        document.getElementById('invalid').innerText = ''
      }
    }).finally(() => showLoader(false))
});
loginModal.addEventListener('hidden.bs.modal', () => {
  username.value = '';
  password.value = '';
  username.classList.remove('is-invalid');
  password.classList.remove('is-invalid');
  document.getElementById('invalid').innerText = ''
})

// =============== Register ============
// ======================================
// Disable register button if user not fill inputs

const isAllowRegiter = () => registerBtn.disabled = isNotEmpty(rUsername) || isNotEmpty(rPassword) || isNotEmpty(rName) || isNotEmpty(email);
isAllowRegiter();
rUsername.addEventListener('input', () => {
  isAllowRegiter();
  rUsername.value = rUsername.value.trim();
})

rPassword.addEventListener('input', () => {
  isAllowRegiter();
  rPassword.value = rPassword.value.trim();
})
rName.addEventListener('input', () => {
  isAllowRegiter();
  rName.value = rName.value.trimStart();
})
email.addEventListener('input', () => {
  isAllowRegiter();
  email.value = email.value.trim();
})

registerBtn.addEventListener('click', () => {
  showLoader(true);
  const formData = new FormData();
  formData.append('username', rUsername.value);
  formData.append('password', rPassword.value);
  formData.append('name', rName.value.replace(/\s+/g, ' ').trim());
  formData.append('email', email.value);
  if (registerImg.files[0]) {
    formData.append('image', registerImg.files[0]);
  }

  axios.post(`${baseUrl}/register`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(response => {
    showLoader(false);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    hideModal(registerModal);
    showAlert('Registered successfully', 'success');
    setUpLogUI();
    
  }).catch(e => {
    console.log(e.response.data.errors)
    if(e.response.data.errors.password) {
      rPassword.classList.add('is-invalid');
    } else {
      rPassword.classList.remove('is-invalid');
    }
    if(e.response.data.errors.email) {
      email.classList.add('is-invalid');
      document.getElementById('emailFeedback').innerText = e.response.data.errors.email.join('\n')
    } else {
      email.classList.remove('is-invalid');
      document.getElementById('emailFeedback').innerText = ''
    }
    if(e.response.data.errors.image) {
      registerImg.classList.add('is-invalid');
      document.getElementById('register-imgFeedback').innerText = e.response.data.errors.image.join('\n')
    } else {
      registerImg.classList.remove('is-invalid');
      document.getElementById('register-imgFeedback').innerText = ''
    }
    if(e.response.data.errors.username) {
      rUsername.classList.add('is-invalid');
      document.getElementById('r-usernameFeedback').innerText = e.response.data.errors.username.join('\n')
    } else {
      rUsername.classList.remove('is-invalid');
      document.getElementById('r-usernameFeedback').innerText = ''
    }
  }).finally(() => showLoader(false))
});

registerModal.addEventListener('hidden.bs.modal', () => {
  rPassword.value = '';
  rUsername.value = '';
  rName.value = '';
  email.value = '';
  rPassword.classList.remove('is-invalid');
  rUsername.classList.remove('is-invalid');
  registerImg.classList.remove('is-invalid');
  email.classList.remove('is-invalid');
  document.getElementById('emailFeedback').innerText = ''
  document.getElementById('register-imgFeedback').innerText = '';
  document.getElementById('r-usernameFeedback').innerText = '';
})

// =============== logout ============
// ======================================
logoutBtn.addEventListener('click', () => {

  localStorage.removeItem('token');
  localStorage.removeItem('user');
  showAlert('Logged out successfully', 'success');
  setUpLogUI();
});
setUpLogUI();

// =============== Loaders ============
// ======================================

const showLoader = show =>  show 
  ? document.getElementById('loader').classList.remove('hide-me') 
  : document.getElementById('loader').classList.add('hide-me');

