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

// alert container
const alertPlaceholder = document.getElementById('alert');
// add post btn to open the modal
const addtBtn = document.getElementById('add-btn');
const addPostModal = document.getElementById('add-post-modal');
// add-post-body
const postBody = document.getElementById('post-body');
const postTitle = document.getElementById('post-title');
const postImg = document.getElementById('post-img');
// add post btn
const addPostBtn = document.getElementById('add-post-btn');

const defaultUserImg = `
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#bbb" class="bi bi-person-fill border border-1 rounded-circle" viewBox="0 0 16 16">
  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
</svg>`;


const hideModal = modal => {
  const modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.hide();
}

// =============== Build logging UI ============
// ======================================
const setUpLogUI = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const userLink = document.querySelector('#logout-container a');

  const loginBtn = document.getElementById('login');
  const registerBtn = document.getElementById('register');

  if (token) {
    userLink.innerHTML = `
      ${ typeof user.profile_image === 'string' && user.profile_image.length ? `<img src="${user.profile_image}" alt="${user.name}" title="${user.name}">` : defaultUserImg }
      <strong>${user.username}</strong>`;
    loginBtn.classList.add('hide-me');
    registerBtn.classList.add('hide-me');
    logoutContainer.classList.remove('hide-me');
    addtBtn.classList.remove('hide-me');
  } else {
    loginBtn.classList.remove('hide-me');
    registerBtn.classList.remove('hide-me');
    logoutContainer.classList.add('hide-me');
    addtBtn.classList.add('hide-me');
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
// =============== get posts ============
// ======================================
const getPosts = () => {
  axios.get(`${baseUrl}/posts`).then(response => {
    const posts = response.data.data;
    const postsContainer = document.getElementById('posts');
  
    const getTags = tags => {
      let content = '';
      for (let tag of tags) {
        content += `
        <li>
          <button type="button" class="btn btn-secondary bg-secondary">${tag.name}</button>
        </li>`;
      }
      return content;
    };
    postsContainer.innerHTML = '';
  
    for(let post of posts) {
      const userImg = `<img src="${post.author.profile_image}" alt="${post.author.name}" class="border border-1 rounded-circle">`;
      const content = `
        <article class="card my-4 shadow-sm">
        <header>
          <h2 class="card-header d-flex align-items-center gap-2">
          ${post.author.profile_image && typeof post.author.profile_image === 'string'? userImg : defaultUserImg} ${post.author.username}
          </h2>
        </header>
        <div class="card-body">
          <figure>
            ${typeof post.image === 'string' &&  post.image.length ? `<img src="${post.image}" alt="${post.title || ''}" class="w-100 mw-100">` : ''}
            <time class="text-body-tertiary fw-medium d-block mt-1">${post.created_at}</time>
            <figcaption class="mt-3">
              <h3 class="card-title">${post.title || ''}</h3>
              <p class="card-text">${post.body || ''}</p>
            </figcaption>
          </figure>
          <footer class="border-top pt-2 gap-1">
            <div class="comments d-flex align-items-center ">
              <button class="d-block text-body-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                </svg>
              </button>
               <p class="text-body-secondary fw-medium">(${post.comments_count}) Comments</p>
            </div>
            ${post.tags.length ? `<ul class="tags nav gap-1">${getTags(post.tags)}</ul>` : ''}
            </footer>
        </div>
      </article>
      `;
      postsContainer.innerHTML += content;
    }
  })
};


// =============== get usersName list ============
// ======================================
let usersNameList;
axios.get(`${baseUrl}/users`).then(response => {
  const users = response.data.data;
  usersNameList = users.map(user => user.username);
})

// =============== login ============
// ======================================
const isNotEmpty = input => !input.value.trim().length;
// Disable login Button if user not fill inputs
loginBtn.disabled = isNotEmpty(username) || isNotEmpty(password);
username.addEventListener('input', () => loginBtn.disabled = isNotEmpty(username) || isNotEmpty(password))
password.addEventListener('input', () => loginBtn.disabled = isNotEmpty(username) || isNotEmpty(password))

// Handle login form validation
loginBtn.addEventListener('click', () => {
  const params = {
    'username': username.value.trim(),
    'password': password.value.trim()
  };

  axios.post(`${baseUrl}/login`, params)
  .then(response => {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    hideModal(loginModal);
    showAlert('Logged in successfully', 'success');
    setUpLogUI();
  })
});


// =============== Register ============
// ======================================
// Disable register button if user not fill inputs

const isAllowRegiter = () => registerBtn.disabled = isNotEmpty(rUsername) || isNotEmpty(rPassword) || isNotEmpty(rName) || isNotEmpty(email);
isAllowRegiter();
rUsername.addEventListener('input', () => {
  isAllowRegiter();
  rUsername.value = rUsername.value.trim();
  console.log(rUsername.value)
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
  const formData = new FormData();
  formData.append('username', rUsername.value);
  formData.append('password', rPassword.value);
  formData.append('name', rName.value.replace(/\s+/g, ' ').trim());
  formData.append('email', email.value);
  formData.append('image', registerImg.files[0]);
  axios.post(`${baseUrl}/register`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(response => {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    hideModal(registerModal);
    showAlert('Registered successfully', 'success');
    setUpLogUI();
    
  }).catch(e => showAlert(e.response.data.message, 'danger'))
});


// =============== logout ============register-modal
// ======================================
logoutBtn.addEventListener('click', () => {

  localStorage.removeItem('token');
  localStorage.removeItem('user');
  showAlert('Logged out successfully', 'success');
  setUpLogUI();
});
setUpLogUI();

// =============== Add post ============
// ======================================
addPostBtn.disabled = isNotEmpty(postBody);
postBody.addEventListener('input', () => addPostBtn.disabled = isNotEmpty(postBody))
addPostBtn.addEventListener('click', () => {
  const formData = new FormData();
  formData.append('title', postTitle.value.trim());
  formData.append('body', postBody.value.trim());
  formData.append('image', postImg.files[0]);
  axios.post(`${baseUrl}/posts`, formData, {
    headers: {
      'authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'multipart/form-data'
    }
  })
  .then(response => {
    getPosts()


    hideModal(addPostModal);
 
    window.scrollTo({
      top: 0, 
      behavior: 'smooth'
    });

    showAlert('New post has been created successfully', 'success');
  }).catch(e => showAlert(e.response.data.message, 'danger'))
});




getPosts();