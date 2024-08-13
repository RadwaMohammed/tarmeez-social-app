let currentPage = 1;
let lastPage = 1;
// Posts Container
const postsContainer = document.getElementById('posts');

// =============== get posts ============
// ======================================
const goToPost = id => window.location = `./post-details.html?id=${id}`;
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
    let user = getCurrentUser();
    for(let post of posts) {
      const userImg = `<img src="${post.author.profile_image}" alt="${post.author.name}" class="border border-1 rounded-circle">`;
      const content = `
        <article class="card my-4 shadow-sm">
        <header>
          <h2 class="card-header d-flex align-items-center gap-2">
          ${post.author.profile_image && typeof post.author.profile_image === 'string'? userImg : defaultUserImg} ${post.author.username}
          <div class="${user && user.id === post.author.id ? 'dropdown' : 'dropdown hide-me'} post-control" data-author="${post.author.id}">
            <button class="post-user-control btn dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
              </svg>
            </button>
            <ul class="dropdown-menu">
              <li><button class="dropdown-item text-success mb-1" title="Edit" onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                </svg> Edit
              </button></li>
              <li><button class="dropdown-item text-danger" title="Delete" onclick="confirmDelete(${post.id})">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                </svg> Delete
              </button></li>
            </ul>
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
      postsContainer.innerHTML += content;
    }
  }).catch(e => showAlert(e.response.data.message, 'danger'))
};

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
