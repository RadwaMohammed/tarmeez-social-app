let currentPage = 1;
let lastPage = 1;

// Posts Container
const postsContainer = document.getElementById('posts');
// add post modal
const addPostModal = document.getElementById('add-post-modal');
// add-post-body
const postBody = document.getElementById('post-body');
const postTitle = document.getElementById('post-title');
const postImg = document.getElementById('post-img');
// add post btn
const addPostBtn = document.getElementById('add-post-btn');


// =============== get posts ============
// ======================================
const goToPost = id => window.location = `/post-details.html?id=${id}`;
const getPosts = (reload = true, page = 1) => {
  
  axios.get(`${baseUrl}/posts?page=${page}`)
  .then(response => {
    const posts = response.data.data;
    lastPage = response.data.meta.last_page;

    
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
    if (reload) {
      postsContainer.innerHTML = ''
    }
    for(let post of posts) {
      const userImg = `<img src="${post.author.profile_image}" alt="${post.author.name}" class="border border-1 rounded-circle">`;
      const content = `
        <article class="card my-4 shadow-sm">
        <header>
          <h2 class="card-header d-flex align-items-center gap-2" title="${post.author.username}">
          ${post.author.profile_image && typeof post.author.profile_image === 'string'? userImg : defaultUserImg} ${post.author.username}
          </h2>
        </header>
        <div class="card-body go-to-post" onclick="goToPost(${post.id})">
          <figure>
            ${typeof post.image === 'string' &&  post.image.length ? `<img src="${post.image}" alt="${post.title || ''}" class="img-fluid card-img-top">` : ''}
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

// =============== Posts Pagination ============
// ======================================
window.addEventListener('scroll', () => {
  const isPageEnd = window.innerHeight + window.scrollY + 1 >= document.body.offsetHeight;
  if (isPageEnd && currentPage < lastPage) {
    currentPage++;
    getPosts(false, currentPage);
  }
});

getPosts();
