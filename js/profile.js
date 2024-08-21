const nameHolder = document.getElementById('user-name');
const userNameHolder = document.getElementById('user-username');
const userEmail = document.getElementById('user-email');
const postsWrapper = document.querySelector('.user-posts-container .posts-wrapper');
const defaultProfileImg = `
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#ddd" class="bi bi-person-fill" viewBox="0 0 16 16">
  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
</svg>`;


const goToPost = id => window.location = `./post-details.html?id=${id}`;

const getUserId = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}
const currentUserId = getCurrentUser() ? getCurrentUser().id : null;
const id = getUserId() || currentUserId;
// If the user not logged go to home page 
if (!id) {
  window.location = `./index.html`;
}

const getUserInfo = () => {

  axios.get(`${baseUrl}/users/${id}`)
    .then(response => {
      const { 
        name, 
        username, 
        email, 
        profile_image, 
        comments_count, 
        posts_count
      } = response.data.data;
      document.getElementById('user-img').innerHTML = profile_image && typeof profile_image === 'string' 
        ? `<img src="${profile_image}" alt="${name || username || ''}" class="img-fluid d-block mx-auto">`
        : defaultProfileImg;
      const manageUI = (elem, value) => {
        value ? elem.parentNode.classList.remove('hide-me') : elem.parentNode.classList.add('hide-me')
      }
      nameHolder.innerText = name;
      manageUI(nameHolder, name);
      userNameHolder.innerText = `@ ${username}`;
      manageUI(userNameHolder, username);
      userEmail.innerText = email;
      userEmail.setAttribute('href', `mailto:${email}`);
      manageUI(userEmail, email);
      document.getElementById('user-posts-count').innerText = posts_count;
      document.getElementById('user-comments-count').innerText = comments_count;
    }).catch(e => showAlert(e.response.data.message, 'danger'))
};



const getUserPosts = () => {
  axios.get(`${baseUrl}/users/${id}/posts`)
  .then(response => {
    const posts = response.data.data;
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
    postsWrapper.innerHTML = posts.length ? '' : `<h2 class="no-posts">No Posts Yet</h2>`
    for(let post of posts) {
      const userImg = `<img src="${post.author.profile_image}" alt="${post.author.name}" class="border border-1 rounded-circle">`;
      const content = `
        <article class="card mt-4 shadow-sm">
        <header>
          <h2 class="card-header d-flex align-items-center gap-2">
          <div class="d-flex alig-items-center post-user-link gap-2">
            <span class="d-inline-block" title="${post.author.username}">${post.author.profile_image && typeof post.author.profile_image === 'string'? userImg : defaultUserImg}</span> 
            <strong class="d-inline-block">${post.author.username}</strong>
          </div>
          </h2>
        </header>
        <div class="card-body go-to-post" onclick="goToPost(${post.id})">
          <figure>
            ${typeof post.image === 'string' &&  post.image.length ? `<img src="${post.image}" alt="${post.title || ''}" class="figure-img img-fluid card-img-top">` : ''}
            <time class="text-body-tertiary fw-medium d-block mt-1">${post.created_at}</time>
            <figcaption class="mt-3">
              <h3 class="card-title">${post.title || ''}</h3>
              <p class="card-text">${post.body || ''}</p>
            </figcaption>
          </figure>
          <footer class="border-top pt-2">
            <div class="wrapper gap-1">
              <div class="comments d-flex align-items-center ">
                  <button class="d-flex text-body-secondary fw-medium align-items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-square" viewBox="0 0 16 16">
                      <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                    </svg>(${post.comments_count}) Comments
                  </button>
              </div>
              ${post.tags.length ? `<ul class="tags nav gap-1">${getTags(post.tags)}</ul>` : ''}
            </div>
          </footer>
        </div>
      </article>
      `;
      postsWrapper.innerHTML += content;
    }
    console.log(response.data.data)
  }).catch(e => {
    console.log(e)
    showAlert(e, 'danger')})
};
if(id) {
  getUserInfo();
  getUserPosts()
}
