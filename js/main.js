const baseUrl = 'https://tarmeezacademy.com/api/v1';
const loginBtn = document.getElementById('login-btn');
const username = document.getElementById('username');
const password = document.getElementById('password');
const invalid = document.getElementById('invalid');
const loginModal = document.getElementById('login-modal');
const logoutBtn = document.getElementById('logout');
const alertPlaceholder = document.getElementById('alert');
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
  const loginBtn = document.getElementById('login');
  const registerBtn = document.getElementById('register');
  if (token) {
    loginBtn.classList.add('hide-me');
    registerBtn.classList.add('hide-me');
    logoutBtn.classList.remove('hide-me');
  } else {
    loginBtn.classList.remove('hide-me');
    registerBtn.classList.remove('hide-me');
    logoutBtn.classList.add('hide-me');
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
      </svg>
      <div class="alert alert-${type} alert-dismissible d-flex align-items-center" role="alert">`,
      `${type === 'success' && `<svg class="bi flex-shrink-0 me-2" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill"></use></svg>`}`,
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
          <img src="${post.image || ''}" alt="${post.title || ''}" class="w-100 mw-100">
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
// Disable loginInput if user not fill inputs
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



// =============== logout ============
// ======================================
logoutBtn.addEventListener('click', () => {

  localStorage.removeItem('token');
  localStorage.removeItem('user');
  showAlert('Logged out successfully', 'success');
  setUpLogUI();
});
setUpLogUI();