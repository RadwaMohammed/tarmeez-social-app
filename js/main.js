axios.get('https://tarmeezacademy.com/api/v1/posts').then(response => {
  const posts = response.data.data;
  const postsContainer = document.getElementById('posts');

  const getTags = tags => {
    let content = '';
    for (let tag of tags) {
      content += `
      <li>
        <button type="button" class="btn btn-secondary bg-secondary">${tag}</button>
      </li>`;
    }
    return content;
  };

  postsContainer.innerHTML = '';
  for(let post of posts) {
    const content = `
      <article class="card my-4 shadow-sm">
      <header>
        <h2 class="card-header d-flex align-items-center gap-2">
          <img src="${post.author.profile_image}" alt="${post.author.name}" class="border border-1 rounded-circle">${post.author.username}
        </h2>
      </header>
      <div class="card-body">
        <figure>
          <img src="${post.image}" alt="${post.title}" class="w-100 mw-100">
          <time class="text-body-tertiary fw-medium d-block mt-1">${post.created_at}</time>
          <figcaption class="mt-3">
            <h3 class="card-title">${post.title ?  post.title : ''}</h3>
            <p class="card-text">${post.body}</p>
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